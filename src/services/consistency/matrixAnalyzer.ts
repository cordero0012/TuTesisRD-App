import { getClient, GEMINI_MODEL } from '../ai/client';
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

export interface ConsistencyAnalysisResult {
    // Identificación inicial
    documentType: string;
    methodologicalApproach: string;
    disciplinaryArea: string;
    applicableStandards: string[];

    // Matriz de consistencia
    consistencyMatrix: ConsistencyMatrixRow[];

    // Evaluación por secciones
    sectionEvaluations: SectionEvaluation[];

    // NUEVO: Verificación Estructural
    structuralVerification?: {
        sectionsFound: {
            [sectionName: string]: {
                exists: boolean;
                pages: string;
                completeness: number;
            };
        };
        missingSections: string[];
        misplacedSections: string[];
    };

    // Análisis metodológico
    methodologicalAnalysis: {
        approachCoherent: boolean;
        designAdequate: boolean;
        techniquesAppropriate: boolean;
        resultsDeriveFromMethod: boolean;
        conclusionsSupportedByResults: boolean;
        forensicReasoning?: string; // New
        criticalAlerts: string[];
        invalidatingIssues?: string[]; // New
    };

    // Normativa y estilo
    normativeCompliance: {
        apa7Score: number;
        academicWritingScore: number;
        terminologyConsistencyScore: number;
        orthographicErrors: string[];
        grammaticalErrors: string[];
        styleIssues: string[];
    };

    // NUEVO: Cumplimiento Normativo Detallado
    normativeComplianceDetailed?: {
        overallCompliance: number;
        violations: {
            rule: string;
            severity: 'Critical' | 'High' | 'Medium' | 'Low';
            evidence: string;
            impact: string;
        }[];
        compliantItems: {
            rule: string;
            evidence: string;
        }[];
    };

    // Diagnóstico global
    globalDiagnosis: {
        level: 'Excelente' | 'Aceptable' | 'Débil' | 'Crítico';
        auditSummary?: string; // New
        mainRisks: string[];
        internalConsistencyDegree: number; // 0-100
        publishabilityLevel: number; // 0-100
    };

