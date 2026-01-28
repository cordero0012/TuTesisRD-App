import mammoth from 'mammoth';

export interface AuditResult {
    wordCount: number;
    hasTitle: boolean;
    hasAbstract: boolean;
    referenceCount: number;
    paragraphs: number;
    suggestions: string[];
    score: number; // 0 to 100
}

export const analyzeDocument = async (file: File): Promise<AuditResult> => {
    const arrayBuffer = await file.arrayBuffer();

    // Convert to Raw Text for Analysis
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value;
    const lines = text.split('\n').filter(line => line.trim().length > 0);

    const wordCount = text.split(/\s+/).length;
    const paragraphs = lines.length;

    // Heuristics
    const hasTitle = lines.length > 0 && lines[0].length < 100; // Simplistic check
    const hasAbstract = text.toLowerCase().includes('resumen') || text.toLowerCase().includes('abstract') || text.toLowerCase().includes('introducción');

    // Reference Estimation (Lines starting with [ bracket or looking like citations)
    // This is VERY basic. A real parser would be better but this is MVP.
    const referenceCount = (text.match(/\(\d{4}\)/g) || []).length; // Counts (2023) style years

    const suggestions: string[] = [];
    let score = 100;

    if (wordCount < 1000) {
        suggestions.push("El documento parece muy corto para una tesis completa. Asegúrate de subir la versión final.");
        score -= 20;
    }

    if (!hasAbstract) {
        suggestions.push("No detectamos una sección de 'Resumen' o 'Introducción' clara. Revisa tus títulos.");
        score -= 15;
    }

    if (referenceCount < 5) {
        suggestions.push("Detectamos muy pocas citas bibliográficas (años entre paréntesis). ¿Estás usando normativa APA?");
        score -= 15;
    }

    return {
        wordCount,
        hasTitle,
        hasAbstract,
        referenceCount,
        paragraphs,
        suggestions,
        score: Math.max(0, score)
    };
};
