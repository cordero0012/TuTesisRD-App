
/**
 * Frontend Word Export Service
 * Generates DOCX files directly in the browser without Python dependency
 */

import {
    Document,
    Paragraph,
    TextRun,
    HeadingLevel,
    Table,
    TableRow,
    TableCell,
    WidthType,
    AlignmentType,
    Packer,
    PageBreak
} from 'docx';
import { saveAs } from 'file-saver';

// Types
interface ReferenceValidationResult {
    reference: {
        title: string;
        authors?: string[];
        publicationYear?: number;
        doi?: string;
        hostVenue?: string;
    };
    status: string;
    score: number;
    sources?: string[];
}

interface AuditResult {
    score: number;
    metrics?: {
        burstiness?: number;
        perplexityProxy?: number;
        lexicalDiversity?: number;
    };
    sourceProbabilities?: {
        chatgpt?: number;
        gemini?: number;
        claude?: number;
    };
    signals?: string[];
    heatmap?: Array<{ text: string; probability: number }>;
}

interface MatrixAnalysis {
    globalDiagnosis?: {
        score?: number;
        summary?: string;
    };
    consistencyMatrix?: Array<{
        element: string;
        status: string;
        observations?: string;
    }>;
}

// Helper: Create a styled paragraph
const createStyledParagraph = (text: string, options: {
    bold?: boolean;
    size?: number;
    color?: string;
    alignment?: typeof AlignmentType[keyof typeof AlignmentType];
    spacing?: { before?: number; after?: number };
} = {}) => {
    return new Paragraph({
        children: [
            new TextRun({
                text,
                bold: options.bold || false,
                size: options.size || 24, // 12pt
                color: options.color || '000000',
                font: 'Arial'
            })
        ],
        alignment: options.alignment || AlignmentType.LEFT,
        spacing: options.spacing || { before: 100, after: 100 }
    });
};

// Helper: Create a section header
const createSectionHeader = (text: string, level: typeof HeadingLevel[keyof typeof HeadingLevel] = HeadingLevel.HEADING_1) => {
    return new Paragraph({
        text,
        heading: level,
        spacing: { before: 300, after: 200 }
    });
};

/**
 * Export validated references to Word
 */
