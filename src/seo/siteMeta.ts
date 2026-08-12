/**
 * Fuente única de verdad para los metadatos de cada ruta.
 *
 * Lo consumen dos cosas que TIENEN que decir lo mismo:
 *   1. `src/components/SEO.tsx`, en tiempo de ejecución (segunda ola de indexación).
 *   2. `scripts/prerender.ts`, en tiempo de build, que escribe el <head> real de
 *      cada URL en `dist/<ruta>/index.html` (primera ola de indexación).
 *
 * Antes de esto cada URL servía el <head> de la home —incluido
 * `<link rel="canonical" href="https://www.tutesisrd.online">`— porque el
 * rewrite `/(.*)` → `/` de vercel.json devuelve siempre el mismo index.html.
 * Google veía la home como canónica de todo el sitio: 19 de 29 URLs del sitemap
 * no tuvieron ni una impresión en 6 meses.
 *
 * Este módulo NO importa JSON: los datos dinámicos (universidades, blog) se le
 * pasan como argumento, para que el script de build pueda leerlos con `fs` sin
 * depender de la resolución de módulos JSON de TypeScript.
 */

export const SITE_URL = 'https://www.tutesisrd.online';
export const SITE_NAME = 'TuTesisRD';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const DEFAULT_DESCRIPTION =
    'Asesoría experta en tesis, anteproyectos y monográficos en República Dominicana. Más de 7 años ayudando a estudiantes a graduarse con éxito.';

export interface BreadcrumbItem {
    name: string;
    path: string;
}

export interface RouteMeta {
    /** Ruta absoluta sin dominio, sin barra final (salvo la home, que es "/"). */
    path: string;
    /** Título SIN el sufijo de marca. `withBrand` lo añade si hace falta. */
    title: string;
    description: string;
    type?: 'website' | 'article' | 'profile';
    ogImage?: string;
    /** Fuera del índice. Rutas privadas o de aplicación. */
    noIndex?: boolean;
    breadcrumbs?: BreadcrumbItem[];
    publishedTime?: string;
    modifiedTime?: string;
}

/**
 * Varias páginas ya llevan la marca en su propio título. Añadir el sufijo sin
 * mirar producía títulos de más de 100 caracteres con la marca dos veces.
 */
export const withBrand = (title: string): string =>
    /tutesisrd|tu tesis rd/i.test(title) ? title : `${title} | ${SITE_NAME}`;

/** Normaliza a https + www, sin query, sin hash y sin barra final. */
export const canonicalFor = (path: string): string => {
    try {
        const url = new URL(path || '/', SITE_URL);
        url.protocol = 'https:';
        url.hostname = 'www.tutesisrd.online';
        url.search = '';
        url.hash = '';
        if (url.pathname !== '/') {
            url.pathname = url.pathname.replace(/\/+$/, '');
        }
        return url.toString();
    } catch {
        return SITE_URL;
    }
};

/* -------------------------------------------------------------------------- */
/*  Rutas estáticas                                                            */
/* -------------------------------------------------------------------------- */

const HOME_CRUMB: BreadcrumbItem = { name: 'Inicio', path: '/' };

