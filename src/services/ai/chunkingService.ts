
interface TextChunk {
    content: string;
    sectionType: string;
    startIndex: number;
    endIndex: number;
}

export class SemanticChunker {
    // Regex for standard academic headers (Spanish & English)
    private static HEADER_PATTERNS = [
        /(?:^|\n)(?:[1-9]\.?\s*)?(?:INTRODUCCI[OÓ]N|INTRODUCTION)/i,
        /(?:^|\n)(?:[1-9]\.?\s*)?(?:MARCO TE[OÓ]RICO|THEORETICAL FRAMEWORK|LITERATURE REVIEW)/i,
        /(?:^|\n)(?:[1-9]\.?\s*)?(?:METODOLOG[IÍ]A|METHODOLOGY|M[EÉ]TODOS|METHODS)/i,
        /(?:^|\n)(?:[1-9]\.?\s*)?(?:RESULTADOS|RESULTS|HALLAZGOS|FINDINGS)/i,
        /(?:^|\n)(?:[1-9]\.?\s*)?(?:DISCUSI[OÓ]N|DISCUSSION)/i,
        /(?:^|\n)(?:[1-9]\.?\s*)?(?:CONCLUSIONES|CONCLUSIONS)/i,
        /(?:^|\n)(?:[1-9]\.?\s*)?(?:REFERENCIAS|REFERENCES|BIBLIOGRAF[IÍ]A)/i
    ];

    /**
     * Splits full text into semantically meaningful chunks based on academic structure.
     */
    public static chunkBySections(fullText: string): TextChunk[] {
        const chunks: TextChunk[] = [];
        let currentPos = 0;

        // Combine regexes into one to find the "next header"
        // This is a simplified parser.

        // Find all matches first
        const matches: { index: number, match: string }[] = [];

        this.HEADER_PATTERNS.forEach(pattern => {
            // Re-create regex with 'g' flag to find all matches
            const regex = new RegExp(pattern.source, 'gi');
            let match;
            while ((match = regex.exec(fullText)) !== null) {
                matches.push({ index: match.index, match: match[0] });
            }
        });

        // Sort by position
        matches.sort((a, b) => a.index - b.index);

        // Filter overlapping or very close matches (deduplication)
        const uniqueMatches = matches.filter((m, i) => {
            if (i === 0) return true;
            return m.index > matches[i - 1].index + 20; // 20 chars buffer
        });

        if (uniqueMatches.length === 0) {
            // No structure found, one big chunk
            return [{ content: fullText, sectionType: 'General', startIndex: 0, endIndex: fullText.length }];
        }

        // Create chunks between headers
        for (let i = 0; i < uniqueMatches.length; i++) {
            const current = uniqueMatches[i];
            const next = uniqueMatches[i + 1];

            // Normalize section name (remove numbers/newlines)
            const sectionName = current.match.replace(/^[\n\r0-9.\s]+/, '').trim().toUpperCase();

            // Content is from end of this header to start of next (or end of file)
            const startContent = current.index + current.match.length;
            const endContent = next ? next.index : fullText.length;

            const content = fullText.substring(startContent, endContent).trim();

            if (content.length > 50) { // Ignore empty sections
                chunks.push({
                    content,
                    sectionType: sectionName,
                    startIndex: startContent,
                    endIndex: endContent
                });
            }
        }

        return chunks;
    }

    /**
     * Gets a specific section with context window fallback
     */
    public static getSectionWithContext(chunks: TextChunk[], sectionType: string): string | null {
        const chunk = chunks.find(c => c.sectionType.includes(sectionType.toUpperCase()));
        return chunk ? chunk.content : null;
    }
}
