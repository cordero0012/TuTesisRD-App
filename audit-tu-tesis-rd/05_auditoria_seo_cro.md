# 05 · Auditoría de SEO y conversión (CRO)

**Fecha:** 2026-07-31 · **Modo:** solo lectura

---

## A. Indexabilidad y arquitectura

### H-10 · SPA sin renderizado en servidor: el rastreador recibe un documento vacío

- **Clasificación:** Verificado
- **Evidencia:** Petición a `https://www.tutesisrd.online/` sin ejecución de JavaScript. El único texto recuperable es el `<title>`. No hay `<h1>`, ni párrafos, ni enlaces internos en el HTML servido. Todo el contenido lo inyecta React tras la hidratación. `package.json` no incluye ninguna herramienta de SSR ni de prerender.
- **Impacto:** Google puede renderizar JavaScript, pero lo hace en una segunda pasada, con retraso y coste de presupuesto de rastreo. Consecuencias concretas para este sitio:
  - Las 29 URLs del sitemap dependen de la cola de renderizado para ser indexadas con contenido.
  - Los meta tags dinámicos de `SEO.tsx` se aplican en un `useEffect` (`SEO.tsx:72`), es decir **después** del render inicial. Un rastreador que no renderice ve el título genérico de `index.html` en todas las páginas.
  - Bing, y sobre todo los rastreadores de IA y de redes sociales (previsualizaciones de enlaces en WhatsApp, Facebook, Instagram), suelen **no** ejecutar JavaScript: verán el mismo OG genérico para todas las URLs. Para un negocio que se difunde por WhatsApp, esto es directamente comercial.
- **Prioridad:** P1
- **Confianza:** Alta sobre el HTML servido. El grado de daño real en Google depende de datos de Search Console (**no evaluado**).
- **Recomendación:** Prerenderizado estático de las rutas públicas (`vite-plugin-ssg`, `react-snap` o migración a un framework con SSR). Como mínimo, prerenderizar home, servicios, las 9 páginas de universidad y los 10 artículos.
- **Validación propuesta:** Prueba de URL en vivo en Search Console → comparar "HTML rastreado" contra "HTML renderizado". Compartir un enlace de artículo por WhatsApp y observar la previsualización.
- **Requiere aprobación:** Sí.

### H-09 · Seis de diez artículos tienen slugs de marcador de posición

- **Clasificación:** Verificado
- **Evidencia:** `src/data/blogPosts.json` — los `id` `blog-4` … `blog-9` se usan como slug de URL (`App.tsx:128`, `/blog/:postId`) y están publicados en `public/sitemap.xml`. Sus títulos, en cambio, sí están trabajados:

  | URL actual | Título real del artículo |
  |-----------|--------------------------|
  | `/blog/blog-4` | Rigor y Estrategia en la Selección de la Metodología de Tesis |
  | `/blog/blog-5` | Planteamiento del Problema: La Fórmula Exacta para que NO te lo Rechacen |
  | `/blog/blog-6` | Marco Teórico: Cómo Investigar Sin Caer en el Plagio |
  | `/blog/blog-7` | Recolección de Datos: Guía para Diseñar Encuestas que SÍ Funcionan |
  | `/blog/blog-8` | Resultados vs Discusión: El Error que Confunde a Todos los Estudiantes |
  | `/blog/blog-9` | Cómo Defender tu Tesis Sin Morir de Nervios (Consejos de Jurados) |

  Los otros cuatro sí tienen slug semántico (`estructura-anteproyecto-dom`, `errores-apa-7`, `gestion-tiempo-tesis`, `temas-tesis-contabilidad-uasd`).
- **Impacto:** La URL es un factor de relevancia y, sobre todo, de CTR: `tutesisrd.online/blog/blog-7` no comunica nada en resultados de búsqueda ni al compartirse. Se está desperdiciando el trabajo de contenido ya hecho. Nótese que `CAMPAIGN_PLAN.md` planifica campañas de pago hacia justamente estos artículos (Blog 6, 7, 9, 10).
- **Prioridad:** P1
- **Confianza:** Alta
- **Recomendación:** Renombrar a slugs semánticos (`/blog/planteamiento-del-problema-tesis`, `/blog/defensa-de-tesis-consejos`, …), implementar **301 desde las URLs antiguas** y actualizar el sitemap. Hacerlo **antes** de invertir en anuncios hacia esas páginas.
- **Validación propuesta:** Comprobar que cada URL antigua devuelve 301 y que Search Console procesa el cambio sin picos de 404.
- **Requiere aprobación:** Sí.

### H-12 · `robots.txt` bloquea rutas que no existen y deja sin bloquear las reales

- **Clasificación:** Verificado
- **Evidencia:** `public/robots.txt` (confirmado idéntico en producción) declara `Disallow: /admin/`, `/api/`, `/portal/`, `/register/`. Rutas reales en `App.tsx`: `/admin` (159), `/portal` (136), `/registro` (**134**), `/monitoreo` (135).
- **Impacto:**
  - `Disallow: /register/` **no protege nada**: la ruta real es `/registro`.
  - `/monitoreo` (consulta de estado de proyecto) no está contemplada.
  - `Disallow: /admin/` con barra final puede no cubrir `/admin` exacto según interpretación del rastreador.
