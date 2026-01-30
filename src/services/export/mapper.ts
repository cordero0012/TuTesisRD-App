import {
    MatrixAnalysisDTO,
    AuditResultDTO,
    ReferenceValidationResultDTO,
    WordExportDTO,
    WordExportSection
} from '../../types/schemas';

const SANITIZATION_LIMITS = {
    MAX_TEXT_LENGTH: 5000,
    MAX_TABLE_ROWS: 500
};

// --- Sanitization Helpers ---

const sanitizeText = (text: string | undefined): string => {
    if (!text) return "";
    let clean = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ''); // Remove control chars
    if (clean.length > SANITIZATION_LIMITS.MAX_TEXT_LENGTH) {
        clean = clean.substring(0, SANITIZATION_LIMITS.MAX_TEXT_LENGTH) + " [TRUNCADO POR SEGURIDAD]";
    }
    return clean;
};

// --- Mappers ---

export const mapMatrixToWordExport = (matrix: MatrixAnalysisDTO): WordExportDTO => {
    const sections: WordExportSection[] = [];

    // 1. Cover Info is handled by metadata, but we add initial sections
    sections.push({
        type: 'heading1',
        content: 'Diagnóstico Global'
    });

    // Warning Banner for Incomplete Analysis
    if (matrix.analysisWarnings && matrix.analysisWarnings.length > 0) {
        sections.push({
            type: 'text',
            content: 'ADVERTENCIA: ANÁLISIS PARCIAL',
            styling: { bold: true, color: '#b91c1c', align: 'center', size: 14 } // darker red, larger
        });
        sections.push({
            type: 'text',
            content: 'El siguiente reporte contiene secciones generadas automáticamente que podrían estar incompletas. Verifique los siguientes puntos:',
            styling: { color: '#b91c1c', align: 'justify', size: 10 }
        });
        matrix.analysisWarnings.forEach(w => {
            sections.push({
                type: 'text',
                content: `- ${sanitizeText(w)}`,
                styling: { color: '#dc2626', size: 9 } // smaller warnings
            });
        });
        sections.push({ type: 'text', content: '' }); // spacer
    }

    if (matrix.globalDiagnosis) {
        if (matrix.globalDiagnosis.score) {
            sections.push({
                type: 'text',
                content: `Puntuación General: ${matrix.globalDiagnosis.score}/100`,
                styling: { bold: true, align: 'center', color: '#2563eb' }
            });
        }

        sections.push({
            type: 'text',
            content: sanitizeText(matrix.globalDiagnosis.summary || matrix.globalDiagnosis.auditSummary),
            styling: { align: 'justify' }
        });
    }

    // 2. Consistency Matrix Table
    if (matrix.consistencyMatrix && matrix.consistencyMatrix.length > 0) {
        sections.push({ type: 'page_break' });
        sections.push({ type: 'heading1', content: 'Matriz de Consistencia' });

        const headers = ["Elemento", "Nivel", "Observación Técnica"];
        const rows = matrix.consistencyMatrix
            .slice(0, SANITIZATION_LIMITS.MAX_TABLE_ROWS)
            .map(row => [
                sanitizeText(row.element),
                sanitizeText(row.coherenceLevel),
                sanitizeText(row.technicalObservation)
            ]);

        sections.push({
            type: 'table',
            tableData: {
                headers,
                rows,
                isMatrix: true
            }
        });
    }

    return {
        metadata: {
            title: 'Informe de Matriz de Consistencia',
            subtitle: 'Evaluación de Coherencia Metodológica',
            date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
            brandingColor: 'ea580c' // Orange brand
        },
        sections
    };
};

export const mapAuditToWordExport = (audit: AuditResultDTO): WordExportDTO => {
    const sections: WordExportSection[] = [];

    // Summary
    sections.push({ type: 'heading1', content: 'Resultado de Auditoría' });
    sections.push({
        type: 'text',
        content: `Probabilidad de IA: ${(audit.score * 100).toFixed(1)}%`,
        styling: {
            bold: true,
            align: 'center',
            size: 24, // custom handling in service? mapped to styling
            color: audit.score > 0.6 ? '#dc2626' : audit.score > 0.3 ? '#f59e0b' : '#16a34a',
            isCritical: audit.score > 0.6
        }
    });

    // Metrics
    sections.push({ type: 'heading2', content: 'Métricas Forenses' });
    sections.push({ type: 'list', content: `Burstiness: ${audit.metrics?.burstiness?.toFixed(2) || 'N/A'}` });
    sections.push({ type: 'list', content: `Perplejidad: ${audit.metrics?.perplexityProxy?.toFixed(2) || 'N/A'}` });

    return {
        metadata: {
            title: 'Informe de Auditoría Forense',
            date: new Date().toLocaleDateString(),
            brandingColor: '#64748b'
        },
        sections
    };
};

export const mapReferencesToWordExport = (references: ReferenceValidationResultDTO[]): WordExportDTO => {
    const sections: WordExportSection[] = [];
    const verified = references.filter(r => r.status === 'verified');

    sections.push({ type: 'heading1', content: 'Referencias Verificadas' });

    if (verified.length === 0) {
        sections.push({ type: 'text', content: 'No se encontraron referencias verificadas.' });
    } else {
        verified.forEach((ref, i) => {
            sections.push({
                type: 'text',
                content: `${i + 1}. ${sanitizeText(ref.reference.title)}`,
                styling: { bold: true }
            });
            sections.push({
                type: 'text',
                content: `Autores: ${sanitizeText(ref.reference.authors?.join(', '))}`,
                styling: { color: '#64748b', size: 10 } // heuristic size
            });
            sections.push({ type: 'text', content: '' }); // spacer
        });
    }

    return {
        metadata: {
            title: 'Validación Bibliográfica',
            date: new Date().toLocaleDateString(),
            brandingColor: '#059669' // Emerald
        },
        sections
    };
};
