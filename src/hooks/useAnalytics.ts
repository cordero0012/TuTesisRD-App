import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA, initWhatsAppMetaTracking, logPageView } from '../utils/analytics';

export const useAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        // Initialize GA on mount. The GA4 half of WhatsApp click tracking is
        // owned by GTM; the Meta half is owned by initWhatsAppMetaTracking.
        // See the note in utils/analytics.ts before changing either.
        initGA();
        initWhatsAppMetaTracking();
    }, []);

    useEffect(() => {
        // Log page view on route change
        logPageView(location.pathname + location.search);
    }, [location]);
};
