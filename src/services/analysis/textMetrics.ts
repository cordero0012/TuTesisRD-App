
/**
 * Text Analysis Metrics Service
 * Implements quantitative linguistic markers for AI detection and humanization.
 * Enhanced with Turnitin AIW-2/AIR-1 and Compilatio Magister+ detection patterns.
 */

export interface TextMetrics {
    burstiness: number; // Variance of sentence length
    lexicalDiversity: number; // Corrected Type-Token Ratio (TTR)
    avgSentenceLength: number;
    sentenceCount: number;
    wordCount: number;
    perplexityProxy: number; // Predictability score (0-1)
    readabilityScore: number; // Flesch-Kincaid ease
    aiConnectorsCount: number; // Frequency of "Furthermore", "In conclusion", etc.
    // NEW: Turnitin/Compilatio-specific metrics
    sentenceLengthVariance: number; // Raw variance (lower = more AI-like)
    structuralSymmetryScore: number; // Parallel construction detection
    paragraphUniformity: number; // Similar paragraph lengths = AI
    aiRiskScore: number; // Composite AI detection score (0-100)
}

/**
 * Calculates Burstiness (Standard Deviation of Sentence Lengths)
 */
export function calculateBurstiness(text: string): number {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);

    if (sentenceLengths.length <= 1) return 0;

    const mean = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
    const variance = sentenceLengths.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / sentenceLengths.length;

    return Math.sqrt(variance);
}

/**
 * Calculates raw Sentence Length Variance (used by Turnitin AIW-2)
 * Lower variance = more uniform = more AI-like
 */
export function calculateSentenceLengthVariance(text: string): number {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);

    if (sentenceLengths.length <= 1) return 0;

    const mean = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
    return sentenceLengths.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / sentenceLengths.length;
}

/**
 * Calculates Lexical Diversity (TTR)
 */
export function calculateLexicalDiversity(text: string): number {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    if (words.length === 0) return 0;

    const uniqueWords = new Set(words);
    return uniqueWords.size / words.length;
}

/**
 * Detects Structural Symmetry (Parallel Constructions)
 * AI often creates symmetrical patterns like "A is X. B is Y. C is Z."
 * Returns 0-1 where higher = more symmetric = more AI-like
 */
export function detectStructuralSymmetry(text: string): number {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length < 3) return 0;

    let symmetryCount = 0;
    const patterns: string[] = [];

    for (const sentence of sentences) {
        // Extract sentence structure pattern (first 3 words as proxy)
        const words = sentence.trim().split(/\s+/).slice(0, 3);
        const pattern = words.map(w => {
            // Normalize to word type
            if (/^[A-ZÁÉÍÓÚ]/.test(w)) return 'NOUN';
            if (['el', 'la', 'los', 'las', 'un', 'una', 'the', 'a', 'an'].includes(w.toLowerCase())) return 'ART';
            if (['es', 'son', 'está', 'están', 'is', 'are', 'was', 'were'].includes(w.toLowerCase())) return 'VERB';
            return 'OTHER';
        }).join('-');

        if (patterns.includes(pattern)) {
            symmetryCount++;
        }
        patterns.push(pattern);
    }

    return Math.min(symmetryCount / sentences.length, 1);
}

/**
 * Calculates Paragraph Uniformity
 * AI tends to create paragraphs of similar length
 * Returns 0-1 where higher = more uniform = more AI-like
 */
export function calculateParagraphUniformity(text: string): number {
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
    if (paragraphs.length < 2) return 0;

    const lengths = paragraphs.map(p => p.split(/\s+/).length);
    const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / lengths.length;
    const stdDev = Math.sqrt(variance);

    // Coefficient of variation: low = uniform = AI-like
    const cv = stdDev / mean;
    // Invert so higher = more uniform
    return Math.max(0, 1 - cv);
}

/**
 * Counts "AI Clichés" / Logical Connectors
 * AI often overuses these to create structure.
 * EXPANDED with Turnitin/Compilatio blacklist patterns
 */
export function countAiConnectors(text: string): number {
    // English connectors
    const englishConnectors = [
        "furthermore", "moreover", "in conclusion", "it is important to note",
        "additionally", "consequently", "subsequently", "overall", "on the other hand",
        "as a result", "in other words", "for instance", "specifically", "notably",
        "in summary", "to summarize", "in essence", "importantly", "significantly"
    ];

    // Spanish connectors (from Anti-Turnitin blacklist)
    const spanishConnectors = [
        "además", "sin embargo", "por lo tanto", "en consecuencia", "por consiguiente",
        "no obstante", "de hecho", "en primer lugar", "en segundo lugar", "por otro lado",
        "en conclusión", "es importante destacar", "cabe destacar", "es importante señalar",
        "resulta evidente", "asimismo", "por ende", "en resumen", "en síntesis",
        "como resultado", "de esta manera", "en este sentido", "vale la pena mencionar",
        "es necesario señalar", "conviene destacar"
    ];

    const allConnectors = [...englishConnectors, ...spanishConnectors];
    let count = 0;
    const lowerText = text.toLowerCase();

    allConnectors.forEach(c => {
        const regex = new RegExp(`\\b${c}\\b`, 'gi');
        count += (lowerText.match(regex) || []).length;
    });

    return count;
}

