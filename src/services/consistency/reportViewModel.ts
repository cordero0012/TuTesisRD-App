import { MatrixAnalysisDTO } from '../../types/schemas';

export type AuditSeverity = 'Crítico' | 'Alto' | 'Medio';

export interface StructuralRow {
    component: string;
    status: 'Cumple' | 'Cumple parcialmente' | 'No cumple';
    notes: string;
}

export interface AuditMatrixRow {
    component: string;
    currentState: string;
    finding: string;
    evidence: string;
    riskLevel: AuditSeverity;
    impact: string;
    recommendedFix: string;
}

export interface ObjectiveMatrixRow {
    objective: string;
    instrument: string;
    result: string;
    complyLabel: 'Sí' | 'Parcial' | 'No' | 'Sin evidencia';
    observation: string;
}

export interface ReferenceMatrixRow {
    reference: string;
    existsLabel: 'Sí' | 'No';
    quality: string;
    citationStatus: string;
    verdict: string;
    action: string;
}

export interface RiskMatrixRow {
    section: string;
    riskType: string;
    riskLevel: 'Bajo' | 'Medio' | 'Alto';
    evidence: string;
    action: string;
}

export interface PrioritizedCorrectionRow {
    component: string;
    finding: string;
    recommendedFix: string;
    evidence: string;
}

export interface ConsistencyReportViewModel {
    diagnosticLines: string[];
    structuralRows: StructuralRow[];
    structuralSummary: {
        comply: number;
        partial: number;
        fail: number;
    };
    auditRows: AuditMatrixRow[];
    objectiveRows: ObjectiveMatrixRow[];
    referenceRows: ReferenceMatrixRow[];
    riskRows: RiskMatrixRow[];
    prioritizedCorrections: Record<AuditSeverity, PrioritizedCorrectionRow[]>;
    finalVerdict: string;
}

const severityOrder: Record<AuditSeverity, number> = {
    'Crítico': 0,
    'Alto': 1,
    'Medio': 2
};

const sentenceSplit = (text: string): string[] =>
    text
        .split(/(?<=[.!?])\s+/)
        .map((part) => part.trim())
        .filter(Boolean);

export const normalizeSeverity = (value?: string): AuditSeverity => {
    const normalized = (value || '').toLowerCase();

    if (normalized.includes('crít') || normalized.includes('crit')) {
        return 'Crítico';
    }

    if (normalized.includes('alto')) {
        return 'Alto';
    }

    return 'Medio';
};

export const normalizeRiskLevel = (value?: string): 'Bajo' | 'Medio' | 'Alto' => {
    const normalized = (value || '').toLowerCase();

    if (normalized.includes('alto')) {
        return 'Alto';
    }

    if (normalized.includes('medio')) {
        return 'Medio';
    }

    return 'Bajo';
};

const normalizeStructuralStatus = (value?: string): StructuralRow['status'] => {
    const normalized = (value || '').toLowerCase();

    if (normalized.includes('no_cumple') || normalized.includes('no cumple')) {
        return 'No cumple';
    }

    if (normalized.includes('parcial')) {
        return 'Cumple parcialmente';
    }

    return 'Cumple';
};

const mapCorrespondenceStatus = (value?: string): ObjectiveMatrixRow['complyLabel'] => {
    const normalized = (value || '').toLowerCase();

    if (normalized.includes('cumplido') && !normalized.includes('no')) {
        return 'Sí';
    }

    if (normalized.includes('parcial')) {
        return 'Parcial';
    }

    if (normalized.includes('no_cumplido') || normalized.includes('no cumplido')) {
        return 'No';
    }

    return 'Sin evidencia';
};

const getThematicConsistency = (score?: number): 'alta' | 'media' | 'baja' => {
    if ((score || 0) >= 85) {
        return 'alta';
    }

    if ((score || 0) >= 70) {
        return 'media';
    }

    return 'baja';
};

const getMethodologicalConsistency = (result: MatrixAnalysisDTO): 'alta' | 'media' | 'baja' => {
    const explicit = result.closingDiagnosis?.methodologicalConsistency?.toLowerCase();

    if (explicit?.includes('alta')) {
        return 'alta';
    }

    if (explicit?.includes('baja')) {
        return 'baja';
    }

    const methodological = result.methodologicalAnalysis;
    if (
        methodological?.approachCoherent &&
        methodological?.designAdequate &&
        methodological?.resultsDeriveFromMethod &&
        methodological?.conclusionsSupportedByResults
    ) {
        return 'alta';
    }

    if (
        methodological &&
        [methodological.approachCoherent, methodological.designAdequate, methodological.resultsDeriveFromMethod, methodological.conclusionsSupportedByResults]
            .filter(Boolean)
            .length >= 2
    ) {
        return 'media';
    }

    return 'baja';
};

