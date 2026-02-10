import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA, logPageView } from '../utils/analytics';

export const useAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        // Initialize GA on mount
        initGA();
    }, []);

    useEffect(() => {
        // Log page view on route change
        logPageView(location.pathname + location.search);
    }, [location]);
};
