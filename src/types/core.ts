
// --- Academic Types ---

export interface AcademicWork {
    id: string;
    doi: string | null;
    title: string;
    publicationYear: number;
    citedByCount: number;
    hostVenue: string | null;
    isOpenAccess: boolean;
    pdfUrl: string | null;
    authors: string[];
    validationStatus: 'verified' | 'unverified' | 'failed';
    confidenceScore: number;
}

// --- PDF Report Data Types ---

export interface AuditSignal {
    text: string;
}

export interface AuditSegment {
    text: string;
    probability: number;
    // Add missing properties for compatibility if needed
}

export interface AuditResult {
    score: number;
    signals: string[];
    heatmap: AuditSegment[];
    // Add optional properties used in pdfExport
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
}

export interface ReferenceItem {
    reference: Partial<AcademicWork>;
    status: 'verified' | 'unverified' | 'needs_review' | 'not_found' | 'valid_no_doi';
    score?: number;
    sources?: string[];
}

export interface TranscriptionSegment {
    start: number;
    end: number;
    text: string;
}

export interface TranscriptionResult {
    text: string;
    segments: TranscriptionSegment[];
    language?: string;
}

// Union type for all possible data passed to PDF strategies
export type ReportData =
    | any // ConsistencyResult (already imported in pdfExport, keeping any here for now to avoid circular deps or huge refactor)
    | ReferenceItem[]
    | AuditResult
    | TranscriptionResult;
