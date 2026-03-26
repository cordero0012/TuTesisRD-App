import React, { createContext, useContext, useEffect, useState } from 'react';
import { persistenceService } from '../services/persistenceService';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline' | 'pending';

interface PersistenceContextType {
    status: SaveStatus;
    flush: () => void;
}

const PersistenceContext = createContext<PersistenceContextType>({
    status: 'idle',
    flush: () => {}
});

export const PersistenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [status, setStatus] = useState<SaveStatus>('idle');

    useEffect(() => {
        const unsubscribe = persistenceService.subscribe((newStatus) => {
            setStatus(newStatus);
        });
        return unsubscribe;
    }, []);

    const flush = () => {
        persistenceService.flushQueue();
    };

    return (
        <PersistenceContext.Provider value={{ status, flush }}>
            {children}
        </PersistenceContext.Provider>
    );
};

export const usePersistence = () => useContext(PersistenceContext);
