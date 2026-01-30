import { generateJSON } from '../ai/client';
import { CONFIG } from '../../config';
import {
    MatrixAnalysisDTO,
    MatrixAnalysisSchema,
    ConsistencyMatrixRowSchema,
    SectionEvaluationSchema
} from '../../types/schemas';
import { z } from 'zod';

// Re-export the DTO as the canonical result type
export type ConsistencyAnalysisResult = MatrixAnalysisDTO;
export type ConsistencyMatrixRow = z.infer<typeof ConsistencyMatrixRowSchema>;
export type SectionEvaluation = z.infer<typeof SectionEvaluationSchema>;

// Local interfaces removed in favor of DTO exports

export interface DocumentChunk {
    text: string;
    sectionHint: string;
    index: number;
}

// lightweight schema for micro-analysis
const MicroAnalysisSchema = z.object({
    claims: z.array(z.object({
        type: z.enum(['Problema', 'Objetivo', 'Hipótesis', 'Metodología', 'Resultado', 'Conclusión', 'Otro']),
        finding: z.string(),
        locator: z.object({
            section: z.string(),
            snippet: z.string()
        })
    })),
    localInconsistencies: z.array(z.string()),
    criticalAlerts: z.array(z.string())
});

type MicroAnalysis = z.infer<typeof MicroAnalysisSchema>;

// --- PROMPT TEMPLATES ---

const MICRO_EXTRACTION_PROMPT = `Actúa como un experto en metodología de investigación.
Analiza este fragmento de una tesis y extrae los elementos clave para una matriz de consistencia.

FRAGMENTO ({SECTION_HINT}, Chunk {INDEX}):
{CHUNK_TEXT}

REGLA DE EVIDENCIA:
Para cada hallazgo, proporciona un 'locator' que incluya la sección de procedencia y un snippet breve (máx 150 chars) del texto original.

FORZAR SALIDA JSON:
{
  "claims": [
    {
      "type": "Problema | Objetivo | Hipótesis | Metodología | Resultado | Conclusión",
      "finding": "Descripción concisa",
      "locator": { "section": "Nombre sección", "snippet": "texto..." }
    }
  ],
  "localInconsistencies": ["lista de contradicciones halladas solo en este fragmento"],
  "criticalAlerts": ["alertas metodológicas inmediatas"]
}`;

const AGGREGATION_PROMPT = `Actúa como revisor de tesis senior. 
Has recibido micro-análisis de diferentes partes de una tesis. Tu tarea es INTEGRAR todo en una Matriz de Consistencia Final.

DATOS EXTRAÍDOS (RESUMEN POR SEGMENTOS):
{SEGMENT_DATA}

{INSTITUTIONAL_RULES}

INSTRUCCIONES:
1. Construye la matriz de consistencia relacionando los hallazgos.
2. Si hay contradicciones entre segmentos (ej. un objetivo en el Ch8 que no coincide con el Ch1), márcalo como riesgo crítico.
3. Evalúa el cumplimiento normativo y el diagnóstico global basándote en la suma de evidencias.

FORMATO DE SALIDA (JSON ESTRICTO):
{
  "documentType": "",
  "methodologicalApproach": "",
  "disciplinaryArea": "",
  "applicableStandards": [],
  "consistencyMatrix": [{"element": "Problema/Objetivo/etc", "description": "", "coherenceLevel": "Alta|Media|Baja|Inexistente", "technicalObservation": "", "recommendation": ""}],
  "sectionEvaluations": [{"section": "", "strengths": [], "weaknesses": [], "internalIncoherences": [], "methodologicalMisalignments": []}],
  "methodologicalAnalysis": {"approachCoherent": true, "designAdequate": true, "techniquesAppropriate": true, "resultsDeriveFromMethod": true, "conclusionsSupportedByResults": true, "criticalAlerts": []},
  "normativeCompliance": {"apa7Score": 0, "academicWritingScore": 0, "terminologyConsistencyScore": 0, "orthographicErrors": [], "grammaticalErrors": [], "styleIssues": []},
  "globalDiagnosis": {"level": "Excelente|Aceptable|Débil|Crítico", "mainRisks": [], "internalConsistencyDegree": 0, "publishabilityLevel": 0},
  "prioritizedRecommendations": [{"priority": "Crítica|Alta|Media|Baja", "what": "", "why": "", "how": ""}]
}`;

