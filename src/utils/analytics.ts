// Environment variable for GA4 Measurement ID
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

// Sources treated as internal/testing traffic.
// GA4 excludes traffic marked as traffic_type='internal' when the
// Internal Traffic data filter is active in GA4 Admin.
const INTERNAL_REFERRERS = [
    'tagassistant.google.com',
    'vercel.com',
];

let gaInitialized = false;
let metaPixelInitialized = false;

/**
 * Detects sessions that come from internal testing sources.
 * This is evaluated in the browser at runtime, not at build time.
 */
const isInternalTraffic = (): boolean => {
    if (typeof document === 'undefined') return false;
    const ref = document.referrer || '';
    return INTERNAL_REFERRERS.some(r => ref.includes(r));
};

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
    // GTM (GTM-MSLMDDLR) owns GA4 configuration and gclid attribution.
    // Do NOT load gtag.js or call gtag('config') here — a duplicate config
    // call resets session attribution and breaks google/cpc in GA4 reports.
    // Only ensure window.gtag and dataLayer exist as fallbacks for logEvent.
    if (GA_MEASUREMENT_ID && !gaInitialized) {
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function gtag() {
            window.dataLayer.push(arguments);
        };
        gaInitialized = true;
    }

    // 2. Meta Pixel
    if (META_PIXEL_ID && !metaPixelInitialized) {
        if (typeof window.fbq === 'undefined') {
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
            `;
            document.head.appendChild(pixelScript);
        }

        // Only initialize here. The PageView is sent by logPageView(), which
        // also runs on mount — sending it here too produced two PageView hits
        // on every first load.
        if (!isInternalTraffic() && typeof window.fbq !== 'undefined') {
            window.fbq('init', META_PIXEL_ID);
        }

        metaPixelInitialized = true;
    }
};

let whatsappTrackingBound = false;

/**
 * Tracks clicks on every WhatsApp CTA via a single delegated listener.
 *
 * WhatsApp is the primary conversion of the business and there are 17 links to
 * it spread across 8 components, none of which emitted an event. Delegation
 * covers all of them — including any added later — without touching each one.
 */
export const initWhatsAppTracking = () => {
    if (typeof document === 'undefined' || whatsappTrackingBound) return;

    document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement | null;
        const link = target?.closest?.('a[href*="wa.me"]') as HTMLAnchorElement | null;
        if (!link) return;

        logEvent(
            'contact_whatsapp',
            'Contacto',
            link.textContent?.trim().slice(0, 100) || 'WhatsApp CTA',
        );
    }, { capture: true });

    whatsappTrackingBound = true;
};

// Log Page View
export const logPageView = (url: string) => {
    const internal = isInternalTraffic();

    if (typeof window.gtag !== 'undefined' && GA_MEASUREMENT_ID) {
        const params: Record<string, unknown> = {
            send_to: GA_MEASUREMENT_ID,
            page_path: url,
            page_location: window.location.href,
            page_title: document.title,
        };
        if (internal) params.traffic_type = 'internal';
        window.gtag('event', 'page_view', params);
    }

    if (!internal && typeof window.fbq !== 'undefined' && META_PIXEL_ID) {
        window.fbq('track', 'PageView');
    }
};

// Log Event
export const logEvent = (action: string, category: string, label: string, value?: number) => {
    if (isInternalTraffic()) return;

    // GA4 Tracking
    if (typeof window.gtag !== 'undefined' && GA_MEASUREMENT_ID) {
        window.gtag('event', action, {
            send_to: GA_MEASUREMENT_ID,
            event_category: category,
            event_label: label,
            value: value,
        });
    }

    // Meta Pixel Tracking
    if (typeof window.fbq !== 'undefined' && META_PIXEL_ID) {
        // Map GA4 events to Meta Standard Events. Anything without a standard
        // equivalent must go through 'trackCustom' — 'track' only accepts the
        // official event names and silently discards anything else.
        const params: any = { content_category: category, content_name: label, value: value };
        let standardEvent: string | null = null;

        if (action === 'generate_lead' || action === 'contact' || action === 'contact_whatsapp') {
            standardEvent = 'Lead';
        } else if (action === 'view_item') {
            standardEvent = 'ViewContent';
        } else if (action === 'purchase') {
            standardEvent = 'Purchase';
            params.currency = 'DOP';
        } else if (action === 'sign_up') {
            standardEvent = 'CompleteRegistration';
        }

        if (standardEvent) {
            window.fbq('track', standardEvent, params);
        } else {
            window.fbq('trackCustom', action, params);
        }
    }

    if (!GA_MEASUREMENT_ID && !META_PIXEL_ID) {
        console.log(`[Analytics Dev] Event: ${action} | Category: ${category} | Label: ${label} | Value: ${value}`);
    }
};
