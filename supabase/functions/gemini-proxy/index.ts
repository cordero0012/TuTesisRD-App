import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "npm:@google/generative-ai"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
        if (!GEMINI_API_KEY) {
            throw new Error('Missing GEMINI_API_KEY environment variable')
        }

        const { prompt, model: modelName, startChat } = await req.json()

        // Validate request
        if (!prompt) {
            throw new Error('Missing prompt in request body')
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

        // Choose model - Default to gemini-1.5-flash if not provided
        const targetModel = modelName || 'gemini-1.5-flash'
        const model = genAI.getGenerativeModel({ model: targetModel })

        let text = ''

        if (startChat) {
            // Chat mode logic if needed, but for now we basically default to generateContent
            // for consistency matrix
            const result = await model.generateContent(prompt)
            text = result.response.text()
        } else {
            // Standard generation
            const result = await model.generateContent(prompt)
            text = result.response.text()
        }

        return new Response(
            JSON.stringify({ text }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            },
        )
    } catch (error) {
        console.error('Gemini Proxy Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500, // Return 500 so client knows it failed and can fallback
            },
        )
    }
})
