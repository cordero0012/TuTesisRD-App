
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

// Flag for Developer Mode (manual key input in session, never bundled)
const getDevKey = (provider: AiProvider): string | null => {
    try {
        return sessionStorage.getItem(`DEV_${provider.toUpperCase()}_KEY`);
    } catch {
        return null;
    }
};

export const generateText = async (options: GenerateOptions): Promise<string> => {
    console.log(`[AI Request] Provider: ${options.provider || 'default (gemini)'}, Model: ${options.model || GEMINI_MODEL}`);

    // High Security: Always prefer Proxy for all traffic to hide keys from client bundle
    try {
        return await generateGeminiProxy(options);
    } catch (err: any) {
        console.warn("[AI] Proxy failed, checking for developer override...");
        
        // Developer fallback: Only if a developer manually added a key in the console for testing
        const devKey = getDevKey(options.provider || 'gemini');
        if (devKey) {
            console.info("[AI] Using developer session key override.");
            // Logic to use devKey would go here if needed for local-only testing
        }
        
        throw new Error(`AI Service Unavailable: ${err.message || 'Connection error'}`);
    }
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
    throw new Error("Local client access is disabled for security. Use generateText() instead.");
};

// --- Implementation Details ---

// Proxy logic remains as the primary secure channel
import { supabase } from '../../supabaseClient';

async function generateGeminiProxy(options: GenerateOptions): Promise<string> {
    const { data, error } = await supabase.functions.invoke('gemini-proxy', {
        body: {
            prompt: options.prompt,
            model: options.model || GEMINI_MODEL,
            systemInstruction: options.systemInstruction,
            temperature: options.temperature,
            jsonMode: options.jsonMode,
            provider: options.provider // Ensure proxy handles both providers
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
