import { z } from 'zod';

// --- Shared Primitive Schemas ---

export const ReferenceSchema = z.object({
    title: z.string(),
    authors: z.array(z.string()).optional(),
    publicationYear: z.number().optional(),
    doi: z.string().optional(),
    hostVenue: z.string().optional(),
});

// --- Feature DTOs ---

// 1. Reference Validation
export const ReferenceValidationResultSchema = z.object({
    reference: ReferenceSchema,
    status: z.enum(['verified', 'valid_no_doi', 'needs_review', 'not_found', 'error']),
    score: z.number().min(0).max(100),
    sources: z.array(z.string()).optional(),
    validationMessage: z.string().optional(),
});

export type ReferenceValidationResultDTO = z.infer<typeof ReferenceValidationResultSchema>;


// 2. Audit / Forensics
export const AuditMetricsSchema = z.object({
    burstiness: z.number().optional(),
    perplexityProxy: z.number().optional(),
    lexicalDiversity: z.number().optional(),
});

export const SourceProbabilitiesSchema = z.object({
    chatgpt: z.number().optional(),
    gemini: z.number().optional(),
    claude: z.number().optional(),
});

export const HeatmapSegmentSchema = z.object({
    text: z.string(),
    probability: z.number(),
});

export const AuditResultSchema = z.object({
    score: z.number().min(0).max(1), // 0 to 1 probability
    metrics: AuditMetricsSchema.optional(),
    sourceProbabilities: SourceProbabilitiesSchema.optional(),
    signals: z.array(z.string()).optional(),
    heatmap: z.array(HeatmapSegmentSchema).optional(),
});

export type AuditResultDTO = z.infer<typeof AuditResultSchema>;


// 3. Consistency Matrix
// 3. Consistency Matrix & Strict Analysis
export const ConsistencyMatrixRowSchema = z.object({
    element: z.string(),
    description: z.string(),
    coherenceLevel: z.enum(['Alta', 'Media', 'Baja', 'Inexistente']).or(z.string()),
    technicalObservation: z.string(),
    recommendation: z.string(),
});

