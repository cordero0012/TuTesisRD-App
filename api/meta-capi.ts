import type { VercelRequest, VercelResponse } from '@vercel/node';

const GRAPH_API_VERSION = 'v21.0';

/**
 * Origins allowed to post conversions. This endpoint is only ever called by
 * our own pages (see sendMetaCapiEvent in src/utils/analytics.ts), so a
 * same-origin allowlist costs nothing and closes the drive-by case: without
 * it, any page on the internet could fire `Lead` events at the pixel and
 * teach Meta's optimizer to chase traffic that never converts.
 *
 * Browsers send `Origin` on every POST, including same-origin ones, so a
 * legitimate call always carries it.
 *
 * What this does NOT stop: a determined attacker with curl, who can set any
 * Origin header they like. Closing that properly needs a signed, short-lived
 * token minted per page load — worth doing if this endpoint ever starts
 * feeding bidding directly, overkill while it is a dedup mirror of a client
 * Pixel event that already fired.
 */
const ALLOWED_ORIGINS = new Set(
    [
        'https://www.tutesisrd.online',
        'https://tutesisrd.online',
        // The deployment's own URL, so Vercel previews work without edits.
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    ].filter((origin): origin is string => Boolean(origin)),
);

/**
 * Any localhost port, but never in production. `vercel dev` serves this
 * function on :3000 while `vite` serves the app on :5173, and either can be
 * remapped, so pinning one port just leaves a broken case behind.
 */
const LOCALHOST_ORIGIN = /^http:\/\/(?:localhost|127\.0\.0\.1):\d+$/;

const isAllowedOrigin = (origin: string): boolean => {
    if (ALLOWED_ORIGINS.has(origin)) return true;
    return process.env.VERCEL_ENV !== 'production' && LOCALHOST_ORIGIN.test(origin);
};

/**
 * Server-side mirror of the client Meta Pixel, using the same eventId the
 * client already generates (see src/utils/analytics.ts createEventId) so
 * Meta collapses both into a single event instead of double-counting.
 *
 * The hero form is the only place this is wired up (see LandingPage.tsx):
 * it is the one conversion this codebase fires directly. contact_whatsapp is
 * deliberately NOT duplicated here — GTM owns that event entirely (see the
 * note in analytics.ts); adding it here would double-count the same click
 * GTM already reports.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Rejecting here loses the server-side mirror, never the lead itself: the
    // client fbq() call fires before this request is even sent.
    const origin = req.headers.origin;
    if (!origin || !isAllowedOrigin(origin)) {
        return res.status(403).json({ error: 'Origin not allowed' });
    }

    const PIXEL_ID = process.env.META_PIXEL_ID || process.env.VITE_META_PIXEL_ID;
    const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

    if (!PIXEL_ID || !ACCESS_TOKEN) {
        return res.status(500).json({
            error: 'META_PIXEL_ID and META_CAPI_ACCESS_TOKEN must be configured in Vercel environment variables.'
        });
    }

    const body = req.body || {};
    const { eventName, eventId, eventSourceUrl, fbp, fbc, customData } = body;

    if (!eventName || typeof eventName !== 'string') {
        return res.status(400).json({ error: 'Missing eventName' });
    }
    if (!eventId || typeof eventId !== 'string') {
        return res.status(400).json({ error: 'Missing eventId — must match the client fbq() eventID for deduplication' });
    }

    const forwardedFor = req.headers['x-forwarded-for'];
    const clientIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0]?.trim();

    const payload = {
        data: [
            {
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000),
                event_id: eventId,
                event_source_url: typeof eventSourceUrl === 'string' ? eventSourceUrl : undefined,
                action_source: 'website',
                user_data: {
                    client_ip_address: clientIp || undefined,
                    client_user_agent: req.headers['user-agent'] || undefined,
                    fbp: typeof fbp === 'string' ? fbp : undefined,
                    fbc: typeof fbc === 'string' ? fbc : undefined,
                },
                custom_data: customData && typeof customData === 'object' ? customData : undefined,
            },
        ],
        // Lets Miguel validate events in Events Manager -> Test Events without
        // touching production data. Unset TEST_EVENT_CODE in Vercel once verified.
        ...(process.env.META_CAPI_TEST_EVENT_CODE ? { test_event_code: process.env.META_CAPI_TEST_EVENT_CODE } : {}),
    };

    try {
        const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            return res.status(response.status).json({ error: (data as any).error?.message || 'Meta CAPI rejected the event', details: data });
        }

        return res.status(200).json(data);
    } catch (err: any) {
        return res.status(500).json({ error: err.message || 'Failed to reach Meta Graph API' });
    }
}
