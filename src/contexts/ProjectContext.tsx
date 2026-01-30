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
    React.useEffect(() => {
        let isMounted = true;

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!isMounted) return;

            console.log(`[ProjectContext] Auth state change [${_event}]:`, session?.user?.email || 'none');
            setSession(session);

            // Wait for project to initialize (might create new one or load existing)
            await initProject(session);

            // If we have a session AND a real project ID, sync the queue
            if (session && project.id && project.id !== 'offline-demo') {
                persistenceService.updateQueueProjectId(project.id);
                persistenceService.flushQueue();
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [project.id]); // Re-run if project.id changes to ensure we flush with current ID


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
