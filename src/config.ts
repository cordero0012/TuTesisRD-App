export const CONFIG = {
    APP_NAME: "TuTesisRD",
    VERSION: "2.0.0",

    // AI Consistency Analyzer Configuration
    CONSISTENCY_AI_MODEL: import.meta.env.VITE_CONSISTENCY_AI_MODEL || "gemini-1.5-flash",
    CONSISTENCY_AI_TEMPERATURE: parseFloat(import.meta.env.VITE_CONSISTENCY_AI_TEMPERATURE || '0.1'),
    CONSISTENCY_MAX_CHARS: parseInt(import.meta.env.VITE_CONSISTENCY_MAX_CHARS || '100000', 10)
};
