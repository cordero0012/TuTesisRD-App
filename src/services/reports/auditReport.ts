
import { AiDetectionResult } from '../analysis/detection';

const fmt = (n: number | undefined, digits = 2): string =>
    typeof n === 'number' && isFinite(n) ? n.toFixed(digits) : 'N/D';

const sanitizeFilename = (name: string): string =>
    (name || 'Documento').replace(/[^\w\-]+/g, '_').substring(0, 30) || 'Documento';

const categoryLabel = (cat?: string): string => {
    switch (cat) {
        case 'A': return 'A - Autoría Humana';
        case 'B': return 'B - Mixto / Edición IA';
        case 'C': return 'C - Probable IA';
        case 'D': return 'D - Altamente Probable IA';
        default: return 'Sin categorizar';
    }
};

export const generateAuditPDF = async (result: AiDetectionResult, documentName: string = 'Documento Analizado') => {
    try {
        const { jsPDF } = await import('jspdf');
        const autoTable = (await import('jspdf-autotable')).default;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        // --- Header ---
        doc.setFillColor(19, 91, 236);
        doc.rect(0, 0, pageWidth, 25, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Informe de Auditoría Forense de IA", 14, 16);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Tu Tesis RD - ${new Date().toLocaleDateString('es-ES')}`, 14, 22);

        let yPos = 35;

        // --- 1. Resumen Ejecutivo ---
        doc.setTextColor(40, 44, 52);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("1. Resumen Ejecutivo", 14, yPos);
        yPos += 10;

        const score = typeof result.score === 'number' ? result.score : 0;
        const isHuman = score < 0.4;
        const color = isHuman ? [16, 185, 129] : [239, 68, 68];

        doc.setFillColor(245, 247, 250);
        doc.roundedRect(14, yPos, pageWidth - 28, 40, 3, 3, 'F');

        doc.setTextColor(color[0], color[1], color[2]);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text(`${(score * 100).toFixed(0)}%`, 20, yPos + 18);

        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text("Probabilidad de Autoría IA", 20, yPos + 26);

        doc.setFontSize(14);
        doc.setTextColor(40, 44, 52);
        doc.setFont("helvetica", "bold");
        const veredict = isHuman ? "DOCUMENTO AUTÉNTICO" : "PATRÓN SINTÉTICO DETECTADO";
        doc.text(veredict, 60, yPos + 14);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Categoría: ${categoryLabel(result.category)}`, 60, yPos + 22);
        doc.text(`Nivel de Confianza: ${result.confidence || 'Media'}`, 60, yPos + 30);

        yPos += 50;

        // --- 2. Métricas Estilométricas ---
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40, 44, 52);
        doc.text("2. Métricas Estilométricas", 14, yPos);
        yPos += 8;

        const m = result.metrics;
        const burstiness = m?.burstiness;
        const perplexity = m?.perplexityProxy;
        const lexical = m?.lexicalDiversity;

        const metricsBody = [
            [
                'Burstiness (Variabilidad)',
                fmt(burstiness),
                typeof burstiness === 'number' ? (burstiness < 4 ? 'Baja (Sospechoso)' : 'Normal') : 'N/D'
            ],
            [
                'Perplejidad (Proxy)',
                fmt(perplexity),
                typeof perplexity === 'number' ? (perplexity < 0.4 ? 'Baja (Sospechoso)' : 'Normal') : 'N/D'
            ],
            [
                'Diversidad Léxica',
                fmt(lexical),
                typeof lexical === 'number' ? (lexical < 0.4 ? 'Vocabulario repetitivo' : 'Variedad adecuada') : 'N/D'
            ]
        ];

        autoTable(doc, {
            startY: yPos,
            head: [['Métrica', 'Valor', 'Interpretación']],
            body: metricsBody,
            theme: 'grid',
            headStyles: { fillColor: [240, 240, 240], textColor: [50, 50, 50], fontStyle: 'bold' },
            styles: { fontSize: 9, cellPadding: 3 },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 }, 1: { cellWidth: 30, halign: 'center' }, 2: { cellWidth: 'auto' } }
        });

        yPos = (doc as any).lastAutoTable.finalY + 15;

        // --- 3. Señales Detectadas ---
        if (result.signals && result.signals.length > 0) {
            if (yPos > pageHeight - 40) { doc.addPage(); yPos = 20; }
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(40, 44, 52);
            doc.text("3. Señales de IA Detectadas", 14, yPos);
            yPos += 8;

            result.signals.forEach(sig => {
                if (yPos > pageHeight - 20) { doc.addPage(); yPos = 20; }
                const lines = doc.splitTextToSize(`- ${sig}`, pageWidth - 36);
                const blockHeight = lines.length * 5 + 3;
                doc.setFillColor(254, 242, 242);
                doc.rect(14, yPos - 4, pageWidth - 28, blockHeight, 'F');
                doc.setTextColor(185, 28, 28);
                doc.setFontSize(9);
                doc.setFont("helvetica", "normal");
                doc.text(lines, 18, yPos);
                yPos += blockHeight + 2;
            });
            yPos += 5;
        }

        // --- 4. Fuente Probable ---
        if (result.sourceProbabilities) {
            if (yPos > pageHeight - 60) { doc.addPage(); yPos = 20; }

            doc.setTextColor(40, 44, 52);
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("4. Análisis de Fuente Probable", 14, yPos);
            yPos += 10;

            const sources = [
                { name: 'ChatGPT / OpenAI', score: result.sourceProbabilities.chatgpt ?? 0 },
                { name: 'Gemini / Google', score: result.sourceProbabilities.gemini ?? 0 },
                { name: 'Claude / Anthropic', score: result.sourceProbabilities.claude ?? 0 }
            ];

            sources.sort((a, b) => b.score - a.score).forEach(source => {
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(40, 44, 52);
                doc.text(`${source.name}: ${source.score}%`, 14, yPos);

                const barW = Math.max(0, Math.min(100, source.score));
                doc.setFillColor(230, 230, 230);
                doc.rect(80, yPos - 3, 100, 3, 'F');
                doc.setFillColor(19, 91, 236);
                doc.rect(80, yPos - 3, barW, 3, 'F');

                yPos += 8;
            });
            yPos += 5;
        }

        // --- Footer ---
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Tu Tesis RD - Auditoría Forense IA`, 14, pageHeight - 8);
            doc.text(`Página ${i} de ${totalPages}`, pageWidth - 14, pageHeight - 8, { align: 'right' });
        }

        doc.save(`Auditoria_IA_${sanitizeFilename(documentName)}.pdf`);
        return true;

    } catch (error) {
        console.error("Error generating Audit PDF:", error);
        throw error;
    }
};
