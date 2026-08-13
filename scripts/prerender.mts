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
 * index.html que produce Vite, y rellena el `<div id="root">` con un cuerpo
 * estático de respaldo.
 *
 * POR QUÉ TAMBIÉN EL <body> (añadido 2026-08-13)
 * ---------------------------------------------
 * Arreglar el <head> no bastó. Search Console seguía diciendo «Google no
 * reconoce esta URL» para `/servicios`, con `Página de referencia: no se ha
 * detectado ninguna`: nunca la había rastreado. La causa es que el HTML crudo
 * servía `<div id="root"></div>`, o sea CERO enlaces. En la primera ola de
 * rastreo el grafo de enlaces interno del sitio es invisible, así que el
 * sitemap era el único canal de descubrimiento. Los rastreadores de IA
 * (GPTBot, ClaudeBot, PerplexityBot…) en su mayoría ni siquiera ejecutan
 * JavaScript, así que para ellos el sitio entero estaba en blanco.
 *
 * Este respaldo emite, sin JavaScript: el H1 y la descripción de la página, sus
 * migas de pan, y un mapa con las 33 URLs indexables. React lo sustituye al
 * montar —`createRoot().render()` vacía el contenedor antes de pintar, así que
 * no hay hidratación que casar ni riesgo de desajuste.
 *
 * NO LLEVA NINGÚN ENLACE `wa.me`, Y ES DELIBERADO. El listener delegado que
 * mide `contact_whatsapp` (AGENTS.md §3, R1) se registra cuando arranca la
 * aplicación. Un CTA de WhatsApp en este respaldo sería clicable durante los
 * milisegundos previos a la hidratación y esa conversión se perdería sin dejar
 * rastro. Si algún día se añade uno aquí, hay que medirlo aparte.
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

/** El contenedor que React vacía al montar. Aquí va el cuerpo de respaldo. */
const ROOT_DIV = '<div id="root"></div>';

/**
 * El respaldo va entre marcadores por la misma razón que el <head>: la
 * plantilla de este script es `dist/index.html`, o sea su propia salida de la
 * vez anterior. Sin una forma de deshacer la inyección, un segundo
 * `npm run prerender` sin `vite build` delante ya no encontraría el
 * `<div id="root"></div>` vacío y abortaría.
 */
const BODY_START = '<!-- BODY:START -->';
const BODY_END = '<!-- BODY:END -->';

/** Devuelve el contenedor a `<div id="root"></div>`. */
const resetRoot = (html: string): string => {
    const start = html.indexOf(BODY_START);
    const end = html.lastIndexOf(BODY_END);
    if (start === -1 || end === -1 || end < start) return html;
    return html.slice(0, start) + html.slice(end + BODY_END.length);
};

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

/* -------------------------------------------------------------------------- */
/*  Cuerpo estático de respaldo                                                */
/* -------------------------------------------------------------------------- */

/**
 * Estilos en línea a propósito, no clases de Tailwind: Tailwind purga lo que no
 * aparece en `src/`, y estas clases sólo existirían dentro de este script. Se
 * quedarían fuera del CSS y el respaldo saldría sin estilo.
 */
const S = {
    wrap: "max-width:1100px;margin:0 auto;padding:2.5rem 1.25rem;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#0E0E0F;line-height:1.6",
    crumbs: 'font-size:.875rem;color:#52525b;margin:0 0 1.25rem',
    h1: 'font-size:clamp(1.6rem,4vw,2.4rem);line-height:1.2;margin:0 0 .75rem',
    lead: 'font-size:1.05rem;color:#3f3f46;max-width:65ch;margin:0 0 2.5rem',
    h2: 'font-size:.8rem;text-transform:uppercase;letter-spacing:.08em;color:#F29727;margin:1.75rem 0 .6rem',
    list: 'list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:.5rem 1.25rem',
    link: 'color:#0E0E0F',
};

interface LinkGroup {
    heading: string;
    matches: (path: string) => boolean;
}

/** El orden manda: cada ruta cae en el PRIMER grupo que la acepta. */
const LINK_GROUPS: LinkGroup[] = [
    { heading: 'Guías por universidad', matches: (p) => p.startsWith('/tesis/') },
    { heading: 'Recursos', matches: (p) => p.startsWith('/recursos/') },
    { heading: 'Artículos del blog', matches: (p) => p.startsWith('/blog/') },
    {
        heading: 'Información legal',
        matches: (p) =>
            p === '/politica-de-privacidad' ||
            p === '/terminos-y-condiciones' ||
            p === '/eliminacion-de-datos',
    },
    { heading: 'Páginas principales', matches: () => true },
];

/**
 * El <title> lleva la marca porque compite en la SERP; un H1 o el texto de un
 * enlace, no. «Servicios y Precios de Asesoría Académica | Tu Tesis RD» como
 * encabezado se lee mal, y es lo que leen los rastreadores de IA, que no
 * ejecutan JavaScript y por tanto nunca ven el H1 de React.
 */
const plainTitle = (title: string): string => title.split(' | ')[0].trim();

const anchor = (path: string, label: string): string =>
    `<li><a style="${S.link}" href="${attr(path)}">${text(label)}</a></li>`;

/**
 * Mapa completo del sitio. Se emite en TODAS las páginas indexables para que
 * cualquier URL que Google rastree le descubra las otras 32 en la misma
 * petición, sin ejecutar JavaScript.
 */
