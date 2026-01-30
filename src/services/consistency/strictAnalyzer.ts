
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
    coherenceLevel: z.string(), // Relaxed from enum to string to avoid validation errors
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
    level: z.string(), // Relaxed from enum to string
    mainRisks: z.array(z.string()),
    internalConsistencyDegree: z.number().min(0).max(100),
    publishabilityLevel: z.number().min(0).max(100)
});

// Expanded Schema for Strict Analysis
// Expanded Schema for Strict Analysis
const EnhancedConsistencyAnalysisResultSchema = z.object({
    documentType: z.string().optional().default("Documento Académico"),
    methodologicalApproach: z.string().optional().default("No especificado"),
    disciplinaryArea: z.string().optional().default("General"),
    applicableStandards: z.array(z.string()).optional().default([]),

    // Original Fields
    consistencyMatrix: z.array(ConsistencyMatrixRowSchema).optional().default([]),
    sectionEvaluations: z.array(SectionEvaluationSchema).optional().default([]),

    methodologicalAnalysis: z.object({
        approachCoherent: z.boolean().optional().default(false),
        designAdequate: z.boolean().optional().default(false),
        techniquesAppropriate: z.boolean().optional().default(false),
        resultsDeriveFromMethod: z.boolean().optional().default(false),
        conclusionsSupportedByResults: z.boolean().optional().default(false),
        criticalAlerts: z.array(z.string()).optional().default([]),
        invalidatingIssues: z.array(z.string()).optional().default([])
    }),

    normativeCompliance: z.object({
        apa7Score: z.number().min(0).max(100).optional().default(0),
        academicWritingScore: z.number().min(0).max(100).optional().default(0),
        terminologyConsistencyScore: z.number().min(0).max(100).optional().default(0),
        orthographicErrors: z.array(z.string()).optional().default([]),
        grammaticalErrors: z.array(z.string()).optional().default([]),
        styleIssues: z.array(z.string()).optional().default([])
    }).optional().default({}),

    globalDiagnosis: z.object({
        level: z.string().optional().default("Pendiente"),
        mainRisks: z.array(z.string()).optional().default([]),
        internalConsistencyDegree: z.number().min(0).max(100).optional().default(0),
        publishabilityLevel: z.number().min(0).max(100).optional().default(0)
    }).optional().default({}),

    prioritizedRecommendations: z.array(z.object({
        priority: z.string().optional().default("Media"),
        what: z.string().optional().default("Revisión general"),
        why: z.string().optional().default("Mejora requerida"),
        how: z.string().optional().default("Revisar sección")
    })).optional().default([]),

    // NEW STRICT FIELDS (Operational Model)
    sourceConsistencySubMatrix: z.object({
        citationsFound: z.array(z.object({
            citation: z.string(),
            inBibliography: z.boolean(),
            page: z.string()
        })).optional().default([]),
        referencesCiting: z.array(z.string()).optional().default([]),
        unusedReferences: z.array(z.string()).optional().default([]),
        missingReferences: z.array(z.string()).optional().default([])
    }).optional().default({ citationsFound: [], referencesCiting: [], unusedReferences: [], missingReferences: [] }),

    actionableFeedback: z.array(z.object({
        finding: z.string().optional().default("Hallazgo general"),
        evidence: z.string().optional().default(""), // Empty evidence default
        whyItMatters: z.string().optional().default("Importancia académica"),
        howToFix: z.string().optional().default("Revisar"),
        example: z.string().optional().default("-")
    })).optional().default([]),

    structuralVerification: z.object({
        sectionsFound: z.record(z.string(), z.object({
            exists: z.boolean(),
            pages: z.string().nullable().optional(),
            completeness: z.number()
        })).optional().default({}),
        missingSections: z.array(z.string()).optional().default([]),
        misplacedSections: z.array(z.string()).optional().default([])
    }).optional().default({ sectionsFound: {}, missingSections: [], misplacedSections: [] }),

    normativeComplianceDetailed: z.object({
        overallCompliance: z.number().optional().default(0),
        violations: z.array(z.object({
            rule: z.string(),
            severity: z.string().optional().default("Medium"),
            evidence: z.string(),
            impact: z.string()
        })).optional().default([]),
        compliantItems: z.array(z.object({
            rule: z.string(),
            evidence: z.string()
        })).optional().default([])
    }).optional().default({ overallCompliance: 0, violations: [], compliantItems: [] })
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

        // --- STATUS DETERMINATION LOGIC ---
        let status: 'ok' | 'partial' | 'insufficient_input' | 'model_noncompliant' = 'ok';

        // 1. Insufficient Input: If document text was tiny or meaningful content wasn't found
        if (cleanText.length < 500) {
            status = 'insufficient_input';
        }

        // 2. Model Non-Compliant / Partial: Check for critical structural failures
        // We only mark partial if substantially empty (e.g. no diagnosis level)
        if (validated.globalDiagnosis.level === 'Pendiente') {
            status = 'partial';
        }

        // Add raw analysis text if needed by UI
        return {
            ...validated,
            rawAnalysis: "Análisis Forense Completado",
            analysisStatus: status
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
