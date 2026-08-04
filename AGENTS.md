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

> **Corregido 2026-08-03 (Claude):** esta sección describía el PR de medición como "sin fusionar". **Ya está fusionado.** Verificado con `git merge-base --is-ancestor` y `git branch --contains`: `main` y `origin/main` están en el mismo commit (`3bd9397`) y ambos contienen `349180f` y `5784f22`, más 13 commits posteriores de Codex encima. Detalle y evidencia completa en `audit-tu-tesis-rd/17_auditoria_final_pre_fusion.md`.

| Hecho | Estado |
|---|---|
| Backend Supabase de producción **caído** (NXDOMAIN) | Sigue caído — reverificado hoy con `nslookup`. `/registro`, `/portal`, `/admin` y las herramientas de IA no funcionan. El sitio informativo sí |
| **Corregido 2026-08-03 (Claude):** Google Ads, GA4, GTM y Meta de Tu Tesis RD **sí tienen acceso real** | Vía navegador con el login correcto de Miguel (`ttesisrd@gmail.com`): GTM editado y publicado esta sesión, Google Ads y GA4 verificados con datos en vivo, Meta reconectado de punta a punta. Detalle completo en `ads-tu-tesis-rd/05_handoff_siguiente_sesion.md`. **Lo que sigue sin servir:** el MCP de Google Ads (`mcp__google-ads__*`) — solo tiene acceso a la cuenta de NES CAMP (`4456869415`), no a Tu Tesis RD; hay que reconfigurar `.mcp.json` si se quiere usar el MCP en vez del navegador |
| El repositorio de GitHub es **público** | Ver §5 |
| Geolocalización de Higüey incorrecta en `index.html` (coordenadas de Santo Domingo) | Sigue sin corregir — falta confirmar la dirección exacta de la oficina |

**Ramas — estado real al 2026-08-03:**

| Rama | Dónde | Qué lleva |
|---|---|---|
| `main` / `origin/main` | Producción (`3bd9397`) | **Ya incluye** `349180f` (deduplicación GTM) y `5784f22` (eventID de Meta), además del rediseño completo de Codex y la corrección de `/exito` (H-02) |
| `fix/auditoria-p0-medicion-conversion` | **Local. Rama de trabajo actual** | Diverge de `main` en más de lo esperado: `src/utils/analytics.ts`, `src/hooks/useAnalytics.ts` y el `fbq` del hero en `LandingPage.tsx` tenían la versión **anterior** a `349180f`/`5784f22` — ya corregidos en esta sesión, ver bitácora. `src/pages/Register/RegisterWizard.tsx` sigue siendo una implementación **distinta** a la de `main` (no es solo un conflicto de fusión trivial) |

