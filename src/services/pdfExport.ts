import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ConsistencyAnalysisResult } from './consistency/matrixAnalyzer';
import { ReportData, ReferenceItem, AuditResult, TranscriptionResult } from '../types/core';

// Professional Academic Document Constants
const PAGE_MARGIN = { top: 20, bottom: 20, left: 25, right: 20 };
const FONTS = { primary: "helvetica", style: { regular: "normal", bold: "bold", italic: "italic" } };
const FONT_SIZES = { title: 24, subtitle: 18, heading1: 16, heading2: 14, body: 11, small: 9, tiny: 8 };
const COLORS = {
    primary: [19, 91, 236],
    text: { main: [40, 44, 52], secondary: [100, 100, 100], light: [150, 150, 150] },
    status: { success: [16, 185, 129], warning: [245, 158, 11], error: [239, 68, 68] },
    bg: { header: [247, 248, 250], accent: [240, 244, 255] }
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

class ConsistencyMatrixStrategy implements PDFReportStrategy {
    getTitle() { return "INFORME DE"; }
    getSubTitle() { return "CONSISTENCIA METODOLÓGICA"; }

    generate(doc: jsPDF, result: ConsistencyAnalysisResult) {
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 25;
        let yPos = 135; // Start after cover header

        // Metadata
        const addMeta = (label: string, value: string) => {
            doc.setFontSize(11);
            doc.setFont(FONTS.primary, FONTS.style.bold);
            doc.setTextColor(COLORS.text.secondary[0], COLORS.text.secondary[1], COLORS.text.secondary[2]);
            doc.text(label, 40, yPos);
            doc.setFont(FONTS.primary, FONTS.style.regular);
            doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
            doc.text(value, 80, yPos);
            yPos += 8;
        };

        addMeta("DOCUMENTO:", result.documentType || "Tesis de Grado");
        addMeta("ENFOQUE:", result.methodologicalApproach || "No identificado");
        addMeta("ÁREA:", result.disciplinaryArea || "Multidisciplinar");
        addMeta("NORMATIVA:", result.applicableStandards.join(', ') || "Estándar General");

        // Page 2: Content
        doc.addPage();
        yPos = 30;

        // 1. Diagnosis
        doc.setFontSize(16);
        doc.setFont(FONTS.primary, FONTS.style.bold);
        doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
        doc.text("1. DIAGNÓSTICO GLOBAL", margin, yPos);
        yPos += 15;

        // Score Cards
        const drawScore = (label: string, value: string | number, x: number) => {
            doc.setFillColor(COLORS.bg.header[0], COLORS.bg.header[1], COLORS.bg.header[2]);
            doc.roundedRect(x, yPos, 50, 25, 3, 3, 'F');
            doc.setFontSize(8); doc.setFont(FONTS.primary, FONTS.style.bold);
            doc.setTextColor(COLORS.text.secondary[0], COLORS.text.secondary[1], COLORS.text.secondary[2]);
            doc.text(label.toUpperCase(), x + 25, yPos + 8, { align: 'center' });
            doc.setFontSize(14);
            doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
            doc.text(String(value), x + 25, yPos + 18, { align: 'center' });
        };

        drawScore("Nivel General", result.globalDiagnosis.level, margin);
        drawScore("Consistencia", `${result.globalDiagnosis.internalConsistencyDegree}%`, margin + 40);
        drawScore("APA 7", `${result.normativeCompliance?.apa7Score || 0}%`, margin + 80);
        drawScore("Publicabilidad", `${result.globalDiagnosis.publishabilityLevel}%`, margin + 120);
        yPos += 40;

        // 2. Matrix Table
        doc.setFontSize(16); doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
        doc.text("2. MATRIZ DE ALINEACIÓN", margin, yPos);
        yPos += 5;

        autoTable(doc, {
            startY: yPos,
            head: [['Componente', 'Contenido Detectado', 'Estado', 'Observación']],
            body: result.consistencyMatrix.map(row => [
                row.element,
                row.description || 'No detectado',
                row.coherenceLevel.toUpperCase(),
                row.technicalObservation || 'Sin observaciones'
            ]),
            theme: 'plain',
            headStyles: { fillColor: [240, 240, 240], textColor: [40, 44, 52], fontStyle: 'bold' },
            styles: { fontSize: 9, cellPadding: 4, textColor: [40, 44, 52] },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 35 }, 1: { cellWidth: 65 }, 2: { halign: 'center', cellWidth: 25 }, 3: { cellWidth: 'auto' } },
            didParseCell: (data) => {
                if (data.section === 'body' && data.column.index === 2) {
                    const text = data.cell.raw as string;
                    data.cell.styles.textColor = (text === 'BAJA' || text === 'INEXISTENTE') ? COLORS.status.error as any : (text === 'MEDIA' ? COLORS.status.warning as any : COLORS.status.success as any);
                }
            }
        });

        // @ts-ignore
        yPos = (doc as any).lastAutoTable.finalY + 15;

        // 2.5 Source Consistency Sub-matrix
        if (result.sourceConsistencySubMatrix) {
            if (yPos > pageHeight - 60) { doc.addPage(); yPos = 30; }
            doc.setFontSize(16); doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
            doc.text("2.5 SUB-MATRIZ DE FUENTES (APA 7)", margin, yPos);
            yPos += 10;

            autoTable(doc, {
                startY: yPos,
                head: [['Cita en Texto', 'En Bibliografía', 'Página']],
                body: result.sourceConsistencySubMatrix.citationsFound.map(item => [
                    item.citation,
                    item.inBibliography ? 'SÍ' : 'NO',
                    item.page
                ]),
                theme: 'striped',
                headStyles: { fillColor: [70, 70, 70], textColor: [255, 255, 255] },
                styles: { fontSize: 8 },
                didParseCell: (data) => {
                    if (data.section === 'body' && data.column.index === 1) {
                        const text = data.cell.raw as string;
                        data.cell.styles.textColor = (text === 'NO') ? COLORS.status.error as any : COLORS.status.success as any;
                        data.cell.styles.fontStyle = 'bold';
                    }
                }
            });

            // @ts-ignore
            yPos = (doc as any).lastAutoTable.finalY + 15;
        }

        // 3. Recommendations
        if (yPos > pageHeight - 50) { doc.addPage(); yPos = 30; }
        doc.setFontSize(16); doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
        doc.text("3. PLAN DE ACCIÓN", margin, yPos);
        yPos += 15;

        result.prioritizedRecommendations.forEach((rec, idx) => {
            if (yPos > pageHeight - 40) { doc.addPage(); yPos = 30; }
            const title = `${idx + 1}. ${rec.what} (${rec.priority})`;
            doc.setFontSize(11); doc.setFont(FONTS.primary, FONTS.style.bold);
            doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);
            doc.text(title, margin, yPos);
            yPos += 6;
            doc.setFont(FONTS.primary, FONTS.style.regular);
            doc.setFontSize(9);
            const whyText = doc.splitTextToSize(`Por qué: ${rec.why}`, pageWidth - margin * 2);
            doc.text(whyText, margin, yPos);
            yPos += (whyText.length * 5) + 2;
            const howText = doc.splitTextToSize(`Cómo: ${rec.how}`, pageWidth - margin * 2);
            doc.text(howText, margin, yPos);
            yPos += (howText.length * 5) + 8;
        });

        // 4. Actionable Feedback
        if (result.actionableFeedback && result.actionableFeedback.length > 0) {
            doc.addPage();
            yPos = 30;
            doc.setFontSize(16); doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
            doc.text("4. FEEDBACK DE MEJORA DIRECTA", margin, yPos);
            yPos += 15;

            result.actionableFeedback.forEach((fb, idx) => {
                if (yPos > pageHeight - 50) { doc.addPage(); yPos = 30; }

                doc.setFontSize(10); doc.setFont(FONTS.primary, FONTS.style.bold);
                doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
                doc.text(`Hallazgo: ${fb.finding}`, margin, yPos);
                yPos += 6;

                doc.setFont(FONTS.primary, FONTS.style.regular);
                doc.setFontSize(9);
                doc.setTextColor(COLORS.text.main[0], COLORS.text.main[1], COLORS.text.main[2]);

                const feedbackLines = [
                    [`Evidencia:`, fb.evidence],
                    [`Justificación:`, fb.whyItMatters],
                    [`Corrección:`, fb.howToFix],
                    [`Ejemplo:`, fb.example]
                ];

                feedbackLines.forEach(([label, value]) => {
                    const lines = doc.splitTextToSize(`${label} ${value}`, pageWidth - margin * 2 - 5);
                    doc.text(lines, margin + 5, yPos);
                    yPos += (lines.length * 5);
                });
                yPos += 8;
            });
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
            const status = ref.status === 'verified' ? "✓ VERIFICADO" : "⚠ SIN VERIFICAR";
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