export const exportReferencesToWord = async (results: ReferenceValidationResult[], citationStyle: string = 'APA 7') => {
    const verified = results.filter(r => r.status === 'verified' || r.status === 'valid_no_doi');
    const needsReview = results.filter(r => r.status === 'needs_review');
    const notFound = results.filter(r => r.status === 'not_found');

    const doc = new Document({
        creator: 'ScholarAI',
        title: 'Informe de Validación Bibliográfica',
        description: 'Reporte generado por ScholarAI',
        sections: [{
            properties: {},
            children: [
                // Cover
                createSectionHeader('INFORME DE VALIDACIÓN BIBLIOGRÁFICA', HeadingLevel.TITLE),
                createStyledParagraph('ScholarAI - Verificación Académica Multifuente', {
                    size: 20,
                    color: '666666',
                    alignment: AlignmentType.CENTER
                }),
                createStyledParagraph(`Fecha: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`, {
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 400 }
                }),
                createStyledParagraph(`Estilo de Citación: ${citationStyle}`, {
                    alignment: AlignmentType.CENTER
                }),
                createStyledParagraph(`Total de Referencias: ${results.length}`, {
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 600 }
                }),

                // Summary Table
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ children: [createStyledParagraph('Estado', { bold: true })], width: { size: 50, type: WidthType.PERCENTAGE } }),
                                new TableCell({ children: [createStyledParagraph('Cantidad', { bold: true })], width: { size: 50, type: WidthType.PERCENTAGE } })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [createStyledParagraph('✓ Verificadas')] }),
                                new TableCell({ children: [createStyledParagraph(String(verified.length))] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [createStyledParagraph('⚠ Requieren Revisión')] }),
                                new TableCell({ children: [createStyledParagraph(String(needsReview.length))] })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [createStyledParagraph('✗ No Encontradas')] }),
                                new TableCell({ children: [createStyledParagraph(String(notFound.length))] })
                            ]
                        })
                    ]
                }),

                // Page break
                new Paragraph({ children: [new PageBreak()] }),

                // Verified References
                createSectionHeader('REFERENCIAS VERIFICADAS', HeadingLevel.HEADING_1),

                ...verified.flatMap((r, idx) => [
                    createStyledParagraph(`${idx + 1}. ${r.reference.title}`, { bold: true, size: 22 }),
                    createStyledParagraph(`Autores: ${r.reference.authors?.join(', ') || 'No especificado'}`, { size: 20, color: '444444' }),
                    createStyledParagraph(`Año: ${r.reference.publicationYear || 'N/A'} | Fuente: ${r.reference.hostVenue || 'N/A'}`, { size: 20, color: '444444' }),
                    r.reference.doi ? createStyledParagraph(`DOI: ${r.reference.doi}`, { size: 18, color: '0066cc' }) : createStyledParagraph(''),
                    createStyledParagraph(`Score de Confianza: ${r.score}%`, { size: 18, color: r.score >= 80 ? '22c55e' : 'f59e0b' }),
                    createStyledParagraph('', { spacing: { after: 200 } })
                ]),

                // Needs Review Section
                ...(needsReview.length > 0 ? [
                    new Paragraph({ children: [new PageBreak()] }),
                    createSectionHeader('REFERENCIAS QUE REQUIEREN REVISIÓN', HeadingLevel.HEADING_1),
                    ...needsReview.flatMap((r, idx) => [
                        createStyledParagraph(`${idx + 1}. ${r.reference.title}`, { bold: true, size: 22 }),
                        createStyledParagraph(`Estado: ${r.status} | Score: ${r.score}%`, { size: 20, color: 'f59e0b' }),
                        createStyledParagraph('', { spacing: { after: 200 } })
                    ])
                ] : [])
            ]
        }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Validacion_Referencias_${Date.now()}.docx`);
};

/**
 * Export AI Audit results to Word
 */
export const exportAuditToWord = async (result: AuditResult, sourceText?: string) => {
    const riskLevel = result.score > 0.6 ? 'ALTO' : result.score > 0.3 ? 'MEDIO' : 'BAJO';
    const riskColor = result.score > 0.6 ? 'dc2626' : result.score > 0.3 ? 'f59e0b' : '22c55e';

    const children: (Paragraph | Table)[] = [
        // Cover
        createSectionHeader('INFORME DE AUDITORÍA FORENSE DE IA', HeadingLevel.TITLE),
        createStyledParagraph('ScholarAI - Laboratorio de Integridad Académica', {
            size: 20,
            color: '666666',
            alignment: AlignmentType.CENTER
        }),
        createStyledParagraph(`Fecha: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`, {
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 600 }
        }),

        // Main Result
        createSectionHeader('RESULTADO PRINCIPAL', HeadingLevel.HEADING_1),
        createStyledParagraph(`Probabilidad de contenido generado por IA: ${(result.score * 100).toFixed(1)}%`, {
            bold: true,
            size: 28,
            color: riskColor,
            alignment: AlignmentType.CENTER
        }),
        createStyledParagraph(`Nivel de Riesgo: ${riskLevel}`, {
            bold: true,
            size: 24,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
        }),

        // Metrics
        createSectionHeader('MÉTRICAS FORENSES', HeadingLevel.HEADING_1),
        createStyledParagraph(`Burstiness (Variabilidad): ${result.metrics?.burstiness?.toFixed(2) || 'N/A'}`, { size: 22 }),
        createStyledParagraph(`Perplejidad Proxy: ${result.metrics?.perplexityProxy?.toFixed(2) || 'N/A'}`, { size: 22 }),
        createStyledParagraph(`Diversidad Léxica: ${result.metrics?.lexicalDiversity?.toFixed(2) || 'N/A'}`, { size: 22, spacing: { after: 300 } }),

        // Source Probabilities
        createSectionHeader('PROBABILIDAD POR FUENTE', HeadingLevel.HEADING_1),
        createStyledParagraph(`ChatGPT: ${result.sourceProbabilities?.chatgpt || 0}%`, { size: 22 }),
        createStyledParagraph(`Gemini: ${result.sourceProbabilities?.gemini || 0}%`, { size: 22 }),
        createStyledParagraph(`Claude: ${result.sourceProbabilities?.claude || 0}%`, { size: 22, spacing: { after: 300 } })
    ];

    // Signals
    if (result.signals && result.signals.length > 0) {
        children.push(createSectionHeader('SEÑALES DETECTADAS', HeadingLevel.HEADING_1));
        result.signals.forEach(sig => {
            children.push(createStyledParagraph(`⚠ ${sig}`, { size: 22, color: 'dc2626' }));
        });
    }

    // Heatmap Summary
    if (result.heatmap && result.heatmap.length > 0) {
        children.push(new Paragraph({ children: [new PageBreak()] }));
        children.push(createSectionHeader('ANÁLISIS POR SEGMENTOS', HeadingLevel.HEADING_1));

        result.heatmap.forEach((seg, idx) => {
            const segColor = seg.probability > 0.7 ? 'dc2626' : seg.probability > 0.4 ? 'f59e0b' : '22c55e';
            children.push(createStyledParagraph(`Segmento ${idx + 1} (${(seg.probability * 100).toFixed(0)}% riesgo)`, {
                bold: true,
                size: 20,
                color: segColor
            }));
            children.push(createStyledParagraph(seg.text.substring(0, 500) + (seg.text.length > 500 ? '...' : ''), {
                size: 20,
                spacing: { after: 200 }
            }));
        });
    }

    const doc = new Document({
        creator: 'ScholarAI',
        title: 'Informe de Auditoría Forense de IA',
        sections: [{ properties: {}, children }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Auditoria_IA_${Date.now()}.docx`);
};