**Pendiente real, no lo que decía antes:** decidir qué hacer con esta rama y, en particular, con `RegisterWizard.tsx` — no es un cherry-pick limpio de lo que ya está en `main`, son dos implementaciones del registro que divergieron. Antes de fusionar esta rama hacia `main` hace falta esa reconciliación explícita (fuera del alcance de una sesión de medición/ads).

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
| 2026-08-04 (2) | Claude | Creada la estructura real de Meta Ads: campaña `Tu Tesis RD \| Leads \| RD` (`120248603951710298`) → ad set `Ad Set 1` (`120248604663030298`, $2.00/día — Meta rechazó $1.45 por debajo de su mínimo real, Miguel aprobó subir) → 8 anuncios (4 conceptos × 2 formatos), todo `PAUSED`. Detalle completo con IDs en `ads-tu-tesis-rd/07_creatividades_meta_recuperadas.md` §8. En el camino: (1) la App de Meta "Tu Tesis RD - Web" estaba en modo Desarrollo y bloqueaba crear anuncios — se completó `Configuración de la app → Básica` (política de privacidad, términos, eliminación de datos apuntando a `/politica-de-privacidad`, `/terminos-y-condiciones`, `/eliminacion-de-datos` del sitio real en vez de placeholders de facebook.com que había ahí, más categoría "Educación") y se publicó la app a Live vía navegador; (2) Meta ahora exige `is_adset_budget_sharing_enabled` en la campaña y `targeting_automation.advantage_audience` en el ad set — parámetros nuevos no contemplados cuando se escribió `api/meta-ads-admin.ts` originalmente, ya corregidos en el archivo (commiteado esta sesión). También: usé el CLI de Vercel (login propio, ver memoria de sesión) para confirmar que el deploy de la rama sí llevaba el código nuevo y que `ADMIN_TOOL_SECRET`/`META_CAPI_TEST_EVENT_CODE` estaban bien configurados. | Codex: sin cambios de diseño. `api/meta-ads-admin.ts` actualizado y pusheado — el default de `create_lead_campaign` ahora es $2.00/día, no $1.45. **Pendiente de Miguel:** revisar los 8 anuncios en Ads Manager (Meta los está evaluando, `effective_status: IN_PROCESS`) y activarlos manualmente cuando esté conforme — nada quedó activo |
| 2026-08-04 | Claude | Auditoría completa de ads (`ads-tu-tesis-rd/06_auditoria_consolidada_2026-08-04.md`) y arranque de la fase Meta. Con un token personal de 1h que Miguel compartió para esta sesión, se investigó la cuenta de Meta y se recuperaron 12 creativos profesionales (subidos 2026-05-01, campaña que los usaba borrada pero las imágenes sobrevivieron en la librería de `act_777831645113258`) — detalle en `ads-tu-tesis-rd/07_creatividades_meta_recuperadas.md`. Se confirmó que la Página de Facebook vieja seguía perdida (bloqueaba crear cualquier anuncio); Miguel creó una nueva ("Tu Tesis RD", ID `1235756289628667`). `api/meta-ads-admin.ts` (archivo sin trackear, ya existía sin commitear) se extendió con la acción `create_lead_ads`, que crea 8 anuncios en PAUSED (4 conceptos × 2 formatos) reutilizando los hashes de imagen ya subidos, y el presupuesto por defecto de `create_lead_campaign` pasó a $1.45/día. Decisión de presupuesto: prueba secuencial de 4-6 semanas — Meta se lleva el grueso ($1.45/día) mientras Google Ads baja a solo la campaña de Marca. Añadido `ADMIN_TOOL_SECRET` a `.env.example`. Verificado: `vitest` 59/59 (no se tocó `src/`). | Codex: sin cambios de diseño ni maquetación. `api/meta-ads-admin.ts` sigue sin commitear — pendiente de que Miguel autorice el push antes de poder desplegarlo y ejecutar las dos llamadas curl documentadas en `07_creatividades_meta_recuperadas.md`. También pendiente que Miguel asigne la Página nueva como activo del Usuario del Sistema en Business Settings |
| 2026-08-03 (5) | Claude | Cierre de sesión: reconexión de Meta Ads ejecutada de punta a punta (App, Usuario del Sistema, Pixel dedicado nuevo `1304072538248053` que reemplaza uno viejo compartido con 3 proyectos ajenos, CAPI en `api/meta-capi.ts`) y **corregido un tag de GTM** que tenía el Pixel ID viejo escrito literalmente en el HTML (`FB_CONVERSIONS_API-1885949815441420-Web-Tag-Pixel_Setup`), publicado como Versión 16. **Hallazgo mayor: Google Ads y GA4 de Tu Tesis RD sí tienen acceso real** (login `ttesisrd@gmail.com`, verificado con datos en vivo) — contradice lo que decía este archivo. El MCP de Google Ads sigue sin servir (solo ve la cuenta de NES CAMP). Encontrada una campaña de Google Ads **ya corriendo** ("Search | Leads | RD + Higüey | Tesis", $81.76 gastados, ahora pausada) que no estaba contemplada al escribir `00_estructura_google_ads.md`/`02_mapa_intencion_trends.md` — hay que reconciliar antes de importar esa propuesta. También: la conversión "Contacto" en Google Ads (42 conv., marcada Principal) resultó ser solo visitas a la home, no clics reales — mezclada al mismo nivel que `contact_whatsapp` (11 conv. reales), diluye la señal de puja. Handoff completo con checklist priorizado en `ads-tu-tesis-rd/05_handoff_siguiente_sesion.md` — **incluye un aviso urgente sobre `META_CAPI_TEST_EVENT_CODE` en Vercel que hay que verificar que se quitó**. | Codex: sin cambios de diseño. Antes de tocar `ads-tu-tesis-rd/00_estructura_google_ads.md` en la próxima sesión, leer primero `05_handoff_siguiente_sesion.md` §"Ya existe una campaña de Google Ads corriendo" |
| 2026-08-03 (4) | Claude | Reconexión de Meta Ads: Miguel ya tiene las cuentas (Business Manager, cuenta publicitaria, Página) vinculadas a su Meta personal; falta crear la App en Meta for Developers y asignar el Usuario del Sistema, que es una acción que solo él puede hacer (requiere su login, no hay MCP de Meta conectado). Documentada la guía completa en `ads-tu-tesis-rd/04_reconexion_meta_ads.md`. En paralelo se construyó el lado del código: **`api/meta-capi.ts`** (nuevo, mismo patrón que `api/gemini-proxy.ts`) reenvía eventos a la Conversions API de Meta usando un token 100% server-side; **`sendMetaCapiEvent()`** en `analytics.ts` y su llamada en el `Lead` del formulario del hero en `LandingPage.tsx`, reutilizando el mismo `eventId` que ya usa el Pixel del navegador para deduplicar. `contact_whatsapp` **no** se tocó — sigue siendo 100% de GTM. Verificado: `tsc` limpio, 59/59 tests, build OK. Añadidas `META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN` y `META_CAPI_TEST_EVENT_CODE` a `.env.example` con la advertencia explícita de configurarlas en Vercel, nunca en el repo. | Codex: cambios en `api/` (nuevo archivo), `src/utils/analytics.ts`, `src/pages/LandingPage.tsx` y `.env.example` — todos dentro de la propiedad de Claude. Sigue pendiente que Miguel: (1) cree la App y el Usuario del Sistema en Meta, (2) ponga el token en Vercel (nunca en chat ni en el repo), (3) revoque el Usuario del Sistema/token viejo asociado al token filtrado de H-24 — el archivo ya no está en el repo pero el token en sí sigue vivo hasta que se revoque en Meta. Presupuesto de Meta Ads sigue sin definir |
| 2026-08-03 (3) | Claude | Miguel fijó el presupuesto real de Google Ads en **$50/mes** (no $25/día como asumía la propuesta anterior). Reestructurado `ads-tu-tesis-rd/`: campañas `Asesoria` e `Higüey` fusionadas en una sola (`TTRD_SEARCH_NUCLEO_RD_ES`) porque fragmentar $50/mes en 4 campañas deja cada una por debajo de $0.50/día, insuficiente para que Google acumule señal. Presupuesto final: Marca $0.20/día (~$6/mes) + Núcleo $1.45/día (~$44/mes) = $1.65/día ≈ $50/mes (factor 30.4, no /30, siguiendo la mecánica real de facturación mensual de Ads). Pausados (no borrados) los grupos Doctorado, Marco Teórico, Tesis Maestría, Anteproyecto, Metodología y toda `Universidades` (incluido UASD, que había reactivado horas antes) — quedan documentados en `00_estructura_google_ads.md` §6 como fases 2 y 3 a reactivar cuando suba el presupuesto. `keywords.csv` y `anuncios_rsa.csv` reescritos y verificados: CSV parsea, cada grupo tiene su RSA, cero colisión con negativas. | Codex: sin cambios de código, solo archivos de `ads-tu-tesis-rd/` (gitignorados). Nada de esto se ha importado a una cuenta real — sigue sin haber acceso a Google Ads de Tu Tesis RD |
| 2026-08-03 (2) | Claude | Auditoría final pre-fusión (`audit-tu-tesis-rd/17_auditoria_final_pre_fusion.md`). Hallazgo principal: **el PR de medición ya está fusionado en `main`/`origin/main`** (§4 de este archivo estaba desactualizado, ya corregido) — pero esta rama local había quedado con una copia **más vieja** de `src/utils/analytics.ts` y `src/hooks/useAnalytics.ts` (con el listener duplicado de WhatsApp y sin `eventID` de Meta) que la ya corregida y desplegada en `main`. Se sobrescribieron ambos archivos con la versión de `main` y se añadió a `LandingPage.tsx` el import de `createEventId` + el 4º argumento `{ eventID: createEventId() }` en el `fbq('track','Lead',…)` del hero — exactamente la reconciliación que este archivo ya pedía. Verificado: `tsc` limpio, **59/59 tests**, build OK, y `grep` sobre el bundle compilado confirma que `initWhatsAppTracking` no llega a producción. Reverificados también H-01 (`.mcp.json` ya no trackeado), H-02 (`/exito` existe y funciona) y H-00/Supabase (siguen abiertos, Supabase sigue en NXDOMAIN). Escaneo de secretos sobre archivos trackeados: 0 coincidencias. `npm ci` corre limpio (la desincronización de lockfile que reportaban entradas previas ya no está). `npm audit`: 29 vulnerabilidades (5 críticas) en dependencias transitivas (`undici`, `ws`, `underscore`, `react-router` vía SDK) — no se aplicó `audit fix` por el riesgo de un mayor de `react-router` sin ronda de pruebas dedicada. | Codex: `src/pages/Register/RegisterWizard.tsx` en esta rama **no es un cherry-pick limpio** de lo que ya está en `main` — es una implementación distinta (diff de cientos de líneas, sin ninguna llamada a `fbq`). No lo toqué por estar fuera de mi propiedad de archivos y por el tamaño del diff; hace falta una decisión explícita sobre cuál versión del registro es la vigente antes de fusionar esta rama. La geolocalización de Higüey en `index.html` sigue sin corregir, sigue faltando la dirección exacta |
| 2026-08-03 | Claude | Revisada la estructura de Google Ads contra Google Trends RD (término "tesis", 2/7-2/8/26): nuevo `ads-tu-tesis-rd/02_mapa_intencion_trends.md` clasifica 18 consultas + 25 entidades por intención. Cambios: 10 negativas nuevas en `negativas_universales.csv` (empastado, agradecimiento, dedicatoria, google scholar/academico, oficina de tesis, regalo, acto de graduacion, diapositivas, repositorio); `keywords.csv` gana ad groups **Doctorado** y **Marco Teorico** (Asesoria) y **UNPHU** (Universidades, Paused); ad group **UASD** reactivado (Enabled) solo en Exacta calificada; presupuesto reasignado Asesoría $15→$11, Universidades $5 pausada→$4 parcialmente activa (total sigue en $25/día). `anuncios_rsa.csv` con 3 RSA nuevos, validados contra límites de Google (30/90/15) y sin comas sueltas rompiendo columnas. Verificado con csv.reader que ninguna keyword Enabled colisiona con una negativa. | Codex: no se tocó nada de diseño ni maquetación. Solo archivos de `ads-tu-tesis-rd/`, que están en `.gitignore` y no se suben al repo público. `tesis done` (Trends, en aumento) se dejó sin clasificar a propósito — no hay evidencia de si es marca competidora o app de terceros; ver §5 del nuevo archivo antes de decidir. Sigue sin resolverse el bug de geolocalización de Higüey (`index.html`, coordenadas de Santo Domingo) — pendiente de confirmar dirección exacta |
| 2026-08-02 | Codex (Ejecutor) | Cierre visual de `/servicios`, `/universidades` y `/tesis/:universityId` aplicando `impeccable`, `ui-ux-pro-max` y `agency-ui-designer`: iconografía pública unificada en Lucide, targets táctiles y focos reforzados, ritmo móvil de Servicios compactado para mostrar el índice en una fila y locators estables añadidos a los CTA. Se fortaleció la regresión a 59 pruebas y el script externo de capturas ahora falla ante objetivos fuera del viewport, wrapping, overflow horizontal o menú cerrado. Se regeneraron deliberadamente `src/styles.css` y las 13 capturas desktop/móvil. | Claude: no se tocaron `src/utils/analytics.ts`, `src/hooks/useAnalytics.ts`, `src/config.ts`, servicios de leads ni SEO. Todos los CTA conservan `<a href={buildWhatsAppUrl(...)}` con `wa.me`; el formulario hero permanece controlado con `onSubmit={handleDiagnosticoSubmit}`. TypeScript limpio, suite 59/59 dos veces, build correcto y visual-verdict 96/100. Los cambios paralelos preexistentes en `index.html`, `package*.json`, `.gitignore` y `.omx/` se preservaron y no deben incluirse en este bloque. |
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
