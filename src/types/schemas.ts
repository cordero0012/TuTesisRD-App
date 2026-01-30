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
    techniquesAppropriate: z.boolean(),
    resultsDeriveFromMethod: z.boolean(),
    conclusionsSupportedByResults: z.boolean(),
    criticalAlerts: z.array(z.string()),
    forensicReasoning: z.string().optional(), // Added for dashboard
});

export const NormativeComplianceSchema = z.object({
    apa7Score: z.number(),
    academicWritingScore: z.number(),
    terminologyConsistencyScore: z.number(),
    orthographicErrors: z.array(z.string()),
    grammaticalErrors: z.array(z.string()),
    styleIssues: z.array(z.string()),
});

export const GlobalDiagnosisSchema = z.object({
    level: z.enum(['Excelente', 'Aceptable', 'Débil', 'Crítico']).or(z.string()),
    mainRisks: z.array(z.string()),
    internalConsistencyDegree: z.number(),
    publishabilityLevel: z.number(),
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
