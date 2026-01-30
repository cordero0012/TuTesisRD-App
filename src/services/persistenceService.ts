import { supabase } from '../supabaseClient';
import { MatrixAnalysisDTO, AuditResultDTO } from '../types/schemas';

type AnalysisType = 'consistency' | 'audit';
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

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

    /**
     * Adds an analysis to the save queue and triggers processing.
     */
    public async saveAnalysis(
        projectId: string,
        type: AnalysisType,
        result: MatrixAnalysisDTO | AuditResultDTO
    ): Promise<void> {
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
        this.notify('saving');
        this.processQueue();
    }

    private async processQueue() {
        if (this.processing || this.queue.length === 0) return;
        this.processing = true;

        const maxRetries = 3;

        try {
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
                    // Wait before retry (simple backoff)
                    await new Promise(r => setTimeout(r, 1000 * item.attempts));
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
    public async getLatestAnalysis(
        projectId: string,
        type: AnalysisType
    ): Promise<SavedAnalysisRecord | null> {
        const { data, error } = await supabase
            .from('analysis_reports')
            .select('*')
            .eq('project_id', projectId)
            .eq('type', type)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) return null;
        return data as SavedAnalysisRecord;
    }
}

export const persistenceService = new PersistenceService();
