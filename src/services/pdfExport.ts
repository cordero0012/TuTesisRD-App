import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ConsistencyAnalysisResult } from './consistency/matrixAnalyzer';
import { ReportData, ReferenceItem, AuditResult, TranscriptionResult } from '../types/core';

// Professional Academic Document Constants — Paleta TuTesis RD
const PAGE_MARGIN = { top: 20, bottom: 20, left: 25, right: 20 };
const FONTS = { primary: "helvetica", style: { regular: "normal", bold: "bold", italic: "italic" } };
const FONT_SIZES = { title: 24, subtitle: 18, heading1: 16, heading2: 14, body: 11, small: 9, tiny: 8 };
type RGB = [number, number, number];
const COLORS = {
    // Brand colors TuTesisRD (tailwind.config.js)
    primary: [242, 151, 39] as RGB,         // #F29727 naranja marca
    primaryDark: [217, 154, 78] as RGB,     // #D99A4E gold
    brandBlack: [13, 13, 13] as RGB,        // #0D0D0D
    text: { main: [30, 30, 35] as RGB, secondary: [100, 100, 100] as RGB, light: [150, 150, 150] as RGB },
    status: { success: [16, 185, 129] as RGB, warning: [245, 158, 11] as RGB, error: [239, 68, 68] as RGB },
    bg: { header: [247, 247, 247] as RGB, accent: [253, 244, 231] as RGB, card: [250, 250, 250] as RGB } // #F7F7F7 + tinte naranja suave
};

interface PDFReportStrategy {
    generate(doc: jsPDF, data: ReportData): void;
    getTitle(): string;
    getSubTitle(): string;
}

// Helpers
// @ts-ignore
const addFooter = (doc: jsPDF, pageNumber: number, totalPages: number) => {
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    doc.setFont(FONTS.primary, FONTS.style.regular);
    doc.setFontSize(FONT_SIZES.small);
    doc.setTextColor(COLORS.text.light[0], COLORS.text.light[1], COLORS.text.light[2]);
    doc.setDrawColor(220, 220, 220);
    doc.line(PAGE_MARGIN.left, pageHeight - PAGE_MARGIN.bottom + 5, pageWidth - PAGE_MARGIN.right, pageHeight - PAGE_MARGIN.bottom + 5);
    const date = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(`Tu Tesis RD – Informe Académico`, PAGE_MARGIN.left, pageHeight - PAGE_MARGIN.bottom + 10);
    doc.text(date, pageWidth / 2, pageHeight - PAGE_MARGIN.bottom + 10, { align: 'center' });
    doc.text(`Página ${pageNumber} de ${totalPages}`, pageWidth - PAGE_MARGIN.right, pageHeight - PAGE_MARGIN.bottom + 10, { align: 'right' });
};

const addWrappedText = (doc: jsPDF, text: string, x: number, y: number, maxWidth: number): number => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * 6);
};

const ensureSpace = (doc: jsPDF, yPos: number, requiredSpace: number): number => {
    const pageHeight = doc.internal.pageSize.height;
    if (yPos + requiredSpace > pageHeight - PAGE_MARGIN.bottom - 10) {
        doc.addPage();
        return PAGE_MARGIN.top;
    }
    return yPos;
};

// --- Concrete Strategies ---

// Helpers específicos para matriz de consistencia
const qualityColor = (q?: string): RGB => {
    const v = (q || '').toLowerCase();
    if (v.includes('exce') || v.includes('alta')) return COLORS.status.success;
    if (v.includes('acept') || v.includes('media')) return COLORS.status.warning;
    if (v.includes('débil') || v.includes('debil') || v.includes('baja') || v.includes('crít') || v.includes('crit') || v.includes('inexist') || v.includes('ausente')) return COLORS.status.error;
    return COLORS.text.secondary;
};

const sectionHeader = (doc: jsPDF, title: string, yPos: number, margin: number, pageWidth: number): number => {
    doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.roundedRect(margin, yPos - 5, pageWidth - margin * 2, 9, 1.5, 1.5, 'F');
    doc.setFontSize(12);
    doc.setFont(FONTS.primary, FONTS.style.bold);
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), margin + 3, yPos + 1);
    return yPos + 12;
};

const miniHeader = (doc: jsPDF, title: string, yPos: number, margin: number): number => {
    doc.setFontSize(11);
    doc.setFont(FONTS.primary, FONTS.style.bold);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(title, margin, yPos);
    doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.setLineWidth(0.4);
    doc.line(margin, yPos + 1.5, margin + 60, yPos + 1.5);
    return yPos + 7;
};

class ConsistencyMatrixStrategy implements PDFReportStrategy {
    getTitle() { return "INFORME DE"; }
    getSubTitle() { return "AUDITORÍA ACADÉMICA COMPLETA"; }

