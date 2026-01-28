import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define a simple Project interface
export interface Project {
    id: string;
    content: string;
    title?: string;
}

interface ProjectContextType {
    project: Project;
    setProject: (project: Project) => void;
    universities: any[]; // Placeholder for univeristies if needed
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Default mock project
    const [project, setProject] = useState<Project>({
        id: 'default-project',
        content: '', // Start empty
        title: 'Mi Tesis'
    });

    return (
        <ProjectContext.Provider value={{ project, setProject, universities: [] }}>
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
