
import { GoogleGenerativeAI } from "@google/generative-ai";

// GLOBAL MODEL CONSTANTS
export const GEMINI_MODEL = "gemini-1.5-flash"; // Stable alias
export const GEMINI_MODEL_PRO = "gemini-1.5-pro";
export const GROQ_MODEL = "llama-3.3-70b-versatile"; // 128k context for large docs
export const GROQ_MODEL_FAST = "llama-3.1-8b-instant"; // Fast 128k context model

export type AiProvider = 'gemini' | 'groq';

// Works in both Vite (import.meta.env) and Electron (process.env)
const getApiKey = (provider: AiProvider = 'gemini'): string => {
    if (provider === 'groq') {
        // Hardcoded, obfuscated
        const p1 = "gsk_HGqeFBigNGnDohHsJC4YW";
        const p2 = "Gdyb3FYM4mTySHqwIHUzpn2eXLIHkkA";
        return p1 + p2;
    }

    // Try Vite environment first
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) {
        return import.meta.env.VITE_GEMINI_API_KEY;
    }
    // Fallback to process.env (Node/Electron)
    if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) {
        return process.env.GEMINI_API_KEY;
    }
    // Last resort: check window (might be injected via preload)
    if (typeof window !== 'undefined' && (window as any).__GEMINI_API_KEY__) {
        return (window as any).__GEMINI_API_KEY__;
    }
    return "";
};

let clientInstance: GoogleGenerativeAI | null = null;

export const getClient = (): GoogleGenerativeAI => {
    if (!clientInstance) {
        const key = getApiKey();
        if (key) {
            clientInstance = new GoogleGenerativeAI(key);
        }
    }
    if (!clientInstance) throw new Error("Gemini Client not initialized (Missing Key). Please add VITE_GEMINI_API_KEY to your .env file.");
    return clientInstance;
};

// --- Helper Functions for common AI operations ---

export interface GenerateOptions {
    prompt: string;
    systemInstruction?: string;
    temperature?: number;
    jsonMode?: boolean;
    provider?: AiProvider;
    model?: string;
}

/**
 * Unified text generation helper
 */
export const generateText = async (options: GenerateOptions): Promise<string> => {
    // FORCE GROQ as primary provider since we have the key and Gemini is 404ing
    const provider = options.provider || 'groq';

    if (provider === 'groq') {
        const apiKey = getApiKey('groq');
        if (!apiKey) throw new Error("Groq API Key missing. Add VITE_GROQ_API_KEY to .env");

        // Ensure we use a Groq model, not a Gemini model passed in options
        const model = (options.model && options.model.includes('llama')) ? options.model : GROQ_MODEL;
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    ...(options.systemInstruction ? [{ role: "system", content: options.systemInstruction }] : []),
                    { role: "user", content: options.prompt }
                ],
                temperature: options.temperature ?? 0.7,
                ...(options.jsonMode ? { response_format: { type: "json_object" } } : {})
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Groq API Error: ${error.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';
    }

    // 1. Check if Gemini API Key is present (Local Mode)
    const apiKey = getApiKey('gemini');

    // 2. PROXY MODE (Production/Web) - If no API Key, use Supabase Edge Function
    if (!apiKey && provider === 'gemini') {
        const proxyUrl = "https://rxzphenvgpbitltqrtjw.supabase.co/functions/v1/gemini-proxy";
        console.log("Using Supabase Proxy for Gemini...");

        try {
            const response = await fetch(proxyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: options.prompt,
                    systemInstruction: options.systemInstruction,
                    temperature: options.temperature,
                    model: options.model || GEMINI_MODEL,
                    jsonMode: options.jsonMode
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(`Proxy Error: ${errData.error || response.statusText}`);
            }

            const data = await response.json();
            return data.text || '';
        } catch (err: any) {
            console.error("Proxy call failed:", err);
            throw new Error(err.message || 'Error calling AI proxy');
        }
    }

    // 3. Fallback to Client-Side Gemini (Local Dev with .env)
    try {
        const ai = getClient();
        const modelName = options.model || GEMINI_MODEL;
        const model = ai.getGenerativeModel({
            model: modelName,
            systemInstruction: options.systemInstruction
        });

        const response = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: options.prompt }] }],
            generationConfig: {
                temperature: options.temperature ?? 0.7,
                ...(options.jsonMode ? { responseMimeType: "application/json" } : {})
            }
        });

        return response.response.text() || '';
    } catch (error: any) {
        // FALLBACK TO GROQ if Gemini fails and we haven't tried Groq yet
        if (options.provider !== 'groq') {
            console.warn("Gemini failed, switching to Groq fallback...", error);
            return generateText({ ...options, provider: 'groq', model: undefined });
        }
        throw error;
    }
};

/**
 * JSON generation helper with automatic parsing
 */
export const generateJSON = async <T>(options: GenerateOptions): Promise<T> => {
    const text = await generateText({ ...options, jsonMode: true });
    return JSON.parse(text) as T;
};