    generate(doc: jsPDF, result: ConsistencyAnalysisResult) {
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 25;
        let yPos = 135; // Start after cover header

        // --- PORTADA: Metadata ---
        const addMeta = (label: string, value: string) => {
            doc.setFontSize(10);
            doc.setFont(FONTS.primary, FONTS.style.bold);
            doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
            doc.text(label, 40, yPos);
            doc.setFont(FONTS.primary, FONTS.style.regular);
            doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
            const valueLines = doc.splitTextToSize(value, pageWidth - 80 - 40);
            doc.text(valueLines, 85, yPos);
            yPos += Math.max(8, valueLines.length * 5);
        };

        addMeta("DOCUMENTO:", result.documentType || "Tesis de Grado");
        addMeta("ENFOQUE:", result.methodologicalApproach || "No identificado");
        addMeta("ÁREA:", result.disciplinaryArea || "Multidisciplinar");
        addMeta("NORMATIVA:", (result.applicableStandards?.join(', ')) || "Estándar General");

        // --- 1. DIAGNÓSTICO GLOBAL ---
        doc.addPage();
        yPos = 30;
        yPos = sectionHeader(doc, "1. Diagnóstico Global", yPos, margin, pageWidth);

        const diag = result.globalDiagnosis;
        const apaScore = result.apaComplianceScore;

        const drawScoreCard = (label: string, value: string | number, x: number, valueColor?: number[]) => {
            doc.setFillColor(COLORS.bg.card[0], COLORS.bg.card[1], COLORS.bg.card[2]);
            doc.roundedRect(x, yPos, 38, 26, 2, 2, 'F');
            doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
            doc.setLineWidth(0.3);
            doc.roundedRect(x, yPos, 38, 26, 2, 2, 'S');
            doc.setFontSize(7);
            doc.setFont(FONTS.primary, FONTS.style.bold);
            doc.setTextColor(COLORS.text.secondary[0], COLORS.text.secondary[1], COLORS.text.secondary[2]);
            doc.text(label.toUpperCase(), x + 19, yPos + 7, { align: 'center' });
            doc.setFontSize(14);
            const c = valueColor || COLORS.brandBlack;
            doc.setTextColor(c[0], c[1], c[2]);
            doc.text(String(value), x + 19, yPos + 18, { align: 'center' });
        };

        drawScoreCard("Nivel", diag?.level ?? "N/D", margin, qualityColor(diag?.level));
        drawScoreCard("Consistencia", `${diag?.internalConsistencyDegree ?? 0}%`, margin + 40);
        drawScoreCard("APA 7", `${Math.round(apaScore?.weightedFinalScore ?? result.normativeCompliance?.apa7Score ?? 0)}%`, margin + 80);
        drawScoreCard("Publicable", `${diag?.publishabilityLevel ?? 0}%`, margin + 120);
        yPos += 32;

        const summaryText = diag?.summary || diag?.auditSummary;
        if (summaryText) {
            doc.setFontSize(10);
            doc.setFont(FONTS.primary, FONTS.style.italic);
            doc.setTextColor(COLORS.text.secondary[0], COLORS.text.secondary[1], COLORS.text.secondary[2]);
            const lines = doc.splitTextToSize(summaryText, pageWidth - margin * 2);
            doc.text(lines, margin, yPos);
            yPos += lines.length * 5 + 8;
            doc.setFont(FONTS.primary, FONTS.style.regular);
        }

        // Main risks
        if (diag?.mainRisks && diag.mainRisks.length > 0) {
            yPos = ensureSpace(doc, yPos, 20);
            yPos = miniHeader(doc, "Principales Riesgos Detectados", yPos, margin);
            diag.mainRisks.forEach(risk => {
                yPos = ensureSpace(doc, yPos, 10);
                doc.setFontSize(9);
                doc.setTextColor(COLORS.status.error[0], COLORS.status.error[1], COLORS.status.error[2]);
                doc.text("●", margin, yPos);
                doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
                const lines = doc.splitTextToSize(risk, pageWidth - margin * 2 - 6);
                doc.text(lines, margin + 5, yPos);
                yPos += lines.length * 5 + 2;
            });
            yPos += 5;
        }

        // --- 2. PUNTAJE APA 7 DETALLADO ---
        if (apaScore) {
            yPos = ensureSpace(doc, yPos, 50);
            yPos = sectionHeader(doc, "2. Puntaje APA 7 — Desglose Ponderado", yPos, margin, pageWidth);

            autoTable(doc, {
                startY: yPos,
                head: [['Dimensión', 'Puntaje', 'Interpretación']],
                body: [
                    ['Citas en el Texto', `${Math.round(apaScore.citationsScore ?? 0)}/100`, apaScore.citationsScore >= 70 ? 'Adecuado' : 'Requiere revisión'],
                    ['Lista de Referencias', `${Math.round(apaScore.referencesScore ?? 0)}/100`, apaScore.referencesScore >= 70 ? 'Adecuado' : 'Requiere revisión'],
                    ['Formato del Documento', `${Math.round(apaScore.formatScore ?? 0)}/100`, apaScore.formatScore >= 70 ? 'Adecuado' : 'Requiere revisión'],
                    ['Prevención del Plagio', `${Math.round(apaScore.plagiarismScore ?? 0)}/100`, apaScore.plagiarismScore >= 70 ? 'Íntegro' : 'Señales de alerta'],
                    ['PUNTAJE FINAL PONDERADO', `${Math.round(apaScore.weightedFinalScore ?? 0)}/100`, (apaScore.classification ?? '').toString().toUpperCase()],
                ],
                theme: 'grid',
                headStyles: { fillColor: COLORS.brandBlack, textColor: [255, 255, 255], fontStyle: 'bold' },
                styles: { fontSize: 9, cellPadding: 3, textColor: COLORS.text.main },
                columnStyles: {
                    0: { fontStyle: 'bold', cellWidth: 60 },
                    1: { halign: 'center', cellWidth: 30 },
                    2: { cellWidth: 'auto' }
                },
                didParseCell: (data) => {
                    if (data.section === 'body' && data.row.index === 4) {
                        data.cell.styles.fillColor = COLORS.bg.accent as any;
                        data.cell.styles.fontStyle = 'bold';
                        data.cell.styles.textColor = COLORS.primary as any;
                    }
                }
            });
            // @ts-ignore
            yPos = (doc as any).lastAutoTable.finalY + 12;
        }

        // --- 3. EVALUACIÓN POR ELEMENTO DE TESIS ---
        const elements = (result as any).thesisElementsEvaluation as any[] | undefined;
        if (elements && elements.length > 0) {
            doc.addPage();
            yPos = 30;
            yPos = sectionHeader(doc, "3. Evaluación por Elemento de la Tesis", yPos, margin, pageWidth);

            elements.forEach((el) => {
                yPos = ensureSpace(doc, yPos, 40);

                // Card header con calidad
                const qc = qualityColor(el.quality);
                doc.setFillColor(COLORS.bg.card[0], COLORS.bg.card[1], COLORS.bg.card[2]);
                doc.roundedRect(margin, yPos, pageWidth - margin * 2, 10, 1.5, 1.5, 'F');
                doc.setFontSize(10);
                doc.setFont(FONTS.primary, FONTS.style.bold);
                doc.setTextColor(COLORS.brandBlack[0], COLORS.brandBlack[1], COLORS.brandBlack[2]);
                doc.text(el.element || 'Elemento', margin + 3, yPos + 6.5);

                // Badge calidad
                doc.setFillColor(qc[0], qc[1], qc[2]);
                const badge = `${el.quality || 'N/D'} · ${Math.round(el.score ?? 0)}/100`;
                const badgeWidth = doc.getTextWidth(badge) + 6;
                doc.roundedRect(pageWidth - margin - badgeWidth - 2, yPos + 2, badgeWidth, 6, 1, 1, 'F');
                doc.setFontSize(8);
                doc.setTextColor(255, 255, 255);
                doc.text(badge, pageWidth - margin - badgeWidth / 2 - 2, yPos + 6, { align: 'center' });

                yPos += 14;

                doc.setFont(FONTS.primary, FONTS.style.regular);
                doc.setFontSize(9);
                doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);

                if (el.page) {
                    doc.setFont(FONTS.primary, FONTS.style.italic);
                    doc.setTextColor(COLORS.text.secondary[0], COLORS.text.secondary[1], COLORS.text.secondary[2]);
                    doc.text(`Ubicación: ${el.page}`, margin + 2, yPos);
                    yPos += 5;
                    doc.setFont(FONTS.primary, FONTS.style.regular);
                    doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
                }

                if (el.strengths && el.strengths.length > 0) {
                    doc.setFont(FONTS.primary, FONTS.style.bold);
                    doc.setTextColor(COLORS.status.success[0], COLORS.status.success[1], COLORS.status.success[2]);
                    doc.text("Fortalezas:", margin + 2, yPos);
                    yPos += 4;
                    doc.setFont(FONTS.primary, FONTS.style.regular);
                    doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
                    el.strengths.forEach((s: string) => {
                        yPos = ensureSpace(doc, yPos, 8);
                        const lines = doc.splitTextToSize(`+ ${s}`, pageWidth - margin * 2 - 8);
                        doc.text(lines, margin + 6, yPos);
                        yPos += lines.length * 4.5;
                    });
                    yPos += 2;
                }

                if (el.weaknesses && el.weaknesses.length > 0) {
                    yPos = ensureSpace(doc, yPos, 10);
                    doc.setFont(FONTS.primary, FONTS.style.bold);
                    doc.setTextColor(COLORS.status.error[0], COLORS.status.error[1], COLORS.status.error[2]);
                    doc.text("Debilidades:", margin + 2, yPos);
                    yPos += 4;
                    doc.setFont(FONTS.primary, FONTS.style.regular);
                    doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
                    el.weaknesses.forEach((w: string) => {
                        yPos = ensureSpace(doc, yPos, 8);
                        const lines = doc.splitTextToSize(`- ${w}`, pageWidth - margin * 2 - 8);
                        doc.text(lines, margin + 6, yPos);
                        yPos += lines.length * 4.5;
                    });
                    yPos += 2;
                }

                if (el.alignmentWithOthers) {
                    yPos = ensureSpace(doc, yPos, 10);
                    doc.setFont(FONTS.primary, FONTS.style.bold);
                    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
                    doc.text("Alineación:", margin + 2, yPos);
                    yPos += 4;
                    doc.setFont(FONTS.primary, FONTS.style.regular);
                    doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
                    const lines = doc.splitTextToSize(el.alignmentWithOthers, pageWidth - margin * 2 - 4);
                    doc.text(lines, margin + 2, yPos);
                    yPos += lines.length * 4.5 + 2;
                }

                if (el.recommendation) {
                    yPos = ensureSpace(doc, yPos, 10);
                    doc.setFont(FONTS.primary, FONTS.style.bold);
                    doc.setTextColor(COLORS.primaryDark[0], COLORS.primaryDark[1], COLORS.primaryDark[2]);
                    doc.text("Recomendación:", margin + 2, yPos);
                    yPos += 4;
                    doc.setFont(FONTS.primary, FONTS.style.regular);
                    doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
                    const lines = doc.splitTextToSize(el.recommendation, pageWidth - margin * 2 - 4);
                    doc.text(lines, margin + 2, yPos);
                    yPos += lines.length * 4.5;
                }

                yPos += 6;
            });
        }

