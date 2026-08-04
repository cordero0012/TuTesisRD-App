import type { VercelRequest, VercelResponse } from '@vercel/node';

const GRAPH_API_VERSION = 'v21.0';
const AD_ACCOUNT_ID = 'act_777831645113258'; // CUENTA PERSONAL MIGUEL — cuenta compartida con NES CAMP
const PIXEL_ID = '1304072538248053'; // Tu Tesis RD - Pixel Web
const PAGE_ID = '1235756289628667'; // Tu Tesis RD (Página nueva, creada 2026-08-04 — la original se perdió, ver ads-tu-tesis-rd/07_creatividades_meta_recuperadas.md)
const LANDING_URL = 'https://www.tutesisrd.online';

// Los 8 creativos recuperados de la subida del 2026-05-01 (act_777831645113258/adimages),
// elegidos porque su CTA impreso en la imagen ("Solicita información", "Cuéntanos en qué
// etapa estás"...) es coherente con aterrizar en la landing — a diferencia de los otros 4
// ("Escríbenos por WhatsApp") reservados para una futura campaña click-to-WhatsApp.
// Cada concepto va en formato cuadrado (feed) y vertical (Stories/Reels).
const LEAD_AD_CREATIVES = [
    {
        key: 'guia_clara_sq',
        imageHash: '4940e15ecf6078f1c205a20165e85392',
        headline: 'Tu tesis con guía clara y apoyo real',
        message: '¿Buscas apoyo real para tu tesis en República Dominicana? Asesoría personalizada, corrección profesional y acompañamiento en cada etapa. Cobertura nacional, todas las universidades.',
    },
    {
        key: 'guia_clara_vt',
        imageHash: 'c0f42226f79f8818725ff5288849b3fe',
        headline: 'Tu tesis con guía clara y apoyo real',
        message: '¿Buscas apoyo real para tu tesis en República Dominicana? Asesoría personalizada, corrección profesional y acompañamiento en cada etapa. Cobertura nacional, todas las universidades.',
    },
    {
        key: 'misma_pagina_sq',
        imageHash: '2712fad3e93ed092e5bc217be217dadb',
        headline: '¿Llevas meses con la misma página?',
        message: 'Si tu tesis está detenida, te ayudamos a ordenar el proceso, corregir errores y avanzar con más claridad. Cuéntanos en qué etapa estás.',
    },
    {
        key: 'misma_pagina_vt',
        imageHash: '03ca1b9e1c345b94ebe9d3d24e39b3c4',
        headline: '¿Llevas meses con la misma página?',
        message: 'Si tu tesis está detenida, te ayudamos a ordenar el proceso, corregir errores y avanzar con más claridad. Cuéntanos en qué etapa estás.',
    },
    {
        key: 'momento_avanzar_sq',
        imageHash: '5d9a53c95b0137bf98b4fe47226f830a',
        headline: 'Llegó el momento de avanzar con tu tesis',
        message: '¿Listo para organizar tu tema, metodología y redacción? Te acompañamos en cada paso de tu tesis.',
    },
    {
        key: 'momento_avanzar_vt',
        imageHash: 'dbc2140aa6b644b4b6849d54f8bc1b12',
        headline: 'Llegó el momento de avanzar con tu tesis',
        message: '¿Listo para organizar tu tema, metodología y redacción? Te acompañamos en cada paso de tu tesis.',
    },
    {
        key: 'servicios_sq',
        imageHash: 'ffe6dfcb5878d92709751e77ad16665e',
        headline: 'Servicios que se adaptan a tu proceso académico',
        message: 'Tesis universitaria, monográficos con orientación, corrección APA y revisión. Servicios que se adaptan a tu proceso académico.',
    },
    {
        key: 'servicios_vt',
        imageHash: '2f626557d211de1d1507bb29affc6109',
        headline: 'Servicios que se adaptan a tu proceso académico',
        message: 'Tesis universitaria, monográficos con orientación, corrección APA y revisión. Servicios que se adaptan a tu proceso académico.',
    },
];

