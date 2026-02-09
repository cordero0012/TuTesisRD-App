import { supabase } from '../supabaseClient';
import { MatrixAnalysisDTO, AuditResultDTO } from '../types/schemas';

type AnalysisType = 'consistency' | 'audit';
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline' | 'pending';

export interface SavedAnalysisRecord {
    id: string;
    project_id: string;
    type: AnalysisType;
    result: MatrixAnalysisDTO | AuditResultDTO;
    status: string;
    warnings: string[];
    created_at: string;
}

interface QueueItem {
    id: string; // localized temp ID
    projectId: string;
    type: AnalysisType;
    result: MatrixAnalysisDTO | AuditResultDTO;
    attempts: number;
    timestamp: number;
}

// Simple Observer for UI
type StatusListener = (status: SaveStatus) => void;

class PersistenceService {
    private queue: QueueItem[] = [];
    private listeners: StatusListener[] = [];
    private status: SaveStatus = 'idle';
    private processing = false;

    constructor() {
        this.loadQueue();
    }

    private loadQueue() {
        try {
            if (typeof window === 'undefined') return;
            const saved = localStorage.getItem('tutesis_save_queue');
            if (saved) {
                this.queue = JSON.parse(saved);
                if (this.queue.length > 0) {
                    this.status = 'saving';
                    this.processQueue();
                }
            }
        } catch (e) {
            console.error('[Persistence] Failed to load queue', e);
        }
    }

    private saveQueueToLocal() {
        if (typeof window === 'undefined') return;
        localStorage.setItem('tutesis_save_queue', JSON.stringify(this.queue));
    }

    private notify(status: SaveStatus) {
        this.status = status;
        this.listeners.forEach(l => l(status));
    }

    public subscribe(listener: StatusListener) {
        this.listeners.push(listener);
        listener(this.status); // Initial state
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public async saveAnalysis(
        projectId: string,
        type: AnalysisType,
        result: MatrixAnalysisDTO | AuditResultDTO
    ): Promise<{ success: boolean; error?: string }> {
        // Validate input using Zod schema
        const { validateInput, SaveAnalysisSchema } = await import('../types/validation');

        // Extract status and warnings if available (only MatrixAnalysisDTO has these)
        let derivedStatus: string = 'ok';
        let derivedWarnings: string[] = [];

        if (type === 'consistency' && 'analysisStatus' in result) {
            derivedStatus = result.analysisStatus || 'ok';
            derivedWarnings = result.analysisWarnings || [];
        }

        const validationResult = validateInput(SaveAnalysisSchema, {
            project_id: projectId,
            type,
            result,
            status: derivedStatus,
            warnings: derivedWarnings,
            version: '1.0'
        });

        if (!validationResult.success) {
            const errorMsg = Object.entries(validationResult.errors)
                .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
                .join('; ');
            console.error('[Persistence] Validation failed:', errorMsg);
            return { success: false, error: errorMsg };
        }

        const item: QueueItem = {
            id: crypto.randomUUID(),
            projectId,
            type,
            result,
            attempts: 0,
            timestamp: Date.now()
        };

        this.queue.push(item);
        this.saveQueueToLocal();

        // If offline, notify pending
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            this.notify('pending');
            return { success: false, error: 'No active session. Analysis queued for later.' };
        } else {
            this.notify('saving');
            this.processQueue();
            return { success: true };
        }
    }


    /**
     * Updates the projectId of all items in the queue.
     * Useful when an anonymous user logs in and claims their work.
     */
    public updateQueueProjectId(newId: string) {
        if (!newId || newId === 'offline-demo') return;

        let changed = false;
        this.queue = this.queue.map(item => {
            if (item.projectId === 'offline-demo') {
                changed = true;
                return { ...item, projectId: newId };
            }
            return item;
        });

        if (changed) {
            console.log(`[Persistence] Updated queue items to project: ${newId}`);
            this.saveQueueToLocal();
        }
    }

    /**
     * Manually triggers queue processing.
     */
    public flushQueue() {
        if (this.queue.length > 0 && !this.processing) {
            console.log('[Persistence] Manual flush triggered.');
            this.processQueue();
        }
    }

    private async processQueue() {
        if (this.processing || this.queue.length === 0) return;
        this.processing = true;

        const maxRetries = 3;

        try {
            // Gating: Check Session
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                console.log('[Persistence] Queue paused: No active session.');
                this.processing = false;
                this.notify('offline');
                return;
            }

            // Peek first item
            const item = this.queue[0];

            // Extract metadata
            let status = 'ok';
            let warnings: string[] = [];
            if (item.type === 'consistency') {
                const r = item.result as MatrixAnalysisDTO;
                status = r.analysisStatus || 'ok';
                warnings = r.analysisWarnings || [];
            }

            // Attempt Save
            const { error } = await supabase
                .from('analysis_reports')
                .insert({
                    project_id: item.projectId,
                    type: item.type,
                    result: item.result,
                    status,
                    warnings,
                    version: '1.0'
                });

            if (error) {
                console.warn('[Persistence] Save failed (retry pending):', error.message);
                item.attempts++;

                if (item.attempts >= maxRetries) {
                    console.error('[Persistence] Max retries reached. Dropping item:', item.id);
                    this.queue.shift(); // Remove dead item
                } else {
                    // Exponential backoff: 1s, 2s, 4s
                    const backoffMs = Math.pow(2, item.attempts - 1) * 1000;
                    console.log(`[Persistence] Retrying in ${backoffMs}ms (attempt ${item.attempts}/${maxRetries})`);
                    await new Promise(r => setTimeout(r, backoffMs));
                }
            } else {
                // Success
                this.queue.shift();
            }

            this.saveQueueToLocal();

            if (this.queue.length > 0) {
                // Continue
                this.processing = false;
                this.processQueue();
            } else {
                this.processing = false;
                this.notify('saved');
                // Reset to idle after a moment
                setTimeout(() => this.notify('idle'), 3000);
            }

        } catch (err) {
            console.error('[Persistence] Critical Queue Error:', err);
            this.processing = false;
            this.notify('error');
        }
    }

    /**
     * Retrieves the latest analysis for a given project and type.
     */
    /**
     * Retrieves all analyses for a given project.
     */
    public async listAnalyses(
        projectId: string
    ): Promise<SavedAnalysisRecord[]> {
        const { data, error } = await supabase
            .from('analysis_reports')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[Persistence] Error listing analyses:', error);
            return [];
        }
        return data as SavedAnalysisRecord[];
    }
}

export const persistenceService = new PersistenceService();