        // --- 4. MATRIZ DE ALINEACIÓN METODOLÓGICA ---
        const matrixRows = (result.consistencyMatrix ?? []).map(row => [
            row.element ?? '-',
            row.description || 'No detectado',
            (row.coherenceLevel ?? '').toString().toUpperCase(),
            row.technicalObservation || 'Sin observaciones'
        ]);

        if (matrixRows.length > 0) {
            doc.addPage();
            yPos = 30;
            yPos = sectionHeader(doc, "4. Matriz de Alineación Metodológica", yPos, margin, pageWidth);

            autoTable(doc, {
                startY: yPos,
                head: [['Componente', 'Contenido Detectado', 'Nivel', 'Observación']],
                body: matrixRows,
                theme: 'grid',
                headStyles: { fillColor: COLORS.brandBlack, textColor: [255, 255, 255], fontStyle: 'bold' },
                styles: { fontSize: 9, cellPadding: 3.5, textColor: COLORS.text.main },
                columnStyles: {
                    0: { fontStyle: 'bold', cellWidth: 35, fillColor: COLORS.bg.card },
                    1: { cellWidth: 55 },
                    2: { halign: 'center', cellWidth: 22, fontStyle: 'bold' },
                    3: { cellWidth: 'auto' }
                },
                didParseCell: (data) => {
                    if (data.section === 'body' && data.column.index === 2) {
                        const text = data.cell.raw as string;
                        data.cell.styles.textColor = (text === 'BAJA' || text === 'INEXISTENTE')
                            ? COLORS.status.error as any
                            : (text === 'MEDIA' ? COLORS.status.warning as any : COLORS.status.success as any);
                    }
                }
            });
            // @ts-ignore
            yPos = (doc as any).lastAutoTable.finalY + 12;
        }

        // --- 5. SUB-MATRIZ DE FUENTES (CITAS ↔ REFERENCIAS) ---
        const citations = result.sourceConsistencySubMatrix?.citationsFound;
        const missingRefs = result.sourceConsistencySubMatrix?.missingReferences;
        const unusedRefs = result.sourceConsistencySubMatrix?.unusedReferences;

        if ((citations && citations.length > 0) || (missingRefs && missingRefs.length > 0) || (unusedRefs && unusedRefs.length > 0)) {
            if (yPos > pageHeight - 80) { doc.addPage(); yPos = 30; }
            yPos = sectionHeader(doc, "5. Sub-Matriz de Fuentes (Citas ↔ Bibliografía)", yPos, margin, pageWidth);

            if (citations && citations.length > 0) {
                autoTable(doc, {
                    startY: yPos,
                    head: [['Cita Detectada', 'En Bibliografía', 'Página']],
                    body: citations.map(item => [
                        item.citation ?? '-',
                        item.inBibliography ? 'SÍ' : 'NO',
                        item.page ?? '-'
                    ]),
                    theme: 'striped',
                    headStyles: { fillColor: COLORS.primary, textColor: [255, 255, 255], fontStyle: 'bold' },
                    styles: { fontSize: 8, cellPadding: 3 },
                    columnStyles: { 1: { halign: 'center', cellWidth: 30 }, 2: { halign: 'center', cellWidth: 25 } },
                    didParseCell: (data) => {
                        if (data.section === 'body' && data.column.index === 1) {
                            const text = data.cell.raw as string;
                            data.cell.styles.textColor = (text === 'NO') ? COLORS.status.error as any : COLORS.status.success as any;
                            data.cell.styles.fontStyle = 'bold';
                        }
                    }
                });
                // @ts-ignore
                yPos = (doc as any).lastAutoTable.finalY + 8;
            }

            if (missingRefs && missingRefs.length > 0) {
                yPos = ensureSpace(doc, yPos, 20);
                yPos = miniHeader(doc, "Citas sin entrada en Bibliografía", yPos, margin);
                missingRefs.forEach(r => {
                    yPos = ensureSpace(doc, yPos, 8);
                    doc.setFontSize(8);
                    doc.setTextColor(COLORS.status.error[0], COLORS.status.error[1], COLORS.status.error[2]);
                    const lines = doc.splitTextToSize(`• ${r}`, pageWidth - margin * 2 - 6);
                    doc.text(lines, margin + 3, yPos);
                    yPos += lines.length * 4 + 1;
                });
                yPos += 4;
            }

            if (unusedRefs && unusedRefs.length > 0) {
                yPos = ensureSpace(doc, yPos, 20);
                yPos = miniHeader(doc, "Referencias no citadas en el texto", yPos, margin);
                unusedRefs.forEach(r => {
                    yPos = ensureSpace(doc, yPos, 8);
                    doc.setFontSize(8);
                    doc.setTextColor(COLORS.status.warning[0], COLORS.status.warning[1], COLORS.status.warning[2]);
                    const lines = doc.splitTextToSize(`• ${r}`, pageWidth - margin * 2 - 6);
                    doc.text(lines, margin + 3, yPos);
                    yPos += lines.length * 4 + 1;
                });
                yPos += 4;
            }
        }