/**
 * One-off admin tool: creates NEW Tu Tesis RD campaign objects via the Meta
 * Marketing API, using the server-only token already issued to the
 * "Conversions API System User" (see ads-tu-tesis-rd/04_reconexion_meta_ads.md).
 *
 * Deliberately create-only — no update/delete/list-by-arbitrary-id actions —
 * so this tool structurally cannot touch the existing NES CAMP campaigns that
 * already run in this shared ad account.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.headers['x-admin-secret'] !== process.env.ADMIN_TOOL_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
    if (!ACCESS_TOKEN) {
        return res.status(500).json({ error: 'META_CAPI_ACCESS_TOKEN not configured' });
    }

    const graph = async (path: string, params: Record<string, any>, method: 'GET' | 'POST' = 'POST') => {
        const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${path}`;
        const opts: RequestInit = { method, headers: { 'Content-Type': 'application/json' } };
        let finalUrl = url;
        if (method === 'GET') {
            const qs = new URLSearchParams({ ...params, access_token: ACCESS_TOKEN }).toString();
            finalUrl = `${url}?${qs}`;
        } else {
            opts.body = JSON.stringify({ ...params, access_token: ACCESS_TOKEN });
        }
        const r = await fetch(finalUrl, opts);
        const data = await r.json().catch(() => ({}));
        if (!r.ok) {
            throw new Error(`${path} failed: ${(data as any).error?.message || r.statusText} — ${JSON.stringify((data as any).error || {})}`);
        }
        return data;
    };

    try {
        const action = (req.query.action as string) || (req.body && req.body.action);

        if (action === 'account_info') {
            const info = await graph(
                AD_ACCOUNT_ID,
                { fields: 'name,currency,account_status,timezone_name,spend_cap,amount_spent' },
                'GET'
            );
            return res.status(200).json(info);
        }

        if (action === 'list_my_campaigns') {
            // Only campaigns whose name starts with "Tu Tesis RD" — never surfaces NES CAMP's.
            const list = await graph(
                `${AD_ACCOUNT_ID}/campaigns`,
                { fields: 'id,name,status,objective,daily_budget,lifetime_budget', limit: 100 },
                'GET'
            );
            const mine = ((list as any).data || []).filter((c: any) => c.name?.startsWith('Tu Tesis RD'));
            return res.status(200).json({ campaigns: mine });
        }

        if (action === 'create_lead_campaign') {
            // $2.00/día is Meta's real minimum per ad set (verified 2026-08-04 — $1.45
            // was rejected with "Presupuesto demasiado bajo"). Default matches what was
            // actually approved and used for the live Tu Tesis RD campaign that day.
            const dailyBudgetCents = Number(req.body?.dailyBudgetCents) || 200;
            const campaignName = req.body?.campaignName || 'Tu Tesis RD | Leads | RD';

            // 1. Campaign — paused on creation, Miguel reviews before enabling.
            const campaign = await graph(`${AD_ACCOUNT_ID}/campaigns`, {
                name: campaignName,
                objective: 'OUTCOME_LEADS',
                status: 'PAUSED',
                special_ad_categories: [],
                // Required as of 2026-08-04: Meta rejects campaign creation without this
                // when the ad set (not the campaign) carries the budget.
                is_adset_budget_sharing_enabled: false,
            });

            // 2. Ad set — optimizes for the existing 'Lead' pixel event (hero form),
            // matching what the site already fires (see analytics.ts sendMetaCapiEvent).
            const adSet = await graph(`${AD_ACCOUNT_ID}/adsets`, {
                name: `${campaignName} | Ad Set 1`,
                campaign_id: campaign.id,
                daily_budget: dailyBudgetCents,
                billing_event: 'IMPRESSIONS',
                optimization_goal: 'OFFSITE_CONVERSIONS',
                bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
                promoted_object: { pixel_id: PIXEL_ID, custom_event_type: 'LEAD' },
                targeting: {
                    geo_locations: { countries: ['DO'] },
                    age_min: 18,
                    age_max: 45,
                    locales: [11], // Spanish
                    // Required as of 2026-08-04. Kept at 0 (manual targeting only) because
                    // enabling Advantage+ Audience (1) forces age_max to 65 — incompatible
                    // with the 18-45 range agreed for this campaign.
                    targeting_automation: { advantage_audience: 0 },
                },
                status: 'PAUSED',
            });

            return res.status(200).json({ campaign, adSet, note: 'Creados en PAUSED. Usa la acción create_lead_ads con este adSet.id para crear los anuncios.' });
        }

        if (action === 'create_lead_ads') {
            const adSetId = req.body?.adSetId || req.query.adSetId;
            if (!adSetId) {
                return res.status(400).json({ error: 'Falta adSetId — corre primero create_lead_campaign y pasa aquí el adSet.id que devuelve.' });
            }

            const created: Array<{ concept: string; creativeId: string; adId: string }> = [];
            for (const c of LEAD_AD_CREATIVES) {
                const creative = await graph(`${AD_ACCOUNT_ID}/adcreatives`, {
                    name: `Tu Tesis RD | ${c.key}`,
                    object_story_spec: {
                        page_id: PAGE_ID,
                        link_data: {
                            link: LANDING_URL,
                            message: c.message,
                            name: c.headline,
                            image_hash: c.imageHash,
                            call_to_action: { type: 'LEARN_MORE', value: { link: LANDING_URL } },
                        },
                    },
                });
                const ad = await graph(`${AD_ACCOUNT_ID}/ads`, {
                    name: `Tu Tesis RD | ${c.key}`,
                    adset_id: adSetId,
                    creative: { creative_id: creative.id },
                    status: 'PAUSED',
                });
                created.push({ concept: c.key, creativeId: creative.id, adId: ad.id });
            }

            return res.status(200).json({
                ads: created,
                note: `${created.length} anuncios creados en PAUSED dentro del ad set ${adSetId}. Revisa el creativo y el copy en Ads Manager antes de activar cualquiera.`,
            });
        }

        return res.status(400).json({ error: 'Unknown or missing action', validActions: ['account_info', 'list_my_campaigns', 'create_lead_campaign', 'create_lead_ads'] });
    } catch (err: any) {
        return res.status(500).json({ error: err.message || 'Meta Marketing API call failed' });
    }
}
