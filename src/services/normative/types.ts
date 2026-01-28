import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// TYPE DEFINITIONS - Deep Normative Analysis
// ═══════════════════════════════════════════════════════════════

export interface TOCEntry {
    level: number;              // 1 = Chapter, 2 = Section, 3 = Subsection
    title: string;
    page?: number | string;
    children?: TOCEntry[];
}

export interface ChapterMetadata {
    number?: string | number;
    title: string;
    startPage: number;
    endPage?: number;
    requirements: string[];     // Specific requirements for this chapter
}

export interface SectionMetadata {
    id: string;
    name: string;
    chapter?: string;
    isMandatory: boolean;
    description: string;
    requirements: string[];
}

export interface AppendixInfo {
    id: string;
    title: string;
    purpose: string;
    isTemplate: boolean;
}

export interface PageSetupRules {
    paperSize: string;          // "Letter", "A4", etc.
    orientation: string;        // "Portrait", "Landscape"
    margins: {
        top: string;
        bottom: string;
        left: string;
        right: string;
        gutter?: string;
    };
}

export interface TypographyRules {
    bodyFont: string;
    bodyFontSize: string;
    headingFont?: string;
    lineSpacing: string;        // "1.5", "Double", etc.
    paragraphSpacing?: string;
    firstLineIndent?: string;
}

export interface HeadingRules {
    level: number;
    fontSize: string;
    fontWeight: string;
    alignment: string;
    spacing: {
        before: string;
        after: string;
    };
    numbering?: string;
}

export interface ParagraphRules {
    alignment: string;
    lineSpacing: string;
    spacingBefore?: string;
    spacingAfter?: string;
    firstLineIndent?: string;
}

export interface ListFormattingRules {
    bulletStyle?: string;
    numberingStyle?: string;
    indentation?: string;
}

export interface TableFormattingRules {
    captionPosition: string;    // "Above", "Below"
    captionFormat: string;
    borderStyle?: string;
    cellPadding?: string;
}

export interface FigureFormattingRules {
    captionPosition: string;
    captionFormat: string;
    alignment: string;
    sizeLimits?: string;
}

export interface MandatorySection {
    name: string;
    description: string;
    position?: number | 'any';   // Specific position or flexible
    minLength?: string;         // "2 páginas", "500 palabras"
    maxLength?: string;
    requirements: string[];
}

export interface OptionalSection {
    name: string;
    description: string;
    recommendedFor: string[];   // Types of thesis where it's recommended
}

export interface SectionOrderRules {
    strictOrder: boolean;       // Must follow exact order?
    requiredSequence: string[]; // Ordered list of section names
    flexibleSections: string[]; // Sections that can be positioned flexibly
}

export interface LengthConstraints {
    minPages?: number;
    maxPages?: number;
    minWords?: number;
    maxWords?: number;
    bySection?: {
        [sectionName: string]: {
            minPages?: number;
            maxPages?: number;
        };
    };
}

export interface CitationFormat {
    style: string;
    examples: string[];
}

export interface ReferenceFormat {
    style: string;
    sortOrder: string;          // "Alphabetical", "Appearance", etc.
    hangingIndent?: string;
    spacing?: string;
}

export interface InferredRule {
    category: string;
    rule: string;
    confidence: number;         // 0-100
    evidencePages: string[];    // Pages where evidence was found
}

// ═══════════════════════════════════════════════════════════════
// MAIN ANALYSIS RESULT INTERFACE
// ═══════════════════════════════════════════════════════════════

export interface DeepNormativeAnalysis {
    // Fase 1: Estructura del documento
    documentStructure: {
        tableOfContents: TOCEntry[];
        chapters: ChapterMetadata[];
        sections: SectionMetadata[];
        appendices: AppendixInfo[];
    };

    // Fase 2: Reglas de formato
    formattingRules: {
        pageSetup: PageSetupRules;
        typography: TypographyRules;
        headings: HeadingRules[];
        paragraphs: ParagraphRules;
        lists: ListFormattingRules;
        tables: TableFormattingRules;
        figures: FigureFormattingRules;
    };

    // Fase 3: Requisitos de contenido
    contentRequirements: {
        mandatorySections: MandatorySection[];
        optionalSections: OptionalSection[];
        sectionOrder: SectionOrderRules;
        lengthRequirements: LengthConstraints;
    };

    // Fase 4: Citación y referencias
    citationRules: {
        style: string;
        inTextFormat: CitationFormat;
        referenceListFormat: ReferenceFormat;
        specificRules: string[];
    };

    // Fase 5: Reglas implícitas
    implicitRules: InferredRule[];

    // Metadatos
    confidence: number;
    extractionMethod: 'ai' | 'ai+deep';
    processingTime: number;
}