        // --- 6. VALIDACIÓN DE REGLAS APA 7 ---
        const rules = (result as any).ruleValidationResults as any[] | undefined;
        if (rules && rules.length > 0) {
            doc.addPage();
            yPos = 30;
            yPos = sectionHeader(doc, "6. Validación Regla-por-Regla (APA 7)", yPos, margin, pageWidth);

            autoTable(doc, {
                startY: yPos,
                head: [['ID', 'Regla', 'Estado', 'Fallos']],
                body: rules.map(r => [
                    r.ruleId ?? '-',
                    r.description ?? '-',
                    (r.status ?? 'na').toString().toUpperCase(),
                    String(r.failCount ?? 0)
                ]),
                theme: 'grid',
                headStyles: { fillColor: COLORS.brandBlack, textColor: [255, 255, 255], fontStyle: 'bold' },
                styles: { fontSize: 8, cellPadding: 3 },
                columnStyles: {
                    0: { cellWidth: 15, halign: 'center', fontStyle: 'bold' },
                    1: { cellWidth: 'auto' },
                    2: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
                    3: { cellWidth: 20, halign: 'center' }
                },
                didParseCell: (data) => {
                    if (data.section === 'body' && data.column.index === 2) {
                        const text = (data.cell.raw as string).toUpperCase();
                        data.cell.styles.textColor = text === 'PASS' ? COLORS.status.success as any
                            : text === 'FAIL' ? COLORS.status.error as any
                            : COLORS.text.secondary as any;
                    }
                }
            });
            // @ts-ignore
            yPos = (doc as any).lastAutoTable.finalY + 12;
        }

        // --- 7. PLAN DE ACCIÓN PRIORIZADO ---
        const recs = result.prioritizedRecommendations ?? [];
        if (recs.length > 0) {
            if (yPos > pageHeight - 50) { doc.addPage(); yPos = 30; }
            yPos = sectionHeader(doc, "7. Plan de Acción Priorizado", yPos, margin, pageWidth);

            recs.forEach((rec, idx) => {
                yPos = ensureSpace(doc, yPos, 28);
                const priority = (rec.priority || 'Media').toString();
                const pColor = priority.toLowerCase().includes('crít') ? COLORS.status.error
                    : priority.toLowerCase().includes('alta') ? COLORS.status.warning
                    : COLORS.status.success;

                // Priority tag
                doc.setFillColor(pColor[0], pColor[1], pColor[2]);
                doc.roundedRect(margin, yPos, 20, 5, 1, 1, 'F');
                doc.setFontSize(7);
                doc.setFont(FONTS.primary, FONTS.style.bold);
                doc.setTextColor(255, 255, 255);
                doc.text(priority.toUpperCase(), margin + 10, yPos + 3.5, { align: 'center' });

                doc.setFontSize(10);
                doc.setTextColor(COLORS.brandBlack[0], COLORS.brandBlack[1], COLORS.brandBlack[2]);
                doc.text(`${idx + 1}. ${rec.what ?? 'Recomendación'}`, margin + 23, yPos + 3.5);
                yPos += 8;

                doc.setFont(FONTS.primary, FONTS.style.regular);
                doc.setFontSize(9);
                doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
                const whyText = doc.splitTextToSize(`Por qué: ${rec.why ?? 'N/D'}`, pageWidth - margin * 2 - 3);
                doc.text(whyText, margin + 3, yPos);
                yPos += (whyText.length * 4.5) + 1;
                const howText = doc.splitTextToSize(`Cómo: ${rec.how ?? 'N/D'}`, pageWidth - margin * 2 - 3);
                doc.text(howText, margin + 3, yPos);
                yPos += (howText.length * 4.5) + 6;
            });
        }

        // --- 8. FEEDBACK ACCIONABLE (plantilla de 5 campos) ---
        if (result.actionableFeedback && result.actionableFeedback.length > 0) {
            doc.addPage();
            yPos = 30;
            yPos = sectionHeader(doc, "8. Feedback Accionable — Plantilla de 5 Campos", yPos, margin, pageWidth);

            result.actionableFeedback.forEach((fb, idx) => {
                yPos = ensureSpace(doc, yPos, 50);

                // Card container
                const cardStart = yPos;
                doc.setFillColor(COLORS.bg.card[0], COLORS.bg.card[1], COLORS.bg.card[2]);

                // Title bar
                doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
                doc.roundedRect(margin, yPos, pageWidth - margin * 2, 7, 1, 1, 'F');
                doc.setFontSize(10);
                doc.setFont(FONTS.primary, FONTS.style.bold);
                doc.setTextColor(255, 255, 255);
                const titleText = doc.splitTextToSize(`Hallazgo ${idx + 1}: ${fb.finding}`, pageWidth - margin * 2 - 4);
                doc.text(titleText[0] ?? `Hallazgo ${idx + 1}`, margin + 3, yPos + 5);
                yPos += 10;

                doc.setFont(FONTS.primary, FONTS.style.regular);
                doc.setFontSize(9);

                const writeField = (label: string, labelColor: number[], value: string) => {
                    yPos = ensureSpace(doc, yPos, 10);
                    doc.setFont(FONTS.primary, FONTS.style.bold);
                    doc.setTextColor(labelColor[0], labelColor[1], labelColor[2]);
                    doc.text(label, margin + 3, yPos);
                    doc.setFont(FONTS.primary, FONTS.style.regular);
                    doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
                    const labelWidth = doc.getTextWidth(label) + 2;
                    const lines = doc.splitTextToSize(value || 'N/D', pageWidth - margin * 2 - labelWidth - 4);
                    doc.text(lines, margin + 3 + labelWidth, yPos);
                    yPos += Math.max(4.5, lines.length * 4.5) + 1;
                };

                writeField("Evidencia:", COLORS.brandBlack, fb.evidence);
                writeField("Por qué importa:", COLORS.status.warning, fb.whyItMatters);
                writeField("Cómo corregir:", COLORS.status.success, fb.howToFix);
                writeField("Ejemplo:", COLORS.primaryDark, fb.example);

                yPos += 5;
            });
        }

