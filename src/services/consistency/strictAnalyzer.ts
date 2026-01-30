
import { z } from 'zod';
import { generateJSON } from '../ai/client';
import { getStrictPrompt } from './strictPrompts';
import { DeepNormativeAnalysis } from '../normative/types';
import { ConsistencyAnalysisResult } from './matrixAnalyzer';
import { CONFIG } from '../../config';

// --- Zod Schemas (Duplicated from matrixAnalyzer due to lack of export) ---

import { MatrixAnalysisSchema, MatrixAnalysisDTO } from '../../types/schemas';

// Re-use the centralized schema for strict analysis
const EnhancedConsistencyAnalysisResultSchema = MatrixAnalysisSchema;

export type StrictAnalysisResult = MatrixAnalysisDTO;

// --- Helper to build normative context ---
function buildDetailedNormativeContext(
    rulesText: string | null,
    metadata?: DeepNormativeAnalysis
): string | null {
    if (!rulesText && !metadata) return null;

    let context = rulesText || '';

    // If we have deep metadata, enrich the context
    if (metadata) {
        context += '\n\nINFORMACIÓN ESTRUCTURAL ADICIONAL EXTRAÍDA:\n';

        if (metadata.contentRequirements?.mandatorySections?.length) {
            context += `Secciones Obligatorias:\n${metadata.contentRequirements.mandatorySections.map(s => `- ${s.name} (Obligatoria)`).join('\n')}\n\n`;
        }

        if (metadata.formattingRules) {
            context += `Reglas de Formato Clave:\n- Márgenes: ${JSON.stringify(metadata.formattingRules.pageSetup?.margins)}\n- Tipografía: ${metadata.formattingRules.typography?.bodyFont}\n- Citación: ${metadata.citationRules?.style}\n`;
        }
    }

    return context;
}

/**
 * Performs a strict forensic analysis of the thesis
 */
export async function analyzeConsistencyStrict(
    documentText: string,
    institutionalRules: string | null,
    academicLevel: 'Grado' | 'Maestría' | 'Doctorado' = 'Grado',
    regulationMetadata?: DeepNormativeAnalysis
): Promise<ConsistencyAnalysisResult> {

    // 0. Clean and Chunk Text
    const cleanText = documentText
        .replace(/<img[^>]*src="data:[^"]*"[^>]*>/g, '') // Remove base64 images
        .replace(/<[^>]*>/g, ' ') // Remove other HTML tags
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

    // Import Chunker dynamically to avoid circular dependencies if any
    const { SemanticChunker } = await import('../ai/chunkingService');
    const chunks = SemanticChunker.chunkBySections(cleanText);

    // Prioritize sections for Forensic Analysis
    const prioritySections = ['INTRODUCCI', 'PROBLEMA', 'METODOLOG', 'RESULTADOS', 'CONCLUSIONES', 'DISCUSI', 'OBJETIVO'];
    const relevantChunks = chunks.filter(c => prioritySections.some(p => c.sectionType.toUpperCase().includes(p)));

    // Ensure we don't send too much
    const textToProcess = relevantChunks.length > 0
        ? relevantChunks.map(c => `[SECCIÓN: ${c.sectionType}]\n${c.content.substring(0, 20000)}`).join('\n\n')
        : cleanText.substring(0, 100000);

    // TELEMETRY: Chunk Verification
    console.log(`[StrictAnalyzer] Processing text. Total Length: ${textToProcess.length}, Chunks Used: ${relevantChunks.length > 0 ? relevantChunks.length : 'Full Text'}`);
    if (textToProcess.length < 500) {
        console.warn("[StrictAnalyzer] WARNING: Input text is dangerously short (<500 chars). Analysis may fail.");
    }

    // 1. Build context
    const normativeContext = buildDetailedNormativeContext(institutionalRules, regulationMetadata);

    // 2. Build prompt
    const promptTemplate = getStrictPrompt(normativeContext, academicLevel);
    const finalPrompt = promptTemplate.replace('{DOCUMENT_TEXT}', textToProcess);

    // 3. Call AI
    try {
        const result = await generateJSON<StrictAnalysisResult>({
            prompt: finalPrompt,
            systemInstruction: "Eres un auditor académico estricto. Analiza el documento buscando inconsistencias fatales y fallos normativos.",
            temperature: 0.1, // Very low temperature for strictness
            model: CONFIG.CONSISTENCY_AI_MODEL // Use configured model
        });

        // 4. Validate and Return
        const validated = EnhancedConsistencyAnalysisResultSchema.parse(result);

        // TELEMETRY: Result Verification
        console.log(`[StrictAnalyzer] Validated Result Keys: ${Object.keys(validated).join(', ')}`);
        console.log(`[StrictAnalyzer] Diagnosis Level: ${validated.globalDiagnosis?.level}, Consistency: ${validated.globalDiagnosis?.internalConsistencyDegree}%`);

        // --- STATUS DETERMINATION LOGIC ---
        let status: 'ok' | 'partial' | 'insufficient_input' | 'model_noncompliant' = 'ok';
        const warnings: string[] = [];

        // 1. Insufficient Input
        if (cleanText.length < 500) {
            status = 'insufficient_input';
            warnings.push("Texto insuficiente para análisis profundo.");
        }

        // 2. Model Non-Compliant / Partial
        if (validated.globalDiagnosis?.level === 'Pendiente') {
            status = 'partial';
            warnings.push("Diagnóstico global incompleto.");
        }

        // 3. Completeness Check (Detect Defaults > Normalization)
        let incompleteRecs = 0;
        if (validated.prioritizedRecommendations) {
            for (const rec of validated.prioritizedRecommendations) {
                const isDefaulted = rec.what === '<<MISSING_CONTENT>>' ||
                    rec.why === '<<MISSING_CONTENT>>' ||
                    rec.how === '<<MISSING_CONTENT>>';

                if (isDefaulted) {
                    incompleteRecs++;
                    // Normalize for UI
                    if (rec.what === '<<MISSING_CONTENT>>') rec.what = 'Recomendación general';
                    if (rec.why === '<<MISSING_CONTENT>>') rec.why = 'Justificación no disponible en análisis estricto.';
                    if (rec.how === '<<MISSING_CONTENT>>') rec.how = 'Consultar revisión manual.';
                }
            }
        }

        if (incompleteRecs > 0) {
            status = 'partial';
            warnings.push(`${incompleteRecs} recomendación(es) marcadas como incompletas.`);
        }

        // Add raw analysis text if needed by UI
        return {
            ...validated,
            rawAnalysis: "Análisis Forense Completado",
            analysisStatus: status,
            analysisWarnings: warnings
        } as unknown as ConsistencyAnalysisResult;

    } catch (error: any) {
        console.error("Strict Analysis Failed. Full Error:", JSON.stringify(error, null, 2));
        if (error instanceof z.ZodError) {
            // Even in error, return a 'partial' state if possible, or 'model_noncompliant'
            console.error("Zod Validation Issues:", error.issues);
            // We could return a partial object here if we wanted to be extremely resilient,
            // but for now, we throw but log cleanly.
        }
        throw new Error(`Error en análisis estricto: ${error.message}`);
    }
}
