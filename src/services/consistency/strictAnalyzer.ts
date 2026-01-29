
import { z } from 'zod';
import { generateJSON } from '../ai/client';
import { getStrictPrompt } from './strictPrompts';
import { DeepNormativeAnalysis } from '../normative/types';
import { ConsistencyAnalysisResult } from './matrixAnalyzer';
import { CONFIG } from '../../config';

// --- Zod Schemas (Duplicated from matrixAnalyzer due to lack of export) ---

const ConsistencyMatrixRowSchema = z.object({
    element: z.string(),
    description: z.string(),
    coherenceLevel: z.union([z.literal('Alta'), z.literal('Media'), z.literal('Baja'), z.literal('Inexistente')]),
    technicalObservation: z.string(),
    recommendation: z.string()
});

const SectionEvaluationSchema = z.object({
    section: z.string(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    internalIncoherences: z.array(z.string()),
    methodologicalMisalignments: z.array(z.string())
});

const GlobalDiagnosisSchema = z.object({
    level: z.union([z.literal('Excelente'), z.literal('Aceptable'), z.literal('Débil'), z.literal('Crítico')]),
    mainRisks: z.array(z.string()),
    internalConsistencyDegree: z.number().min(0).max(100),
    publishabilityLevel: z.number().min(0).max(100)
});

// Expanded Schema for Strict Analysis
const EnhancedConsistencyAnalysisResultSchema = z.object({
    documentType: z.string(),
    methodologicalApproach: z.string(),
    disciplinaryArea: z.string(),
    applicableStandards: z.array(z.string()),

    // Original Fields
    consistencyMatrix: z.array(ConsistencyMatrixRowSchema),
    sectionEvaluations: z.array(SectionEvaluationSchema),

    methodologicalAnalysis: z.object({
        approachCoherent: z.boolean(),
        designAdequate: z.boolean(),
        techniquesAppropriate: z.boolean(),
        resultsDeriveFromMethod: z.boolean(),
        conclusionsSupportedByResults: z.boolean(),
        forensicReasoning: z.string().describe("Explanation of the forensic analysis logic"),
        criticalAlerts: z.array(z.string()),
        invalidatingIssues: z.array(z.string()).optional() // New strict field
    }),

    normativeCompliance: z.object({
        apa7Score: z.number().min(0).max(100),
        academicWritingScore: z.number().min(0).max(100),
        terminologyConsistencyScore: z.number().min(0).max(100),
        orthographicErrors: z.array(z.string()),
        grammaticalErrors: z.array(z.string()),
        styleIssues: z.array(z.string())
    }),

    globalDiagnosis: z.object({
        level: z.union([z.literal('Excelente'), z.literal('Aceptable'), z.literal('Débil'), z.literal('Crítico')]),
        auditSummary: z.string().describe("Executive summary of the forensic audit"),
        mainRisks: z.array(z.string()),
        internalConsistencyDegree: z.number().min(0).max(100),
        publishabilityLevel: z.number().min(0).max(100)
    }),

    prioritizedRecommendations: z.array(z.object({
        priority: z.union([z.literal('Crítica'), z.literal('Alta'), z.literal('Media'), z.literal('Baja')]),
        what: z.string(),
        why: z.string(),
        how: z.string()
    })),

    // NEW STRICT FIELDS (Operational Model)
    sourceConsistencySubMatrix: z.object({
        citationsFound: z.array(z.object({
            citation: z.string(),
            inBibliography: z.boolean(),
            page: z.string()
        })),
        referencesCiting: z.array(z.string()),
        unusedReferences: z.array(z.string()),
        missingReferences: z.array(z.string())
    }).optional(),
    actionableFeedback: z.array(z.object({
        finding: z.string(),
        evidence: z.string(),
        whyItMatters: z.string(),
        howToFix: z.string(),
        example: z.string()
    })),

    structuralVerification: z.object({
        sectionsFound: z.record(z.string(), z.object({
            exists: z.boolean(),
            pages: z.string(),
            completeness: z.number()
        })),
        missingSections: z.array(z.string()),
        misplacedSections: z.array(z.string())
    }).optional(),

    normativeComplianceDetailed: z.object({
        overallCompliance: z.number(),
        violations: z.array(z.object({
            rule: z.string(),
            severity: z.union([z.literal('Critical'), z.literal('High'), z.literal('Medium'), z.literal('Low')]),
            evidence: z.string(),
            impact: z.string()
        })),
        compliantItems: z.array(z.object({
            rule: z.string(),
            evidence: z.string()
        }))
    }).optional()
});

export type StrictAnalysisResult = z.infer<typeof EnhancedConsistencyAnalysisResultSchema>;

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

    // 1. Build context
    const normativeContext = buildDetailedNormativeContext(institutionalRules, regulationMetadata);

    // 2. Build prompt
    const prompt = getStrictPrompt(normativeContext, academicLevel);

    const finalPrompt = prompt + "\n\nDOCUMENTO A EVALUAR:\n" + textToProcess;

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

        // Add raw analysis text if needed by UI, though usually it's just the object
        return {
            ...validated,
            rawAnalysis: "Análisis Forense Completado"
        } as unknown as ConsistencyAnalysisResult;

    } catch (error: any) {
        console.error("Strict Analysis Failed:", error);
        throw new Error(`Error en análisis estricto: ${error.message}`);
    }
}
