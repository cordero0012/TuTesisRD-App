
import { GoogleGenerativeAI } from "@google/generative-ai";

// GLOBAL MODEL CONSTANTS
export const GEMINI_MODEL = "gemini-1.5-flash"; // Stable production model
export const GEMINI_MODEL_PRO = "gemini-1.5-pro"; // For complex reasoning

export type AiProvider = 'gemini';

// Works in both Vite (import.meta.env) and Electron (process.env)
const getApiKey = (): string => {
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
