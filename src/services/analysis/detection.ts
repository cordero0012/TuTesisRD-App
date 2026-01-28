
import { getClient, GEMINI_MODEL } from '../ai/client';
import { analyzeTextMetrics, TextMetrics } from './textMetrics';

export interface AiDetectionResult {
    score: number; // 0 (Human) to 1 (AI)
    category: 'A' | 'B' | 'C' | 'D'; // Categories from report
    confidence: 'Low' | 'Medium' | 'High';
    signals: string[]; // List of detected patterns (Positive or Negative)
    heatmap: { text: string; probability: number }[]; // Paragraph segments
    metrics: TextMetrics;
    sourceProbabilities?: {
        chatgpt: number;
        gemini: number;
        claude: number;
    };
}

/**
 * Heuristic + LLM Hybrid Detector
 * Uses local quantitative metrics + AI intuition (Perplexity & Burstiness analysis) to classify.
 */
export const detectAiContent = async (text: string): Promise<AiDetectionResult> => {
    // 1. Calculate Hard Metrics
    const metrics = analyzeTextMetrics(text);

    // 2. AI Judge (limit to 5000 chars for quick analysis)
    const analysis = await analyzeWithGemini(text.substring(0, 5000), metrics);

    return {
        ...analysis,
        metrics
    };
};

export const detectAiContentBatch = async (
    text: string,
    onProgress?: (progress: number, status: string) => void
): Promise<AiDetectionResult> => {
    // 0. Normalize text (remove excessive whitespaces)
    const normalizedText = text.trim().replace(/\s+/g, ' ');

    // 1. Global Metrics
    const globalMetrics = analyzeTextMetrics(normalizedText);

    // 2. Split into larger chunks for better context and fewer API calls
    // Using 12,000 chars (~3000 tokens) which is well within Gemini limits
    const CHUNK_SIZE = 12000;
    const chunks = [];
    for (let i = 0; i < normalizedText.length; i += CHUNK_SIZE) {
        chunks.push(normalizedText.substring(i, i + CHUNK_SIZE));
    }

    const totalChunks = chunks.length;

    let combinedHeatmap: any[] = [];
    let combinedSignals: Set<string> = new Set();
    let totalScore = 0;
    let successfulChunks = 0;
    let totalSourceProbs = { chatgpt: 0, gemini: 0, claude: 0 };

    // 3. Process Chunks
    for (let i = 0; i < totalChunks; i++) {
        const currentProgress = Math.round((i / totalChunks) * 100);
        if (onProgress) {
            onProgress(
                currentProgress,
                `Analizando bloque ${i + 1} de ${totalChunks}...`
            );
        }

        // Local metrics for this chunk
        const chunkMetrics = analyzeTextMetrics(chunks[i]);

        // AI Analysis
        try {
            const result = await analyzeWithGemini(chunks[i], chunkMetrics);

            // Aggregation - Only count successful ones for the average
            totalScore += result.score;
            successfulChunks++;

            if (result.sourceProbabilities) {
                totalSourceProbs.chatgpt += result.sourceProbabilities.chatgpt;
                totalSourceProbs.gemini += result.sourceProbabilities.gemini;
                totalSourceProbs.claude += result.sourceProbabilities.claude;
            }

            // Combine Heatmap
            combinedHeatmap = [...combinedHeatmap, ...result.heatmap];

            // Combine Signals
            result.signals.forEach(s => combinedSignals.add(s));

        } catch (e) {
            console.error(`Error analyzing chunk ${i}`, e);
            // Non-breaking error handling for batch
        }

        // Small delay to prevent rate limits (reduced as chunks are larger)
        if (totalChunks > 1) await new Promise(r => setTimeout(r, 300));
    }

    if (onProgress) onProgress(100, "Generando veredicto final...");

    // 4. Final Aggregation
    const count = successfulChunks || 1;
    const avgScore = totalScore / count;

    // Determine category based on avg score
    let category: 'A' | 'B' | 'C' | 'D' = 'A';
    if (avgScore > 0.8) category = 'D';
    else if (avgScore > 0.6) category = 'C';
    else if (avgScore > 0.3) category = 'B';

    return {
        score: avgScore,
        category: category,
        confidence: successfulChunks > totalChunks / 2 ? 'High' : 'Medium',
        signals: Array.from(combinedSignals),
        heatmap: combinedHeatmap.length > 0 ? combinedHeatmap : [{ text: text.substring(0, 200) + "...", probability: avgScore }],
        metrics: globalMetrics,
        sourceProbabilities: {
            chatgpt: Math.round(totalSourceProbs.chatgpt / count),
            gemini: Math.round(totalSourceProbs.gemini / count),
            claude: Math.round(totalSourceProbs.claude / count)
        }
    };
};

