/**
 * Escribe un HTML por ruta en `dist/`, con el <head> correcto de cada página.
 *
 * POR QUÉ EXISTE
 * --------------
 * `vercel.json` reescribe `/(.*)` → `/`, así que hasta ahora toda URL servía el
 * index.html de la home, incluido `<link rel="canonical" href=".../">`. Google
 * veía la home declarada como canónica de cada URL del sitio en la primera ola
 * de rastreo. `SEO.tsx` lo corregía, pero dentro de un `useEffect`, o sea sólo
 * después de ejecutar JavaScript. Resultado medido en Search Console
 * (2026-02-09 → 2026-08-09): 19 de las 29 URLs del sitemap con CERO impresiones.
 *
 * CÓMO FUNCIONA
 * -------------
 * Vercel resuelve el sistema de archivos ANTES que los `rewrites`. Si existe
 * `dist/tesis/uasd/index.html`, la petición a `/tesis/uasd` lo sirve tal cual y
 * el rewrite comodín no llega a dispararse. Este script sólo tiene que generar
 * esos archivos: no hay que tocar `vercel.json`.
 *
 * No renderiza React. Sustituye la región entre `SEO:START` y `SEO:END` del
 * index.html que produce Vite. El <body> sigue siendo el `<div id="root">` que
 * hidrata el cliente; lo que se arregla aquí son las señales de <head>, que es
 * exactamente lo que estaba roto.
 */

import fs from 'node:fs';
import path from 'node:path';

import {
    STATIC_ROUTES,
    universityRouteMeta,
    blogRouteMeta,
    breadcrumbSchema,
    canonicalFor,
    withBrand,
    DEFAULT_OG_IMAGE,
    type BlogPostLike,
    type RouteMeta,
    type UniversityLike,
} from '../src/seo/siteMeta';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');

const START = '<!--';
const MARKER_START = 'SEO:START';
const MARKER_END = 'SEO:END';

const readJson = <T>(relativePath: string): T =>
    JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8')) as T;

/** Escapa para insertar dentro de un atributo HTML entre comillas dobles. */
const attr = (value: string): string =>
    value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

/** Escapa para insertar como texto de un elemento. */
const text = (value: string): string =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * `</script>` dentro de un JSON-LD cierra el bloque antes de tiempo y rompe el
 * resto del <head>. Google recomienda escapar la barra.
 */
const jsonLd = (data: unknown): string =>
    JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

const buildHead = (meta: RouteMeta): string => {
    const title = withBrand(meta.title);
    const canonical = canonicalFor(meta.path);
    const ogImage = meta.ogImage || DEFAULT_OG_IMAGE;
    const robots = meta.noIndex
        ? 'noindex, nofollow'
        : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

    const lines = [
        `    <title>${text(title)}</title>`,
        `    <meta name="description" content="${attr(meta.description)}" />`,
        `    <meta name="robots" content="${robots}" />`,
        `    <link rel="canonical" href="${attr(canonical)}" />`,
        ``,
        `    <meta property="og:type" content="${attr(meta.type || 'website')}" />`,
        `    <meta property="og:url" content="${attr(canonical)}" />`,
        `    <meta property="og:title" content="${attr(title)}" />`,
        `    <meta property="og:description" content="${attr(meta.description)}" />`,
        `    <meta property="og:image" content="${attr(ogImage)}" />`,
        `    <meta property="og:image:width" content="1200" />`,
        `    <meta property="og:image:height" content="630" />`,
        `    <meta property="og:locale" content="es_DO" />`,
        `    <meta property="og:site_name" content="TuTesisRD" />`,
        ``,
        `    <meta name="twitter:card" content="summary_large_image" />`,
        `    <meta name="twitter:title" content="${attr(title)}" />`,
        `    <meta name="twitter:description" content="${attr(meta.description)}" />`,
        `    <meta name="twitter:image" content="${attr(ogImage)}" />`,
    ];

    if (meta.type === 'article') {
        if (meta.publishedTime) {
            lines.push(`    <meta property="article:published_time" content="${attr(meta.publishedTime)}" />`);
        }
        if (meta.modifiedTime) {
            lines.push(`    <meta property="article:modified_time" content="${attr(meta.modifiedTime)}" />`);
        }
    }

    if (meta.breadcrumbs?.length) {
        // `id="ld-json"` a propósito: es el mismo que busca `SEO.tsx` al hidratar.
        // Sin él, el componente añadiría un SEGUNDO bloque en vez de reemplazar
        // este, y la página acabaría declarando dos BreadcrumbList idénticos.
        lines.push(
            ``,
            `    <script type="application/ld+json" id="ld-json">${jsonLd(breadcrumbSchema(meta.breadcrumbs))}</script>`,
        );
    }

    return lines.join('\n');
};

