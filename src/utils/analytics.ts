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

// WhatsApp click tracking is NOT implemented here on purpose.
//
// The GTM container (GTM-MSLMDDLR) already owns it: a Click - Just Links
// trigger whose condition is `gtm.elementUrl` contains "wa.me", firing the
// GA4 event `contact_whatsapp` to G-2XTMDMXZFC. Verified on 2026-08-02 by
// decoding the public container.
//
// A delegated listener here would fire a second contact_whatsapp on the same
// click and double the primary conversion of the business.
//
// This is why every WhatsApp CTA must stay an <a> whose href contains
// "wa.me" — GTM matches on the href, so replacing an anchor with a button
// silently stops the conversion. See AGENTS.md section 3.

/**
 * Generates an event ID for Meta deduplication.
 *
 * Meta collapses two events that share the same (event name, eventID) pair
 * inside a 48h window. Passing one here means a single user action reported
 * through two paths is counted once instead of twice.
 *
 * What this does NOT do: deduplicate against the events GTM already sends.
 * The container derives its own eventID as
 *   "bca3a99a-…-c150e8ff1b90_" + gtm.start + "." + gtm.uniqueEventId
 * which comes from GTM's internal event counter and cannot be reproduced from
 * here. Deduplicating against CAPI requires the same logical event to carry the
 * same ID on both sides, so it has to be GTM that emits both — see
 * ads-tu-tesis-rd/01_conexiones_medicion_verificadas.md.
 */
export const createEventId = (): string => {
    try {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
    } catch {
        // Fall through to the manual ID below.
    }
    return `ttrd-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
};

/**
 * Reads a Meta-issued cookie (_fbp/_fbc) for the server-side CAPI call below.
 * Both are set automatically by fbevents.js once the Pixel initializes.
 */
const readCookie = (name: string): string | undefined => {
    if (typeof document === 'undefined') return undefined;
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : undefined;
};

/**
 * Sends a server-side copy of a conversion to Meta's Conversions API via
 * /api/meta-capi, reusing the same eventId as the client fbq() call so Meta
 * dedupes them into one event instead of counting twice.
 *
 * Fire-and-forget on purpose: this is a resilience layer against ad blockers
 * and browser tracking prevention stripping the client Pixel, not the
 * primary path. A failure here must never block the conversion the user is
 * actually completing (opening WhatsApp / submitting the form).
 */
export const sendMetaCapiEvent = (
    eventName: string,
    eventId: string,
    customData?: Record<string, unknown>,
): void => {
    if (isInternalTraffic() || typeof fetch === 'undefined') return;

    fetch('/api/meta-capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            eventName,
            eventId,
            eventSourceUrl: typeof window !== 'undefined' ? window.location.href : undefined,
            fbp: readCookie('_fbp'),
            fbc: readCookie('_fbc'),
            customData,
        }),
    }).catch(() => {
        // Best-effort. The client fbq() call already fired; losing the
        // server-side mirror degrades match quality, it doesn't lose the lead.
    });
};
// Log Page View
export const logPageView = (_url: string) => {
    // GA4 page_view is NOT sent here on purpose.
    //
    // GTM already emits page_view to G-2XTMDMXZFC on load and on SPA route
    // change. Measuring production on 2026-08-02 showed 3 page_view hits per
    // initial load and 5 per SPA navigation for the same URL and session; this
    // call was one of them. Sending it from here as well inflates every
    // per-view metric in GA4 and any Ads bidding fed from it.
    //
    // Meta is the opposite case: the PageView beacons observed carried no
    // eventID, meaning they came from this call and not from GTM. GTM does not
    // send a Meta PageView, so removing the call below would leave Meta with no
    // PageView at all.
    if (isInternalTraffic()) return;

    if (typeof window.fbq !== 'undefined' && META_PIXEL_ID) {
        window.fbq('track', 'PageView', {}, { eventID: createEventId() });
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

        const options = { eventID: createEventId() };

        if (standardEvent) {
            window.fbq('track', standardEvent, params, options);
        } else {
            window.fbq('trackCustom', action, params, options);
        }
    }

    if (!GA_MEASUREMENT_ID && !META_PIXEL_ID) {
        console.log(`[Analytics Dev] Event: ${action} | Category: ${category} | Label: ${label} | Value: ${value}`);
    }
};
