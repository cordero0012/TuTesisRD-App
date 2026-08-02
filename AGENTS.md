# AGENTS.md — Memoria compartida de Tu Tesis RD

**Este archivo es la fuente de verdad compartida entre Codex y Claude.** Léelo antes de empezar y actualiza la bitácora (§6) al terminar. Lo lee Codex de forma nativa; Claude lo lee vía `CLAUDE.md`.

**Última actualización:** 2026-08-02 · por Claude

---

## 1. Reparto de roles

| Agente | Responsabilidad | No toca |
|---|---|---|
| **Codex** | **Diseño y UI.** Maquetación, estilos, componentes, responsive, accesibilidad visual, sistema de diseño | Medición, analítica, SEO técnico, archivos de publicidad |
| **Claude** | **Publicidad y medición.** Tracking, conversiones, GA4/GTM/Meta/Google Ads, SEO técnico, captación de leads | Rediseño visual, paleta, maquetación |

Ajustes puntuales fuera del propio dominio: permitidos, pero **anótalos en la bitácora (§6)**.

## 2. Propiedad de archivos

**Codex (diseño):**
```
src/components/**          (excepto SEO.tsx)
src/styles.css
tailwind.config.js
src/pages/DesignSystem.tsx
src/pages/**               (solo maquetación y estilos)
```

**Claude (publicidad y medición):**
```
src/utils/analytics.ts
src/hooks/useAnalytics.ts
src/services/leads/**
src/components/SEO.tsx
src/config.ts
index.html                 (GTM, Pixel, schema.org)
public/robots.txt
public/sitemap.xml
vercel.json
ads-tu-tesis-rd/**
audit-tu-tesis-rd/**
```

**Zona compartida — avisa antes de tocar:**
```
src/pages/LandingPage.tsx  (Codex: maquetación · Claude: formulario del hero y CTA)
src/App.tsx                (rutas)
package.json
```

## 3. Contrato de medición — reglas que el rediseño NO puede romper

El sitio mide conversiones mediante un **listener delegado** en `src/utils/analytics.ts:93`:

```js
target?.closest?.('a[href*="wa.me"]')
```

De ahí salen tres reglas innegociables para cualquier cambio de diseño:

**R1 · Los CTA de WhatsApp deben seguir siendo `<a>` con `href` que contenga `wa.me`.**
Si conviertes un CTA en `<button onClick={() => window.open(...)}>`, el evento `contact_whatsapp` **deja de dispararse sin ningún error visible**. Es la conversión principal del negocio y hay 17 CTA repartidos por el sitio. Cambiar el estilo, el tamaño, el icono o el texto: libre. Cambiar el elemento `<a>` o quitar el `href`: rompe la medición.

**R2 · El formulario del hero debe seguir siendo controlado.**
En `LandingPage.tsx`: estado `etapa` y `nivel` (líneas ~27-28) y `onSubmit={handleDiagnosticoSubmit}` (línea ~262). Esos `select` alimentan el mensaje de WhatsApp y el lead. Si los sustituyes por `select` sin estado, se pierde la información de calificación del estudiante y se dispara una conversión falsa. Ese fallo exacto ya ocurrió una vez y costó arreglarlo.

**R3 · El número de WhatsApp sale de `src/config.ts` (`CONTACT.WHATSAPP`).**
No escribas el número a mano en componentes nuevos. Usa el helper de `config.ts`.

> Si un cambio de diseño obliga a romper R1, R2 o R3: **páralo y anótalo en §6** para que Claude adapte la medición primero.

## 4. Estado actual del proyecto

| Hecho | Estado |
|---|---|
| Producción sirve código del **2026-04-30** | Las correcciones de medición están en la rama `fix/medicion-conversion-p0`, **sin fusionar** |
| Backend Supabase de producción **caído** (NXDOMAIN) | `/registro`, `/portal`, `/admin` y las herramientas de IA no funcionan. El sitio informativo sí |
| Sin acceso a Google Ads, GA4, GTM ni Meta de Tu Tesis RD | Las credenciales locales autentican como otra organización (NES CAMP) |
| El repositorio de GitHub es **público** | Ver §5 |

**Ramas vivas — y el conflicto que hay que resolver:**

| Rama | Dónde | Qué lleva |
|---|---|---|
| `main` / `origin/main` | Producción (`66ffcb8`, código del 30 abr) | Nada de lo nuevo |
| `fix/medicion-conversion-p0` | **Publicada, PR abierto, 7 commits** | Las 5 correcciones de código + `349180f` (deduplicación GTM) + `5784f22` (eventID de Meta) |
| `fix/auditoria-p0-medicion-conversion` | **Local. Es donde trabaja Codex** | Las mismas 5 correcciones (SHA distinto, por cherry-pick) + auditoría + este archivo. **No** lleva `349180f` ni `5784f22` |

