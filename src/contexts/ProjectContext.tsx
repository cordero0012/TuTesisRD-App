import React, { createContext, useContext, useState, ReactNode } from 'react';
import universitiesData from '../data/universities.json';
import { supabase } from '../supabaseClient';
import { Session } from '@supabase/supabase-js';
import { persistenceService } from '../services/persistenceService';

// Define a simple Project interface
export interface Project {
    id: string;
    content: string;
    title?: string;
    owner_id?: string | null;
}

export interface UploadedFile {
    name: string;
    type: string;
    size: number;
    content: string | { page: number; text: string }[];
    lastModified: number;
}

interface ProjectContextType {
    project: Project;
    setProject: (project: Project) => void;
    uploadedFile: UploadedFile | null;
    setUploadedFile: (file: UploadedFile | null) => void;
    universities: any[];
    session: Session | null;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    // Default project state
    const [project, setProject] = useState<Project>({
        id: '',
        content: '',
        title: 'Mi Tesis'
    });

    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(() => {
        if (typeof window === 'undefined') return null;
        const saved = localStorage.getItem('tutesis_uploaded_file');
        return saved ? JSON.parse(saved) : null;
    });

    const [session, setSession] = useState<Session | null>(null);
    const currentCallId = React.useRef(0);
    const lastInitSessionRef = React.useRef<string | null>(null);

    // Core Initialization Logic
    const initProject = async (currentSession: Session | null) => {
        const myCallId = ++currentCallId.current;
        console.log(`[ProjectContext] Starting initProject #${myCallId}, session:`, currentSession?.user?.email || 'none');

        try {
            const storedId = localStorage.getItem('tutesis_project_uuid');

            // --- 1. Anonymous / Offline Mode (No Session) ---
            if (!currentSession) {
                if (myCallId !== currentCallId.current) return;
                console.log(`[ProjectContext] #${myCallId} No session. Setting Offline Mode.`);

                setProject({
                    id: 'offline-demo',
                    title: 'Mi Tesis (Offline)',
                    content: ''
                });
                return;
            }

            // --- 2. Authenticated Mode ---
            let activeProjectId = '';
            let activeProjectData: any = null;

            // Try to load Stored Project
            if (storedId && storedId !== 'offline-demo') {
                const { data } = await supabase
                    .from('scholar_projects')
                    .select('*')
                    .eq('id', storedId)
                    .single();

                if (myCallId !== currentCallId.current) return;

                if (data) {
                    // If found, check ownership
                    if (currentSession && !data.owner_id) {
                        // It's anonymous and we are logged in -> CLAIM IT
                        const { error: updateError } = await supabase
                            .from('scholar_projects')
                            .update({ owner_id: currentSession.user.id })
                            .eq('id', storedId);

                        if (myCallId !== currentCallId.current) return;

                        if (!updateError) {
                            console.log("Project claimed by user:", storedId);
                            data.owner_id = currentSession.user.id;
                        }
                    }

                    // If it's mine or anon (and visible), use it
                    activeProjectId = data.id;
                    activeProjectData = data;
                }
            }

            // If no valid stored project, try to fetch user's latest
            if (!activeProjectId) {
                const { data } = await supabase
                    .from('scholar_projects')
                    .select('*')
                    .eq('owner_id', currentSession.user.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (myCallId !== currentCallId.current) return;

                if (data) {
                    activeProjectId = data.id;
                    activeProjectData = data;
                    localStorage.setItem('tutesis_project_uuid', data.id);
                }
            }

            // If still nothing, create new owned project
            if (!activeProjectId) {
                const { data, error } = await supabase
                    .from('scholar_projects')
                    .insert({
                        title: 'Nuevo Proyecto',
                        content: '',
                        owner_id: currentSession.user.id
                    })
                    .select()
                    .single();

                if (myCallId !== currentCallId.current) return;

                if (data && !error) {
                    activeProjectId = data.id;
                    activeProjectData = data;
                    localStorage.setItem('tutesis_project_uuid', data.id);
                } else {
                    console.error("Failed to create project", error);
                    setProject(p => ({ ...p, id: 'offline-demo' }));
                    return;
                }
            }

            // 4. Update State
            if (myCallId !== currentCallId.current) return;

            setProject({
                id: activeProjectId,
                title: activeProjectData.title || 'Mi Tesis',
                content: activeProjectData.content || '',
                owner_id: activeProjectData.owner_id
            });

            console.log(`[ProjectContext] #${myCallId} Successfully initialized project:`, activeProjectId);

        } catch (err) {
            console.error(`[ProjectContext] #${myCallId} Critical Error:`, err);
            if (myCallId === currentCallId.current) {
                setProject(p => ({ ...p, id: 'offline-demo' }));
            }
        }
    };

    // Auth & Init Sync
    const projectIdRef = React.useRef(project.id);
    React.useEffect(() => {
        projectIdRef.current = project.id;
    }, [project.id]);

    React.useEffect(() => {
        let isMounted = true;
        let debounceTimer: ReturnType<typeof setTimeout> | null = null;

        // Get current session immediately — avoids relying on INITIAL_SESSION event
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!isMounted) return;
            setSession(session);
            lastInitSessionRef.current = session?.user?.id ?? null;
            initProject(session); // errors handled internally via try/catch
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!isMounted) return;
            // INITIAL_SESSION is handled above via getSession() — skip to avoid double-init
            if (_event === 'INITIAL_SESSION') return;

            console.log(`[ProjectContext] Auth state change [${_event}]:`, session?.user?.email || 'none');
            setSession(session);

            const incomingSessionId = session?.user?.id ?? null;
            const alreadyInitializedForSession =
                (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED') &&
                incomingSessionId !== null &&
                incomingSessionId === lastInitSessionRef.current;

            if (alreadyInitializedForSession) {
                console.log(`[ProjectContext] Skipping duplicate init for session:`, session?.user?.email || 'none');
                return;
            }

            // Debounce rapid consecutive events (Supabase can fire SIGNED_IN twice in quick succession)
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(async () => {
                if (!isMounted) return;
                try {
                    await initProject(session);
                    lastInitSessionRef.current = incomingSessionId;
                    const pId = projectIdRef.current;
                    if (session && pId && pId !== 'offline-demo') {
                        persistenceService.updateQueueProjectId(pId);
                        persistenceService.flushQueue();
                    }
                } catch (err) {
                    // Absorb any residual errors (e.g. AbortError from cancelled fetches)
                    console.warn('[ProjectContext] Auth handler error (non-critical):', err);
                }
            }, 100);
        });

        return () => {
            isMounted = false;
            if (debounceTimer) clearTimeout(debounceTimer);
            subscription.unsubscribe();
        };
    }, []);


    React.useEffect(() => {
        if (uploadedFile) {
            localStorage.setItem('tutesis_uploaded_file', JSON.stringify(uploadedFile));
        } else {
            localStorage.removeItem('tutesis_uploaded_file');
        }
    }, [uploadedFile]);

    return (
        <ProjectContext.Provider value={{
            project,
            setProject,
            uploadedFile,
            setUploadedFile,
            universities: universitiesData,
            session
        }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
};