        // --- 9. MATRIZ DE CORRESPONDENCIA (OBJETIVO ↔ INSTRUMENTO ↔ RESULTADO) ---
        const correspondence = (result as any).correspondenceMatrix as any[] | undefined;
        if (correspondence && correspondence.length > 0) {
            doc.addPage();
            yPos = 30;
            yPos = sectionHeader(doc, "9. Trazabilidad Empírica (Objetivo ↔ Instrumento ↔ Resultado)", yPos, margin, pageWidth);

            autoTable(doc, {
                startY: yPos,
                head: [['Objetivo', 'Instrumento', 'Resultado Esperado', 'Encontrado', 'Estado']],
                body: correspondence.map(c => [
                    c.objective ?? '-',
                    c.instrumentDeclared ?? '-',
                    c.expectedOutput ?? '-',
                    c.actualResultFound ?? 'NO ENCONTRADO',
                    (c.status ?? 'sin_evidencia').toString().toUpperCase().replace('_', ' ')
                ]),
                theme: 'grid',
                headStyles: { fillColor: COLORS.brandBlack, textColor: [255, 255, 255], fontStyle: 'bold' },
                styles: { fontSize: 7.5, cellPadding: 2.5, textColor: COLORS.text.main, valign: 'top' },
                columnStyles: {
                    0: { cellWidth: 40, fontStyle: 'bold' },
                    1: { cellWidth: 28 },
                    2: { cellWidth: 32 },
                    3: { cellWidth: 'auto' },
                    4: { cellWidth: 22, halign: 'center', fontStyle: 'bold' }
                },
                didParseCell: (data) => {
                    if (data.section === 'body' && data.column.index === 4) {
                        const t = (data.cell.raw as string);
                        data.cell.styles.textColor = t.includes('CUMPLIDO') && !t.includes('NO') ? COLORS.status.success as any
                            : t.includes('PARCIAL') ? COLORS.status.warning as any
                            : COLORS.status.error as any;
                    }
                }
            });
            // @ts-ignore
            yPos = (doc as any).lastAutoTable.finalY + 10;

            // Observaciones debajo de la tabla
            const obsEntries = correspondence.filter(c => c.observation);
            if (obsEntries.length > 0) {
                yPos = ensureSpace(doc, yPos, 15);
                yPos = miniHeader(doc, "Observaciones de trazabilidad", yPos, margin);
                obsEntries.forEach((c: any) => {
                    yPos = ensureSpace(doc, yPos, 10);
                    doc.setFontSize(8);
                    doc.setFont(FONTS.primary, FONTS.style.bold);
                    doc.setTextColor(COLORS.brandBlack[0], COLORS.brandBlack[1], COLORS.brandBlack[2]);
                    doc.text(`• ${c.objective}:`, margin + 2, yPos);
                    yPos += 4;
                    doc.setFont(FONTS.primary, FONTS.style.regular);
                    doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
                    const lines = doc.splitTextToSize(c.observation, pageWidth - margin * 2 - 6);
                    doc.text(lines, margin + 6, yPos);
                    yPos += lines.length * 4 + 2;
                });
            }
        }

        // --- 10. COHERENCIA NUMÉRICA ---
        const numerical = (result as any).numericalCoherence as any[] | undefined;
        if (numerical && numerical.length > 0) {
            yPos = ensureSpace(doc, yPos, 40);
            if (yPos > pageHeight - 80) { doc.addPage(); yPos = 30; }
            yPos = sectionHeader(doc, "10. Coherencia Numérica — Cifras Contradictorias", yPos, margin, pageWidth);

            autoTable(doc, {
                startY: yPos,
                head: [['Cifra / Métrica', 'Ubicación A', 'Ubicación B', 'Discrepancia', 'Gravedad']],
                body: numerical.map(n => [
                    n.figure ?? '-',
                    n.locationA ?? '-',
                    n.locationB ?? '-',
                    n.discrepancy ?? '-',
                    (n.severity ?? 'Medio').toString().toUpperCase()
                ]),
                theme: 'grid',
                headStyles: { fillColor: COLORS.status.error, textColor: [255, 255, 255], fontStyle: 'bold' },
                styles: { fontSize: 8, cellPadding: 2.5, valign: 'top' },
                columnStyles: {
                    0: { fontStyle: 'bold', cellWidth: 35 },
                    1: { cellWidth: 35 },
                    2: { cellWidth: 35 },
                    3: { cellWidth: 'auto' },
                    4: { cellWidth: 20, halign: 'center', fontStyle: 'bold' }
                },
                didParseCell: (data) => {
                    if (data.section === 'body' && data.column.index === 4) {
                        const t = (data.cell.raw as string).toUpperCase();
                        data.cell.styles.textColor = t === 'CRÍTICO' ? COLORS.status.error as any
                            : t === 'ALTO' ? COLORS.status.warning as any
                            : COLORS.text.secondary as any;
                    }
                }
            });
            // @ts-ignore
            yPos = (doc as any).lastAutoTable.finalY + 10;
        }