- **Prioridad:** P2
- **Confianza:** Alta
- **Recomendación:** Corregir a las rutas reales. Considerar además `noindex` a nivel de meta para las áreas privadas, ya que `robots.txt` impide el rastreo pero no garantiza la desindexación.
- **Requiere aprobación:** Sí.

### H-19 · Tres URLs del sitemap no tienen metadatos propios

- **Clasificación:** Verificado
- **Evidencia:** Páginas sin componente `<SEO>`: `Blog.tsx`, `AuditPage.tsx`, `ConsistencyMatrix.tsx`, `RegisterWizard.tsx`, `StudentPortal.tsx`. De ellas, **tres están en el sitemap**: `/blog`, `/herramientas/auditor` (a través de `/herramientas`), `/herramientas/matriz`.
- **Impacto:** En una SPA, no establecer el título deja el del documento anterior (o el genérico de `index.html`). `/blog` es la página índice del contenido y `/herramientas/matriz` es una herramienta diferenciadora del producto: ambas compiten con un título que no les corresponde.
- **Prioridad:** P2
- **Confianza:** Alta
- **Recomendación:** Añadir `<SEO>` a las cinco páginas, con schema `ItemList` en `/blog` y `SoftwareApplication` en las herramientas.
- **Requiere aprobación:** Sí.

---

## B. Lo que está bien resuelto (verificado)

Conviene registrarlo para no romperlo en las correcciones:

| Elemento | Estado | Evidencia |
|----------|--------|-----------|
| Componente SEO centralizado | ✅ Sólido | `SEO.tsx` gestiona title, description, keywords, robots, geo, OG, Twitter Card, canonical y JSON-LD |
| Normalización de canonical | ✅ Correcta | `SEO.tsx:19-37` fuerza https, host `www`, elimina query y hash, y quita la barra final |
| Schema.org base | ✅ Presente | `EducationalOrganization` + `WebSite` en `index.html:66-118`, con dirección, geo, teléfono y `sameAs` |
| Estrategia de contenido | ✅ Bien orientada | 9 páginas por universidad (`/tesis/uasd`, `/tesis/pucmm`…) y 3 páginas de recursos: captura correctamente la búsqueda long-tail local |
| Sitemap | ✅ Existe y es coherente | 29 URLs, con `lastmod`, `changefreq` y `priority` |
| OG image | ✅ Definida | 1200×630 con dimensiones declaradas |
| `hreflang` | ➖ No necesario | Sitio monolingüe es-DO |

---

## C. CRO — Análisis del recorrido de conversión

### Recorrido verificado

```
Landing (/)
 ├── Formulario "Diagnóstico Rápido"  → datos DESCARTADOS → WhatsApp sin contexto   ← H-03
 ├── 9 CTA de WhatsApp en la página   → sin instrumentar, sin mensaje prellenado    ← H-04
 └── /registro (wizard completo)      → Supabase → navigate('/student/success')
                                                     └── RUTA INEXISTENTE → pantalla en blanco  ← H-02
```

### Fricciones identificadas

| # | Fricción | Evidencia | Prioridad |
|---|---------|-----------|-----------|
| C-1 | El registro pide importe total y importe pagado (`RegisterWizard.tsx:122-123`) antes de que exista relación comercial | Campos `totalAmount` / `paidAmount` en el formulario público | P1 |
| C-2 | El wizard crea una **cuenta de autenticación** (`supabase.auth.signUp`, línea 55) como paso obligatorio | Barrera alta para un primer contacto | P1 |
| C-3 | Los 17 enlaces de WhatsApp abren un chat vacío | Ningún `?text=` en ninguno | P1 |
| C-4 | El formulario del hero no valida ni exige ningún campo | Los `select` no tienen estado | P2 |
| C-5 | No hay estado de error visible tras un fallo de registro más allá de una notificación | `catch` en `RegisterWizard.tsx:159-161` | P2 |

**Hipótesis a validar (no son conclusiones):** el paso de `signUp` obligatorio y la solicitud de importes son los candidatos más probables a explicar abandono en el wizard. **No puede confirmarse sin datos de embudo de GA4**, que hoy no son accesibles.

---

## D. No evaluado

- Posiciones, impresiones, CTR y consultas reales → requiere **Search Console**.
- Errores de cobertura, páginas descubiertas no indexadas, soft 404 detectados por Google → **Search Console**.
- Canibalización entre las 9 páginas de universidad y las 3 de recursos → requiere datos de consultas.
- Perfil de backlinks y autoridad → requiere herramienta externa.
- SEO local: existencia, estado y reseñas del **Google Business Profile** → no confirmado.
- Tasas de conversión reales por página y por dispositivo → requiere GA4.