const getStructuralComplianceLabel = (rows: StructuralRow[]): 'total' | 'parcialmente' | 'no cumple' => {
    if (rows.length === 0) {
        return 'parcialmente';
    }

    const failures = rows.filter((row) => row.status === 'No cumple').length;
    const partials = rows.filter((row) => row.status === 'Cumple parcialmente').length;

    if (failures === 0 && partials === 0) {
        return 'total';
    }

    if (failures > 0 && partials === 0 && failures === rows.length) {
        return 'no cumple';
    }

    return 'parcialmente';
};

const buildStructuralRows = (result: MatrixAnalysisDTO): StructuralRow[] => {
    if (result.structuralCompliance?.length) {
        return result.structuralCompliance.map((entry) => ({
            component: entry.component,
            status: normalizeStructuralStatus(entry.status),
            notes: entry.notes || 'Sin observación adicional.'
        }));
    }

    const sectionsFound = result.structuralVerification?.sectionsFound;

    if (!sectionsFound) {
        return [];
    }

    return Object.entries(sectionsFound).map(([component, data]) => ({
        component,
        status: !data.exists
            ? 'No cumple'
            : (data.completeness || 0) >= 80
                ? 'Cumple'
                : 'Cumple parcialmente',
        notes: data.pages || 'Sin localización reportada.'
    }));
};

const buildAuditRows = (result: MatrixAnalysisDTO): AuditMatrixRow[] => {
    if (result.auditFindings?.length) {
        return [...result.auditFindings]
            .sort((left, right) => severityOrder[normalizeSeverity(left.severity)] - severityOrder[normalizeSeverity(right.severity)])
            .map((finding) => ({
                component: finding.component,
                currentState: finding.currentFormulation || 'No especificado en el manuscrito.',
                finding: finding.finding,
                evidence: finding.evidence,
                riskLevel: normalizeSeverity(finding.severity),
                impact: finding.impactOnThesis || finding.violatedRelation || 'Afecta la defendibilidad académica.',
                recommendedFix: finding.recommendedFix
            }));
    }

    return (result.consistencyMatrix || []).map((row) => ({
        component: row.element,
        currentState: row.description || 'Sin texto detectable.',
        finding: row.technicalObservation,
        evidence: 'Sin evidencia literal estructurada en la salida.',
        riskLevel: row.coherenceLevel === 'Baja' || row.coherenceLevel === 'Inexistente' ? 'Crítico' : row.coherenceLevel === 'Media' ? 'Alto' : 'Medio',
        impact: row.technicalObservation,
        recommendedFix: row.recommendation
    }));
};

const buildObjectiveRows = (result: MatrixAnalysisDTO): ObjectiveMatrixRow[] =>
    (result.correspondenceMatrix || []).map((entry) => ({
        objective: entry.objective,
        instrument: entry.instrumentDeclared || 'No declarado',
        result: entry.actualResultFound || 'No encontrado',
        complyLabel: mapCorrespondenceStatus(entry.status),
        observation: entry.observation || entry.resultSection || 'Sin observación adicional.'
    }));

const buildReferenceRows = (result: MatrixAnalysisDTO): ReferenceMatrixRow[] => {
    if (result.referenceValidationMatrix?.length) {
        return result.referenceValidationMatrix.map((entry) => ({
            reference: entry.reference,
            existsLabel: entry.exists ? 'Sí' : 'No',
            quality: entry.academicQuality,
            citationStatus: entry.citationStatus.replace(/_/g, ' '),
            verdict: entry.verdict,
            action: entry.actionDetail || 'Sin acción detallada.'
        }));
    }

    return (result.referenceInventory || []).map((reference) => ({
        reference,
        existsLabel: 'No',
        quality: 'Sin validar',
        citationStatus: 'sin validar',
        verdict: 'corregir',
        action: 'Completar validación bibliográfica.'
    }));
};

const buildRiskRows = (result: MatrixAnalysisDTO): RiskMatrixRow[] => {
    if (result.plagiarismMatrix?.length) {
        return result.plagiarismMatrix.map((entry) => ({
            section: entry.section,
            riskType: entry.riskType.replace(/_/g, ' '),
            riskLevel: normalizeRiskLevel(entry.riskLevel),
            evidence: entry.evidence || 'Sin evidencia literal disponible.',
            action: entry.suggestedAction || 'Revisión manual.'
        }));
    }

    return (result.plagiarismRiskAnalysis?.suspectExcerpts || []).map((excerpt) => ({
        section: excerpt.page || 'Sección no identificada',
        riskType: 'riesgo coincidencia textual',
        riskLevel: normalizeRiskLevel(result.plagiarismRiskAnalysis?.overallRiskLevel),
        evidence: excerpt.excerpt || 'Sin extracto disponible.',
        action: excerpt.reason || 'Revisar integridad textual.'
    }));
};