async function analyzeWithGemini(text: string, metrics: TextMetrics): Promise<Omit<AiDetectionResult, 'metrics'>> {
    const ai = getClient();
    const model = ai.getGenerativeModel({
        model: GEMINI_MODEL,
        generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
    });

    const prompt = `
    Actúa como un experto forense en lingüística computacional, especializado en los modelos de detección Turnitin AIW-2, AIR-1 y Compilatio Magister+.
    
    Tu misión es analizar este fragmento de texto para detectar huellas de IA (ChatGPT, Gemini, Claude, Llama).

    === MÉTRICAS CUANTITATIVAS LOCALES ===
    - Burstiness: ${metrics.burstiness.toFixed(2)} (< 4.0 = ALTA SOSPECHA - IA tiene oraciones uniformes)
    - Perplejidad (Proxy): ${metrics.perplexityProxy.toFixed(2)} (< 0.4 = ALTA SOSPECHA - texto predecible)
    - Varianza de Longitud de Oración: ${metrics.sentenceLengthVariance.toFixed(2)} (< 50 = SOSPECHOSO)
    - Simetría Estructural: ${metrics.structuralSymmetryScore.toFixed(2)} (> 0.3 = SOSPECHOSO - construcciones paralelas)
    - Uniformidad de Párrafos: ${metrics.paragraphUniformity.toFixed(2)} (> 0.7 = SOSPECHOSO)
    - Conectores IA Detectados: ${metrics.aiConnectorsCount} (> 3 = SOSPECHOSO)
    - Diversidad Léxica: ${metrics.lexicalDiversity.toFixed(2)} (< 0.4 = SOSPECHOSO)
    - Puntuación de Riesgo IA Local: ${metrics.aiRiskScore}/100

    === PATRONES DE DETECCIÓN TURNITIN ===
    1. AIW-2 (Modelo Principal): Detecta BAJA perplejidad + BAJA variabilidad de oraciones
    2. AIR-1 (Detector de Parafraseo): Detecta sustitución mecánica de sinónimos
    3. Bypasser Detection: Detecta texto que pasó por humanizadores

    === PATRONES DE DETECCIÓN COMPILATIO MAGISTER+ ===
    1. Reformulaciones Profundas: Detecta texto reescrito manteniendo estructura semántica
    2. Plagio Semántico: Detecta significado preservado con palabras cambiadas
    3. Traducciones: Detecta artefactos de traducción automática
    
    === CONECTORES TÍPICOS DE IA (Lista Negra) ===
    Español: "además", "sin embargo", "por lo tanto", "en conclusión", "es importante destacar", "cabe señalar", "resulta evidente", "por ende"
    Inglés: "furthermore", "moreover", "in conclusion", "it is important to note", "additionally"

    === TEXTO A ANALIZAR ===
    "${text}"

    === SALIDA JSON REQUERIDA ===
    {
        "score": number, // 0.0-1.0 (Probabilidad IA - considera las métricas locales)
        "category": "A"|"B"|"C"|"D", // A=Humano, B=Probablemente Humano, C=Probablemente IA, D=IA
        "confidence": "Low"|"Medium"|"High",
        "signals": [
            "señal positiva o negativa detectada",
            "otra señal..."
        ],
        "heatmap": [
            { "text": "fragmento sospechoso...", "probability": 0.0-1.0 }
        ],
        "sourceProbabilities": { "chatgpt": 0-100, "gemini": 0-100, "claude": 0-100 },
        "turnitinIndicators": {
            "aiw2_score": 0-100,
            "air1_paraphrase_detected": boolean,
            "bypasser_detected": boolean
        },
        "compilatioIndicators": {
            "deep_reformulation": boolean,
            "semantic_plagiarism_score": 0-100,
            "translation_artifacts": boolean
        }
    }
    
    === INSTRUCCIONES CRÍTICAS ===
    - El "heatmap" debe dividir el texto en oraciones/frases resaltando las más sospechosas
    - Correlaciona tu análisis con las métricas locales (si burstiness < 4, eso CONFIRMA sospecha)
    - Sé estricto pero justo: un texto bien escrito por humano puede tener buenas métricas
    - IMPORTANTE: Incluye turnitinIndicators y compilatioIndicators en tu respuesta
    `;

    try {
        const result = await model.generateContent(prompt);
        let jsonStr = result.response.text();
        // Clean markdown
        jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        return JSON.parse(jsonStr);
    } catch (e: any) {
        console.error("AI Detection failed", e);

        // Improve missing key detection
        if (e.message?.includes("API Key") || e.message?.includes("API_KEY")) {
            throw new Error("Falta la API Key de Gemini. Configúrala en Ajustes.");
        }
        if (e.message?.includes("fetch failed") || e.message?.includes("Network")) {
            throw new Error("Error de Conexión. Verifica tu internet.");
        }

        // Return fallback if it's just a model hiccup, but throw if it's config
        return {
            score: 0.5,
            category: 'B',
            confidence: 'Low',
            signals: ["Error en análisis de fragmento: " + (e.message || "Desconocido")],
            heatmap: [{ text: text.substring(0, 100) + "...", probability: 0.5 }],
            sourceProbabilities: { chatgpt: 0, gemini: 0, claude: 0 }
        };
    }
}
