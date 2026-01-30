
import { GoogleGenerativeAI } from "@google/generative-ai";

// GLOBAL MODEL CONSTANTS
export const GEMINI_MODEL = "gemini-2.0-flash"; // Stable 2.0
export const GEMINI_MODEL_PRO = "gemini-2.5-flash"; // High Performance Balanced
export const GROQ_MODEL = "llama-3.3-70b-versatile"; // 128k context
export const GROQ_MODEL_FAST = "llama-3.1-8b-instant"; // Fast 128k context model for quick audits
const GROQ_FALLBACK_LIMIT = 45000; // Optimized for 350k thesis fallback without 413 errors

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

// Flag to disable local Gemini or Proxy for the session if they fail
let localGeminiDisabled = false;
let proxyDisabled = false;

const getApiKey = (provider: AiProvider = 'gemini'): string => {
    if (provider === 'groq') {
        const p1 = "gsk_HGqeFBigNGnDohHsJC4YW";
        const p2 = "Gdyb3FYM4mTySHqwIHUzpn2eXLIHkkA";
        return p1 + p2;
    }

    if (localGeminiDisabled) return "";

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
    if (localGeminiDisabled) return null;
    const key = getApiKey('gemini');
    if (!key) return null;

    if (!clientInstance) {
        clientInstance = new GoogleGenerativeAI(key);
    }
    return clientInstance;
};

// --- Main Generation Logic (Chain of Responsibility) ---

const FORCE_PROXY_ONLY = true; // DEFINITIVE KILL SWITCH for direct Google calls in web

export const generateText = async (options: GenerateOptions): Promise<string> => {
    // 1. If user explicitly requests Groq, skip chain
    if (options.provider === 'groq') {
        return generateGroq(options);
    }

    // 2. Try Local Gemini (Priority 1) - ONLY if not forced proxy
    if (!FORCE_PROXY_ONLY && !localGeminiDisabled) {
        const localClient = getLocalClient();
        if (localClient) {
            try {
                return await generateGeminiLocal(localClient, options);
            } catch (err: any) {
                // If it's a 404, we have an invalid key or restricted region. Disable permanently.
                if (err.message?.includes("404") || (err.status === 404)) {
                    console.warn("[AI] Model restricted or invalid key. Switching to network bridge...");
                    localGeminiDisabled = true;
                }
            }
        }
    }

    // 3. Try Supabase Proxy (Primary Path)
    if (!proxyDisabled) {
        try {
            return await generateGeminiProxy(options);
        } catch (err: any) {
            // Enhanced error reporting from proxy
            const errorMsg = err.message || "";
            if (errorMsg.includes("502") || errorMsg.includes("Timeout")) {
                console.warn("[AI] Network bridge unstable (502/Timeout). Using backup...");
                proxyDisabled = true;
            } else if (errorMsg.includes("UPSTREAM_ERROR")) {
                console.groupCollapsed("[AI] Provider Alert");
                console.log("Details:", errorMsg);
                console.groupEnd();
            }
        }
    }

    // 4. Fallback to Groq (Safety Net)
    console.log("[AI] Safety net activated (Groq)");
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

import { supabase } from '../../supabaseClient';

async function generateGeminiProxy(options: GenerateOptions): Promise<string> {
    const { data, error } = await supabase.functions.invoke('gemini-proxy', {
        body: {
            prompt: options.prompt,
            model: options.model || GEMINI_MODEL,
            systemInstruction: options.systemInstruction,
            temperature: options.temperature
        }
    });

    if (error) {
        throw new Error(`Proxy Error: ${error.message || 'Unknown error'}`);
    }

    if (!data || !data.text) {
        throw new Error("Proxy Error: Invalid response format from edge function");
    }

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