/** `/` → `dist/index.html`; `/tesis/uasd` → `dist/tesis/uasd/index.html`. */
const outputPathFor = (routePath: string): string =>
    routePath === '/'
        ? path.join(DIST, 'index.html')
        : path.join(DIST, routePath.replace(/^\//, ''), 'index.html');

const main = () => {
    const templatePath = path.join(DIST, 'index.html');
    if (!fs.existsSync(templatePath)) {
        console.error('[prerender] No existe dist/index.html. Ejecuta `vite build` antes.');
        process.exit(1);
    }

    const template = fs.readFileSync(templatePath, 'utf8');

    // `lastIndexOf` para el cierre a propósito: si alguien vuelve a nombrar el
    // marcador dentro del comentario explicativo, cortar por la PRIMERA
    // aparición dejaría intacto el <head> de la home y cada página acabaría con
    // dos <title> y dos canonicals —uno suyo y otro de la portada—, que es
    // justo el fallo que este script existe para evitar.
    const startIndex = template.indexOf(MARKER_START);
    const endIndex = template.lastIndexOf(MARKER_END);
    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
        console.error(
            `[prerender] No encuentro los marcadores ${MARKER_START}/${MARKER_END} en index.html.\n` +
                '            Sin ellos no sé qué región del <head> reemplazar y cada URL volvería\n' +
                '            a servir el canonical de la home. Abortando para no publicar eso.',
        );
        process.exit(1);
    }

    // Recorta desde el `<!--` que abre el comentario START hasta el `-->` que
    // cierra el comentario END, para no dejar comentarios huérfanos.
    const headStart = template.lastIndexOf(START, startIndex);
    const headEnd = template.indexOf('-->', endIndex) + '-->'.length;

    const before = template.slice(0, headStart);
    const after = template.slice(headEnd);

    const universities = readJson<UniversityLike[]>('src/data/universities.json');
    const posts = readJson<BlogPostLike[]>('src/data/blogPosts.json');

    const routes: RouteMeta[] = [
        ...STATIC_ROUTES,
        ...universities.map(universityRouteMeta),
        ...posts.map(blogRouteMeta),
    ];

    const seen = new Set<string>();
    let written = 0;
    let tooLongTitles = 0;

    for (const meta of routes) {
        if (seen.has(meta.path)) {
            console.warn(`[prerender] Ruta duplicada, me quedo con la primera: ${meta.path}`);
            continue;
        }
        seen.add(meta.path);

        const html = `${before}<!-- ${MARKER_START} (generado por scripts/prerender.ts) -->\n${buildHead(meta)}\n    <!-- ${MARKER_END} -->${after}`;

        // Un <title> o un canonical de más significa que el recorte falló y que
        // la página lleva pegado el <head> de la home. Es exactamente el bug
        // que rompió la indexación, así que aquí revienta el build en vez de
        // salir a producción.
        const titles = (html.match(/<title>/g) || []).length;
        const canonicals = (html.match(/rel="canonical"/g) || []).length;
        if (titles !== 1 || canonicals !== 1) {
            console.error(
                `[prerender] ${meta.path} salió con ${titles} <title> y ${canonicals} canonical(s); ` +
                    'debe haber exactamente uno de cada. Revisa los marcadores de index.html.',
            );
            process.exit(1);
        }

        const outputPath = outputPathFor(meta.path);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, html, 'utf8');
        written += 1;

        const finalTitle = withBrand(meta.title);
        if (!meta.noIndex && finalTitle.length > 60) {
            tooLongTitles += 1;
            console.warn(`[prerender] Título de ${finalTitle.length} caracteres (Google corta en ~60): ${meta.path}`);
        }
    }

    // Fallback de la SPA para las rutas que no prerenderizamos (/admin/*) y para
    // los 404 reales. Se construye desde `template` —la plantilla original en
    // memoria—, NO desde dist/index.html, que a estas alturas ya lleva el <head>
    // de la home: un 404 que se declare canónico de la home invita a Google a
    // indexar cualquier URL rota como si fuese la portada.
    const notFoundHtml = `${before}<!-- ${MARKER_START} (generado por scripts/prerender.mts) -->\n${buildHead({
        path: '/404',
        title: 'Página no encontrada',
        description: 'La página que buscas no existe o cambió de dirección.',
        noIndex: true,
    })}\n    <!-- ${MARKER_END} -->${after}`;
    fs.writeFileSync(path.join(DIST, '404.html'), notFoundHtml, 'utf8');

    // El sitemap sale de la MISMA tabla que el <head>, para que no puedan
    // divergir: el de `public/sitemap.xml` se mantenía a mano y ya se había
    // quedado sin /herramientas.
    const indexable = routes.filter((r) => !r.noIndex);
    const today = new Date().toISOString().slice(0, 10);
    const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...indexable.map(
            (r) =>
                `  <url>\n    <loc>${canonicalFor(r.path)}</loc>\n    <lastmod>${r.modifiedTime || today}</lastmod>\n  </url>`,
        ),
        '</urlset>',
        '',
    ].join('\n');
    fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8');

    console.log(`[prerender] ${written} rutas escritas en dist/.`);
    console.log(`[prerender] sitemap.xml con ${indexable.length} URLs indexables.`);
    if (tooLongTitles > 0) {
        console.log(`[prerender] ${tooLongTitles} título(s) por encima de 60 caracteres.`);
    }
};

main();
