
import { GoogleGenerativeAI } from "@google/generative-ai";

// GLOBAL MODEL CONSTANTS
export const GEMINI_MODEL = "gemini-1.5-flash-001"; // Specific version to avoid 404
export const GEMINI_MODEL_PRO = "gemini-1.5-pro"; // For complex reasoning
export const GROQ_MODEL = "llama-3.3-70b-versatile"; // High capability Groq
export const GROQ_MODEL_FAST = "llama-3.1-8b-instant"; // Ultra-fast Groq

export type AiProvider = 'gemini' | 'groq';

// Works in both Vite (import.meta.env) and Electron (process.env)
const getApiKey = (provider: AiProvider = 'gemini'): string => {
    if (provider === 'groq') {
        if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) {
            return import.meta.env.VITE_GROQ_API_KEY;
        }
        return (typeof process !== 'undefined' && process.env?.GROQ_API_KEY) || "";
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
    const provider = options.provider || 'gemini';

    if (provider === 'groq') {
        const apiKey = getApiKey('groq');
        if (!apiKey) throw new Error("Groq API Key missing. Add VITE_GROQ_API_KEY to .env");

        const model = options.model || GROQ_MODEL;
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

    // 1. Fallback to Client-Side Gemini (Web/Dev)
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
};

/**
 * JSON generation helper with automatic parsing
 */
export const generateJSON = async <T>(options: GenerateOptions): Promise<T> => {
    const text = await generateText({ ...options, jsonMode: true });
    return JSON.parse(text) as T;
};
