/// <reference lib="deno.ns" />

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// 2026 STABLE MODELS LIST (Including Gemini 3)
const FALLBACK_MODELS = [
    'gemini-3-flash-preview', 
    'gemini-3-pro-preview',
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash', 
    'gemini-1.5-pro'
];

function resolveGeminiApiVersion(modelName: string): 'v1' | 'v1beta' {
    // Preview and experimental Gemini aliases are published under v1beta.
    if (modelName.includes('preview') || modelName.includes('exp')) {
        return 'v1beta';
    }

    return 'v1';
}

Deno.serve(async (req: Request) => {
    console.log("-> GEMINI_PROXY_ENTRY");
    
    // 1. Handle CORS Preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    // 2. Health Check for Browser
    if (req.method === 'GET') {
        return new Response('AI Bridge is Active and Reachable', { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'text/plain' } 
        })
    }

    try {
        console.log(`[Proxy] New Request: ${req.method} ${req.url}`);

        // 2. Auth Check (Secret)
        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
        if (!GEMINI_API_KEY) {
            console.error("[Proxy] CRITICAL: GEMINI_API_KEY missing in environment.");
            return new Response(JSON.stringify({ error: 'Falta GEMINI_API_KEY en Supabase.' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        // 3. Parse Body
        const body = await req.json().catch(() => ({}));
        const userText = body.prompt || body.user || body.contents;
        const systemText = body.systemInstruction || body.system || "";
        const temperature = body.temperature ?? 0.1;
        const requestedModel = body.model;

        if (!userText || (typeof userText !== 'string' && !Array.isArray(userText))) {
            return new Response(JSON.stringify({ error: 'Missing or invalid prompt text' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        // 4. Build Priority List
        const modelsToTry = requestedModel 
            ? [requestedModel, ...FALLBACK_MODELS.filter(m => m !== requestedModel)]
            : FALLBACK_MODELS;

        let lastError = null;
        let lastStatus = 500;

        for (const mName of modelsToTry) {
            try {
                console.log(`[Proxy] Attempting AI Call: ${mName}`);
                const apiVersion = resolveGeminiApiVersion(mName);
                const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${mName}:generateContent?key=${GEMINI_API_KEY}`;

                // Extract text from contents if it's an array (standard Gemini format)
                let finalPrompt = "";
                if (Array.isArray(userText)) {
                    finalPrompt = userText[0]?.parts?.[0]?.text || "";
                } else {
                    finalPrompt = userText;
                }

                const combinedPrompt = systemText
                    ? `[SYSTEM_INSTRUCTION]\n${systemText}\n[END_SYSTEM_INSTRUCTION]\n\n${finalPrompt}`
                    : finalPrompt;

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
                        continue;
                    }
                    console.log(`[Proxy] Success with ${mName}`);
                    return new Response(JSON.stringify({ text }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                        status: 200,
                    });
                }

                console.error(`[Proxy] Upstream Error [${mName}]:`, JSON.stringify(data.error || data));
                lastError = data.error?.message || response.statusText;
                lastStatus = response.status;

                if ([404, 400, 429].includes(response.status)) continue;
                break; 

            } catch (err: any) {
                console.error(`[Proxy] Connection failed to ${mName}:`, err.message);
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
        console.error("[Proxy] Global Handler Crash:", error.message);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500,
            },
        )
    }
})
