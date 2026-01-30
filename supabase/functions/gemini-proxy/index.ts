import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// DEFINITIVE GEMINI 2.x MODELS - REMOVED 1.5 AT PROXY LEVEL
const MODELS = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-2.0-pro'];

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
        // Fallback for prompt/user/contents
        const userText = body.prompt || body.user || body.contents;
        const systemText = body.systemInstruction || body.system || "";
        const temperature = body.temperature ?? 0.7;

        if (!userText || typeof userText !== 'string') {
            return new Response(JSON.stringify({ error: 'Missing or invalid prompt text' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        let lastError = null;
        let lastStatus = 500;

        // Always favor 2.0+ models now
        const tryModels = MODELS;

        for (const mName of tryModels) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1/models/${mName}:generateContent?key=${GEMINI_API_KEY}`;

                // --- DEFINITIVE REST V1 PAYLOAD ---
                // We inject system instruction as the first user turn to ensure 100% compatibility
                // with endpoints that don't support the top-level systemInstruction field.
                const combinedPrompt = systemText
                    ? `[INSTRUCCIONES DE SISTEMA]\n${systemText}\n[FIN INSTRUCCIONES]\n\n${userText}`
                    : userText;

                const payload = {
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: combinedPrompt }]
                        }
                    ],
                    generationConfig: {
                        temperature: temperature,
                        // Not sending responseMimeType if it's causing 400s; 
                        // prompting for JSON is more reliable across unstable API versions.
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

                const errBody = await response.json().catch(() => ({}));
                console.error(`[Proxy] Upstream Error for ${mName}:`, JSON.stringify(errBody));

                lastError = errBody.error?.message || response.statusText;
                lastStatus = response.status;

                if (response.status === 404) continue;
                break; // Stop on 400 or other fatal errors

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
