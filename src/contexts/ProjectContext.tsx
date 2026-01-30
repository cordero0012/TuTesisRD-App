import React, { createContext, useContext, useState, ReactNode } from 'react';
import universitiesData from '../data/universities.json';

// Define a simple Project interface
export interface Project {
    id: string;
    content: string;
    title?: string;
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
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

import { supabase } from '../supabaseClient';

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    // Default mock project initially, will be hydrated
    const [project, setProject] = useState<Project>({
        id: '',
        content: '',
        title: 'Mi Tesis'
    });

    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(() => {
        const saved = localStorage.getItem('tutesis_uploaded_file');
        return saved ? JSON.parse(saved) : null;
    });

    // Hydrate Project from Supabase or Create New
    React.useEffect(() => {
        const initProject = async () => {
            const storedId = localStorage.getItem('tutesis_project_uuid');

            if (storedId) {
                // Fetch existing
                const { data } = await supabase
                    .from('scholar_projects')
                    .select('*')
                    .eq('id', storedId)
                    .single();

                if (data) {
                    setProject({
                        id: data.id,
                        title: data.title || 'Mi Tesis',
                        content: data.content || ''
                    });
                    return;
                }
            }

            // Create new if none found or not valid
            const { data, error } = await supabase
                .from('scholar_projects')
                .insert({
                    title: 'Nuevo Proyecto',
                    content: ''
                })
                .select()
                .single();

            if (data && !error) {
                localStorage.setItem('tutesis_project_uuid', data.id);
                setProject({
                    id: data.id,
                    title: data.title,
                    content: data.content || ''
                });
            } else {
                console.error("Failed to initialize project", error);
                // Fallback to offline/mock
                setProject(p => ({ ...p, id: 'offline-demo' }));
            }
        };

        initProject();
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
            universities: universitiesData
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
