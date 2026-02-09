import React, { useEffect } from 'react';

interface SEOProps {
    title: string;
    description?: string;
    canonical?: string;
    schema?: object | object[];
    keywords?: string[];
    ogImage?: string;
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    type?: 'website' | 'article' | 'profile';
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    canonical,
    schema,
    keywords = [],
    ogImage,
    publishedTime,
    modifiedTime,
    author = "TuTesisRD",
    type = 'website'
}) => {
    const fullTitle = `${title} | TuTesisRD - Asesoría de Tesis en República Dominicana`;
    const defaultDescription = "Asesoría experta en tesis, anteproyectos y monográficos en República Dominicana. Más de 7 años ayudando a estudiantes a graduarse con éxito.";
    const currentDescription = description || defaultDescription;

    // Default keywords if none provided
    const defaultKeywords = [
        'tesis',
        'tesis de grado',
        'tesis doctoral',
        'anteproyecto de tesis',
        'asesoría tesis',
        'república dominicana',
        'tesis RD',
        'cómo hacer una tesis',
        'ejemplos de tesis',
        'qué es tesis'
    ];
    const allKeywords = keywords.length > 0 ? keywords : defaultKeywords;

    // Canonical URL constant to ensure consistency across the app
    const SITE_URL = "https://www.tutesisrd.online";
    const defaultOgImage = `${SITE_URL}/og-image.png`;

    useEffect(() => {
        document.title = fullTitle;

        // Helper to update meta tags
        const updateMeta = (name: string, content: string, property = false) => {
            const attr = property ? 'property' : 'name';
            let el = document.querySelector(`meta[${attr}="${name}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, name);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        // Basic meta tags
        updateMeta('description', currentDescription);
        updateMeta('keywords', allKeywords.join(', '));
        updateMeta('author', author);
        updateMeta('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

        // Language and region
        updateMeta('language', 'Spanish');
        updateMeta('geo.region', 'DO');
        updateMeta('geo.placename', 'República Dominicana');

        // Open Graph
        updateMeta('og:title', fullTitle, true);
        updateMeta('og:description', currentDescription, true);
        updateMeta('og:type', type, true);
        updateMeta('og:url', canonical || window.location.href, true);
        updateMeta('og:image', ogImage || defaultOgImage, true);
        updateMeta('og:image:width', '1200', true);
        updateMeta('og:image:height', '630', true);
        updateMeta('og:locale', 'es_DO', true);
        updateMeta('og:site_name', 'TuTesisRD', true);

        // Article-specific tags
        if (type === 'article') {
            if (publishedTime) {
                updateMeta('article:published_time', publishedTime, true);
            }
            if (modifiedTime) {
                updateMeta('article:modified_time', modifiedTime, true);
            }
            updateMeta('article:author', author, true);
        }

        // Twitter Cards
        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:title', fullTitle);
        updateMeta('twitter:description', currentDescription);
        updateMeta('twitter:image', ogImage || defaultOgImage);
        updateMeta('twitter:site', '@tutesisrd');

        // Update canonical
        let linkCanonical = document.querySelector('link[rel="canonical"]');
        const canonicalUrl = canonical || window.location.href;
        if (!linkCanonical) {
            linkCanonical = document.createElement('link');
            linkCanonical.setAttribute('rel', 'canonical');
            document.head.appendChild(linkCanonical);
        }
        linkCanonical.setAttribute('href', canonicalUrl);

        // Structured Data (JSON-LD) - support multiple schemas
        let scriptSchema = document.querySelector('script[id="ld-json"]');
        if (schema) {
            if (!scriptSchema) {
                scriptSchema = document.createElement('script');
                scriptSchema.setAttribute('type', 'application/ld+json');
                scriptSchema.setAttribute('id', 'ld-json');
                document.head.appendChild(scriptSchema);
            }
            // Handle both single schema and array of schemas
            const schemaContent = Array.isArray(schema) ? schema : [schema];
            scriptSchema.textContent = JSON.stringify(schemaContent.length === 1 ? schemaContent[0] : schemaContent);
        } else if (scriptSchema) {
            scriptSchema.remove();
        }
    }, [fullTitle, currentDescription, canonical, schema, allKeywords, ogImage, publishedTime, modifiedTime, author, type]);

    return null;
};

export default SEO;
