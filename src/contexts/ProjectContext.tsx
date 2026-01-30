import React, { createContext, useContext, useState, ReactNode } from 'react';
import universitiesData from '../data/universities.json';
import { supabase } from '../supabaseClient';
import { Session } from '@supabase/supabase-js';

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

    // Core Initialization Logic
    const initProject = async (currentSession: Session | null) => {
        const storedId = localStorage.getItem('tutesis_project_uuid');

        // --- 1. Anonymous / Offline Mode (No Session) ---
        if (!currentSession) {
            console.log("[ProjectContext] No session. Initializing Mode.");

            // Try to load full project state from local storage if we want true offline persistence
            // For now, we just keep the ID in memory or use a default, avoiding Supabase calls
            if (storedId === 'offline-demo' || !storedId) {
                setProject({
                    id: 'offline-demo',
                    title: 'Mi Tesis (Offline)',
                    content: ''
                });
            } else {
                setProject({
                    id: 'offline-demo',
                    title: 'Mi Tesis (Offline)',
                    content: ''
                });
            }
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

            if (data) {
                // If found, check ownership
                if (currentSession && !data.owner_id) {
                    // It's anonymous and we are logged in -> CLAIM IT
                    const { error: updateError } = await supabase
                        .from('scholar_projects')
                        .update({ owner_id: currentSession.user.id })
                        .eq('id', storedId);

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
        setProject({
            id: activeProjectId,
            title: activeProjectData.title || 'Mi Tesis',
            content: activeProjectData.content || '',
            owner_id: activeProjectData.owner_id
        });
    };

    // Auth & Init Sync
    React.useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            // Init with fetched session (might be null initially or valid)
            if (!session) {
                initProject(null);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            await initProject(session);
        });

        return () => subscription.unsubscribe();
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
