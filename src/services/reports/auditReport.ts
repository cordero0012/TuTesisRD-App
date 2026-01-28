
import { AiDetectionResult } from '../analysis/detection';

export const generateAuditPDF = async (result: AiDetectionResult, documentName: string = 'Documento Analizado') => {
    try {
        const { jsPDF } = await import('jspdf');
        const autoTable = (await import('jspdf-autotable')).default;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        // --- Header ---
        doc.setFillColor(19, 91, 236); // Primary Blue
        doc.rect(0, 0, pageWidth, 25, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Informe de Auditoría Forense de IA", 14, 16);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Generado por ScholarAI - ${new Date().toLocaleDateString()}`, 14, 22);

        let yPos = 35;

        // --- Summary Section ---
        doc.setTextColor(40, 44, 52);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("1. Resumen Ejecutivo", 14, yPos);
        yPos += 10;

        // Score Box
        doc.setFillColor(245, 247, 250);
        doc.roundedRect(14, yPos, pageWidth - 28, 35, 3, 3, 'F');

        const isHuman = result.score < 0.4;
        const color = isHuman ? [16, 185, 129] : [239, 68, 68]; // Green or Red
        doc.setTextColor(color[0], color[1], color[2]);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text(`${(result.score * 100).toFixed(0)}%`, 20, yPos + 18);

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Probabilidad de Autoría IA", 20, yPos + 26);

        // Veredict
        doc.setFontSize(14);
        doc.setTextColor(40, 44, 52);
        doc.setFont("helvetica", "bold");
        const veredict = isHuman ? "DOCUMENTO AUTÉNTICO" : "PATRÓN SINTÉTICO DETECTADO";
        doc.text(veredict, 60, yPos + 15);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Nivel de Confianza: ${result.confidence || 'Media'}`, 60, yPos + 22);

        yPos += 45;

        // --- Metrics Section ---
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("2. Métricas Estilométricas", 14, yPos);
        yPos += 8;

        const metricsData = [
            ['Métrica', 'Valor', 'Interpretación'],
            ['Burstiness (Variabilidad)', result.metrics.burstiness.toFixed(2), result.metrics.burstiness < 4 ? 'Baja (Sospechoso)' : 'Normal'],
            ['Perplejidad (Proxy)', result.metrics.perplexityProxy.toFixed(2), result.metrics.perplexityProxy < 0.4 ? 'Baja (Sospechoso)' : 'Normal'],
            ['Diversidad Léxica', result.metrics.lexicalDiversity.toFixed(2), '-']
        ];

        // @ts-ignore
        autoTable(doc, {
            startY: yPos,
            head: [metricsData[0]],
            body: metricsData.slice(1),
            theme: 'grid',
            headStyles: { fillColor: [240, 240, 240], textColor: [50, 50, 50], fontStyle: 'bold' },
            styles: { fontSize: 9, cellPadding: 3 },
            columnStyles: { 0: { fontStyle: 'bold' } }
        });

        // @ts-ignore
        yPos = doc.lastAutoTable.finalY + 15;

        // --- Signals Section ---
        if (result.signals && result.signals.length > 0) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("3. Señales de IA Detectadas", 14, yPos);
            yPos += 8;

            result.signals.forEach(sig => {
                doc.setFillColor(254, 242, 242); // Light red
                doc.rect(14, yPos, pageWidth - 28, 8, 'F');
                doc.setTextColor(185, 28, 28);
                doc.setFontSize(9);
                doc.text(`• ${sig}`, 18, yPos + 6);
                yPos += 10;
            });
            yPos += 5;
        }

        // --- Source Probability ---
        if (result.sourceProbabilities) {
            if (yPos > pageHeight - 50) { doc.addPage(); yPos = 20; }

            doc.setFillColor(40, 44, 52);
            doc.setTextColor(40, 44, 52);
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("4. Análisis de Fuente Probable", 14, yPos);
            yPos += 8;

            const sources = [
                { name: 'ChatGPT / OpenAI', score: result.sourceProbabilities.chatgpt },
                { name: 'Gemini / Google', score: result.sourceProbabilities.gemini },
                { name: 'Claude / Anthropic', score: result.sourceProbabilities.claude }
            ];

            sources.sort((a, b) => b.score - a.score).forEach(source => {
                doc.setFontSize(10);
                doc.setFont("helvetica", "normal");
                doc.text(`${source.name}: ${source.score}%`, 14, yPos);

                // Bar
                doc.setFillColor(230, 230, 230);
                doc.rect(60, yPos - 3, 100, 3, 'F');
                doc.setFillColor(19, 91, 236);
                doc.rect(60, yPos - 3, source.score, 3, 'F');

                yPos += 8;
            });
        }

        doc.save(`Auditoria_IA_${documentName.substring(0, 15)}.pdf`);
        return true;

    } catch (error) {
        console.error("Error generating Audit PDF:", error);
        throw error;
    }
};
