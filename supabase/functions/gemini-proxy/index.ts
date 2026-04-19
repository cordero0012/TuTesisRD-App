import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// STABLE MODELS LIST
const FALLBACK_MODELS = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp'];

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
        const userText = body.prompt || body.user || body.contents;
        const systemText = body.systemInstruction || body.system || "";
        const temperature = body.temperature ?? 0.7;
        const requestedModel = body.model;

        if (!userText || typeof userText !== 'string') {
            return new Response(JSON.stringify({ error: 'Missing or invalid prompt text' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        // Build priority list: Requested model first, then fallbacks
        const modelsToTry = requestedModel 
            ? [requestedModel, ...FALLBACK_MODELS.filter(m => m !== requestedModel)]
            : FALLBACK_MODELS;

        let lastError = null;
        let lastStatus = 500;

        for (const mName of modelsToTry) {
            try {
                console.log(`[Proxy] Attempting model: ${mName}`);
                const url = `https://generativelanguage.googleapis.com/v1/models/${mName}:generateContent?key=${GEMINI_API_KEY}`;

                const combinedPrompt = systemText
                    ? `[SYSTEM_INSTRUCTION]\n${systemText}\n[END_SYSTEM_INSTRUCTION]\n\n${userText}`
                    : userText;

                const payload = {
                    contents: [{
                        role: "user",
                        parts: [{ text: combinedPrompt }]
                    }],
                    generationConfig: {
                        temperature: temperature,
                    }
                };

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json().catch(() => ({}));

                if (response.ok) {
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    if (!text) {
                        console.warn(`[Proxy] Empty response from ${mName}`);
                        lastError = "Respuesta vacía de la IA";
                        continue;
                    }
                    return new Response(JSON.stringify({ text }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        status: 200,
                    });
                }

                console.error(`[Proxy] Upstream Error for ${mName}:`, JSON.stringify(data));
                lastError = data.error?.message || response.statusText;
                lastStatus = response.status;

                // If quota or fatal error on a specific model, try next one
                if ([404, 400, 429].includes(response.status)) continue;
                break; 

            } catch (err: any) {
                console.error(`[Proxy] Fetch error for ${mName}:`, err.message);
                lastError = err.message;
            }
        }

        return new Response(
            JSON.stringify({
                error: lastError || 'No available Gemini model found.',
                type: 'UPSTREAM_ERROR',
                status: lastStatus,
                details: "Consulte los logs de la función para más detalles."
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