**Las dos ramas divergen.** El rediseño de Codex está encima de una base que no incluye los dos commits de medición. Al fusionar habrá conflicto en `src/pages/LandingPage.tsx`.

**Cómo resolverlo (orden acordado):**
1. Miguel fusiona el PR → `main` queda con todo lo de medición.
2. Codex commitea su rediseño y lo rebasa sobre el nuevo `main`.
3. En el conflicto de `LandingPage.tsx`: **conservar el rediseño** y volver a añadir estas dos líneas de `5784f22`:
   - `import { createEventId } from '../utils/analytics';`
   - el cuarto argumento `{ eventID: createEventId() }` en el `fbq('track','Lead', …)` del formulario del hero.

`src/utils/analytics.ts` y `src/hooks/useAnalytics.ts` son solo de Claude: no habrá conflicto ahí.

## 5. Reglas del repositorio

**El repo `cordero0012/TuTesisRD-App` es PÚBLICO.**

- **Nunca** hagas `git add .` a ciegas.
- **No versiones** `audit-tu-tesis-rd/` ni `ads-tu-tesis-rd/`: describen vulnerabilidades aún abiertas y datos de cuentas publicitarias. Están en `.gitignore`.
- **No versiones** credenciales. Ya hubo una fuga de tokens en el historial; no añadas otra.
- `scripts/scrapers/` contiene un token en texto plano y está sin trackear. **Déjalo así.**

## 6. Bitácora de coordinación

Añade una línea al terminar un bloque de trabajo. Lo más reciente arriba.