const buildSiteMap = (indexable: RouteMeta[]): string => {
    const buckets = LINK_GROUPS.map((group) => ({ group, items: [] as RouteMeta[] }));

    for (const meta of indexable) {
        buckets.find((b) => b.group.matches(meta.path))?.items.push(meta);
    }

    // Las principales primero: son las que queremos que Google priorice.
    buckets.reverse();

    return buckets
        .filter((b) => b.items.length > 0)
        .map(
            (b) =>
                `      <h2 style="${S.h2}">${text(b.group.heading)}</h2>\n` +
                `      <ul style="${S.list}">${b.items
                    .map((m) => anchor(m.path, m.path === '/' ? 'Inicio' : plainTitle(m.title)))
                    .join('')}</ul>`,
        )
        .join('\n');
};

const buildBody = (meta: RouteMeta, indexable: RouteMeta[]): string => {
    const lines: string[] = [BODY_START, `    <div style="${S.wrap}">`];

    if (meta.breadcrumbs?.length) {
        const trail = meta.breadcrumbs
            .map((c, i) =>
                i === meta.breadcrumbs!.length - 1
                    ? `<span>${text(c.name)}</span>`
                    : `<a style="${S.link}" href="${attr(c.path)}">${text(c.name)}</a>`,
            )
            .join(' &rsaquo; ');
        lines.push(`      <nav style="${S.crumbs}" aria-label="Miga de pan">${trail}</nav>`);
    }

    lines.push(
        `      <h1 style="${S.h1}">${text(plainTitle(meta.title))}</h1>`,
        `      <p style="${S.lead}">${text(meta.description)}</p>`,
    );

    // En las rutas `noindex` los robots llevan además `nofollow`, así que el
    // mapa no se rastrearía: emitirlo sería peso muerto en cada respuesta.
    if (!meta.noIndex) {
        lines.push(`      <nav aria-label="Mapa del sitio">`, buildSiteMap(indexable), `      </nav>`);
    }

    lines.push('    </div>', `    ${BODY_END}`);
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

    const template = resetRoot(fs.readFileSync(templatePath, 'utf8'));

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

    // Si alguien reformatea el `<div id="root"></div>` (un salto de línea, un
    // atributo de más) el respaldo dejaría de inyectarse y volveríamos a
    // publicar un <body> sin un solo enlace, en silencio y sin romper ningún
    // test. Que reviente el build es justo lo que queremos.
    const rootDivs = after.split(ROOT_DIV).length - 1;
    if (rootDivs !== 1) {
        console.error(
            `[prerender] Esperaba exactamente un \`${ROOT_DIV}\` en index.html y encontré ${rootDivs}.\n` +
                '            Sin él no puedo inyectar el cuerpo de respaldo y cada página volvería a\n' +
                '            servirse sin enlaces para Google y para los rastreadores de IA. Abortando.',
        );
        process.exit(1);
    }

    const universities = readJson<UniversityLike[]>('src/data/universities.json');
    const posts = readJson<BlogPostLike[]>('src/data/blogPosts.json');

    const routes: RouteMeta[] = [
        ...STATIC_ROUTES,
        ...universities.map(universityRouteMeta),
        ...posts.map(blogRouteMeta),
    ];

    const seen = new Set<string>();
    const uniqueRoutes: RouteMeta[] = [];
    for (const meta of routes) {
        if (seen.has(meta.path)) {
            console.warn(`[prerender] Ruta duplicada, me quedo con la primera: ${meta.path}`);
            continue;
        }
        seen.add(meta.path);
        uniqueRoutes.push(meta);
    }

    // El mapa de enlaces del respaldo se calcula una sola vez y es el mismo en
    // todas las páginas, así que cualquier URL rastreada descubre el resto.
    const indexable = uniqueRoutes.filter((r) => !r.noIndex);

    let written = 0;
    let tooLongTitles = 0;

    for (const meta of uniqueRoutes) {
        // Sin espacios sueltos alrededor de los marcadores: así `resetRoot`
        // devuelve exactamente `<div id="root"></div>` y el script es repetible.
        const body = after.replace(ROOT_DIV, `<div id="root">${buildBody(meta, indexable)}</div>`);
        const html = `${before}<!-- ${MARKER_START} (generado por scripts/prerender.ts) -->\n${buildHead(meta)}\n    <!-- ${MARKER_END} -->${body}`;

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

        // La razón de ser de este respaldo es que Google encuentre enlaces sin
        // ejecutar JavaScript. Si la inyección falla, la página sale «correcta»
        // en todo lo demás y el fallo vuelve a ser invisible: por eso se
        // comprueba el resultado, no la intención.
        if (!meta.noIndex) {
            const links = (html.match(/<a style=/g) || []).length;
            if (links < indexable.length) {
                console.error(
                    `[prerender] ${meta.path} salió con ${links} enlaces estáticos y esperaba al menos ` +
                        `${indexable.length}. Sin ellos Google no descubre el sitio en la primera ola. Abortando.`,
                );
                process.exit(1);
            }
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
    const notFound: RouteMeta = {
        path: '/404',
        title: 'Página no encontrada',
        description: 'La página que buscas no existe o cambió de dirección.',
        noIndex: true,
    };
    // El 404 sí lleva el mapa, aunque sea `noindex`: quien aterrice en una URL
    // rota ve una salida antes de que React monte, en vez de una pantalla vacía.
    const notFoundBody = after.replace(
        ROOT_DIV,
        `<div id="root">${buildBody({ ...notFound, noIndex: false }, indexable)}</div>`,
    );
    const notFoundHtml = `${before}<!-- ${MARKER_START} (generado por scripts/prerender.mts) -->\n${buildHead(
        notFound,
    )}\n    <!-- ${MARKER_END} -->${notFoundBody}`;
    fs.writeFileSync(path.join(DIST, '404.html'), notFoundHtml, 'utf8');

    // El sitemap sale de la MISMA tabla que el <head>, para que no puedan
    // divergir: el de `public/sitemap.xml` se mantenía a mano y ya se había
    // quedado sin /herramientas.
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