    // Recomendaciones priorizadas
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

const GlobalDiagnosisSchema = z.object({
    level: z.enum(['Excelente', 'Aceptable', 'Débil', 'Crítico']),
    mainRisks: z.array(z.string()),
    internalConsistencyDegree: z.number().min(0).max(100),
    publishabilityLevel: z.number().min(0).max(100)
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
    globalDiagnosis: GlobalDiagnosisSchema,
    prioritizedRecommendations: z.array(z.object({
        priority: z.enum(['Crítica', 'Alta', 'Media', 'Baja']),
        what: z.string(),
        why: z.string(),
        how: z.string()
    }))
});

const CONSISTENCY_MATRIX_PROMPT = `Rol y especialización
Actúa como un revisor académico senior multidisciplinario, con más de 20 años de experiencia evaluando:
- Tesis de grado, posgrado y doctorales
- Monográficos
- Artículos científicos indexados

Dominas metodología cuantitativa, cualitativa y mixta, así como normas institucionales universitarias, APA 7, ISO y otros estándares editoriales académicos.

Objetivo general
Evaluar integralmente la coherencia, consistencia metodológica, calidad académica y cumplimiento normativo del documento completo, detectando:
- Inconsistencias estructurales
- Desalineaciones metodológicas
- Errores conceptuales
- Fallas de articulación interna
- Errores ortográficos y de redacción académica

EVIDENCIA REQUERIDA (CRÍTICO):
Para TODA observación, hallazgo o recomendación, DEBES citar el número de página donde se encuentra la evidencia o el error.
Formato de cita: [Pág. X]
Ejemplo: "El objetivo general no se alinea con la pregunta de investigación [Pág. 12] ya que menciona..."

ANÁLISIS REQUERIDO:

1. IDENTIFICACIÓN INICIAL
Determina:
- Tipo de trabajo: Grado / Posgrado / Doctoral / Artículo científico
- Enfoque metodológico predominante: Cuantitativo / Cualitativo / Mixto
- Área disciplinar aproximada
- Normativas aplicables detectadas (APA 7, ISO, institucional u otras)

2. MATRIZ DE CONSISTENCIA (OBLIGATORIA)
Genera una Matriz de Consistencia Académica evaluando la alineación entre:
- Problema de investigación
- Justificación
- Objetivo general
- Objetivos específicos
- Preguntas / hipótesis (si aplica)
- Variables / categorías
- Enfoque metodológico
- Diseño de investigación
- Técnicas e instrumentos
- Población y muestra / participantes
- Resultados
- Conclusiones
- Recomendaciones

Para CADA elemento, proporciona:
- Descripción encontrada en el documento (Citar página: [Pág. X])
- Nivel de coherencia (Alta / Media / Baja / Inexistente)
- Observación técnica (Citar evidencia: [Pág. X])
- Recomendación concreta de ajuste

3. EVALUACIÓN POR SECCIONES
Analiza: Planteamiento del problema, Marco teórico, Metodología, Resultados, Discusión, Conclusiones, Referencias.
Para cada sección indica:
- Fortalezas (Citar ejemplos: [Pág. X])
- Debilidades (Citar evidencia: [Pág. X])
- Incoherencias internas
- Desajustes con objetivos o método

4. ANÁLISIS METODOLÓGICO PROFUNDO
Verifica si:
- El enfoque metodológico es coherente con los objetivos
- El diseño es adecuado al tipo de estudio
- Las técnicas e instrumentos responden al enfoque
- Los resultados derivan realmente del método aplicado
- Las conclusiones se sustentan en los resultados [Pág. X]
Marca alertas críticas cuando el diseño invalide los hallazgos.

5. NORMATIVA Y ESTILO ACADÉMICO
Evalúa cumplimiento de APA 7, ISO, redacción académica formal, coherencia terminológica, uso adecuado de tiempos verbales.
Detecta y lista: Errores ortográficos, gramaticales, problemas de estilo académico. (Indicar [Pág. X] en ejemplos)

6. DIAGNÓSTICO GLOBAL
- Nivel global del trabajo: Excelente / Aceptable / Débil / Crítico
- Principales riesgos académicos
- Grado de consistencia interna (0-100%)
- Nivel de publicabilidad / defendibilidad (0-100%)

7. RECOMENDACIONES ACCIONABLES PRIORIZADAS
Para cada recomendación:
- Prioridad: Crítica / Alta / Media / Baja
- Qué corregir (Citar ubicación: [Pág. X])
- Por qué corregirlo
- Cómo corregirlo

FORMATO DE SALIDA (JSON ESTRICTO):
{
  "documentType": "Tesis de Grado / Posgrado / etc.",
  "methodologicalApproach": "Cuantitativo / Cualitativo / Mixto",
  "disciplinaryArea": "Área identificada",
  "applicableStandards": ["APA 7", "ISO", "etc."],
  "consistencyMatrix": [
    {
      "element": "Problema de investigación",
      "description": "Texto encontrado [Pág. X]",
      "coherenceLevel": "Alta/Media/Baja/Inexistente",
      "technicalObservation": "Observación con evidencia [Pág. X]",
      "recommendation": "Recomendación"
    }
  ],
  "sectionEvaluations": [
    {
      "section": "Planteamiento del problema",
      "strengths": ["Fortaleza 1 [Pág. X]"],
      "weaknesses": ["Debilidad 1 [Pág. X]"],
      "internalIncoherences": ["Incoherencia 1"],
      "methodologicalMisalignments": ["Desajuste 1"]
    }
  ],
  "methodologicalAnalysis": {
    "approachCoherent": true/false,
    "designAdequate": true/false,
    "techniquesAppropriate": true/false,
    "resultsDeriveFromMethod": true/false,
    "conclusionsSupportedByResults": true/false,
    "criticalAlerts": ["Alerta 1 [Pág. X]"]
  },
  "normativeCompliance": {
    "apa7Score": 0-100,
    "academicWritingScore": 0-100,
    "terminologyConsistencyScore": 0-100,
    "orthographicErrors": ["Error 1 [Pág. X]"],
    "grammaticalErrors": ["Error 1 [Pág. X]"],
    "styleIssues": ["Issue 1 [Pág. X]"]
  },
  "globalDiagnosis": {
    "level": "Excelente/Aceptable/Débil/Crítico",
    "mainRisks": ["Riesgo 1 [Pág. X]"],
    "internalConsistencyDegree": 0-100,
    "publishabilityLevel": 0-100
  },
  "prioritizedRecommendations": [
    {
      "priority": "Crítica/Alta/Media/Baja",
      "what": "Qué corregir [Pág. X]",
      "why": "Por qué es importante",
      "how": "Pasos específicos"
    }
  ]
}

RESTRICCIONES:
- No inventes información. Si falta algo, indícalo explícitamente.
- Mantén lenguaje académico claro y profesional.
- Prioriza RIGOR sobre simplicidad.
- Sé técnico y específico en las recomendaciones.
- SIEMPRE CITA LA PÁGINA DE REFERENCIA cuando sea posible.

{INSTITUTIONAL_RULES}

DOCUMENTO A EVALUAR:
{DOCUMENT_TEXT}

ANÁLISIS COMPLETO (JSON):`;

export async function analyzeConsistencyMatrix(
    documentInput: string | { page: number; text: string }[],
    institutionalRules?: string
): Promise<ConsistencyAnalysisResult> {
    const ai = getClient();

    // Use configurable model and temperature
    const model = ai.getGenerativeModel({
        model: CONFIG.CONSISTENCY_AI_MODEL,
        generationConfig: {
            responseMimeType: "application/json"
        }
    });

    // Handle paginated content
    let documentText = '';
    if (Array.isArray(documentInput)) {
        documentText = documentInput.map(page => `\n--- PÁGINA ${page.page} ---\n${page.text}`).join('\n');
    } else {
        documentText = documentInput;
    }

    const originalLength = documentText.length;
    const maxChars = CONFIG.CONSISTENCY_MAX_CHARS;
    let wasTruncated = false;

    // Apply truncation with warning
    if (documentText.length > maxChars) {
        console.warn(`[ConsistencyAnalyzer] Document truncated from ${originalLength} to ${maxChars} chars`);
        documentText = documentText.substring(0, maxChars);
        wasTruncated = true;
    }

    try {
        let prompt = CONSISTENCY_MATRIX_PROMPT.replace('{DOCUMENT_TEXT}', documentText);

        // Add institutional rules if provided
        if (institutionalRules && institutionalRules.trim()) {
            const rulesSection = `\n\nNORMATIVAS INSTITUCIONALES A APLICAR:\nEl documento debe ser evaluado también contra las siguientes normativas institucionales específicas:\n\n${institutionalRules}\n\nAsegúrate de validar el cumplimiento de estas reglas institucionales en tu análisis de coherencia y en las recomendaciones.\n`;
            prompt = prompt.replace('{INSTITUTIONAL_RULES}', rulesSection);
        } else {
            prompt = prompt.replace('{INSTITUTIONAL_RULES}', '');
        }

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: CONFIG.CONSISTENCY_AI_TEMPERATURE,
                topP: 0.9,
                maxOutputTokens: 8192,
            }
        });

        let responseText = result.response.text();

        // Clean markdown formatting if present
        responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        // Parse and validate JSON response with Zod
        const parsed = JSON.parse(responseText);
        const validated = ConsistencyAnalysisResultSchema.parse(parsed);

        const analysis: ConsistencyAnalysisResult = {
            ...validated,
            rawAnalysis: responseText
        };

        // Add truncation warning to recommendations if applicable
        if (wasTruncated) {
            analysis.prioritizedRecommendations.unshift({
                priority: 'Alta',
                what: `⚠️ ADVERTENCIA: Documento truncado a ${maxChars.toLocaleString()} caracteres (original: ${originalLength.toLocaleString()})`,
                why: 'El análisis puede estar incompleto debido a limitaciones de procesamiento. Partes finales del documento pueden no haber sido evaluadas.',
                how: 'Para análisis completo de documentos largos, considera dividir el documento en secciones o aumentar el límite en configuración (VITE_CONSISTENCY_MAX_CHARS).'
            });
        }

        return analysis;
    } catch (error: any) {
        console.error('Consistency matrix analysis error:', error);

        // Enhanced error messages
        let msg = "Error al analizar la consistencia.";
        if (error instanceof z.ZodError) {
            msg = "El formato de respuesta del AI es inválido. Por favor intenta nuevamente.";
            console.error("Zod validation errors:", error.issues);
        } else if (error.message?.includes("API Key")) {
            msg = "Falta la API Key de Gemini. Ve a Ajustes > Configuración.";
        } else if (error.message?.includes("fetch failed") || error.message?.includes("Network")) {
            msg = "Error de conexión con Google AI. Verifica tu internet.";
        } else if (error.message?.includes("JSON")) {
            msg = "Error al parsear la respuesta del AI. El modelo puede haber retornado formato inválido.";
        }

        throw new Error(msg);
    }
}

