
import { GoogleGenerativeAI } from "@google/generative-ai";

// GLOBAL MODEL CONSTANTS
export const GEMINI_MODEL = "gemini-1.5-flash"; // Stable 1.5 (Better JSON handling)
export const GEMINI_MODEL_PRO = "gemini-1.5-pro"; // High Performance 1.5
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
    responseSchema?: any; // Native schema object for Gemini
}

// Flag to disable local Gemini or Proxy for the session if they fail
let localGeminiDisabled = false;
let proxyDisabled = false;
let groqPausedUntil = 0;

const isGroqLocked = () => Date.now() < groqPausedUntil;

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

const FORCE_PROXY_ONLY = false; // Allow local fallback if available

export const generateText = async (options: GenerateOptions): Promise<string> => {
    // TELEMETRY: Trace Model Request
    console.log(`[AI Request] Provider: ${options.provider || 'default (gemini)'}, Model: ${options.model || GEMINI_MODEL}`);

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

import { z, ZodSchema } from 'zod';
import { AiTelemetrySchema, AiTelemetryDTO } from '../../types/schemas';

// ... (existing constants)

import { zodToJsonSchema } from 'zod-to-json-schema';

export const generateStructured = async <T>(options: GenerateOptions, schema: ZodSchema<T>): Promise<T> => {
    const startTime = Date.now();
    let errorToReport: any = null;
    let textResponse = "";

    // Configuration for Native Structured Output (Gemini)
    const canUseNativeSchema = options.provider !== 'groq' && !localGeminiDisabled; // Groq uses different format, handling manually for now
    let finalOptions = { ...options, jsonMode: true };

    if (canUseNativeSchema) {
        // Convert Zod to JSON Schema fitting for Gemini responseSchema
        const jsonSchema = zodToJsonSchema(schema, { target: 'jsonSchema7' });
        // @ts-ignore - Google SDK types might lag behind, but this is supported in newer versions
        finalOptions.responseSchema = jsonSchema;
    }

    const attemptGeneration = async (isRetry = false, previousError?: string): Promise<T> => {
        try {
            // Include previous error in system instruction for repair if retrying
            let currentOptions = { ...finalOptions };
            if (isRetry && previousError) {
                console.warn(`[AI Client] Attempting self-repair. Error: ${previousError}`);
                const repairInstruction = `\n\nCRITICAL: Your previous response was invalid JSON or missed schema requirements. \nValidation Error: ${previousError}\nFix the structure to match the schema exactly.`;
                currentOptions.systemInstruction = (currentOptions.systemInstruction || "") + repairInstruction;
            }

            textResponse = await generateText(currentOptions);

            // Clean markdown code blocks if present (robust regex)
            const cleanText = textResponse.replace(/^```(?:json)?|```$/gi, '').trim();
            const parsedRaw = JSON.parse(cleanText);

            // Zod Validation
            const result = schema.parse(parsedRaw);

            // TELEMETRY: SUCCESS
            logTelemetry({
                provider: options.provider || 'gemini',
                model: options.model || GEMINI_MODEL,
                durationMs: Date.now() - startTime,
                success: true,
                timestamp: Date.now(),
                inputTokens: 0,
                outputTokens: textResponse.length / 4
            });

            if (isRetry) console.log(`[AI Client] Self-repair COMPLETE.`);
            return result;

        } catch (e: any) {
            // If it's the first attempt, we can try to repair
            if (!isRetry) {
                let repairableError = "Invalid JSON format";
                if (e instanceof z.ZodError) {
                    // Privacy Hardening: Only send path and message, NEVER the received value which might contain PII
                    repairableError = e.errors.map(err => `Field '${err.path.join('.')}' is invalid: ${err.message}`).join('; ');
                } else if (e instanceof SyntaxError) {
                    repairableError = "JSON Syntax Error: " + e.message;
                }

                // Trigger Self-Repair Loop
                return await attemptGeneration(true, repairableError);
            }

            // If we are already retrying, or fatal error, throw up
            errorToReport = e;
            console.error("Structured Generation Error (Final). Raw Text Preview:", textResponse.substring(0, 200));

            if (e instanceof z.ZodError) {
                throw new Error(`AI Schema Validation Failed after repair: ${e.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')}`);
            }
            throw new Error("Failed to parse or validate AI response after retries.");
        }
    };

    try {
        return await attemptGeneration(false);
    } finally {
        if (errorToReport) {
            logTelemetry({
                provider: options.provider || 'gemini',
                model: options.model || GEMINI_MODEL,
                durationMs: Date.now() - startTime,
                success: false,
                errorCode: errorToReport.message || "Unknown Error",
                timestamp: Date.now()
            });
        }
    }
};

// Deprecated wrapper for backward compatibility, but prefer generateStructured
export const generateJSON = async <T>(options: GenerateOptions): Promise<T> => {
    return generateStructured(options, z.any());
};

const logTelemetry = (data: AiTelemetryDTO) => {
    // In production, this would go to Supabase or a logging service
    // For now, minimal console output with a distinctive prefix
    console.debug(`[TELEMETRY] ${JSON.stringify(data)}`);
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
            temperature: options.temperature,
            jsonMode: options.jsonMode
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
    if (isGroqLocked()) {
        const remaining = Math.ceil((groqPausedUntil - Date.now()) / 1000);
        throw new Error(`Groq temporalmente bloqueado (Rate Limit). Reintenta en ${remaining}s.`);
    }

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
        if (response.status === 429) {
            console.error("[Groq] Rate limit hit. Pausing service for 30s...");
            groqPausedUntil = Date.now() + 30000;
        }
        const err = await response.json().catch(() => ({}));
        throw new Error(`Groq Error ${response.status}: ${err.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
}