        // --- 11. HALLAZGOS POR SEVERIDAD (Crítico / Alto / Medio) ---
        const findings = (result as any).auditFindings as any[] | undefined;
        if (findings && findings.length > 0) {
            doc.addPage();
            yPos = 30;
            yPos = sectionHeader(doc, "11. Hallazgos de Auditoría Clasificados por Severidad", yPos, margin, pageWidth);

            // Contadores tipo dashboard
            const counts = { c: 0, h: 0, m: 0 };
            findings.forEach(f => {
                const s = (f.severity || '').toLowerCase();
                if (s.includes('crít') || s.includes('crit')) counts.c++;
                else if (s.includes('alto')) counts.h++;
                else counts.m++;
            });

            const drawCountCard = (label: string, count: number, x: number, color: RGB) => {
                doc.setFillColor(color[0], color[1], color[2]);
                doc.roundedRect(x, yPos, 50, 15, 1.5, 1.5, 'F');
                doc.setFontSize(7);
                doc.setFont(FONTS.primary, FONTS.style.bold);
                doc.setTextColor(255, 255, 255);
                doc.text(label.toUpperCase(), x + 25, yPos + 5, { align: 'center' });
                doc.setFontSize(12);
                doc.text(String(count), x + 25, yPos + 12, { align: 'center' });
            };
            drawCountCard("Críticos", counts.c, margin, COLORS.status.error);
            drawCountCard("Altos", counts.h, margin + 55, COLORS.status.warning);
            drawCountCard("Medios", counts.m, margin + 110, COLORS.text.secondary);
            yPos += 22;

            // Orden: críticos primero
            const orderWeight = (s?: string) => {
                const v = (s || '').toLowerCase();
                if (v.includes('crít') || v.includes('crit')) return 0;
                if (v.includes('alto')) return 1;
                return 2;
            };
            const sorted = [...findings].sort((a, b) => orderWeight(a.severity) - orderWeight(b.severity));

            sorted.forEach((f, idx) => {
                yPos = ensureSpace(doc, yPos, 40);

                const sev = (f.severity || 'Medio').toString();
                const sevColor = sev.toLowerCase().includes('crít') || sev.toLowerCase().includes('crit') ? COLORS.status.error
                    : sev.toLowerCase().includes('alto') ? COLORS.status.warning
                    : COLORS.text.secondary;

                // Badge lateral
                doc.setFillColor(sevColor[0], sevColor[1], sevColor[2]);
                doc.roundedRect(margin, yPos, 3, 30, 0.5, 0.5, 'F');

                // Header
                doc.setFontSize(9);
                doc.setFont(FONTS.primary, FONTS.style.bold);
                doc.setTextColor(sevColor[0], sevColor[1], sevColor[2]);
                doc.text(`[${sev.toUpperCase()}]`, margin + 6, yPos + 4);
                doc.setTextColor(COLORS.brandBlack[0], COLORS.brandBlack[1], COLORS.brandBlack[2]);
                doc.text(`${idx + 1}. ${(f.component || 'Componente').toUpperCase()}`, margin + 6 + doc.getTextWidth(`[${sev.toUpperCase()}]`) + 2, yPos + 4);
                yPos += 6;

                doc.setFont(FONTS.primary, FONTS.style.regular);
                doc.setFontSize(8);
                doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);

                const writeLabeled = (label: string, value: string, labelColor: RGB = COLORS.text.secondary) => {
                    if (!value) return;
                    yPos = ensureSpace(doc, yPos, 8);
                    doc.setFont(FONTS.primary, FONTS.style.bold);
                    doc.setTextColor(labelColor[0], labelColor[1], labelColor[2]);
                    doc.text(label, margin + 6, yPos);
                    doc.setFont(FONTS.primary, FONTS.style.regular);
                    doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
                    const lw = doc.getTextWidth(label) + 2;
                    const lines = doc.splitTextToSize(value, pageWidth - margin * 2 - 6 - lw);
                    doc.text(lines, margin + 6 + lw, yPos);
                    yPos += Math.max(4, lines.length * 4) + 1;
                };

                writeLabeled("Hallazgo:", f.finding || '-', COLORS.brandBlack);
                if (f.currentFormulation) writeLabeled("Formulación actual:", f.currentFormulation, COLORS.text.secondary);
                writeLabeled("Evidencia:", f.evidence || '-', COLORS.primaryDark);
                if (f.violatedRelation) writeLabeled("Relación afectada:", f.violatedRelation, COLORS.status.error);
                if (f.impactOnThesis) writeLabeled("Impacto:", f.impactOnThesis, COLORS.status.warning);
                writeLabeled("Corrección:", f.recommendedFix || '-', COLORS.status.success);
                if (f.priority) writeLabeled("Prioridad:", f.priority, COLORS.primary);
                yPos += 4;
            });
        }

        // --- 12. ANÁLISIS DE PLAGIO Y PATRONES DE REDACCIÓN ASISTIDA ---
        const plag = (result as any).plagiarismRiskAnalysis as any | undefined;
        const aiPat = (result as any).aiWritingPatterns as any | undefined;
        if (plag || aiPat) {
            doc.addPage();
            yPos = 30;
            yPos = sectionHeader(doc, "12. Riesgo de Plagio y Patrones de Redacción Asistida", yPos, margin, pageWidth);

            const riskColor = (lvl?: string): RGB => {
                const v = (lvl || '').toLowerCase();
                if (v === 'alto') return COLORS.status.error;
                if (v === 'medio') return COLORS.status.warning;
                return COLORS.status.success;
            };

            // Plagio
            if (plag) {
                yPos = miniHeader(doc, "Riesgo de Plagio (análisis estructural)", yPos, margin);
                const pColor = riskColor(plag.overallRiskLevel);
                doc.setFillColor(pColor[0], pColor[1], pColor[2]);
                doc.roundedRect(margin, yPos, 55, 8, 1, 1, 'F');
                doc.setFontSize(9);
                doc.setFont(FONTS.primary, FONTS.style.bold);
                doc.setTextColor(255, 255, 255);
                doc.text(`Nivel: ${(plag.overallRiskLevel || 'N/D').toUpperCase()}`, margin + 27.5, yPos + 5.5, { align: 'center' });
                yPos += 12;

                if (plag.classification) {
                    doc.setFont(FONTS.primary, FONTS.style.italic);
                    doc.setFontSize(9);
                    doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
                    const lines = doc.splitTextToSize(`Clasificación: ${plag.classification}`, pageWidth - margin * 2);
                    doc.text(lines, margin, yPos);
                    yPos += lines.length * 4.5 + 3;
                }

                if (Array.isArray(plag.signals) && plag.signals.length > 0) {
                    doc.setFont(FONTS.primary, FONTS.style.bold);
                    doc.setTextColor(COLORS.status.error[0], COLORS.status.error[1], COLORS.status.error[2]);
                    doc.setFontSize(9);
                    doc.text("Señales detectadas:", margin, yPos);
                    yPos += 5;
                    doc.setFont(FONTS.primary, FONTS.style.regular);
                    doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
                    doc.setFontSize(8);
                    plag.signals.forEach((s: string) => {
                        yPos = ensureSpace(doc, yPos, 8);
                        const lines = doc.splitTextToSize(`• ${s}`, pageWidth - margin * 2 - 4);
                        doc.text(lines, margin + 3, yPos);
                        yPos += lines.length * 4 + 1;
                    });
                    yPos += 3;
                }

                if (Array.isArray(plag.suspectExcerpts) && plag.suspectExcerpts.length > 0) {
                    doc.setFont(FONTS.primary, FONTS.style.bold);
                    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
                    doc.setFontSize(9);
                    doc.text("Fragmentos sospechosos:", margin, yPos);
                    yPos += 5;
                    doc.setFont(FONTS.primary, FONTS.style.regular);
                    doc.setFontSize(8);
                    plag.suspectExcerpts.forEach((e: any, i: number) => {
                        yPos = ensureSpace(doc, yPos, 15);
                        doc.setFont(FONTS.primary, FONTS.style.bold);
                        doc.setTextColor(COLORS.text.secondary[0], COLORS.text.secondary[1], COLORS.text.secondary[2]);
                        doc.text(`${i + 1}. ${e.page || ''}`, margin + 3, yPos);
                        yPos += 4;
                        doc.setFont(FONTS.primary, FONTS.style.italic);
                        doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
                        const exc = doc.splitTextToSize(`"${e.excerpt || ''}"`, pageWidth - margin * 2 - 6);
                        doc.text(exc, margin + 6, yPos);
                        yPos += exc.length * 4;
                        if (e.reason) {
                            doc.setFont(FONTS.primary, FONTS.style.regular);
                            doc.setTextColor(COLORS.status.warning[0], COLORS.status.warning[1], COLORS.status.warning[2]);
                            const rn = doc.splitTextToSize(`Motivo: ${e.reason}`, pageWidth - margin * 2 - 6);
                            doc.text(rn, margin + 6, yPos);
                            yPos += rn.length * 4;
                        }
                        yPos += 3;
                    });
                }
                yPos += 5;
            }

            // IA
            if (aiPat) {
                yPos = ensureSpace(doc, yPos, 30);
                yPos = miniHeader(doc, "Patrones Compatibles con Redacción Asistida (no es prueba, sólo señales)", yPos, margin);
                const aColor = riskColor(aiPat.compatibilityLevel);
                doc.setFillColor(aColor[0], aColor[1], aColor[2]);
                doc.roundedRect(margin, yPos, 55, 8, 1, 1, 'F');
                doc.setFontSize(9);
                doc.setFont(FONTS.primary, FONTS.style.bold);
                doc.setTextColor(255, 255, 255);
                doc.text(`Compatibilidad: ${(aiPat.compatibilityLevel || 'N/D').toUpperCase()}`, margin + 27.5, yPos + 5.5, { align: 'center' });
                yPos += 12;

                if (Array.isArray(aiPat.detectedPatterns) && aiPat.detectedPatterns.length > 0) {
                    doc.setFont(FONTS.primary, FONTS.style.regular);
                    doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
                    doc.setFontSize(8);
                    aiPat.detectedPatterns.forEach((pt: string) => {
                        yPos = ensureSpace(doc, yPos, 8);
                        const lines = doc.splitTextToSize(`• ${pt}`, pageWidth - margin * 2 - 4);
                        doc.text(lines, margin + 3, yPos);
                        yPos += lines.length * 4 + 1;
                    });
                }
                if (aiPat.notes) {
                    yPos = ensureSpace(doc, yPos, 8);
                    doc.setFont(FONTS.primary, FONTS.style.italic);
                    doc.setTextColor(COLORS.text.secondary[0], COLORS.text.secondary[1], COLORS.text.secondary[2]);
                    doc.setFontSize(8);
                    const lines = doc.splitTextToSize(aiPat.notes, pageWidth - margin * 2);
                    doc.text(lines, margin, yPos);
                    yPos += lines.length * 4;
                }
            }
        }

        // --- 13. CLASIFICACIÓN DE LA PROPUESTA ---
        const prop = (result as any).proposalClassification as any | undefined;
        if (prop && prop.type && prop.type !== 'no_aplica') {
            yPos = ensureSpace(doc, yPos, 40);
            if (yPos > pageHeight - 60) { doc.addPage(); yPos = 30; }
            yPos = sectionHeader(doc, "13. Clasificación de la Propuesta (Diseño vs. Implementación)", yPos, margin, pageWidth);

            const typeLabel = (prop.type || 'no_aplica').toString().toUpperCase();
            const typeColor: RGB = typeLabel.includes('IMPLEMENT') ? COLORS.status.success
                : typeLabel.includes('DISEÑ') ? COLORS.status.warning
                : typeLabel.includes('PROYECT') || typeLabel.includes('SIMUL') ? COLORS.status.error
                : COLORS.text.secondary;

            doc.setFillColor(typeColor[0], typeColor[1], typeColor[2]);
            doc.roundedRect(margin, yPos, 60, 9, 1.5, 1.5, 'F');
            doc.setFontSize(10);
            doc.setFont(FONTS.primary, FONTS.style.bold);
            doc.setTextColor(255, 255, 255);
            doc.text(typeLabel, margin + 30, yPos + 6, { align: 'center' });
            yPos += 14;

            const propField = (label: string, value: string, color: RGB) => {
                if (!value) return;
                yPos = ensureSpace(doc, yPos, 10);
                doc.setFont(FONTS.primary, FONTS.style.bold);
                doc.setTextColor(color[0], color[1], color[2]);
                doc.setFontSize(9);
                doc.text(label, margin, yPos);
                yPos += 4;
                doc.setFont(FONTS.primary, FONTS.style.regular);
                doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
                const lines = doc.splitTextToSize(value, pageWidth - margin * 2);
                doc.text(lines, margin, yPos);
                yPos += lines.length * 4.5 + 2;
            };
            propField("Evidencia en el manuscrito:", prop.evidence, COLORS.brandBlack);
            propField("Impacto reclamado por el autor:", prop.claimedImpact, COLORS.primary);
            propField("Impacto verificable con los datos:", prop.verifiableImpact, COLORS.status.success);
            if (prop.discrepancyWarning) {
                yPos = ensureSpace(doc, yPos, 15);
                doc.setFillColor(COLORS.status.error[0], COLORS.status.error[1], COLORS.status.error[2]);
                doc.roundedRect(margin, yPos, pageWidth - margin * 2, 8, 1, 1, 'F');
                doc.setFontSize(9);
                doc.setFont(FONTS.primary, FONTS.style.bold);
                doc.setTextColor(255, 255, 255);
                doc.text("⚠ ALERTA DE SOBREAFIRMACIÓN", margin + 3, yPos + 5.5);
                yPos += 11;
                doc.setFont(FONTS.primary, FONTS.style.regular);
                doc.setTextColor(COLORS.status.error[0], COLORS.status.error[1], COLORS.status.error[2]);
                const lines = doc.splitTextToSize(prop.discrepancyWarning, pageWidth - margin * 2);
                doc.text(lines, margin, yPos);
                yPos += lines.length * 4.5 + 3;
            }
        }

        // --- 14. DIAGNÓSTICO DE CIERRE ---
        const closing = (result as any).closingDiagnosis as any | undefined;
        if (closing) {
            doc.addPage();
            yPos = 30;
            yPos = sectionHeader(doc, "14. Diagnóstico Técnico de Cierre", yPos, margin, pageWidth);

            // Dos cards: estructural + metodológico
            const drawGrade = (label: string, grade: string, x: number) => {
                const c = qualityColor(grade);
                doc.setFillColor(COLORS.bg.card[0], COLORS.bg.card[1], COLORS.bg.card[2]);
                doc.roundedRect(x, yPos, 80, 22, 2, 2, 'F');
                doc.setDrawColor(c[0], c[1], c[2]);
                doc.setLineWidth(0.5);
                doc.roundedRect(x, yPos, 80, 22, 2, 2, 'S');
                doc.setFontSize(8);
                doc.setFont(FONTS.primary, FONTS.style.bold);
                doc.setTextColor(COLORS.text.secondary[0], COLORS.text.secondary[1], COLORS.text.secondary[2]);
                doc.text(label.toUpperCase(), x + 40, yPos + 7, { align: 'center' });
                doc.setFontSize(14);
                doc.setTextColor(c[0], c[1], c[2]);
                doc.text((grade || 'N/D').toUpperCase(), x + 40, yPos + 16, { align: 'center' });
            };
            drawGrade("Cumplimiento Estructural", closing.structuralCompliance, margin);
            drawGrade("Consistencia Metodológica", closing.methodologicalConsistency, margin + 85);
            yPos += 28;

            const renderList = (title: string, items: string[] | undefined, color: RGB, bullet: string) => {
                if (!items || items.length === 0) return;
                yPos = ensureSpace(doc, yPos, 15);
                doc.setFont(FONTS.primary, FONTS.style.bold);
                doc.setTextColor(color[0], color[1], color[2]);
                doc.setFontSize(10);
                doc.text(title, margin, yPos);
                yPos += 5;
                doc.setFont(FONTS.primary, FONTS.style.regular);
                doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
                doc.setFontSize(9);
                items.forEach(it => {
                    yPos = ensureSpace(doc, yPos, 8);
                    const lines = doc.splitTextToSize(`${bullet} ${it}`, pageWidth - margin * 2 - 4);
                    doc.text(lines, margin + 3, yPos);
                    yPos += lines.length * 4.5 + 1;
                });
                yPos += 4;
            };

            renderList("Principales Fortalezas", closing.mainStrengths, COLORS.status.success, "✓");
            renderList("Principales Debilidades", closing.mainWeaknesses, COLORS.status.error, "✗");
            renderList("Correcciones Críticas Requeridas", closing.criticalFixesRequired, COLORS.status.warning, "!");
            renderList("Validaciones Pendientes", closing.pendingValidations, COLORS.primary, "○");

            if (closing.technicalClosingStatement) {
                yPos = ensureSpace(doc, yPos, 30);
                doc.setFillColor(COLORS.bg.accent[0], COLORS.bg.accent[1], COLORS.bg.accent[2]);
                const boxX = margin;
                const boxW = pageWidth - margin * 2;
                const text = closing.technicalClosingStatement;
                doc.setFont(FONTS.primary, FONTS.style.italic);
                doc.setFontSize(10);
                const lines = doc.splitTextToSize(text, boxW - 10);
                const boxH = lines.length * 5 + 14;
                doc.roundedRect(boxX, yPos, boxW, boxH, 2, 2, 'F');
                doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
                doc.setLineWidth(0.5);
                doc.line(boxX, yPos, boxX, yPos + boxH);
                doc.setFont(FONTS.primary, FONTS.style.bold);
                doc.setFontSize(9);
                doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
                doc.text("DECLARACIÓN TÉCNICA DE CIERRE", boxX + 5, yPos + 6);
                doc.setFont(FONTS.primary, FONTS.style.italic);
                doc.setFontSize(10);
                doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
                doc.text(lines, boxX + 5, yPos + 12);
                yPos += boxH + 5;
            }
        }
    }
}

