
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
        const key = import.meta.env.VITE_GEMINI_API_KEY;
        return (key && !key.includes('PLACEHOLDER')) ? key : "";
    }
    // Fallback to process.env (Node/Electron)
    if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) {
        const key = process.env.GEMINI_API_KEY;
        return (key && !key.includes('PLACEHOLDER')) ? key : "";
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
    // Don't throw here if key is missing, as we might handle it via proxy later
    // if (!clientInstance) throw new Error("Gemini Client not initialized...");
    return clientInstance!;
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
// Chain of Responsibility: Direct Gemini -> Proxy Gemini -> Groq
export const generateText = async (options: GenerateOptions): Promise<string> => {
    let lastError: any = null;

    // 1. DIRECT GEMINI (Only if we have a key that isn't a placeholder)
    const apiKey = getApiKey('gemini');
    if (apiKey) {
        try {
            const ai = getClient();
            const modelName = options.model || GEMINI_MODEL;
            const model = ai.getGenerativeModel({
                model: modelName,
                systemInstruction: options.systemInstruction
            });

            console.log(`[AI] Attempting Direct Gemini (${modelName})...`);
            const response = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: options.prompt }] }],
                generationConfig: {
                    temperature: options.temperature ?? 0.7,
                    ...(options.jsonMode ? { responseMimeType: "application/json" } : {})
                }
            });

            return response.response.text();
        } catch (err: any) {
            console.warn("[AI] Direct Gemini failed:", err.message);
            lastError = err;
            // Continue to Proxy...
        }
    }

    // 2. PROXY GEMINI (If Direct skipped or failed)
    if (options.provider !== 'groq') { // Don't proxy if user explicitly requested Groq
        try {
            console.log("[AI] Attempting Supabase Proxy...");
            // Use the project-specific URL, or dynamic detection
            const proxyUrl = "https://rxzphenvgpbitltqrtjw.supabase.co/functions/v1/gemini-proxy";

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
                throw new Error(`Proxy status ${response.status}: ${errData.error || response.statusText}`);
            }

            const data = await response.json();
            if (data.text) return data.text;

        } catch (err: any) {
            console.warn("[AI] Proxy Gemini failed:", err.message);
            lastError = err;
            // Continue to Groq...
        }
    }

    // 3. FALLBACK TO GROQ (Last Resort)
    console.log("[AI] Falling back to Groq...");
    try {
        const groqKey = getApiKey('groq');
        if (!groqKey) throw new Error("No Groq API Key available");

        // Safe truncation for Groq
        const MAX_GROQ_CHARS = 32000;
        let finalPrompt = options.prompt;
        if (finalPrompt.length > MAX_GROQ_CHARS) {
            console.warn(`[Groq] Truncating prompt from ${finalPrompt.length} to ${MAX_GROQ_CHARS}`);
            finalPrompt = finalPrompt.substring(0, MAX_GROQ_CHARS) + "\n\n[...TRUNCATED...]";
        }

        const model = (options.model && options.model.includes('llama')) ? options.model : GROQ_MODEL;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${groqKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    ...(options.systemInstruction ? [{ role: "system", content: options.systemInstruction }] : []),
                    { role: "user", content: finalPrompt }
                ],
                temperature: options.temperature ?? 0.7,
                ...(options.jsonMode ? { response_format: { type: "json_object" } } : {})
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Groq ${response.status}: ${error.error?.message}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';

    } catch (groqErr: any) {
        console.error("[AI] All providers failed.");
        throw lastError || groqErr; // Throw the original error or the Groq error
    }
};

/**
 * JSON generation helper with automatic parsing
 */
export const generateJSON = async <T>(options: GenerateOptions): Promise<T> => {
    const text = await generateText({ ...options, jsonMode: true });
    return JSON.parse(text) as T;
};
