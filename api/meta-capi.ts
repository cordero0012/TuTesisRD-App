import type { VercelRequest, VercelResponse } from '@vercel/node';

const GRAPH_API_VERSION = 'v21.0';

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