/**
 * Export Consistency Matrix analysis to Word
 */
export const exportMatrixToWord = async (analysis: MatrixAnalysis, documentType?: string) => {
    const children: (Paragraph | Table)[] = [
        createSectionHeader('INFORME DE MATRIZ DE CONSISTENCIA', HeadingLevel.TITLE),
        createStyledParagraph('ScholarAI - Evaluación de Coherencia Metodológica', {
            size: 20,
            color: '666666',
            alignment: AlignmentType.CENTER
        }),
        createStyledParagraph(`Tipo de Documento: ${documentType || 'Tesis Doctoral'}`, {
            alignment: AlignmentType.CENTER,
            spacing: { before: 200 }
        }),
        createStyledParagraph(`Fecha: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`, {
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 }
        })
    ];

    // Global Diagnosis
    if (analysis.globalDiagnosis) {
        children.push(createSectionHeader('DIAGNÓSTICO GLOBAL', HeadingLevel.HEADING_1));
        if (analysis.globalDiagnosis.score !== undefined) {
            children.push(createStyledParagraph(`Puntuación General: ${analysis.globalDiagnosis.score}/100`, {
                bold: true,
                size: 28,
                alignment: AlignmentType.CENTER
            }));
        }
        if (analysis.globalDiagnosis.summary) {
            children.push(createStyledParagraph(analysis.globalDiagnosis.summary, {
                size: 22,
                spacing: { after: 400 }
            }));
        }
    }

    // Consistency Matrix Table
    if (analysis.consistencyMatrix && analysis.consistencyMatrix.length > 0) {
        children.push(createSectionHeader('MATRIZ DE CONSISTENCIA', HeadingLevel.HEADING_1));

        const tableRows = [
            new TableRow({
                children: [
                    new TableCell({
                        children: [createStyledParagraph('Elemento', { bold: true })],
                        width: { size: 30, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                        children: [createStyledParagraph('Estado', { bold: true })],
                        width: { size: 20, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                        children: [createStyledParagraph('Observaciones', { bold: true })],
                        width: { size: 50, type: WidthType.PERCENTAGE }
                    })
                ]
            }),
            ...analysis.consistencyMatrix.map(item => new TableRow({
                children: [
                    new TableCell({ children: [createStyledParagraph(item.element)] }),
                    new TableCell({ children: [createStyledParagraph(item.status)] }),
                    new TableCell({ children: [createStyledParagraph(item.observations || '-')] })
                ]
            }))
        ];

        children.push(new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows
        }));
    }

    const doc = new Document({
        creator: 'ScholarAI',
        title: 'Informe de Matriz de Consistencia',
        sections: [{ properties: {}, children }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Matriz_Consistencia_${Date.now()}.docx`);
};

export const wordExportService = {
    exportReferencesToWord,
    exportAuditToWord,
    exportMatrixToWord
};