const buildDiagnosticLines = (result: MatrixAnalysisDTO, structuralRows: StructuralRow[]): string[] => {
    const lines: string[] = [];
    const overview = result.executiveSummary?.overview || result.globalDiagnosis?.auditSummary || result.globalDiagnosis?.summary || '';

    lines.push(...sentenceSplit(overview).slice(0, 3));
    lines.push(`Cumplimiento estructural: ${getStructuralComplianceLabel(structuralRows)}.`);
    lines.push(`Consistencia metodológica: ${getMethodologicalConsistency(result)}.`);

    if (typeof result.globalDiagnosis?.internalConsistencyDegree === 'number') {
        lines.push(`Consistencia interna estimada: ${result.globalDiagnosis.internalConsistencyDegree}%.`);
    }

    if (typeof result.globalDiagnosis?.publishabilityLevel === 'number') {
        lines.push(`Defendibilidad o publicabilidad estimada: ${result.globalDiagnosis.publishabilityLevel}%.`);
    }

    lines.push(...(result.executiveSummary?.mainStrengths || []).slice(0, 2).map((item) => `Fortaleza: ${item}`));
    lines.push(...(result.executiveSummary?.mainWeaknesses || []).slice(0, 3).map((item) => `Debilidad: ${item}`));

    if (result.proposalClassification?.discrepancyWarning) {
        lines.push(`Alerta de propuesta: ${result.proposalClassification.discrepancyWarning}`);
    }

    return lines.filter(Boolean).slice(0, 12);
};

const buildFinalVerdict = (result: MatrixAnalysisDTO, structuralRows: StructuralRow[]): string => {
    const directVerdict = result.closingDiagnosis?.technicalClosingStatement?.trim();

    if (directVerdict) {
        return directVerdict;
    }

    const thematic = getThematicConsistency(result.globalDiagnosis?.internalConsistencyDegree);
    const methodological = getMethodologicalConsistency(result);
    const structural = getStructuralComplianceLabel(structuralRows);

    const weakSources = [
        ...(result.executiveSummary?.mainWeaknesses || []).slice(0, 2),
        ...(result.globalDiagnosis?.mainRisks || []).slice(0, 1)
    ];
    const fixes = [
        ...(result.closingDiagnosis?.criticalFixesRequired || []).slice(0, 2),
        ...(result.prioritizedRecommendations || []).slice(0, 2).map((item) => item.what)
    ];

    const weaknesses = weakSources.length > 0 ? weakSources.join(', ') : 'la relación entre objetivos, resultados y conclusiones';
    const requiredFixes = fixes.length > 0 ? fixes.join(', ') : 'la trazabilidad de instrumentos y la corrección bibliográfica';

    return `La tesis presenta consistencia temática ${thematic} y consistencia metodológica ${methodological}. Cumple ${structural} con la estructura institucional. Sus principales debilidades se concentran en ${weaknesses}. Antes de considerarse versión final cerrada, requiere corrección prioritaria en ${requiredFixes}.`;
};

export const buildConsistencyReportViewModel = (result: MatrixAnalysisDTO): ConsistencyReportViewModel => {
    const structuralRows = buildStructuralRows(result);
    const auditRows = buildAuditRows(result);
    const objectiveRows = buildObjectiveRows(result);
    const referenceRows = buildReferenceRows(result);
    const riskRows = buildRiskRows(result);

    const prioritizedCorrections: Record<AuditSeverity, PrioritizedCorrectionRow[]> = {
        'Crítico': [],
        'Alto': [],
        'Medio': []
    };

    auditRows.forEach((row) => {
        prioritizedCorrections[row.riskLevel].push({
            component: row.component,
            finding: row.finding,
            recommendedFix: row.recommendedFix,
            evidence: row.evidence
        });
    });

    const structuralSummary = structuralRows.reduce(
        (summary, row) => {
            if (row.status === 'Cumple') {
                summary.comply += 1;
            } else if (row.status === 'Cumple parcialmente') {
                summary.partial += 1;
            } else {
                summary.fail += 1;
            }

            return summary;
        },
        { comply: 0, partial: 0, fail: 0 }
    );

    return {
        diagnosticLines: buildDiagnosticLines(result, structuralRows),
        structuralRows,
        structuralSummary,
        auditRows,
        objectiveRows,
        referenceRows,
        riskRows,
        prioritizedCorrections,
        finalVerdict: buildFinalVerdict(result, structuralRows)
    };
};