export async function generateConsistencyReport(
    documentText: string
): Promise<string> {
    const analysis = await analyzeConsistencyMatrix(documentText);

    // Generate markdown report
    let report = `# Informe de Matriz de Consistencia Académica\n\n`;

    report += `## Identificación del Documento\n\n`;
    report += `- **Tipo**: ${analysis.documentType}\n`;
    report += `- **Enfoque Metodológico**: ${analysis.methodologicalApproach}\n`;
    report += `- **Área Disciplinar**: ${analysis.disciplinaryArea}\n`;
    report += `- **Normativas Aplicables**: ${analysis.applicableStandards.join(', ')}\n\n`;

    report += `## Matriz de Consistencia\n\n`;
    report += `| Elemento | Descripción | Coherencia | Observación | Recomendación |\n`;
    report += `|----------|-------------|------------|-------------|---------------|\n`;
    analysis.consistencyMatrix.forEach(row => {
        report += `| ${row.element} | ${row.description.substring(0, 50)}... | ${row.coherenceLevel} | ${row.technicalObservation.substring(0, 50)}... | ${row.recommendation.substring(0, 50)}... |\n`;
    });
    report += `\n`;

    report += `## Diagnóstico Global\n\n`;
    report += `- **Nivel del Trabajo**: ${analysis.globalDiagnosis.level}\n`;
    report += `- **Consistencia Interna**: ${analysis.globalDiagnosis.internalConsistencyDegree}%\n`;
    report += `- **Nivel de Publicabilidad**: ${analysis.globalDiagnosis.publishabilityLevel}%\n\n`;

    report += `### Principales Riesgos\n\n`;
    analysis.globalDiagnosis.mainRisks.forEach(risk => {
        report += `- ${risk}\n`;
    });
    report += `\n`;

    report += `## Recomendaciones Prioritarias\n\n`;
    analysis.prioritizedRecommendations.forEach((rec, idx) => {
        report += `### ${idx + 1}. [${rec.priority}] ${rec.what}\n\n`;
        report += `**Por qué**: ${rec.why}\n\n`;
        report += `**Cómo**: ${rec.how}\n\n`;
    });

    return report;
}
