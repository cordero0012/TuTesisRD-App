
declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
    }
}

// Environment variable for GA4 Measurement ID
// Environment variable for GA4 Measurement ID
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
        fbq: (...args: any[]) => void;
        _fbq: any;
    }
}

// Initialize Analytics (GA4 + Meta Pixel)
export const initGA = () => {
    // 1. Google Analytics 4
    if (GA_MEASUREMENT_ID && !document.querySelector(`script[src*="googletagmanager"]`)) {
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

    // 2. Meta Pixel
    if (META_PIXEL_ID && !document.querySelector(`script[id="meta-pixel"]`)) {
        const pixelScript = document.createElement('script');
        pixelScript.id = 'meta-pixel';
        pixelScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${META_PIXEL_ID}');
        fbq('track', 'PageView');
        `;
        document.head.appendChild(pixelScript);
    }
};

// Log Page View
export const logPageView = (url: string) => {
    if (typeof window.gtag !== 'undefined' && GA_MEASUREMENT_ID) {
        window.gtag('config', GA_MEASUREMENT_ID, {
            page_path: url,
        });
    }

    // Meta Pixel PageView is handled by react-router usually, but we can force track if needed
    // However, the base code tracks the initial load. For SPA, we might need to track again.
    if (typeof window.fbq !== 'undefined' && META_PIXEL_ID) {
        window.fbq('track', 'PageView');
    }
};

// Log Event
export const logEvent = (action: string, category: string, label: string, value?: number) => {
    // GA4 Tracking
    if (typeof window.gtag !== 'undefined' && GA_MEASUREMENT_ID) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }

    // Meta Pixel Tracking
    if (typeof window.fbq !== 'undefined' && META_PIXEL_ID) {
        // Map common GA4 events to Facebook Standard Events
        let fbEvent = 'CustomEvent';
        const params: any = { content_category: category, content_name: label, value: value };

        if (action === 'generate_lead' || action === 'contact') {
            fbEvent = 'Lead';
        } else if (action === 'view_item') {
            fbEvent = 'ViewContent';
        } else if (action === 'purchase') { // Future proofing
            fbEvent = 'Purchase';
            params.currency = 'DOP';
        } else if (action === 'sign_up') {
            fbEvent = 'CompleteRegistration';
        }

        window.fbq('track', fbEvent, params);
    }

    if (!GA_MEASUREMENT_ID && !META_PIXEL_ID) {
        console.log(`[Analytics Dev] Event: ${action} | Category: ${category} | Label: ${label} | Value: ${value}`);
    }
};