export const STATIC_ROUTES: RouteMeta[] = [
    {
        /**
         * El título anterior ("Asesoría metodológica para tesis en República
         * Dominicana | TuTesisRD") medía 68 caracteres y empezaba por
         * "metodológica", que nadie busca. La home rankea en posición 3,55 para
         * `asesor de tesis` con 89 impresiones y CERO clics: el problema no es
         * la posición, es que el snippet no responde a la consulta. Este empieza
         * por el término comercial y cabe entero en la SERP.
         */
        path: '/',
        title: 'Asesoría de Tesis en República Dominicana | TuTesisRD',
        description:
            'Asesor de tesis con más de 7 años en RD. Diagnóstico gratis, revisión metodológica y acompañamiento por etapas. En línea en todo el país y presencial en Higüey.',
    },
    {
        path: '/nosotros',
        title: 'Sobre Nosotros',
        description:
            'Conoce a Miguel Ángel Cordero y al equipo de TuTesisRD. Expertos con más de 7 años de experiencia en asesoría académica.',
        breadcrumbs: [HOME_CRUMB, { name: 'Nosotros', path: '/nosotros' }],
    },
    {
        path: '/servicios',
        title: 'Servicios y Precios de Asesoría Académica | Tu Tesis RD',
        description:
            'Conoce nuestro catálogo transparente de servicios para tesis de grado, monográficos, maestrías y doctorados en República Dominicana.',
        breadcrumbs: [HOME_CRUMB, { name: 'Servicios', path: '/servicios' }],
    },
    {
        path: '/universidades',
        title: 'Directorio de Universidades RD | TuTesisRD',
        description:
            'Guías metodológicas y normativas específicas para UASD, PUCMM, INTEC, UNIBE, O&M, UNPHU, UAPA, UCATECI y UNEV.',
        breadcrumbs: [HOME_CRUMB, { name: 'Universidades', path: '/universidades' }],
    },
    {
        path: '/blog',
        title: 'Blog de Tesis: Guías de APA y Metodología',
        description:
            'Estrategias de investigación, redacción académica y consejos prácticos para tu tesis. Guías sobre normas APA, anteproyecto, marco teórico y defensa.',
        breadcrumbs: [HOME_CRUMB, { name: 'Blog', path: '/blog' }],
    },
    {
        path: '/recursos/que-es-tesis',
        title: 'Qué es una Tesis: Definición, Tipos y Ejemplos',
        description:
            'Descubre qué es una tesis, sus características principales y la diferencia entre tesis de grado y doctoral. Explicación académica con referencias APA 7.',
        type: 'article',
        publishedTime: '2026-02-09',
        breadcrumbs: [
            HOME_CRUMB,
            { name: 'Recursos', path: '/recursos/que-es-tesis' },
            { name: 'Qué es una tesis', path: '/recursos/que-es-tesis' },
        ],
    },
    {
        path: '/recursos/como-hacer-tesis',
        title: 'Cómo Hacer una Tesis: Guía Paso a Paso',
        description:
            'Aprende la metodología correcta para hacer tu tesis. Pasos desde el anteproyecto hasta la defensa, con citas APA y consejos académicos.',
        type: 'article',
        breadcrumbs: [
            HOME_CRUMB,
            { name: 'Recursos', path: '/recursos/como-hacer-tesis' },
            { name: 'Cómo hacer una tesis', path: '/recursos/como-hacer-tesis' },
        ],
    },
    {
        path: '/recursos/ejemplos-tesis',
        title: 'Ejemplos de Tesis y Repositorios en RD',
        description:
            'Accede a los mejores ejemplos de tesis de grado y maestría en República Dominicana. Enlaces a repositorios de UASD, PUCMM, INTEC y más.',
        type: 'article',
        breadcrumbs: [
            HOME_CRUMB,
            { name: 'Recursos', path: '/recursos/ejemplos-tesis' },
            { name: 'Ejemplos de tesis', path: '/recursos/ejemplos-tesis' },
        ],
    },
    {
        path: '/herramientas',
        title: 'Herramientas de Análisis de Tesis',
        description:
            'Analiza tu tesis gratis: auditoría de documento con IA y matriz de consistencia. Detecta errores de formato, coherencia y normas APA antes de entregar.',
        breadcrumbs: [HOME_CRUMB, { name: 'Herramientas', path: '/herramientas' }],
    },
    {
        path: '/herramientas/matriz',
        title: 'Matriz de Consistencia de Tesis con IA',
        description:
            'Verifica gratis la coherencia de tu tesis: relación entre objetivos, instrumentos y resultados, normas APA y trazabilidad metodológica. Informe descargable en PDF.',
        breadcrumbs: [
            HOME_CRUMB,
            { name: 'Herramientas', path: '/herramientas' },
            { name: 'Matriz de consistencia', path: '/herramientas/matriz' },
        ],
    },
    {
        path: '/herramientas/auditor',
        title: 'Auditor de Tesis con IA',
        description:
            'Sube tu tesis y recibe un diagnóstico automático gratis: formato, normas APA y coherencia metodológica revisados en minutos.',
        breadcrumbs: [
            HOME_CRUMB,
            { name: 'Herramientas', path: '/herramientas' },
            { name: 'Auditor de tesis', path: '/herramientas/auditor' },
        ],
    },
    {
        path: '/politica-de-privacidad',
        title: 'Política de Privacidad - TuTesisRD',
        description:
            'Cómo TuTesisRD recoge, usa y protege tus datos personales: qué información pedimos, con qué fin, cuánto tiempo la conservamos y cómo ejercer tus derechos.',
    },
    {
        path: '/terminos-y-condiciones',
        title: 'Términos y Condiciones - TuTesisRD',
        description:
            'Condiciones de uso de los servicios de asesoría de TuTesisRD: alcance del acompañamiento, responsabilidades de cada parte, pagos y límites del servicio.',
    },
    {
        path: '/eliminacion-de-datos',
        title: 'Instrucciones para la Eliminación de Datos - TuTesisRD',
        description:
            'Instrucciones sobre cómo solicitar la eliminación de sus datos personales de TuTesisRD según las políticas de privacidad y de Facebook/Meta.',
    },

    /* --- Rutas de aplicación: fuera del índice ---------------------------- */
    /* robots.txt las bloquea, pero un Disallow impide RASTREAR, no INDEXAR:
       /monitoreo llegó a acumular impresiones en posición 4 sin ser rastreada.
       Sólo un `noindex` servido en el HTML las saca del índice. */
    { path: '/registro', title: 'Registro', description: DEFAULT_DESCRIPTION, noIndex: true },
    { path: '/monitoreo', title: 'Monitoreo de proyecto', description: DEFAULT_DESCRIPTION, noIndex: true },
    { path: '/portal', title: 'Portal del estudiante', description: DEFAULT_DESCRIPTION, noIndex: true },
    { path: '/portal/historial', title: 'Historial', description: DEFAULT_DESCRIPTION, noIndex: true },
    { path: '/exito', title: 'Solicitud recibida', description: DEFAULT_DESCRIPTION, noIndex: true },
    { path: '/design', title: 'Design System', description: DEFAULT_DESCRIPTION, noIndex: true },
    { path: '/admin/login', title: 'Acceso administrativo', description: DEFAULT_DESCRIPTION, noIndex: true },
];