// --- SEGMENTER LOGIC ---

const MAX_CHUNK_SIZE = 25000;
const OVERLAP_SIZE = 1500;

function segmentDocument(text: string): DocumentChunk[] {
    const paragraphs = text.split(/\n\n+/);
    const chunks: DocumentChunk[] = [];

    // Header Detection Scoring
    const isHeader = (line: string): { isHeader: boolean; score: number } => {
        const clean = line.trim();
        if (clean.length > 150 || clean.length < 3) return { isHeader: false, score: 0 };

        let score = 0;
        if (clean === clean.toUpperCase()) score += 2;
        if (/^\d+(\.\d+)*\s/.test(clean)) score += 2;
        if (/^(CAP[IÍ]TULO|INTRO|RESUMEN|METOD|RESULTAD|CONCLU|BIBLIO|ANEXO)/i.test(clean)) score += 3;

        return { isHeader: score >= 3, score };
    };

    let currentChunkText = "";
    let currentSection = "Prólogo/Inicio";
    let chunkIndex = 0;

    for (const p of paragraphs) {
        const line = p.split('\n')[0];
        const headerTest = isHeader(line);

        if (headerTest.isHeader) {
            // If we have text and it's a new header, we don't necessarily flush yet
            // unless the chunk is getting large. Headers are markers.
            currentSection = line.trim();
        }

        if ((currentChunkText.length + p.length) > MAX_CHUNK_SIZE) {
            // Flush current chunk
            chunks.push({
                text: currentChunkText.trim(),
                sectionHint: currentSection,
                index: chunkIndex++
            });
            // Overlap: take end of last chunk
            currentChunkText = currentChunkText.substring(currentChunkText.length - OVERLAP_SIZE) + "\n\n" + p;
        } else {
            currentChunkText += (currentChunkText ? "\n\n" : "") + p;
        }
    }

    if (currentChunkText.trim()) {
        chunks.push({
            text: currentChunkText.trim(),
            sectionHint: currentSection,
            index: chunkIndex++
        });
    }

    return chunks;
}

// --- MAIN ANALYZER ---

