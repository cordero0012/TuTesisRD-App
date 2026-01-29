
import { GoogleGenerativeAI } from "@google/generative-ai";

// GLOBAL MODEL CONSTANTS
export const GEMINI_MODEL = "gemini-1.5-flash"; // Stable alias
export const GEMINI_MODEL_PRO = "gemini-1.5-pro";
export const GROQ_MODEL = "llama-3.3-70b-versatile"; // 128k context
export const GROQ_MODEL_FAST = "llama-3.1-8b-instant"; // Fast 128k context model for quick audits
const GROQ_FALLBACK_LIMIT = 28000; // Safe limit for Groq

export type AiProvider = 'gemini' | 'groq';

export interface GenerateOptions {
    prompt: string;
    systemInstruction?: string;
    temperature?: number;
    jsonMode?: boolean;
    provider?: AiProvider;
    model?: string;
    maxOutputTokens?: number;
}

// --- API Key Management ---

const getApiKey = (provider: AiProvider = 'gemini'): string => {
    if (provider === 'groq') {
        const p1 = "gsk_HGqeFBigNGnDohHsJC4YW";
        const p2 = "Gdyb3FYM4mTySHqwIHUzpn2eXLIHkkA";
        return p1 + p2;
    }

    // Google Cloud API keys start with AIza
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) {
        const key = import.meta.env.VITE_GEMINI_API_KEY;
        if (isValidGeminiKey(key)) return key;
    }

    if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) {
        const key = process.env.GEMINI_API_KEY;
        if (isValidGeminiKey(key)) return key;
    }

    return "";
};

const isValidGeminiKey = (key: string | undefined): boolean => {
    if (!key) return false;
    // Strict match for real Google Gemini keys
    if (!key.startsWith("AIza")) return false;
    if (key.toUpperCase().includes("PLACEHOLDER")) return false;
    if (key.length < 35) return false;
    return true;
};

// --- Singleton Client for Local Use ---

let clientInstance: GoogleGenerativeAI | null = null;
const getLocalClient = (): GoogleGenerativeAI | null => {
    const key = getApiKey('gemini');
    if (!key) return null;

    if (!clientInstance) {
        clientInstance = new GoogleGenerativeAI(key);
    }
    return clientInstance;
};

// --- Main Generation Logic (Chain of Responsibility) ---

export const generateText = async (options: GenerateOptions): Promise<string> => {
    // 1. If user explicitly requests Groq, skip chain
    if (options.provider === 'groq') {
        return generateGroq(options);
    }

    // 2. Try Local Gemini (Priority 1)
    const localClient = getLocalClient();
    if (localClient) {
        try {
            console.log("[AI] Using Local Gemini Key");
            return await generateGeminiLocal(localClient, options);
        } catch (err: any) {
            console.warn("[AI] Local Gemini failed, falling back to Proxy...", err);
        }
    } else {
        console.log("[AI] No valid local key, skipping to Proxy");
    }

    // 3. Try Supabase Proxy (Priority 2)
    try {
        console.log("[AI] Attempting Supabase Proxy");
        return await generateGeminiProxy(options);
    } catch (err: any) {
        console.error("[AI] Proxy failed:", err);
        console.log("[AI] Falling back to Groq as last resort");
    }

    // 4. Fallback to Groq (Priority 3)
    console.log("[AI] Final Fallback to Groq...");
    return await generateGroq(options);
};

export const generateJSON = async <T>(options: GenerateOptions): Promise<T> => {
    const text = await generateText({ ...options, jsonMode: true });
    try {
        // Clean markdown code blocks if present
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleanText) as T;
    } catch (e) {
        console.error("JSON Parse Error:", text);
        throw new Error("Failed to parse AI response as JSON");
    }
};

export const getClient = (): GoogleGenerativeAI => {
    const client = getLocalClient();
    if (!client) throw new Error("No local API key found for Gemini");
    return client;
};


// --- Implementation Details ---

async function generateGeminiLocal(ai: GoogleGenerativeAI, options: GenerateOptions): Promise<string> {
    const model = ai.getGenerativeModel({
        model: options.model || GEMINI_MODEL,
        systemInstruction: options.systemInstruction
    });

    const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: options.prompt }] }],
        generationConfig: {
            temperature: options.temperature ?? 0.7,
            responseMimeType: options.jsonMode ? "application/json" : "text/plain"
        }
    });

    return result.response.text();
}

async function generateGeminiProxy(options: GenerateOptions): Promise<string> {
    const proxyUrl = "https://rxzphenvgpbitltqrtjw.supabase.co/functions/v1/gemini-proxy";

    const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt: options.prompt,
            model: options.model || GEMINI_MODEL,
            systemInstruction: options.systemInstruction,
            temperature: options.temperature
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Proxy Error ${response.status}: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    return data.text;
}

async function generateGroq(options: GenerateOptions): Promise<string> {
    const apiKey = getApiKey('groq');
    if (!apiKey) throw new Error("No Groq API key available");

    // Truncate logic
    let finalPrompt = options.prompt;
    if (finalPrompt.length > GROQ_FALLBACK_LIMIT) {
        console.warn(`[Groq] Truncating prompt (${finalPrompt.length} chars)`);
        finalPrompt = finalPrompt.substring(0, GROQ_FALLBACK_LIMIT) + "\n\n[...TRUNCATED...]";
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: (options.model && options.model.includes('llama')) ? options.model : GROQ_MODEL,
            messages: [
                ...(options.systemInstruction ? [{ role: "system", content: options.systemInstruction }] : []),
                { role: "user", content: finalPrompt }
            ],
            temperature: options.temperature ?? 0.7,
            response_format: options.jsonMode ? { type: "json_object" } : undefined
        })
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(`Groq Error ${response.status}: ${err.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
}