/**
 * Simple Perplexity Proxy based on common word transitions / predictability
 * (Highly simplified version for local execution)
 * Enhanced with bigram analysis
 */
export function calculatePerplexityProxy(text: string): number {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    if (words.length < 10) return 0.5;

    // Check for repetitive word lengths (common in some AI outputs)
    const lengths = words.map(w => w.length);
    const uniqueLengths = new Set(lengths).size;

    // Check for repetitive bigrams (word pairs)
    const bigrams: string[] = [];
    for (let i = 0; i < words.length - 1; i++) {
        bigrams.push(`${words[i]}_${words[i + 1]}`);
    }
    const uniqueBigrams = new Set(bigrams).size;
    const bigramRatio = bigrams.length > 0 ? uniqueBigrams / bigrams.length : 0.5;

    // Combined score: higher unique lengths + higher bigram diversity = higher perplexity (better)
    const lengthScore = Math.min(uniqueLengths / 15, 1);
    const bigramScore = bigramRatio;

    return (lengthScore * 0.4) + (bigramScore * 0.6);
}

/**
 * Calculate composite AI Risk Score (0-100)
 * Based on Turnitin AIW-2 and Compilatio detection patterns
 */
export function calculateAiRiskScore(metrics: Omit<TextMetrics, 'aiRiskScore'>): number {
    let score = 50; // Base neutral score

    // Burstiness: < 4 is suspicious (AI has uniform sentences)
    if (metrics.burstiness < 3) score += 20;
    else if (metrics.burstiness < 5) score += 10;
    else if (metrics.burstiness > 8) score -= 15;

    // Perplexity: < 0.4 is suspicious (predictable text)
    if (metrics.perplexityProxy < 0.35) score += 20;
    else if (metrics.perplexityProxy < 0.45) score += 10;
    else if (metrics.perplexityProxy > 0.55) score -= 10;

    // AI Connectors: > 3 is suspicious
    if (metrics.aiConnectorsCount > 5) score += 15;
    else if (metrics.aiConnectorsCount > 3) score += 8;
    else if (metrics.aiConnectorsCount === 0) score -= 5;

    // Sentence Length Variance: < 50 is suspicious
    if (metrics.sentenceLengthVariance < 30) score += 15;
    else if (metrics.sentenceLengthVariance < 50) score += 8;
    else if (metrics.sentenceLengthVariance > 100) score -= 10;

    // Structural Symmetry: > 0.3 is suspicious
    if (metrics.structuralSymmetryScore > 0.4) score += 10;
    else if (metrics.structuralSymmetryScore > 0.25) score += 5;

    // Paragraph Uniformity: > 0.7 is suspicious
    if (metrics.paragraphUniformity > 0.8) score += 10;
    else if (metrics.paragraphUniformity > 0.6) score += 5;

    // Lexical Diversity: < 0.4 is suspicious
    if (metrics.lexicalDiversity < 0.35) score += 10;
    else if (metrics.lexicalDiversity > 0.55) score -= 5;

    return Math.max(0, Math.min(100, score));
}

/**
 * Analyze full text metrics
 */
export function analyzeTextMetrics(text: string): TextMetrics {
    const words = text.trim().split(/\s+/);
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    const baseMetrics = {
        burstiness: calculateBurstiness(text),
        lexicalDiversity: calculateLexicalDiversity(text),
        avgSentenceLength: words.length / sentences.length,
        sentenceCount: sentences.length,
        wordCount: words.length,
        perplexityProxy: calculatePerplexityProxy(text),
        readabilityScore: 206.835 - (1.015 * (words.length / sentences.length)) - (84.6 * (text.length / words.length / 5)),
        aiConnectorsCount: countAiConnectors(text),
        sentenceLengthVariance: calculateSentenceLengthVariance(text),
        structuralSymmetryScore: detectStructuralSymmetry(text),
        paragraphUniformity: calculateParagraphUniformity(text),
        aiRiskScore: 0 // Will be calculated next
    };

    // Calculate composite risk score
    baseMetrics.aiRiskScore = calculateAiRiskScore(baseMetrics);

    return baseMetrics;
}