class ReferenceReportStrategy implements PDFReportStrategy {
    getTitle() { return "INFORME DE"; }
    getSubTitle() { return "REFERENCIAS BIBLIOGRÁFICAS"; }

    generate(doc: jsPDF, data: ReportData) {
        if (!Array.isArray(data)) return;
        const refs = data as ReferenceItem[];

        let yPos = 140;

        doc.addPage();
        yPos = PAGE_MARGIN.top;

        doc.setFontSize(FONT_SIZES.heading1);
        doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
        doc.text("LISTADO DE REFERENCIAS", PAGE_MARGIN.left, yPos);
        yPos += 15;

        const maxWidth = doc.internal.pageSize.width - PAGE_MARGIN.left - PAGE_MARGIN.right;

        refs.forEach((ref, index) => {
            yPos = ensureSpace(doc, yPos, 25);
            const work = ref.reference || {};
            const title = work.title || "Sin título";
            const authors = work.authors && Array.isArray(work.authors) ? work.authors.join(", ") : "Autor desconocido";
            const year = work.publicationYear || "s.f.";
            doc.setFontSize(FONT_SIZES.body);
            doc.setFont(FONTS.primary, FONTS.style.bold);
            doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
            doc.text(`[${index + 1}]`, PAGE_MARGIN.left, yPos);
            doc.setFont(FONTS.primary, FONTS.style.regular);
            const citation = `${authors} (${year}). ${title}.`;
            yPos = addWrappedText(doc, citation, PAGE_MARGIN.left + 10, yPos, maxWidth - 10);
            yPos += 2;
            doc.setFontSize(FONT_SIZES.small);
            const status = ref.status === 'verified' ? "[OK] VERIFICADO" : "[!] SIN VERIFICAR";
            const statusColor = ref.status === 'verified' ? COLORS.status.success : COLORS.status.error;
            doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
            doc.text(status, PAGE_MARGIN.left + 10, yPos);
            yPos += 10;
        });
    }
}

