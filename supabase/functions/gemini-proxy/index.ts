import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "npm:@google/generative-ai"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MODELS = ['gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-1.5-pro'];

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
        if (!GEMINI_API_KEY) {
            return new Response(JSON.stringify({ error: 'Configuración pendiente: Falta GEMINI_API_KEY en Supabase.' }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        const { prompt, model: modelName, systemInstruction, temperature } = await req.json()

        if (!prompt) {
            return new Response(JSON.stringify({ error: 'Missing prompt' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

        // Attempt models in sequence if 404
        let lastError = null;
        const requestedModel = modelName || 'gemini-1.5-flash';
        const tryModels = [requestedModel, ...MODELS.filter(m => m !== requestedModel)];

        for (const mName of tryModels) {
            try {
                const model = genAI.getGenerativeModel({
                    model: mName,
                    systemInstruction: systemInstruction
                })

                const result = await model.generateContent({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: temperature ?? 0.7,
                    }
                })

                const text = result.response.text()
                return new Response(JSON.stringify({ text }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 200,
                })
            } catch (err: any) {
                lastError = err;
                // If it's a 404, try next model. If it's something else (429, etc), fail early or continue?
                // 429 (Rate limit) should probably fail or wait, but 404 (Model not found) should definitely try next.
                if (!err.message?.includes('404')) {
                    break;
                }
                console.warn(`Model ${mName} returned 404, trying next...`);
            }
        }

        // If we get here, all models failed or we hit a non-404 error
        return new Response(
            JSON.stringify({
                error: lastError?.message || 'Error desconocido en el proveedor AI.',
                type: 'UPSTREAM_ERROR',
                status: lastError?.status || 500
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: lastError?.status || 500,
            },
        )
    } catch (error: any) {
        console.error('Edge Function Crash:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500,
            },
        )
    }
})
