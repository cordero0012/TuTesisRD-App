export const CONFIG = {
    APP_NAME: "TuTesisRD",
    VERSION: "2.0.0",

    // AI Consistency Analyzer Configuration
    CONSISTENCY_AI_MODEL: import.meta.env.VITE_CONSISTENCY_AI_MODEL || "gemini-3-flash-preview",
    CONSISTENCY_AI_TEMPERATURE: parseFloat(import.meta.env.VITE_CONSISTENCY_AI_TEMPERATURE || '0.1'),
    // 500k chars ≈ ~120k tokens input (tesis completa de ~120 páginas). Gemini 3 Flash soporta 1M tokens.
    CONSISTENCY_MAX_CHARS: parseInt(import.meta.env.VITE_CONSISTENCY_MAX_CHARS || '500000', 10),
    // 16k tokens ≈ ~64k chars de JSON — suficiente para inventarios + reglas + feedback sin truncar.
    CONSISTENCY_MAX_OUTPUT_TOKENS: parseInt(import.meta.env.VITE_CONSISTENCY_MAX_OUTPUT_TOKENS || '16384', 10)
};