class AiAuditReportStrategy implements PDFReportStrategy {
    getTitle() { return "INFORME DE"; }
    getSubTitle() { return "AUDITORÍA DE PRENSA IA"; }

    generate(doc: jsPDF, data: ReportData) {
        const audit = data as AuditResult;
        if (typeof audit.score !== 'number') return;
        const margin = 25;
        doc.addPage();
        let yPos = 30;
        doc.setFontSize(16);
        doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
        doc.text(`PROBABILIDAD DE IA: ${(audit.score * 100).toFixed(1)}%`, margin, yPos);
        yPos += 15;
        if (audit.signals && audit.signals.length > 0) {
            doc.setFontSize(14);
            doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
            doc.text("Señales Detectadas", margin, yPos);
            yPos += 10;
            audit.signals.forEach((sig) => {
                doc.setFontSize(11);
                doc.text(`• ${sig}`, margin + 5, yPos);
                yPos += 7;
            });
            yPos += 10;
        }
        if (audit.heatmap) {
            doc.setFontSize(14);
            doc.text("Análisis de Segmentos", margin, yPos);
            yPos += 10;
            audit.heatmap.forEach((seg) => {
                const prob = seg.probability;
                const text = `[${(prob * 100).toFixed(0)}%] ${seg.text.substring(0, 100)}...`;
                if (yPos > doc.internal.pageSize.height - 20) { doc.addPage(); yPos = 30; }
                doc.setFontSize(10);
                if (prob > 0.7) doc.setTextColor(COLORS.status.error[0], COLORS.status.error[1], COLORS.status.error[2]);
                else if (prob > 0.4) doc.setTextColor(COLORS.status.warning[0], COLORS.status.warning[1], COLORS.status.warning[2]);
                else doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
                doc.text(text, margin, yPos);
                yPos += 6;
            });
        }
    }
}

class TranscriptionReportStrategy implements PDFReportStrategy {
    getTitle() { return "TRANSCRIPCIÓN"; }
    getSubTitle() { return "ENTREVISTA DE INVESTIGACIÓN"; }

    generate(doc: jsPDF, data: ReportData) {
        const trans = data as TranscriptionResult;
        if (!trans.segments) return;
        const margin = 25;
        doc.addPage();
        let yPos = 30;
        autoTable(doc, {
            startY: yPos,
            head: [['Tiempo', 'Contenido']],
            body: trans.segments.map((s) => [
                `${Math.floor(s.start / 60)}:${Math.floor(s.start % 60).toString().padStart(2, '0')}`,
                s.text
            ]),
            columnStyles: { 0: { cellWidth: 20, fontStyle: 'bold' }, 1: { cellWidth: 'auto' } }
        });
    }
}

export type ReportType = 'consistency' | 'references' | 'audit' | 'transcription';

export const exportToPDF = (type: ReportType, data: ReportData, fileName: string = 'Reporte') => {
    let strategy: PDFReportStrategy;
    switch (type) {
        case 'consistency': strategy = new ConsistencyMatrixStrategy(); break;
        case 'references': strategy = new ReferenceReportStrategy(); break;
        case 'audit': strategy = new AiAuditReportStrategy(); break;
        case 'transcription': strategy = new TranscriptionReportStrategy(); break;
        default: console.error("Unknown export type"); return;
    }
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    doc.setFillColor(COLORS.bg.accent[0], COLORS.bg.accent[1], COLORS.bg.accent[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(20, 20, pageWidth - 40, pageHeight - 40, 5, 5, 'F');
    let yPos = 80;
    doc.setFont(FONTS.primary, FONTS.style.bold);
    doc.setFontSize(24);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text("TU TESIS RD", pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont(FONTS.primary, FONTS.style.regular);
    doc.setTextColor(COLORS.text.secondary[0], COLORS.text.secondary[1], COLORS.text.secondary[2]);
    doc.text("SISTEMA DE AUDITORÍA ACADÉMICA", pageWidth / 2, yPos, { align: 'center' });
    yPos += 50;
    doc.setFontSize(28);
    doc.setFont(FONTS.primary, FONTS.style.bold);
    doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
    doc.text(strategy.getTitle(), pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;
    doc.text(strategy.getSubTitle(), pageWidth / 2, yPos, { align: 'center' });
    strategy.generate(doc, data);
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        if (i > 1) {
            addFooter(doc, i, totalPages);
        }
    }
    doc.save(`${fileName}_${new Date().getTime()}.pdf`);
};

export const generateConsistencyMatrixPDF = (result: ConsistencyAnalysisResult, fileName?: string) => {
    exportToPDF('consistency', result, fileName);
};
