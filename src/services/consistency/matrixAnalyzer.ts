import { generateJSON } from '../ai/client';
import { CONFIG } from '../../config';
import { z } from 'zod';

export interface ConsistencyMatrixRow {
    element: string;
    description: string;
    coherenceLevel: 'Alta' | 'Media' | 'Baja' | 'Inexistente';
    technicalObservation: string;
    recommendation: string;
}

export interface SectionEvaluation {
    section: string;
    strengths: string[];
    weaknesses: string[];
    internalIncoherences: string[];
    methodologicalMisalignments: string[];
}

export interface GlobalDiagnosis {
    level: 'Excelente' | 'Aceptable' | 'Débil' | 'Crítico';
    mainRisks: string[];
    internalConsistencyDegree: number; // 0-100
    publishabilityLevel: number; // 0-100
}

export interface FeedbackItem {
    finding: string;
    evidence: string;
    whyItMatters: string;
    howToFix: string;
    example: string;
}

export interface SourceAlignment {
    citation: string;
    inBibliography: boolean;
    page: string;
}

export interface ConsistencyAnalysisResult {
    documentType: string;
    methodologicalApproach: string;
    disciplinaryArea: string;
    applicableStandards: string[];
    consistencyMatrix: ConsistencyMatrixRow[];
    sectionEvaluations: SectionEvaluation[];
    methodologicalAnalysis: {
        approachCoherent: boolean;
        designAdequate: boolean;
        techniquesAppropriate: boolean;
        resultsDeriveFromMethod: boolean;
        conclusionsSupportedByResults: boolean;
        criticalAlerts: string[];
    };
    normativeCompliance: {
        apa7Score: number;
        academicWritingScore: number;
        terminologyConsistencyScore: number;
        orthographicErrors: string[];
        grammaticalErrors: string[];
        styleIssues: string[];
    };
    globalDiagnosis: {
        level: 'Excelente' | 'Aceptable' | 'Débil' | 'Crítico';
        mainRisks: string[];
        internalConsistencyDegree: number; // 0-100
        publishabilityLevel: number; // 0-100
    };
    prioritizedRecommendations: {
        priority: 'Crítica' | 'Alta' | 'Media' | 'Baja';
        what: string;
        why: string;
        how: string;
    }[];
    rawAnalysis: string;
}

