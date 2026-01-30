/**
 * Frontend Word Export Service (Presentation Layer)
 * Renders strict WordExportDTO structures into DOCX files.
 * Zero dependency on Analysis logic.
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
    PageBreak,
    BorderStyle
} from 'docx';
import { saveAs } from 'file-saver';
import { WordExportDTO, WordExportSection } from '../types/schemas';

// --- Rendering Helpers ---

const renderText = (content: string, styling: any = {}) => {
    return new Paragraph({
        children: [
            new TextRun({
                text: content,
                bold: styling.bold,
                size: styling.size ? styling.size * 2 : 24, // Half-points to points roughly (API uses half-points)
                color: styling.color ? styling.color.replace('#', '') : '1e293b', // Default slate-800
                font: 'Arial'
            })
        ],
        alignment: styling.align === 'center' ? AlignmentType.CENTER :
            styling.align === 'right' ? AlignmentType.RIGHT :
                styling.align === 'justify' ? AlignmentType.JUSTIFIED : AlignmentType.LEFT,
        spacing: { before: 120, after: 120 }
    });
};

const renderTable = (data: NonNullable<WordExportSection['tableData']>) => {
    const headerRow = new TableRow({
        tableHeader: true,
        children: data.headers.map(header =>
            new TableCell({
                children: [new Paragraph({
                    children: [new TextRun({ text: header, bold: true, color: 'ffffff' })],
                    alignment: AlignmentType.CENTER
                })],
                shading: { fill: '475569' }, // Header bg
                verticalAlign: 'center',
                margins: { top: 100, bottom: 100, left: 100, right: 100 }
            })
        )
    });

    const bodyRows = data.rows.map(row =>
        new TableRow({
            children: row.map(cellText =>
                new TableCell({
                    children: [new Paragraph(cellText)],
                    margins: { top: 100, bottom: 100, left: 100, right: 100 }
                })
            )
        })
    );

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [headerRow, ...bodyRows],
        borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "e2e8f0" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "e2e8f0" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "e2e8f0" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "e2e8f0" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "e2e8f0" },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "e2e8f0" }
        }
    });
};

// --- Main Generator ---

export const generateWordDocument = async (dto: WordExportDTO, filename: string = 'export.docx') => {
    const docChildren: any[] = [];

    // 1. Metadata / Header (Simplified visual header)
    docChildren.push(new Paragraph({
        text: dto.metadata.title.toUpperCase(),
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
    }));

    docChildren.push(new Paragraph({
        children: [
            new TextRun({
                text: `Generado por ${dto.metadata.creator} | ${dto.metadata.date}`,
                size: 20,
                color: '94a3b8'
            })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 }
    }));

    // 2. Render Sections
    dto.sections.forEach(section => {
        switch (section.type) {
            case 'heading1':
                docChildren.push(new Paragraph({
                    text: section.content?.toUpperCase(),
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 400, after: 200 }
                }));
                break;
            case 'heading2':
                docChildren.push(new Paragraph({
                    text: section.content,
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 150 }
                }));
                break;
            case 'text':
                if (section.content) {
                    docChildren.push(renderText(section.content, section.styling));
                }
                break;
            case 'list':
                if (section.content) {
                    docChildren.push(new Paragraph({
                        text: "• " + section.content, // Simple bullet fallback
                        spacing: { before: 50, after: 50 },
                        indent: { left: 720, hanging: 360 }
                    }));
                }
                break;
            case 'table':
                if (section.tableData) {
                    docChildren.push(renderTable(section.tableData));
                    docChildren.push(new Paragraph("")); // Spacer
                }
                break;
            case 'page_break':
                docChildren.push(new Paragraph({ children: [new PageBreak()] }));
                break;
        }
    });

    const doc = new Document({
        creator: dto.metadata.creator,
        title: dto.metadata.title,
        description: dto.metadata.subtitle,
        sections: [{
            properties: {},
            children: docChildren
        }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
};

export const wordExportService = {
    generateWordDocument
};
