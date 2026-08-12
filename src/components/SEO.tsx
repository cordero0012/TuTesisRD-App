import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import {
    DEFAULT_DESCRIPTION,
    DEFAULT_OG_IMAGE,
    breadcrumbSchema,
    canonicalFor,
    staticRouteMeta,
    withBrand,
    type BreadcrumbItem,
    type RouteMeta,
} from '../seo/siteMeta';

interface SEOProps {
    /**
     * Sólo para rutas dinámicas (/tesis/:id, /blog/:id). Las rutas fijas viven
     * en `STATIC_ROUTES` y no necesitan pasar nada: la tabla manda.
     */
    title?: string;
    description?: string;
    canonical?: string;
    schema?: object | object[];
    /**
     * @deprecated Ningún buscador usa `<meta name="keywords">` desde hace más de
     * una década. Se acepta para no romper las llamadas existentes, pero ya no
     * se emite ninguna etiqueta.
     */
    keywords?: string[];
    ogImage?: string;
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    type?: 'website' | 'article' | 'profile';
    /** Keeps the page out of the index. Use for private/app routes. */
    noIndex?: boolean;
    /** Migas para rutas dinámicas (/tesis/:id, /blog/:id), que no están en la tabla. */
    breadcrumbs?: BreadcrumbItem[];
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    canonical,
    schema,
    ogImage,
    publishedTime,
    modifiedTime,
    author = 'TuTesisRD',
    type = 'website',
    noIndex = false,
    breadcrumbs,
}) => {
    const { pathname } = useLocation();

    /**
     * `src/seo/siteMeta.ts` manda sobre las props.
     *
     * El mismo módulo alimenta a `scripts/prerender.mts`, que escribe el <head>
     * real de cada URL durante el build. Si las props de la página pudieran
     * ganar, el HTML servido y el DOM hidratado dirían cosas distintas sobre el
     * canonical de la página — que es justo la incoherencia que dejó 19 de las
     * 29 URLs del sitemap sin una sola impresión en 6 meses.
     *
     * Las rutas dinámicas (/tesis/:id, /blog/:id) no están en la tabla: ahí
     * mandan las props, y las plantillas las construyen con `universityRouteMeta`
     * y `blogRouteMeta`, que son del mismo módulo.
     */
    const tableMeta: RouteMeta | undefined = staticRouteMeta(pathname);

    const effectiveTitle = tableMeta?.title ?? title ?? 'TuTesisRD';
    const effectiveDescription = tableMeta?.description ?? description ?? DEFAULT_DESCRIPTION;
    const effectiveType = tableMeta?.type ?? type;
    const effectiveNoIndex = tableMeta?.noIndex ?? noIndex;
    const effectiveOgImage = tableMeta?.ogImage ?? ogImage ?? DEFAULT_OG_IMAGE;
    const effectivePublished = tableMeta?.publishedTime ?? publishedTime;
    const effectiveModified = tableMeta?.modifiedTime ?? modifiedTime;
    const effectiveCrumbs = tableMeta?.breadcrumbs ?? breadcrumbs;

    const fullTitle = withBrand(effectiveTitle);
    const canonicalUrl = canonicalFor(tableMeta?.path ?? canonical ?? pathname);

    if (import.meta.env.DEV && tableMeta && title && withBrand(title) !== fullTitle) {
        console.warn(
            `[SEO] ${pathname} pasa el título "${title}" pero manda la tabla: "${tableMeta.title}".\n` +
                '      Edita src/seo/siteMeta.ts — es la fuente única que consumen el prerender y este componente.',
        );
    }

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
        updateMeta('description', effectiveDescription);
        updateMeta('author', author);
        updateMeta('robots', effectiveNoIndex
            ? 'noindex, nofollow'
            : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

        // Language and region
        updateMeta('language', 'Spanish');
        updateMeta('geo.region', 'DO');
        updateMeta('geo.placename', 'República Dominicana');

        // Open Graph
        updateMeta('og:title', fullTitle, true);
        updateMeta('og:description', effectiveDescription, true);
        updateMeta('og:type', effectiveType, true);
        updateMeta('og:url', canonicalUrl, true);
        updateMeta('og:image', effectiveOgImage, true);
        updateMeta('og:image:width', '1200', true);
        updateMeta('og:image:height', '630', true);
        updateMeta('og:locale', 'es_DO', true);
        updateMeta('og:site_name', 'TuTesisRD', true);

        // Article-specific tags
        if (effectiveType === 'article') {
            if (effectivePublished) {
                updateMeta('article:published_time', effectivePublished, true);
            }
            if (effectiveModified) {
                updateMeta('article:modified_time', effectiveModified, true);
            }
            updateMeta('article:author', author, true);
        }

        // Twitter Cards
        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:title', fullTitle);
        updateMeta('twitter:description', effectiveDescription);
        updateMeta('twitter:image', effectiveOgImage);
        updateMeta('twitter:site', '@tutesisrd');

        // Update canonical
        let linkCanonical = document.querySelector('link[rel="canonical"]');
        if (!linkCanonical) {
            linkCanonical = document.createElement('link');
            linkCanonical.setAttribute('rel', 'canonical');
            document.head.appendChild(linkCanonical);
        }
        linkCanonical.setAttribute('href', canonicalUrl);

        /**
         * Structured Data. Las migas van siempre que la ruta las tenga: es el
         * único tipo de resultado enriquecido realista para este sitio, y hoy
         * "Aparición en búsquedas" de Search Console llega literalmente vacía.
         *
         * El prerender ya escribe estas migas en el HTML servido; volver a
         * inyectarlas aquí en el mismo `<script id="ld-json">` las mantiene
         * cuando el usuario navega dentro de la SPA y no hay recarga.
         */
        const pageSchemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];
        const allSchemas = effectiveCrumbs?.length
            ? [breadcrumbSchema(effectiveCrumbs), ...pageSchemas]
            : pageSchemas;

        let scriptSchema = document.querySelector('script[id="ld-json"]');
        if (allSchemas.length > 0) {
            if (!scriptSchema) {
                scriptSchema = document.createElement('script');
                scriptSchema.setAttribute('type', 'application/ld+json');
                scriptSchema.setAttribute('id', 'ld-json');
                document.head.appendChild(scriptSchema);
            }
            scriptSchema.textContent = JSON.stringify(allSchemas.length === 1 ? allSchemas[0] : allSchemas);
        } else if (scriptSchema) {
            scriptSchema.remove();
        }
    }, [
        fullTitle,
        effectiveDescription,
        canonicalUrl,
        schema,
        effectiveCrumbs,
        effectiveOgImage,
        effectivePublished,
        effectiveModified,
        author,
        effectiveType,
        effectiveNoIndex,
    ]);

    return null;
};

export default SEO;