/** Búsqueda por ruta, para que los componentes no repitan literales. */
export const staticRouteMeta = (path: string): RouteMeta | undefined =>
    STATIC_ROUTES.find((r) => r.path === path);

/* -------------------------------------------------------------------------- */
/*  Rutas dinámicas                                                            */
/* -------------------------------------------------------------------------- */

export interface UniversityLike {
    id: string;
    name: string;
    shortName: string;
    regulations: { style: string; minPages: number; maxPages: number };
}

/**
 * Las páginas `/tesis/*` son el mejor activo medido del sitio: 9,17 % de CTR
 * como bloque, frente al 0,30 % del contenido informacional. La descripción
 * anterior salía a 103 caracteres en O&M —desaprovechaba media línea de SERP— y
 * repetía el nombre largo de la universidad, que el título ya lleva. Esta usa el
 * acrónimo (que es lo que se busca: `tesis uasd`, `tesis pucmm`) y deja las 9
 * entre 129 y 149 caracteres.
 */
export const universityRouteMeta = (u: UniversityLike): RouteMeta => ({
    path: `/tesis/${u.id}`,
    title: `Tesis y Monográficos para ${u.shortName} | TuTesisRD`,
    description: `Asesoría de tesis y monográficos para ${u.shortName}: normativa vigente, formato ${u.regulations.style} y ${u.regulations.minPages}-${u.regulations.maxPages} páginas. Acompañamiento por etapas en RD.`,
    breadcrumbs: [
        HOME_CRUMB,
        { name: 'Universidades', path: '/universidades' },
        { name: u.shortName, path: `/tesis/${u.id}` },
    ],
});

export interface BlogPostLike {
    id: string;
    title: string;
    excerpt: string;
    date?: string;
    image?: string;
    schemaType?: string;
    /**
     * Título para la SERP. El `title` es el H1 y llega a 118 caracteres en
     * algunos artículos; Google corta en ~60 (escritorio) y ~50 (móvil), y el
     * CTR en móvil del sitio (2,52 % en posición 7,3) es peor que el de
     * escritorio (3,74 % en posición 14,4) precisamente por eso.
     */
    seoTitle?: string;
    seoDescription?: string;
}

export const blogRouteMeta = (post: BlogPostLike): RouteMeta => ({
    path: `/blog/${post.id}`,
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    type: 'article',
    // `post.image` es sólo el nombre del archivo; las portadas viven en /blog/.
    ogImage: post.image ? `${SITE_URL}/blog/${post.image}` : undefined,
    publishedTime: post.date,
    breadcrumbs: [HOME_CRUMB, { name: 'Blog', path: '/blog' }, { name: post.seoTitle || post.title, path: `/blog/${post.id}` }],
});

/* -------------------------------------------------------------------------- */
/*  Schema.org                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Migas. Es el único tipo de resultado enriquecido realista para este sitio:
 * la exportación de Search Console trae "Aparición en búsquedas" vacía, o sea
 * cero funciones de SERP en 6 meses.
 */
export const breadcrumbSchema = (items: BreadcrumbItem[]) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: canonicalFor(item.path),
    })),
});