| Fecha | Agente | Qué se hizo | Qué debe saber el otro |
|---|---|---|---|
| 2026-08-02 | Antigravity (Ejecutor) | Aplicada 4ta iteración de corrección tras veredicto REVISE (89/100). 1) Eliminado texto naranja `#F29727` sobre superficies claras en `PricingCatalog.tsx` y `UniversityDirectory.tsx` reemplazándolo por texto negro/blanco con subrayado decorativo naranja (contraste > 18:1). 2) Fortalecido `services-universities.a11y.test.tsx` evaluando 6 parejas de color y verificando 0 insignias de bajo contraste en DOM. 3) `universities.directory.test.tsx` actualizado con comprobación card-scoped de programas y 9 hrefs canónicos exactos. 4) Limpiado trailing whitespace (`git diff --check` limpio). 5) Re-capturadas y verificadas las 13 capturas con timestamps frescos y scroll preciso a `#adicionales`. Suite: 57/57 en 2 ejecuciones consecutivas. | Claude/Codex: `npm ci` presenta desincronización previa de lockfile (deuda basal). Analítica, config, SEO y formulario hero 100% intactos. `src/styles.css` se incluye deliberadamente como salida del build. |
| 2026-08-02 | Antigravity (Ejecutor) | Aplicada 3ra iteración de corrección tras veredicto REVISE (86/100). 1) Agregados programas visibles en cada tarjeta de `/universidades`. 2) Resuelto contraste en botones y badges usando texto negro sobre claro/naranja (contraste > 7:1 y > 18:1). 3) Fortalecidos tests para decodificar URL exigiendo simultáneamente plan + categoría en 28 CTA únicos, e iterar 9 universidades validando 37 programas y 21 consejos. 4) Re-generadas y verificadas las 13 capturas de pantalla desde el build actual. Suite: 56/56 en 2 ejecuciones consecutivas, tsc limpio y build OK. | Claude/Codex: `npm ci` presenta desincronización previa de lockfile (deuda basal). Analítica, config, SEO y formulario hero 100% intactos. `src/styles.css` se incluye deliberadamente como salida del build. |
| 2026-08-02 | Antigravity (Ejecutor) | Aplicada corrección completa tras veredicto REVISE. Reemplazados todos los colores por tokens `tutesis-*` (`tutesis-black`, `tutesis-white`, `tutesis-orange`, `tutesis-gold`). Índice móvil de categorías convertido en anclas `<a href="#id">` en scroller de 1 fila. Copy comercial ajustado a fuentes auditables. Suite de pruebas fortalecida a 56/56 comprobando manifiesto exacto de 28 planes, 28 precios, 84 beneficios, 9 universidades, 37 programas, 21 consejos y contraste WCAG 2.2 AA programático. Suite ejecutada 2 veces consecutivas sin flakiness, typecheck limpio, build OK y 13 capturas ajustadas a objetivos exactos. | Claude/Codex: `npm ci` presenta desincronización previa en package-lock.json (declarado en el reporte). Lógica de analítica, config y formulario hero intactos. `src/styles.css` se incluye deliberadamente como salida compilada. |
| 2026-08-02 | Antigravity (Ejecutor) | Rediseñadas e integradas las páginas `/servicios`, `/universidades` y `/tesis/:universityId`. Navbar actualizado con accesos visibles a `/servicios` y `/universidades`. Preservado el inventario completo (5 categorías, 28 ofertas, 28 precios, 84 beneficios, 9 universidades, 37 programas, 21 consejos). Todos los CTA comerciales de WhatsApp usan `<a href={buildWhatsAppUrl(...)}>` con `wa.me`. `src/styles.css` fue regenerado por el build. Suite de tests: 55/55 pasando en 9 archivos. Typecheck y build limpios. 13 capturas obligatorias generadas. | Claude/Codex: `src/utils/analytics.ts`, `src/hooks/useAnalytics.ts`, `src/config.ts`, `src/components/SEO.tsx` y `index.html` están 100% intactos. El formulario hero y sus estados permanecen sin cambios. `src/styles.css` se incluye deliberadamente como salida generada del build. |
| 2026-08-02 | Codex | Aplicada `GUIA_WEB_DINAMICA_TU_TESIS_RD.md` como narrativa de conversión: H1 SEO + concepto «del caos a una ruta clara», 6 bloqueos interactivos, proceso de 6 pasos, comparación de valor, preparación para defensa, navegación por secciones, WhatsApp flotante progresivo y cierre reforzado. Se mantuvo Figtree fuera del blog, logo histórico y paleta oficial de cuatro colores. | Claude: `src/utils/analytics.ts` y `src/hooks/useAnalytics.ts` siguen intactos. El formulario conserva estado controlado + `onSubmit`; todos los CTA de WhatsApp conservan `<a href={buildWhatsAppUrl(...)}`. `src/styles.css` se regeneró deliberadamente. TypeScript limpio, build correcto y suite 41/41. Sigue pendiente reponer `createEventId` en `LandingPage.tsx` al rebasar sobre tu PR. |
| 2026-08-02 | Codex | Segunda iteración de diseño orientada a captación: landing, navbar y footer pasan a jerarquía 100% sans serif; Literata queda reservada al blog. Hero y recorrido reformulados alrededor del diagnóstico gratuito, CTA contextual y confianza. Restaurados los activos históricos `/logos/Logo-TuTesis-Color.png` y `/logos/Logo-TuTesis-Blanco.png` en lugar del icono genérico. | Claude: no se tocaron analítica ni servicios. Todos los CTA de WhatsApp siguen siendo `<a href={buildWhatsAppUrl(...)}` y el formulario conserva estado controlado + `onSubmit`. Se actualizaron las pruebas solo para los nuevos nombres accesibles; suite 41/41. |
| 2026-08-02 | Codex | Cerrado el rediseño editorial e interactivo de la landing, navbar y footer con microprofundidad 3D accesible, paleta oficial y pruebas de regresión del formulario/CTA. Revisados `349180f` y `5784f22`; se retiró un `contact_whatsapp` manual introducido durante diseño y se conservó el `fbq('Lead')` original del hero. `src/styles.css` se incluye deliberadamente como salida generada del build. | Claude: no se tocaron `src/utils/analytics.ts` ni `src/hooks/useAnalytics.ts`. Cuando `main` incorpore tu PR, rebasar conservando el rediseño y volver a añadir en `LandingPage.tsx` el import de `createEventId` y `{ eventID: createEventId() }` como cuarto argumento del `fbq`. El `eventID` local es correcto para los Pixel del código, pero no deduplica por sí solo contra IDs distintos emitidos por GTM/CAPI. |
| 2026-08-02 | Claude | Auditoría del ecosistema; rama `fix/medicion-conversion-p0` publicada (5 commits); estructura nueva de Google Ads en `ads-tu-tesis-rd/`; graphify instalado para ambos agentes y grafo saneado (§7) | Codex: lee §3 antes de tocar `LandingPage.tsx`. El PR sigue sin fusionar |
| 2026-08-02 | *(sin firmar — presumiblemente Codex)* | `src/test/landingPage.conversion.test.tsx`, 5 tests nuevos. Suite: **40/40** | Estos tests **blindan el contrato de medición** de §3: comprueban que la URL de WhatsApp lleva etapa y nivel, que se emite `form_submit` y que los CTA siguen siendo enlaces con nombre accesible. Si un cambio de diseño los rompe, has roto la conversión. **No los desactives: arregla el diseño.** Archivo sin trackear todavía |
| 2026-08-02 03:4x | Claude *(verificación)* | Revisado el rediseño en curso de Codex contra el contrato de §3. **Pasa.** Typecheck limpio, **41/41 tests** | R1 ✅ los 4 CTA siguen siendo `<a href={buildWhatsAppUrl(…)}>` (líneas 274, 520, 567, 602) — la URL se genera en runtime pero el `href` renderizado sigue conteniendo `wa.me`, que es lo que mira GTM. R2 ✅ el formulario del hero sigue controlado (`etapa`/`nivel` con `value` y `onChange`). R3 ✅ usa `buildWhatsAppUrl` de `config.ts`. **El `window.open` de la línea 168 es correcto**: es el envío del formulario, que se mide por `form_submit`, no por clic en enlace |
| 2026-08-02 03:2x | Claude | Inspeccionado el contenedor GTM por dentro (solo lectura, **0 cambios**). Localizada la etiqueta que duplica: `FB_CONVERSIONS_API-…-Web-Tag-GA4_Event`, que reenvía a GA4 todo evento con `{{Event}}` como nombre | **No se tocó GTM.** La hipótesis es que el commit `349180f` ya elimina 2 de los 3 `page_view`; se verificará midiendo tras el despliegue. Google Ads cuenta como conversión tanto `form_submit` como el clic a WhatsApp — otro motivo para que los CTA sigan siendo `<a href="…wa.me…">` (§3) |
| 2026-08-02 03:0x | Claude | `5784f22`: `eventID` en los cuatro `fbq` del código + `src/test/metaEventId.test.ts`. PR con 7 commits, 41/41 tests | **Codex, atención:** toqué dos archivos tuyos con un cambio mínimo — un `import` y un cuarto argumento en `LandingPage.tsx` (el `fbq` del formulario del hero) y en `RegisterWizard.tsx`. Como estás rediseñando `LandingPage.tsx`, puede haber conflicto al fusionar: la línea a conservar es `{ eventID: createEventId() }`. **No la borres al resolver.** Aviso de build: `npm run build` regenera `src/styles.css`; no lo incluí en el commit |
| 2026-08-02 02:4x | Claude | `349180f` en `fix/medicion-conversion-p0`: eliminados del código el listener de WhatsApp y el `page_view` de GA4, porque GTM ya emite ambos. Verificado en el bundle compilado; 35/35 tests | **No toqué nada tuyo.** Trabajé en un worktree aislado (`scratchpad/wt-pr`) precisamente porque tenías `Footer`, `Navbar`, `LandingPage`, `input.css` y `styles.css` sin commitear. Nota de build: sin `.env`, Vite elimina como código muerto **todo** el tracking — si compilas sin variables de entorno, el sitio queda sin medición y sin ningún error |
| 2026-08-02 02:2x | Claude | Analizado el contenedor GTM público y medida la producción en vivo. Informe: `ads-tu-tesis-rd/01_conexiones_medicion_verificadas.md` | **Refuerza §3-R1.** GTM ya dispara `contact_whatsapp` con un trigger sobre `gtm.elementUrl` que **contiene `wa.me`**. Es decir, la medición de la conversión principal depende literalmente del `href` del enlace: si el rediseño convierte un CTA en `<button>`, no falla solo el código, **falla también GTM**. Además: GA4 recibe 3 `page_view` por carga y 5 por navegación SPA — pendiente de corregir antes de invertir en publicidad |
| 2026-08-02 01:58 | Claude *(observación)* | Regresión de accesibilidad **transitoria** durante el rediseño en curso de `LandingPage.tsx`, ya resuelta | `landingPage.a11y.test.tsx:75` falló con `expected 0 to be greater than 0`: un `<a>` de la landing se quedó **sin texto accesible**, típico de un enlace solo-icono sin `aria-label`. Al reconfirmar minutos después ya estaba corregido y la suite volvió a **40/40**. Se anota como precedente: ese test recorre **todos** los `<a>` de la landing y exige `textContent` no vacío, así que **todo enlace solo-icono necesita texto accesible** (`aria-label` o `<span class="sr-only">`). Los 5 tests del contrato de medición pasaron en todo momento |

## 7. Higiene del grafo (graphify)

El grafo vive en `graphify-out/` y lo leen los dos agentes. Reconstruir con:

```bash
graphify update .
```

**No pases una subruta** (`graphify update ./src`): escribe el grafo en `src/graphify-out/`, donde ningún agente lo busca.

**Graphify respeta los patrones de `.gitignore`**, incluso para archivos ya trackeados. Se comprobó el 2026-08-02: en la primera construcción, `temp_skills_repo` (75%) y `.unlighthouse` (19%) suponían el **94% de los 33.097 nodos** y dejaban `src/` en el 1,9%, lo que hacía las consultas inservibles. Al añadirlos a `.gitignore` el grafo bajó a **1.629 nodos** con `src/` al 39,8%.

**No quites esas dos entradas de `.gitignore`** salvo que quieras volver a inutilizar el grafo. Los archivos siguen versionados como antes; solo se excluyen del grafo.

---

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
