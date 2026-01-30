import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// DEFINITIVE GEMINI 2.x MODELS
const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-pro'];

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
        if (!GEMINI_API_KEY) {
            return new Response(JSON.stringify({ error: 'Falta GEMINI_API_KEY en Supabase.' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        const body = await req.json();
        const { prompt, model: modelName, systemInstruction, temperature, jsonMode } = body;

        if (!prompt) {
            return new Response(JSON.stringify({ error: 'Missing prompt' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        let lastError = null;
        let lastStatus = 500;
        const requestedModel = modelName || 'gemini-2.5-flash';
        const tryModels = [requestedModel, ...MODELS.filter(m => m !== requestedModel)];

        for (const mName of tryModels) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1/models/${mName}:generateContent?key=${GEMINI_API_KEY}`;

                // --- PAYLOAD SHIELD (v1.14) ---
                // We send BOTH formats to ensure compatibility if Google switches expectations
                const payload = {
                    systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: temperature ?? 0.7,
                        responseMimeType: jsonMode ? "application/json" : "text/plain"
                    }
                };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const data = await response.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    return new Response(JSON.stringify({ text }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        status: 200,
                    });
                }

                // --- CRITICAL LOGGING (v1.14) ---
                const errBody = await response.json().catch(() => ({}));
                console.error(`[Proxy] Google Upstream Error (400) for model ${mName}:`, JSON.stringify({
                    status: response.status,
                    error: errBody,
                    payloadSent: { ...payload, contents: "[REDACTED_FOR_PRIVACY]" } // Log structure, not thesis data
                }));

                lastError = errBody.error?.message || response.statusText;
                lastStatus = response.status;

                if (response.status === 404) {
                    console.warn(`[Proxy] Model ${mName} returned 404. Rotating...`);
                    continue;
                }

                // If 400, might be a permanent schema issue with this model, break and return
                break;

            } catch (err: any) {
                lastError = err.message;
                console.error(`[Proxy] Critical error with ${mName}:`, err);
            }
        }

        return new Response(
            JSON.stringify({
                error: lastError || 'No available Gemini model found.',
                type: 'UPSTREAM_ERROR',
                status: lastStatus,
                details: "Check Supabase logs for Payload Shield info."
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: lastStatus,
            },
        )
    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500,
            },
        )
    }
})
