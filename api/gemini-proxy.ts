import type { VercelRequest, VercelResponse } from '@vercel/node';

const MODELS = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-2.0-pro', 'gemini-1.5-flash'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: 'GEMINI_API_KEY/VITE_GEMINI_API_KEY not configured in Vercel environment variables.' });
    }

    const body = req.body;
    const userText = body?.prompt || body?.user || body?.contents;
    const systemText = body?.systemInstruction || body?.system || '';
    const temperature = body?.temperature ?? 0.7;

    if (!userText || typeof userText !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid prompt text' });
    }

    const combinedPrompt = systemText
        ? `[INSTRUCCIONES DE SISTEMA]\n${systemText}\n[FIN INSTRUCCIONES]\n\n${userText}`
        : userText;

    let lastError: string | null = null;
    let lastStatus = 500;

    for (const mName of MODELS) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1/models/${mName}:generateContent?key=${GEMINI_API_KEY}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: combinedPrompt }] }],
                    generationConfig: { temperature }
                })
            });

            if (response.ok) {
                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                return res.status(200).json({ text });
            }

            const errBody = await response.json().catch(() => ({}));
            lastError = (errBody as any).error?.message || response.statusText;
            lastStatus = response.status;

            if (response.status === 404) continue;
            break;

        } catch (err: any) {
            lastError = err.message;
        }
    }

    return res.status(lastStatus).json({
        error: lastError || 'No available Gemini model.',
        type: 'UPSTREAM_ERROR'
    });
}