export async function analyzeConsistencyMatrix(
    documentInput: string | { page: number; text: string }[],
    institutionalRules?: string
): Promise<ConsistencyAnalysisResult> {
    let documentText = '';
    if (Array.isArray(documentInput)) {
        documentText = documentInput.map(p => p.text).join('\n\n');
    } else {
        documentText = documentInput;
    }

    console.log(`[MatrixAnalyzer] Starting segmented analysis for ${documentText.length} chars...`);

    const chunks = segmentDocument(documentText);
    console.log(`[MatrixAnalyzer] Document segmented into ${chunks.length} chunks.`);

    const microResults: MicroAnalysis[] = [];

    // Phase 1: Micro-Analysis (Extraction) with Throttling
    const CONCURRENCY_LIMIT = 2;
    const CHUNK_DELAY = 1000; // 1s between chunks to be safe

    for (let i = 0; i < chunks.length; i += CONCURRENCY_LIMIT) {
        const batch = chunks.slice(i, i + CONCURRENCY_LIMIT);

        await Promise.all(batch.map(async (chunk) => {
            console.log(`[MatrixAnalyzer] Analyzing chunk ${chunk.index + 1}/${chunks.length} (${chunk.sectionHint})...`);
            try {
                const result = await generateJSON<MicroAnalysis>({
                    prompt: MICRO_EXTRACTION_PROMPT
                        .replace('{SECTION_HINT}', chunk.sectionHint)
                        .replace('{INDEX}', chunk.index.toString())
                        .replace('{CHUNK_TEXT}', chunk.text),
                    systemInstruction: "Eres un extractor de datos académicos ultra-preciso.",
                    temperature: 0.1,
                    model: 'gemini-2.0-flash' // Updated to 2.0
                });
                microResults.push(result);
            } catch (err) {
                console.error(`[MatrixAnalyzer] Failed chunk ${chunk.index}:`, err);
            }
        }));

        if (i + CONCURRENCY_LIMIT < chunks.length) {
            await new Promise(resolve => setTimeout(resolve, CHUNK_DELAY));
        }
    }

    // Phase 2: Aggregation
    console.log(`[MatrixAnalyzer] Aggregating ${microResults.length} micro-results...`);

    try {
        let rulesSection = institutionalRules?.trim() ? `\n\nNORMATIVAS INSTITUCIONALES:\n${institutionalRules}\n` : '';

        const aggregationResult = await generateJSON<any>({
            prompt: AGGREGATION_PROMPT
                .replace('{SEGMENT_DATA}', JSON.stringify(microResults, null, 2))
                .replace('{INSTITUTIONAL_RULES}', rulesSection),
            systemInstruction: "Eres un revisor senior capaz de sintetizar múltiples evidencias en un diagnóstico coherente.",
            temperature: CONFIG.CONSISTENCY_AI_TEMPERATURE,
            model: CONFIG.CONSISTENCY_AI_MODEL
        });

        // Apply Schema Parsing to ensure defaults are populated
        const validated = MatrixAnalysisSchema.parse(aggregationResult);

        // Check for completeness (Zod defaults detection)
        const warnings: string[] = [];
        let status: 'ok' | 'partial' = 'ok' as 'ok' | 'partial';

        if (validated.prioritizedRecommendations) {
            for (const rec of validated.prioritizedRecommendations) {
                // Check if any field matches the sentinel
                const isDefaulted = rec.what === '<<MISSING_CONTENT>>' ||
                    rec.why === '<<MISSING_CONTENT>>' ||
                    rec.how === '<<MISSING_CONTENT>>';

                if (isDefaulted) {
                    status = 'partial';
                    // Late Normalization: Replace sentinel with UI-friendly text
                    if (rec.what === '<<MISSING_CONTENT>>') rec.what = 'Recomendación general';
                    if (rec.why === '<<MISSING_CONTENT>>') rec.why = 'Justificación no generada automáticamente.';
                    if (rec.how === '<<MISSING_CONTENT>>') rec.how = 'Pasos detallados no disponibles.';
                }
            }
        }

        if (status === 'partial') {
            warnings.push("Se detectaron recomendaciones incompletas (rellenadas por seguridad).");
        }

        return {
            ...validated,
            rawAnalysis: JSON.stringify(aggregationResult),
            analysisStatus: status,
            analysisWarnings: warnings
        } as ConsistencyAnalysisResult;

    } catch (error: any) {
        console.error('[MatrixAnalyzer] Aggregation error:', error);
        throw new Error("Error en la fase de síntesis del análisis.");
    }
}

export async function generateConsistencyReport(
    documentText: string
): Promise<string> {
    const analysis = await analyzeConsistencyMatrix(documentText);
    let report = `# Informe de Matriz de Consistencia Académica (v1.9 Segmented)\n\n`;
    report += `## Diagnóstico Global\n\n- **Nivel**: ${analysis.globalDiagnosis.level}\n- **Consistencia**: ${analysis.globalDiagnosis.internalConsistencyDegree}%\n\n`;
    report += `## Recomendaciones Prioritarias\n\n`;
    analysis.prioritizedRecommendations.forEach((rec, idx) => {
        report += `### ${idx + 1}. [${rec.priority}] ${rec.what}\n\n**Cómo**: ${rec.how}\n\n`;
    });
    return report;
}
