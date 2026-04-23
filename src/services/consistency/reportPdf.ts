import { jsPDF } from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import type { MatrixAnalysisDTO } from '../../types/schemas';
import { buildConsistencyReportViewModel } from './reportViewModel';

type Orientation = 'portrait' | 'landscape';
type RGB = [number, number, number];

const BRAND = {
    ink: [17, 24, 39] as RGB,
    accent: [201, 93, 36] as RGB,
    accentSoft: [250, 237, 228] as RGB,
    line: [203, 213, 225] as RGB,
    text: [51, 65, 85] as RGB,
    muted: [100, 116, 139] as RGB,
    success: [22, 163, 74] as RGB,
    warning: [217, 119, 6] as RGB,
    danger: [220, 38, 38] as RGB
};

const PAGE_MARGIN = {
    portrait: { top: 28, right: 14, bottom: 18, left: 14 },
    landscape: { top: 24, right: 12, bottom: 18, left: 12 }
};

const getMargins = (orientation: Orientation) => PAGE_MARGIN[orientation];

const getPageMetrics = (doc: jsPDF) => {
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const orientation: Orientation = width > height ? 'landscape' : 'portrait';

    return {
        width,
        height,
        orientation,
        margin: getMargins(orientation)
    };
};

const sanitizeFilename = (name: string): string =>
    (name || 'Informe_Consistencia')
        .replace(/[^\w\-]+/g, '_')
        .replace(/_+/g, '_')
        .slice(0, 60) || 'Informe_Consistencia';