// Zod Schema for validation
const ConsistencyMatrixRowSchema = z.object({
    element: z.string(),
    description: z.string(),
    coherenceLevel: z.enum(['Alta', 'Media', 'Baja', 'Inexistente']),
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

const ConsistencyAnalysisResultSchema = z.object({
    documentType: z.string(),
    methodologicalApproach: z.string(),
    disciplinaryArea: z.string(),
    applicableStandards: z.array(z.string()),
    consistencyMatrix: z.array(ConsistencyMatrixRowSchema),
    sectionEvaluations: z.array(SectionEvaluationSchema),
    methodologicalAnalysis: z.object({
        approachCoherent: z.boolean(),
        designAdequate: z.boolean(),
        techniquesAppropriate: z.boolean(),
        resultsDeriveFromMethod: z.boolean(),
        conclusionsSupportedByResults: z.boolean(),
        criticalAlerts: z.array(z.string())
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
        level: z.enum(['Excelente', 'Aceptable', 'Débil', 'Crítico']),
        mainRisks: z.array(z.string()),
        internalConsistencyDegree: z.number().min(0).max(100),
        publishabilityLevel: z.number().min(0).max(100)
    }),
    prioritizedRecommendations: z.array(z.object({
        priority: z.enum(['Crítica', 'Alta', 'Media', 'Baja']),
        what: z.string(),
        why: z.string(),
        how: z.string()
    }))
});

const CONSISTENCY_MATRIX_PROMPT = `Rol y especialización
Actúa como un revisor académico senior multidisciplinario, con más de 20 años de experiencia evaluando tesis y artículos científicos.

EVIDENCIA REQUERIDA (CRÍTICO):
Para TODA observación, hallazgo o recomendación, DEBES citar el número de página donde se encuentra la evidencia o el error.
Formato de cita: [Pág. X]

ANÁLISIS REQUERIDO:
1. IDENTIFICACIÓN INICIAL
2. MATRIZ DE CONSISTENCIA (OBLIGATORIA)
3. EVALUACIÓN POR SECCIONES
4. ANÁLISIS METODOLÓGICO PROFUNDO
5. NORMATIVA Y ESTILO ACADÉMICO
6. DIAGNÓSTICO GLOBAL
7. RECOMENDACIONES ACCIONABLES PRIORIZADAS

FORMATO DE SALIDA (JSON ESTRICTO):
{
  "documentType": "",
  "methodologicalApproach": "",
  "disciplinaryArea": "",
  "applicableStandards": [],
  "consistencyMatrix": [{"element": "", "description": "", "coherenceLevel": "", "technicalObservation": "", "recommendation": ""}],
  "sectionEvaluations": [{"section": "", "strengths": [], "weaknesses": [], "internalIncoherences": [], "methodologicalMisalignments": []}],
  "methodologicalAnalysis": {"approachCoherent": true, "designAdequate": true, "techniquesAppropriate": true, "resultsDeriveFromMethod": true, "conclusionsSupportedByResults": true, "criticalAlerts": []},
  "normativeCompliance": {"apa7Score": 0, "academicWritingScore": 0, "terminologyConsistencyScore": 0, "orthographicErrors": [], "grammaticalErrors": [], "styleIssues": []},
  "globalDiagnosis": {"level": "", "mainRisks": [], "internalConsistencyDegree": 0, "publishabilityLevel": 0},
  "prioritizedRecommendations": [{"priority": "", "what": "", "why": "", "how": ""}]
}

{INSTITUTIONAL_RULES}

DOCUMENTO A EVALUAR:
{DOCUMENT_TEXT}

ANÁLISIS COMPLETO (JSON):`;

export async function analyzeConsistencyMatrix(
    documentInput: string | { page: number; text: string }[],
    institutionalRules?: string
): Promise<ConsistencyAnalysisResult> {
    let documentText = '';
    if (Array.isArray(documentInput)) {
        documentText = documentInput.map(page => `\n--- PÁGINA ${page.page} ---\n${page.text}`).join('\n');
    } else {
        documentText = documentInput;
    }

    const originalLength = documentText.length;
    const maxChars = CONFIG.CONSISTENCY_MAX_CHARS;
    let wasTruncated = false;

    if (documentText.length > maxChars) {
        const headLimit = 120000;
        const tailLimit = 180000;
        const head = documentText.substring(0, headLimit);
        const tail = documentText.substring(documentText.length - tailLimit);
        documentText = head + "\n\n[... PARTE MEDIA DEL DOCUMENTO OMITIDA POR EXTENSIÓN ...]\n\n" + tail;
        wasTruncated = true;
    }

    try {
        let promptTemplate = CONSISTENCY_MATRIX_PROMPT;
        if (institutionalRules && institutionalRules.trim()) {
            const rulesSection = `\n\nNORMATIVAS INSTITUCIONALES:\n${institutionalRules}\n`;
            promptTemplate = promptTemplate.replace('{INSTITUTIONAL_RULES}', rulesSection);
        } else {
            promptTemplate = promptTemplate.replace('{INSTITUTIONAL_RULES}', '');
        }

        const finalPrompt = promptTemplate.replace('{DOCUMENT_TEXT}', documentText);

        const validated = await generateJSON<any>({
            prompt: finalPrompt,
            systemInstruction: "Eres un experto en metodología de investigación científica.",
            temperature: CONFIG.CONSISTENCY_AI_TEMPERATURE,
            model: CONFIG.CONSISTENCY_AI_MODEL
        });

        const analysis: ConsistencyAnalysisResult = {
            ...validated,
            rawAnalysis: JSON.stringify(validated)
        } as ConsistencyAnalysisResult;

        if (wasTruncated) {
            analysis.prioritizedRecommendations.unshift({
                priority: 'Alta',
                what: `⚠️ ADVERTENCIA: Documento de gran extensión (${originalLength.toLocaleString()} chars).`,
                why: 'Se aplicó el modo de alta capacidad conservando las partes críticas (inicio y fin) para el análisis.',
                how: 'El análisis es válido para la estructura global, pero partes intermedias no fueron procesadas.'
            });
        }

        return analysis;
    } catch (error: any) {
        console.error('Consistency matrix analysis error:', error);
        throw new Error("Error al analizar la consistencia. Intenta con un texto más breve o revisa la conexión.");
    }
}

export async function generateConsistencyReport(
    documentText: string
): Promise<string> {
    const analysis = await analyzeConsistencyMatrix(documentText);
    let report = `# Informe de Matriz de Consistencia Académica\n\n`;
    report += `## Diagnóstico Global\n\n- **Nivel**: ${analysis.globalDiagnosis.level}\n- **Consistencia**: ${analysis.globalDiagnosis.internalConsistencyDegree}%\n\n`;
    report += `## Recomendaciones\n\n`;
    analysis.prioritizedRecommendations.forEach((rec, idx) => {
        report += `### ${idx + 1}. [${rec.priority}] ${rec.what}\n\n**Cómo**: ${rec.how}\n\n`;
    });
    return report;
}
