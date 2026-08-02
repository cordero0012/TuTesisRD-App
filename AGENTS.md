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

**Ramas vivas:**
- `main` — lo que hay en producción
- `fix/medicion-conversion-p0` — publicada, pendiente de PR (solo código)
- `fix/auditoria-p0-medicion-conversion` — rama local de trabajo de Claude

**Antes de crear una rama de diseño, pártela desde `origin/main`** y avisa en §6.

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
| 2026-08-02 | Claude | Auditoría del ecosistema; rama `fix/medicion-conversion-p0` publicada (5 commits); estructura nueva de Google Ads en `ads-tu-tesis-rd/`; graphify instalado para ambos agentes y grafo saneado (§7) | Codex: lee §3 antes de tocar `LandingPage.tsx`. El PR sigue sin fusionar |
| 2026-08-02 | *(sin firmar — presumiblemente Codex)* | `src/test/landingPage.conversion.test.tsx`, 5 tests nuevos. Suite: **40/40** | Estos tests **blindan el contrato de medición** de §3: comprueban que la URL de WhatsApp lleva etapa y nivel, que se emite `form_submit` y que los CTA siguen siendo enlaces con nombre accesible. Si un cambio de diseño los rompe, has roto la conversión. **No los desactives: arregla el diseño.** Archivo sin trackear todavía |
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
