import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize conditionally to avoid crashing if key is missing during dev/build
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getGeminiResponse = async (prompt: string): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in .env.local");
    return "El servicio de IA no está configurado correctamente.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash', // Standard production model
      contents: prompt,
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    return response.text || "Lo siento, no pude generar una respuesta.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Ocurrió un error al procesar tu solicitud. Por favor intenta de nuevo.";
  }
};