export const SectionEvaluationSchema = z.object({
    section: z.string(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    internalIncoherences: z.array(z.string()),
    methodologicalMisalignments: z.array(z.string()),
});

export const MethodologicalAnalysisSchema = z.object({
    approachCoherent: z.boolean(),
    designAdequate: z.boolean(),
    techniquesAppropriate: z.boolean().optional().default(true),
    resultsDeriveFromMethod: z.boolean(),
    conclusionsSupportedByResults: z.boolean(),
    criticalAlerts: z.array(z.string()),
    forensicReasoning: z.string().optional(), // Added for dashboard
});

export const NormativeComplianceSchema = z.object({
    apa7Score: z.number(),
    academicWritingScore: z.number(),
    terminologyConsistencyScore: z.number(),
    orthographicErrors: z.array(z.string()).optional().default([]),
    grammaticalErrors: z.array(z.string()).optional().default([]),
    styleIssues: z.array(z.string()).optional().default([]),
});

export const GlobalDiagnosisSchema = z.object({
    level: z.enum(['Excelente', 'Aceptable', 'Débil', 'Crítico']).or(z.string()),
    mainRisks: z.array(z.string()),
    internalConsistencyDegree: z.number(),
    publishabilityLevel: z.number().optional().default(0),
    auditSummary: z.string().optional(), // Added to fix UI error
    summary: z.string().optional(), // Backward compatibility
    score: z.number().optional()    // Backward compatibility
});

export const PrioritizedRecommendationSchema = z.object({
    priority: z.enum(['Crítica', 'Alta', 'Media', 'Baja']).or(z.string()).optional().default('Media'),
    what: z.string().optional().default('<<MISSING_CONTENT>>'),
    why: z.string().optional().default('<<MISSING_CONTENT>>'),
    how: z.string().optional().default('<<MISSING_CONTENT>>'),
});

// Strict Mode Features
export const StructuralVerificationSchema = z.object({
    sectionsFound: z.record(z.string(), z.object({
        exists: z.boolean(),
        pages: z.string().nullable().optional(),
        completeness: z.number()
    })).optional(),
    missingSections: z.array(z.string()).optional(),
    misplacedSections: z.array(z.string()).optional()
});

export const SourceConsistencySubMatrixSchema = z.object({
    citationsFound: z.array(z.object({
        citation: z.string(),
        inBibliography: z.boolean(),
        page: z.string()
    })).optional(),
    referencesCiting: z.array(z.string()).optional(),
    unusedReferences: z.array(z.string()).optional(),
    missingReferences: z.array(z.string()).optional()
});

export const ActionableFeedbackSchema = z.object({
    finding: z.string(),
    evidence: z.string(),
    whyItMatters: z.string(),
    howToFix: z.string(),
    example: z.string()
});

// APA 7 forensic extraction — inventarios y validación regla-por-regla
export const CitationInventoryEntrySchema = z.object({
    author: z.string(),
    year: z.string(),
    page: z.string().optional().default(''),
    quoteType: z.string().optional().default('parenthetical'),
    textExcerpt: z.string().optional().default('')
});

export const RuleValidationResultSchema = z.object({
    ruleId: z.string(),
    description: z.string().optional().default(''),
    status: z.enum(['pass', 'fail', 'na']).or(z.string()).optional().default('na'),
    failCount: z.number().optional().default(0),
    examples: z.array(z.object({
        page: z.string().optional().default(''),
        excerpt: z.string().optional().default('')
    })).optional().default([])
});

// Evaluación por elemento estructural de la tesis (problema, objetivos, metodología, etc.)
export const ThesisElementEvaluationSchema = z.object({
    element: z.string(),
    present: z.boolean().optional().default(false),
    page: z.string().optional().default(''),
    quality: z.enum(['Excelente', 'Aceptable', 'Débil', 'Ausente']).or(z.string()).optional().default('Ausente'),
    score: z.number().optional().default(0),
    strengths: z.array(z.string()).optional().default([]),
    weaknesses: z.array(z.string()).optional().default([]),
    alignmentWithOthers: z.string().optional().default(''),
    recommendation: z.string().optional().default('')
});

export const ApaComplianceScoreSchema = z.object({
    citationsScore: z.number().optional().default(0),
    referencesScore: z.number().optional().default(0),
    formatScore: z.number().optional().default(0),
    plagiarismScore: z.number().optional().default(0),
    weightedFinalScore: z.number().optional().default(0),
    classification: z.enum(['Excelente', 'Aceptable', 'Débil', 'Crítico']).or(z.string()).optional().default('Crítico'),
    thresholdMet: z.boolean().optional().default(false)
});

// Auditoría sistémica — hallazgos clasificados por severidad
export const AuditFindingSchema = z.object({
    component: z.string(), // título, problema, objetivos, hipótesis, instrumentos, resultados, conclusiones, citas, referencias, estilo, etc.
    currentFormulation: z.string().optional().default(''),
    finding: z.string(),
    evidence: z.string(), // Pág. X — "fragmento literal"
    severity: z.enum(['Crítico', 'Alto', 'Medio']).or(z.string()).optional().default('Medio'),
    violatedRelation: z.string().optional().default(''), // qué componentes entran en contradicción
    impactOnThesis: z.string().optional().default(''),
    recommendedFix: z.string(),
    priority: z.enum(['Inmediata', 'Alta', 'Normal']).or(z.string()).optional().default('Normal')
});

// Matriz objetivo ↔ instrumento ↔ resultado (trazabilidad empírica)
export const CorrespondenceEntrySchema = z.object({
    objective: z.string(), // objetivo específico N
    instrumentDeclared: z.string().optional().default(''),
    expectedOutput: z.string().optional().default(''),
    actualResultFound: z.string().optional().default(''),
    resultSection: z.string().optional().default(''), // Pág. X, Cap. Y
    status: z.enum(['cumplido', 'parcial', 'no_cumplido', 'sin_evidencia']).or(z.string()).optional().default('sin_evidencia'),
    observation: z.string().optional().default('')
});

// Incoherencia numérica — misma cifra, dos lugares, valores distintos
export const NumericalInconsistencySchema = z.object({
    figure: z.string(), // "porcentaje de accidentes"
    locationA: z.string(), // "Planteamiento Pág. 12: 45%"
    locationB: z.string(), // "Resultados Pág. 87: 52%"
    discrepancy: z.string(),
    severity: z.enum(['Crítico', 'Alto', 'Medio']).or(z.string()).optional().default('Alto')
});

// Riesgo de plagio — análisis estructural, no acusatorio
export const PlagiarismRiskAnalysisSchema = z.object({
    overallRiskLevel: z.enum(['Bajo', 'Medio', 'Alto']).or(z.string()).optional().default('Bajo'),
    signals: z.array(z.string()).optional().default([]), // cambios de voz, paráfrasis débil, etc.
    suspectExcerpts: z.array(z.object({
        page: z.string().optional().default(''),
        excerpt: z.string().optional().default(''),
        reason: z.string().optional().default('')
    })).optional().default([]),
    classification: z.string().optional().default('') // "bajo riesgo", "riesgo medio de paráfrasis débil", "alto riesgo de copia parcial"
});

// Patrones compatibles con redacción asistida por IA (no prueba, sólo señales)
export const AiWritingPatternsSchema = z.object({
    compatibilityLevel: z.enum(['Bajo', 'Medio', 'Alto']).or(z.string()).optional().default('Bajo'),
    detectedPatterns: z.array(z.string()).optional().default([]),
    notes: z.string().optional().default('')
});

// Clasificación de la propuesta — diseñada vs implementada vs proyectada
export const ProposalClassificationSchema = z.object({
    type: z.enum(['diseñada', 'implementada', 'proyectada', 'simulada', 'no_aplica']).or(z.string()).optional().default('no_aplica'),
    evidence: z.string().optional().default(''),
    claimedImpact: z.string().optional().default(''),
    verifiableImpact: z.string().optional().default(''),
    discrepancyWarning: z.string().optional().default('') // alerta si las conclusiones hablan de "reducción real" sin intervención
});

// A) Resumen ejecutivo del reporte de auditoría
export const ExecutiveSummarySchema = z.object({
    overview: z.string().optional().default(''), // 3-4 líneas de diagnóstico general
    mainStrengths: z.array(z.string()).optional().default([]), // ≥3
    mainWeaknesses: z.array(z.string()).optional().default([]), // ≥3
    defensibilityLevel: z.enum(['Excelente', 'Aceptable', 'Débil', 'Crítico']).or(z.string()).optional().default('Débil')
});

// Cumplimiento institucional estructural — portada, preliminares, capítulos, etc.
export const StructuralComplianceEntrySchema = z.object({
    component: z.string(), // portada, preliminares, índice, capítulos, conclusiones, anexos, tablas, figuras...
    status: z.enum(['cumple', 'cumple_parcial', 'no_cumple']).or(z.string()).optional().default('cumple_parcial'),
    notes: z.string().optional().default('')
});

// D) Matriz de validación de referencias — una entrada por referencia
export const ReferenceValidationEntrySchema = z.object({
    reference: z.string(), // entrada literal
    exists: z.boolean().optional().default(false),
    academicQuality: z.enum(['Alta', 'Media', 'Baja', 'No_académica']).or(z.string()).optional().default('Media'),
    citationStatus: z.enum(['citada', 'no_citada', 'mal_citada']).or(z.string()).optional().default('citada'),
    category: z.enum(['válida', 'válida_mal_citada', 'débil', 'incompleta', 'duplicada']).or(z.string()).optional().default('válida'),
    verdict: z.enum(['mantener', 'corregir', 'sustituir', 'eliminar']).or(z.string()).optional().default('mantener'),
    actionDetail: z.string().optional().default('')
});

// E) Matriz de riesgo de plagio / patrones IA por sección
export const PlagiarismMatrixEntrySchema = z.object({
    section: z.string(), // Marco teórico, Metodología, Resultados, etc.
    riskType: z.enum([
        'paráfrasis_deficiente', 'ensamblaje_documental', 'cita_débil',
        'cambio_de_voz', 'repetición_formulaica', 'cierre_genérico',
        'riesgo_coincidencia_textual', 'tono_homogéneo_IA'
    ]).or(z.string()).optional().default('paráfrasis_deficiente'),
    riskLevel: z.enum(['Bajo', 'Medio', 'Alto']).or(z.string()).optional().default('Medio'),
    evidence: z.string().optional().default(''),
    suggestedAction: z.string().optional().default('')
});

// Diagnóstico de cierre — síntesis defendible frente a asesor/jurado
export const ClosingDiagnosisSchema = z.object({
    structuralCompliance: z.enum(['Alto', 'Medio', 'Bajo']).or(z.string()).optional().default('Medio'),
    methodologicalConsistency: z.enum(['Alta', 'Media', 'Baja']).or(z.string()).optional().default('Media'),
    mainStrengths: z.array(z.string()).optional().default([]),
    mainWeaknesses: z.array(z.string()).optional().default([]),
    criticalFixesRequired: z.array(z.string()).optional().default([]),
    pendingValidations: z.array(z.string()).optional().default([]),
    technicalClosingStatement: z.string().optional().default('') // párrafo de cierre técnico
});

export const MatrixAnalysisSchema = z.object({
    documentType: z.string().optional(),
    methodologicalApproach: z.string().optional(),
    disciplinaryArea: z.string().optional(),
    applicableStandards: z.array(z.string()).optional(),

    consistencyMatrix: z.array(ConsistencyMatrixRowSchema).optional(), // Can be optional in partial results
    sectionEvaluations: z.array(SectionEvaluationSchema).optional(),
    methodologicalAnalysis: MethodologicalAnalysisSchema.optional(), // Made optional to prevent breaks if missing
    normativeCompliance: NormativeComplianceSchema.optional(),

    globalDiagnosis: GlobalDiagnosisSchema.optional(),
    prioritizedRecommendations: z.array(PrioritizedRecommendationSchema).optional(),

    // Strict Extensions
    structuralVerification: StructuralVerificationSchema.optional(),
    sourceConsistencySubMatrix: SourceConsistencySubMatrixSchema.optional(),
    actionableFeedback: z.array(ActionableFeedbackSchema).optional(),
    normativeComplianceDetailed: z.any().optional(), // Simplify for now

    // APA 7 Forensic Extensions (inventarios + checklist computable + scoring ponderado)
    citationInventory: z.array(CitationInventoryEntrySchema).optional(),
    referenceInventory: z.array(z.string()).optional(),
    ruleValidationResults: z.array(RuleValidationResultSchema).optional(),
    apaComplianceScore: ApaComplianceScoreSchema.optional(),

    // Evaluación exhaustiva por elemento de la tesis (problema, objetivos, metodología, etc.)
    thesisElementsEvaluation: z.array(ThesisElementEvaluationSchema).optional(),

    // Auditoría sistémica — framework completo de auditoría de tesis
    executiveSummary: ExecutiveSummarySchema.optional(),
    structuralCompliance: z.array(StructuralComplianceEntrySchema).optional(),
    auditFindings: z.array(AuditFindingSchema).optional(),
    correspondenceMatrix: z.array(CorrespondenceEntrySchema).optional(),
    numericalCoherence: z.array(NumericalInconsistencySchema).optional(),
    referenceValidationMatrix: z.array(ReferenceValidationEntrySchema).optional(),
    plagiarismMatrix: z.array(PlagiarismMatrixEntrySchema).optional(),
    plagiarismRiskAnalysis: PlagiarismRiskAnalysisSchema.optional(),
    aiWritingPatterns: AiWritingPatternsSchema.optional(),
    proposalClassification: ProposalClassificationSchema.optional(),
    closingDiagnosis: ClosingDiagnosisSchema.optional(),

    rawAnalysis: z.string().optional(),
    analysisStatus: z.enum(['ok', 'partial', 'insufficient_input', 'model_noncompliant', 'error']).optional(),
    analysisWarnings: z.array(z.string()).optional() // Tracking for partial/defaulted content
});

export type MatrixAnalysisDTO = z.infer<typeof MatrixAnalysisSchema>;


// 4. Thesis Project Metadata (Core)
export const ThesisProjectSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string(),
    studentName: z.string().optional(),
    university: z.string().optional(),
    status: z.enum(['draft', 'review', 'approved']).default('draft'),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type ThesisProjectDTO = z.infer<typeof ThesisProjectSchema>;


// 5. AI Telemetry
export const AiTelemetrySchema = z.object({
    provider: z.string(),
    model: z.string(),
    durationMs: z.number(),
    inputTokens: z.number().optional(),
    outputTokens: z.number().optional(),
    success: z.boolean(),
    errorCode: z.string().optional(),
    timestamp: z.number(),
});

export type AiTelemetryDTO = z.infer<typeof AiTelemetrySchema>;


// 6. Presentation Layer (Secure Export)
export const WordExportSectionSchema = z.object({
    type: z.enum(['text', 'heading1', 'heading2', 'heading3', 'list', 'table', 'page_break']),
    content: z.string().optional(), // For text, headings, list items
    tableData: z.object({
        headers: z.array(z.string()),
        rows: z.array(z.array(z.string())),
        isMatrix: z.boolean().optional() // Styling hint
    }).optional(),
    styling: z.object({
        bold: z.boolean().optional(),
        color: z.string().optional(), // hex
        align: z.enum(['left', 'center', 'right', 'justify']).optional(),
        isCritical: z.boolean().optional(), // Semantic style
        size: z.number().optional() // Font size overrides
    }).optional()
});

export const WordExportDTOSchema = z.object({
    metadata: z.object({
        title: z.string(),
        subtitle: z.string().optional(),
        date: z.string(),
        creator: z.string().default('ScholarAI'),
        brandingColor: z.string().optional()
    }),
    sections: z.array(WordExportSectionSchema)
});

export type WordExportDTO = z.infer<typeof WordExportDTOSchema>;
export type WordExportSection = z.infer<typeof WordExportSectionSchema>;
