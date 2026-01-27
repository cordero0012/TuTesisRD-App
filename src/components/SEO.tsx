import React, { useEffect } from 'react';

interface SEOProps {
    title: string;
    description?: string;
    canonical?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, canonical }) => {
    const fullTitle = `${title} | TuTesisRD - Asesoría de Tesis en República Dominicana`;
    const defaultDescription = "Asesoría experta en tesis, anteproyectos y monográficos en República Dominicana. Más de 7 años ayudando a estudiantes a graduarse con éxito.";
    const currentDescription = description || defaultDescription;
    const siteUrl = "https://www.tutesisrd.online";

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

        updateMeta('description', currentDescription);

        // Open Graph
        updateMeta('og:title', fullTitle, true);
        updateMeta('og:description', currentDescription, true);
        updateMeta('og:type', 'website', true);
        updateMeta('og:url', window.location.href, true);
        updateMeta('og:image', `${siteUrl}/favicon.png`, true);

        // Twitter
        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:title', fullTitle);
        updateMeta('twitter:description', currentDescription);

        // Update canonical
        let linkCanonical = document.querySelector('link[rel="canonical"]');
        const canonicalUrl = canonical || window.location.href;
        if (!linkCanonical) {
            linkCanonical = document.createElement('link');
            linkCanonical.setAttribute('rel', 'canonical');
            document.head.appendChild(linkCanonical);
        }
        linkCanonical.setAttribute('href', canonicalUrl);
    }, [fullTitle, currentDescription, canonical]);

    return null;
};

export default SEO;
