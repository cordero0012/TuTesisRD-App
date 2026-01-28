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

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Default mock project
    const [project, setProject] = useState<Project>({
        id: 'default-project',
        content: '', // Start empty
        title: 'Mi Tesis'
    });

    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

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