const drawCover = (doc: jsPDF) => {
    const { width, height } = getPageMetrics(doc);

    doc.setFillColor(...BRAND.accentSoft);
    doc.rect(0, 0, width, height, 'F');

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(16, 18, width - 32, height - 36, 6, 6, 'F');

    doc.setFillColor(...BRAND.accent);
    doc.roundedRect(16, 18, width - 32, 8, 4, 4, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(...BRAND.accent);
    doc.text('TuTesisRD', width / 2, 56, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...BRAND.muted);
    doc.text('AUDITORIA ACADEMICA Y MATRIZ DE CONSISTENCIA', width / 2, 63, { align: 'center' });

    doc.setDrawColor(...BRAND.accent);
    doc.setLineWidth(0.6);
    doc.line(width / 2 - 34, 69, width / 2 + 34, 69);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(...BRAND.muted);
    doc.text('INFORME DE', width / 2, 112, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(...BRAND.ink);
    const subtitle = doc.splitTextToSize('AUDITORIA ACADEMICA INTEGRAL', width - 80);
    subtitle.forEach((line, index) => {
        doc.text(line, width / 2, 123 + index * 10, { align: 'center' });
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...BRAND.muted);
    doc.text(`Generado: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`, width / 2, height - 34, { align: 'center' });
    doc.text('Formato profesional para revision, presentacion y envio', width / 2, height - 28, { align: 'center' });
};

const drawHeader = (doc: jsPDF, sectionTitle: string) => {
    const { width, margin } = getPageMetrics(doc);

    doc.setFillColor(...BRAND.accentSoft);
    doc.rect(0, 0, width, margin.top - 10, 'F');
    doc.setDrawColor(...BRAND.line);
    doc.line(margin.left, margin.top - 6, width - margin.right, margin.top - 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...BRAND.ink);
    doc.text('TuTesisRD', margin.left, margin.top - 12);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...BRAND.muted);
    doc.text(sectionTitle, width - margin.right, margin.top - 12, { align: 'right' });
};

const addFooters = (doc: jsPDF) => {
    const totalPages = doc.getNumberOfPages();

    for (let page = 2; page <= totalPages; page += 1) {
        doc.setPage(page);
        const { width, height, margin } = getPageMetrics(doc);
        doc.setDrawColor(...BRAND.line);
        doc.line(margin.left, height - margin.bottom + 4, width - margin.right, height - margin.bottom + 4);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...BRAND.muted);
        doc.text('Reporte de auditoria academica', margin.left, height - margin.bottom + 9);
        doc.text(`Pagina ${page} de ${totalPages}`, width - margin.right, height - margin.bottom + 9, { align: 'right' });
    }
};

const addSectionPage = (doc: jsPDF, title: string, orientation: Orientation) => {
    doc.addPage('letter', orientation);
    drawHeader(doc, title);
};

const addSectionTitle = (doc: jsPDF, title: string, description: string, y: number): number => {
    const { width, margin } = getPageMetrics(doc);

    doc.setFillColor(...BRAND.accent);
    doc.roundedRect(margin.left, y - 5, width - margin.left - margin.right, 8, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(title, margin.left + 4, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...BRAND.muted);
    const lines = doc.splitTextToSize(description, width - margin.left - margin.right);
    doc.text(lines, margin.left, y + 10);

    return y + 10 + lines.length * 4.5;
};

const addMetricCard = (doc: jsPDF, label: string, value: string, x: number, y: number, width: number, tone: RGB) => {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, width, 24, 2, 2, 'F');
    doc.setDrawColor(...BRAND.line);
    doc.roundedRect(x, y, width, 24, 2, 2, 'S');

    doc.setFillColor(...tone);
    doc.roundedRect(x + 3, y + 3, width - 6, 6, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(label.toUpperCase(), x + width / 2, y + 7.5, { align: 'center' });

    doc.setTextColor(...BRAND.ink);
    doc.setFontSize(16);
    doc.text(value, x + width / 2, y + 18, { align: 'center' });
};

const renderDiagnosticSection = (doc: jsPDF, result: MatrixAnalysisDTO) => {
    const report = buildConsistencyReportViewModel(result);
    addSectionPage(doc, 'A. Diagnostico General', 'portrait');
    const { width, margin } = getPageMetrics(doc);
    let y = addSectionTitle(
        doc,
        'A. DIAGNOSTICO GENERAL',
        'Diagnostico ejecutivo, control estructural y principales indicadores de defendibilidad academica.',
        margin.top
    );

    const cardGap = 4;
    const cardWidth = (width - margin.left - margin.right - cardGap * 3) / 4;
    addMetricCard(doc, 'Consistencia interna', `${result.globalDiagnosis?.internalConsistencyDegree ?? 0}%`, margin.left, y, cardWidth, BRAND.success);
    addMetricCard(doc, 'Consistencia metodologica', result.closingDiagnosis?.methodologicalConsistency || 'Media', margin.left + cardWidth + cardGap, y, cardWidth, [37, 99, 235]);
    addMetricCard(doc, 'APA 7', `${Math.round(result.apaComplianceScore?.weightedFinalScore ?? result.normativeCompliance?.apa7Score ?? 0)}%`, margin.left + (cardWidth + cardGap) * 2, y, cardWidth, [124, 58, 237]);
    addMetricCard(doc, 'Publicabilidad', `${result.globalDiagnosis?.publishabilityLevel ?? 0}%`, margin.left + (cardWidth + cardGap) * 3, y, cardWidth, BRAND.warning);
    y += 32;

    const diagnosticEntries = report.diagnosticLines.length > 0 ? report.diagnosticLines : ['No se genero una sintesis ejecutiva suficiente.'];
    const diagnosticHeight = diagnosticEntries.reduce((total, line, index) => {
        const wrapped = doc.splitTextToSize(`${index + 1}. ${line}`, width - margin.left - margin.right - 12);
        return total + wrapped.length * 4.4 + 1;
    }, 0);

    const diagnosticBoxHeight = Math.max(40, diagnosticHeight + 14);
    doc.setFillColor(...BRAND.accentSoft);
    doc.roundedRect(margin.left, y, width - margin.left - margin.right, diagnosticBoxHeight, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...BRAND.ink);
    doc.text('SINTESIS DEL AUDITOR', margin.left + 4, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...BRAND.text);

    let currentY = y + 12;
    diagnosticEntries.forEach((line, index) => {
        const split = doc.splitTextToSize(`${index + 1}. ${line}`, width - margin.left - margin.right - 12);
        doc.text(split, margin.left + 6, currentY);
        currentY += split.length * 4.4 + 1;
    });
    y += diagnosticBoxHeight + 8;

    autoTable(doc, {
        startY: y,
        margin: { ...margin },
        head: [['Componente', 'Estado', 'Observacion']],
        body: (report.structuralRows.length > 0 ? report.structuralRows : [{ component: 'Sin datos', status: 'Cumple parcialmente', notes: 'La salida no incluyo una matriz estructural explicita.' }]).map((row) => [row.component, row.status, row.notes]),
        theme: 'grid',
        headStyles: { fillColor: BRAND.ink, textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 2.6, overflow: 'linebreak', textColor: BRAND.text, valign: 'top' },
        columnStyles: {
            0: { cellWidth: 48, fontStyle: 'bold' },
            1: { cellWidth: 28, halign: 'center', fontStyle: 'bold' },
            2: { cellWidth: 'auto' }
        },
        didParseCell: (hook) => {
            if (hook.section === 'body' && hook.column.index === 1) {
                const value = String(hook.cell.raw).toLowerCase();
                hook.cell.styles.textColor = value.includes('no cumple')
                    ? BRAND.danger
                    : value.includes('parcial')
                        ? BRAND.warning
                        : BRAND.success;
            }
        }
    });
};

const renderTableSection = (
    doc: jsPDF,
    title: string,
    description: string,
    orientation: Orientation,
    head: string[][],
    body: string[][],
    columnStyles: UserOptions['columnStyles'],
    didParseCell?: UserOptions['didParseCell']
) => {
    addSectionPage(doc, title, orientation);
    const { margin } = getPageMetrics(doc);
    const startY = addSectionTitle(doc, title, description, margin.top);

    autoTable(doc, {
        startY,
        margin: { ...margin },
        head,
        body: body.length > 0
            ? body
            : [head[0].map((_, index) => (index === 0 ? 'Sin datos suficientes para esta seccion.' : '-'))],
        theme: 'grid',
        rowPageBreak: 'avoid',
        headStyles: { fillColor: BRAND.ink, textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: orientation === 'landscape' ? 7.3 : 8, cellPadding: 2.2, overflow: 'linebreak', textColor: BRAND.text, valign: 'top' },
        columnStyles,
        didParseCell,
        didDrawPage: () => drawHeader(doc, title)
    });
};

const renderPrioritiesAndVerdict = (doc: jsPDF, result: MatrixAnalysisDTO) => {
    const report = buildConsistencyReportViewModel(result);

    addSectionPage(doc, 'F. Priorizacion de Correcciones', 'portrait');
    const { width, margin } = getPageMetrics(doc);

    let y = addSectionTitle(
        doc,
        'F. PRIORIZACION DE CORRECCIONES',
        'Hallazgos agrupados por severidad para intervenir primero lo que compromete validez, coherencia o defendibilidad.',
        margin.top
    );

    const columns = ['Crítico', 'Alto', 'Medio'] as const;
    const columnWidth = (width - margin.left - margin.right - 8) / 3;

    const endHeights: number[] = [];

    columns.forEach((severity, index) => {
        const x = margin.left + index * (columnWidth + 4);
        const tone = severity === 'Crítico' ? BRAND.danger : severity === 'Alto' ? BRAND.warning : BRAND.success;
        doc.setFillColor(...tone);
        doc.roundedRect(x, y, columnWidth, 10, 2, 2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text(severity.toUpperCase(), x + columnWidth / 2, y + 6.3, { align: 'center' });

        const items = report.prioritizedCorrections[severity];
        let currentY = y + 16;

        if (items.length === 0) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(8);
            doc.setTextColor(...BRAND.muted);
            doc.text('Sin hallazgos en este nivel.', x + 2, currentY);
            endHeights.push(currentY + 4);
            return;
        }

        items.slice(0, 4).forEach((item) => {
            const paragraph = doc.splitTextToSize(`- ${item.component}: ${item.recommendedFix}`, columnWidth - 6);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(...BRAND.text);
            doc.text(paragraph, x + 2, currentY);
            currentY += paragraph.length * 4.2 + 1;
        });
        endHeights.push(currentY + 2);
    });

    y = Math.max(...endHeights, y + 44);

    y = addSectionTitle(
        doc,
        'G. DICTAMEN FINAL',
        'Cierre tecnico consolidado listo para compartir, presentar o usar como lista de trabajo con el asesor.',
        y
    );

    const verdict = doc.splitTextToSize(report.finalVerdict, width - margin.left - margin.right - 12);
    const blockHeight = verdict.length * 5 + 16;
    doc.setFillColor(...BRAND.accentSoft);
    doc.roundedRect(margin.left, y, width - margin.left - margin.right, blockHeight, 2, 2, 'F');
    doc.setDrawColor(...BRAND.accent);
    doc.setLineWidth(0.8);
    doc.line(margin.left, y, margin.left, y + blockHeight);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...BRAND.ink);
    doc.text(verdict, margin.left + 6, y + 10);
};

export const buildConsistencyMatrixPdfDoc = (result: MatrixAnalysisDTO): jsPDF => {
    const report = buildConsistencyReportViewModel(result);
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });

    drawCover(doc);
    renderDiagnosticSection(doc, result);

    renderTableSection(
        doc,
        'B. MATRIZ DE AUDITORIA INTEGRAL',
        'Tabla principal de hallazgos con evidencia, nivel de riesgo e impacto directo sobre la tesis.',
        'landscape',
        [[
            'Componente auditado',
            'Formulación o estado actual',
            'Hallazgo o discrepancia',
            'Evidencia',
            'Nivel de riesgo',
            'Impacto en la tesis',
            'Corrección recomendada'
        ]],
        report.auditRows.map((row) => [
            row.component,
            row.currentState,
            row.finding,
            row.evidence,
            row.riskLevel,
            row.impact,
            row.recommendedFix
        ]),
        {
            0: { cellWidth: 32, fontStyle: 'bold' },
            1: { cellWidth: 38 },
            2: { cellWidth: 38 },
            3: { cellWidth: 42 },
            4: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
            5: { cellWidth: 38 },
            6: { cellWidth: 42 }
        },
        (hook) => {
            if (hook.section === 'body' && hook.column.index === 4) {
                const value = String(hook.cell.raw).toLowerCase();
                hook.cell.styles.textColor = value.includes('crít') || value.includes('crit')
                    ? BRAND.danger
                    : value.includes('alto')
                        ? BRAND.warning
                        : BRAND.success;
            }
        }
    );

    renderTableSection(
        doc,
        'C. MATRIZ OBJETIVO - INSTRUMENTO - RESULTADO',
        'Trazabilidad entre objetivos específicos, instrumentos declarados y resultados realmente visibles en la tesis.',
        'landscape',
        [[
            'Objetivo específico',
            'Instrumento(s) que deberían responderlo',
            'Resultado visible en la tesis',
            '¿Cumple?',
            'Observación'
        ]],
        report.objectiveRows.map((row) => [
            row.objective,
            row.instrument,
            row.result,
            row.complyLabel,
            row.observation
        ]),
        {
            0: { cellWidth: 50, fontStyle: 'bold' },
            1: { cellWidth: 42 },
            2: { cellWidth: 48 },
            3: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
            4: { cellWidth: 62 }
        },
        (hook) => {
            if (hook.section === 'body' && hook.column.index === 3) {
                const value = String(hook.cell.raw).toLowerCase();
                hook.cell.styles.textColor = value === 'sí'
                    ? BRAND.success
                    : value === 'parcial'
                        ? BRAND.warning
                        : BRAND.danger;
            }
        }
    );

    renderTableSection(
        doc,
        'D. MATRIZ DE VALIDACION DE REFERENCIAS',
        'Revisión una por una del estado bibliográfico, calidad académica y acción requerida.',
        'landscape',
        [[
            'Referencia',
            '¿Existe?',
            'Calidad académica',
            'Estado de citación',
            'Veredicto',
            'Acción'
        ]],
        report.referenceRows.map((row) => [
            row.reference,
            row.existsLabel,
            row.quality,
            row.citationStatus,
            row.verdict,
            row.action
        ]),
        {
            0: { cellWidth: 64 },
            1: { cellWidth: 16, halign: 'center', fontStyle: 'bold' },
            2: { cellWidth: 22, halign: 'center' },
            3: { cellWidth: 26, halign: 'center' },
            4: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
            5: { cellWidth: 64 }
        },
        (hook) => {
            if (hook.section === 'body' && hook.column.index === 4) {
                const value = String(hook.cell.raw).toLowerCase();
                hook.cell.styles.textColor = value.includes('mantener')
                    ? BRAND.success
                    : value.includes('corregir')
                        ? BRAND.warning
                        : BRAND.danger;
            }
        }
    );

    renderTableSection(
        doc,
        'E. MATRIZ DE RIESGO DE PLAGIO / IA',
        'Patrones observables compatibles con coincidencia textual, ensamblaje documental o redacción asistida.',
        'landscape',
        [[
            'Sección',
            'Tipo de riesgo detectado',
            'Nivel de riesgo',
            'Evidencia',
            'Acción sugerida'
        ]],
        report.riskRows.map((row) => [
            row.section,
            row.riskType,
            row.riskLevel,
            row.evidence,
            row.action
        ]),
        {
            0: { cellWidth: 30, fontStyle: 'bold' },
            1: { cellWidth: 36 },
            2: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
            3: { cellWidth: 62 },
            4: { cellWidth: 72 }
        },
        (hook) => {
            if (hook.section === 'body' && hook.column.index === 2) {
                const value = String(hook.cell.raw).toLowerCase();
                hook.cell.styles.textColor = value.includes('alto')
                    ? BRAND.danger
                    : value.includes('medio')
                        ? BRAND.warning
                        : BRAND.success;
            }
        }
    );

    renderPrioritiesAndVerdict(doc, result);
    addFooters(doc);

    return doc;
};

export const generateConsistencyMatrixPDF = (result: MatrixAnalysisDTO, fileName = 'Informe_Consistencia') => {
    const doc = buildConsistencyMatrixPdfDoc(result);
    doc.save(`${sanitizeFilename(fileName)}_${Date.now()}.pdf`);
};
