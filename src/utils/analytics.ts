
declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
    }
}

// Environment variable for GA4 Measurement ID
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Initialize GA4
export const initGA = () => {
    if (!GA_MEASUREMENT_ID) {
        console.warn('GA4 Measurement ID is missing');
        return;
    }

    // Create script tags dynamically if they don't exist
    if (!document.querySelector(`script[src*="googletagmanager"]`)) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);

        const inlineScript = document.createElement('script');
        inlineScript.innerHTML = `
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', '${GA_MEASUREMENT_ID}');
     `;
        document.head.appendChild(inlineScript);
    }
};

// Log Page View
export const logPageView = (url: string) => {
    if (typeof window.gtag !== 'undefined' && GA_MEASUREMENT_ID) {
        window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: url,
        });
    }
};

// Log Event
export const logEvent = (action: string, category: string, label: string, value?: number) => {
    if (typeof window.gtag !== 'undefined' && GA_MEASUREMENT_ID) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    } else {
        console.log(`[Analytics Dev] Event: ${action} | Category: ${category} | Label: ${label}`);
    }
};
