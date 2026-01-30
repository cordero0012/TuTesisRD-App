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

        const { prompt, model: modelName, systemInstruction, temperature, jsonMode } = await req.json()

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
                // STABLE v1 API
                const url = `https://generativelanguage.googleapis.com/v1/models/${mName}:generateContent?key=${GEMINI_API_KEY}`;

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        // FIXED: Use camelCase as per REST v1 spec
                        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
                        contents: [{ role: 'user', parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: temperature ?? 0.7,
                            // FIXED: Add responseMimeType for JSON mode
                            responseMimeType: jsonMode ? "application/json" : "text/plain"
                        }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    return new Response(JSON.stringify({ text }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        status: 200,
                    });
                }

                const errBody = await response.json().catch(() => ({}));
                lastError = errBody.error?.message || response.statusText;
                lastStatus = response.status;

                if (response.status === 404) {
                    console.warn(`[Proxy] Model ${mName} returned 404. Rotating...`);
                    continue;
                }
                break;

            } catch (err: any) {
                lastError = err.message;
            }
        }

        return new Response(
            JSON.stringify({
                error: lastError || 'No available Gemini model found.',
                type: 'UPSTREAM_ERROR',
                status: lastStatus
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
