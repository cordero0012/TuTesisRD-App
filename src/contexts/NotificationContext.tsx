import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationContextType {
    showNotification: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<{ message: string; type: string } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification && (
                <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg z-[100] text-white font-bold transition-all ${notification.type === 'error' ? 'bg-red-500' :
                        notification.type === 'success' ? 'bg-emerald-500' :
                            notification.type === 'warning' ? 'bg-amber-500' :
                                'bg-blue-500'
                    }`}>
                    {notification.message}
                </div>
            )}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
