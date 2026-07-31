# 04 · Auditoría de la página web

**Fecha:** 2026-07-31 · **Dominio:** `https://www.tutesisrd.online` · **Modo:** solo lectura

**Stack verificado:** React 19.2 + Vite 6 + React Router 7 (SPA client-side), Tailwind 3.4, Supabase como backend, desplegado en Vercel (proyecto `tu-tesis-rd-app`). Sin SSR ni prerender.

---

## A. Seguridad y gestión de secretos

### H-01 · Token de desarrollador de Google Ads versionado en git

- **Clasificación:** Verificado
- **Evidencia:**
  - `.mcp.json` contiene la variable `GOOGLE_ADS_DEVELOPER_TOKEN` con un valor literal.
  - `git ls-files --error-unmatch .mcp.json` → **el archivo está trackeado**.
  - `git log -- .mcp.json` → introducido en el commit `dea5f0b`.
  - El repositorio tiene remoto en `github.com/cordero0012/TuTesisRD-App`.
  - *(No se pudo confirmar si el repositorio es público: `gh` devolvió `HTTP 401 Bad credentials`.)*
- **Impacto:** Un token de desarrollador de Google Ads permite operar contra la API de Ads. Está en el historial de git, así que borrarlo del archivo actual **no lo elimina**: sigue recuperable desde cualquier clon. Si el repositorio es público o lo fue en algún momento, debe considerarse comprometido.
- **Prioridad:** **P0**
- **Confianza:** Alta sobre la exposición en git. Media sobre la severidad final (depende de la visibilidad del repositorio).
- **Recomendación, en este orden:**
  1. Confirmar la visibilidad del repositorio en GitHub.
  2. **Rotar el token** en el centro de API de Google Ads, independientemente de la visibilidad.
  3. Añadir `.mcp.json` a `.gitignore` y versionar en su lugar un `.mcp.json.example` sin valores.
  4. Si el repositorio es o fue público, purgar el historial (`git filter-repo`) y forzar la reescritura.
- **Validación propuesta:** `git log -p -- .mcp.json` para confirmar que el valor desapareció del historial tras la purga.
- **Requiere aprobación:** Sí.

> Nota positiva verificada: `.env` y `.env.local` **no** están versionados (solo `.env.example`), y un escaneo de patrones de secretos (`sk-`, `AIza`, JWT) sobre todos los archivos versionados no arrojó coincidencias. El problema está acotado a `.mcp.json`.

---

## B. Conversión y experiencia de usuario

Los dos hallazgos más graves del sitio están documentados en detalle en `08_auditoria_analytics_tracking.md` porque su evidencia es compartida con la medición:

- **H-02 — Ruta `/student/success` inexistente.** El usuario que completa el registro aterriza en una pantalla en blanco y nunca ve su código de seguimiento. `RegisterWizard.tsx:157` vs `App.tsx:138`. **P0.**
- **H-03 — El formulario "Diagnóstico Rápido" descarta los datos del usuario** y aun así dispara `form_submit` y `fbq('track','Lead')`. `LandingPage.tsx:206-218`. **P0.**

### H-17 · No existe página 404

- **Clasificación:** Verificado
- **Evidencia:** No hay `<Route path="*">` en `src/App.tsx`. `vercel.json` reescribe todo a `/`, y `package.json:8` copia `index.html` a `404.html` en el build. Resultado: cualquier URL inexistente devuelve HTTP 200 con el shell del SPA, que renderiza vacío.
- **Impacto:** Doble. En UX, callejón sin salida sin navegación de retorno. En SEO, **soft 404s**: Google recibe 200 OK con contenido vacío para URLs rotas, lo que desperdicia presupuesto de rastreo y puede afectar la evaluación de calidad del sitio.
- **Prioridad:** P1
- **Confianza:** Alta
- **Recomendación:** Añadir ruta catch-all con página 404 útil (buscador, enlaces a servicios y blog, CTA de WhatsApp).
- **Requiere aprobación:** Sí.

### H-11 · Inconsistencia NAP (nombre, dirección, teléfono)

- **Clasificación:** Verificado
- **Evidencia:** Conteo sobre `src/`, `public/` e `index.html`:
  - `18297513267` → 19 apariciones (todos los enlaces de WhatsApp)
  - `+18094557280` → 5 apariciones (`tel:` del footer y schema.org)
  - `+18294435985` → valor **anterior** del schema.org, sustituido en un cambio aún sin commitear
  - Correo de contacto: `ttesisrd@gmail.com` (4 apariciones)
- **Impacto:** Tres números distintos han representado a la marca. El `schema.org` declara `+18094557280` como teléfono principal mientras que el 100 % de los CTA llevan a WhatsApp `18297513267`. Para SEO local, la consistencia NAP entre sitio, Google Business Profile y directorios es un factor de posicionamiento directo; para el usuario, dos números generan duda sobre cuál es el canal válido.
- **Prioridad:** P1
- **Confianza:** Alta
- **Recomendación:** Definir un número canónico, propagarlo a schema.org, footer, GBP y perfiles sociales, y centralizarlo en una constante única del código en vez de 19 literales repetidos.
- **Validación propuesta:** Auditoría de citaciones NAP en directorios dominicanos.
- **Requiere aprobación:** Sí.

### H-13 · El árbol de trabajo diverge de producción

- **Clasificación:** Verificado
- **Evidencia:** `git diff --stat` → 13 archivos modificados sin commitear, entre ellos `index.html`, `LandingPage.tsx`, `Navbar.tsx`, `Footer.tsx`. El diff de `index.html` muestra una corrección **pendiente de desplegar**: `telephone` pasa de `+18294435985` a `+18094557280` y `sameAs` de `wa.me/message/YESJDSE3MZ3IM1` a `wa.me/18297513267`.
- **Impacto:** El schema.org en producción sigue declarando un teléfono y un enlace de WhatsApp obsoletos. Además, cualquier conclusión de esta auditoría basada en el código local puede no reflejar lo desplegado.
- **Prioridad:** P1
- **Confianza:** Alta
- **Recomendación:** Revisar, commitear y desplegar los cambios pendientes, o descartarlos deliberadamente. No dejar el árbol en estado intermedio.
- **Validación propuesta:** Rich Results Test sobre la home en producción para confirmar el teléfono servido.
- **Requiere aprobación:** Sí.

---

## C. Rendimiento técnico

### Observaciones verificadas

| Aspecto | Estado | Evidencia |
|---------|--------|-----------|
| HTTPS | ✅ Correcto | Producción responde en `https://` |
| Redirección apex → www | ✅ Correcto | `vercel.json` redirige `tutesisrd.online` → `https://www.tutesisrd.online` con `permanent: true` (301) |
| Carga de fuentes | ✅ Bien optimizada | `preconnect` + `preload` + patrón `media="print" onload` con fallback `<noscript>` (`index.html:121-148`) |
| Code splitting | ✅ Presente | Rutas cargadas con `React.lazy` + `Suspense` (`App.tsx:31, 118`) |
| GTM en `<head>` | ⚠️ Bloqueante | `index.html:6-10`, carga síncrona antes del contenido |
| Peso de dependencias | ⚠️ Alto | `package.json` incluye `pdfjs-dist`, `jspdf`, `docx`, `mammoth`, `recharts`, `framer-motion` **y** `motion` (duplicado), `cheerio`, `pg` |
| `pg` en cliente | ⚠️ Revisar | Driver de PostgreSQL en `dependencies`; si entra al bundle es peso muerto grande en el navegador |
| `framer-motion` + `motion` | ⚠️ Duplicado | Ambos en `dependencies`; `motion` es el sucesor de `framer-motion` |

### No evaluado

- **Core Web Vitals reales (datos de campo).** Requiere Search Console o CrUX. Sin ellos no se puede afirmar nada sobre LCP/INP/CLS en usuarios reales.
- **Lighthouse en producción.** Existe una carpeta `.unlighthouse/` en el repositorio, no analizada en esta sesión.
- **Errores de consola y enlaces rotos en runtime.** Requiere ejecución con JavaScript.

---

## D. Confianza y privacidad

| Elemento | Estado | Evidencia |
|----------|--------|-----------|
| Política de privacidad | ✅ Existe | `/politica-de-privacidad` (`App.tsx:153`) |
| Términos y condiciones | ✅ Existe | `/terminos-y-condiciones` (`App.tsx:154`) |
| Eliminación de datos | ✅ Existe | `/eliminacion-de-datos` (`App.tsx:155`) — requisito de Meta, correcto |
| Banner de consentimiento | ❌ **No existe** | Cero coincidencias de `cookie consent` / `consent mode` / `gtag('consent'` en `src/` |
| Consent Mode v2 | ❌ No implementado | Ídem |
| Protección antispam en formularios | ❌ No detectada | Sin captcha, honeypot ni rate limiting en `RegisterWizard.tsx` |
| PII en dataLayer | ⚠️ Sí, en texto plano | Ver H-08 en `08_auditoria_analytics_tracking.md` |
| Áreas sensibles en robots.txt | ⚠️ Parcialmente incorrecto | Ver H-12 en `05_auditoria_seo_cro.md` |

### H-18 · Formulario de registro sin protección antispam

- **Clasificación:** Verificado (ausencia en código)
- **Evidencia:** `RegisterWizard.tsx` ejecuta `supabase.auth.signUp` y dos `insert` sin ninguna barrera previa.
- **Impacto:** Un bot puede crear cuentas de auth, filas en `students` y en `projects` de forma masiva. Contamina la base comercial, distorsiona las métricas de conversión y consume cuota de Supabase.
- **Prioridad:** P2 (sube a P1 si ya se observa spam en la base)
- **Confianza:** Alta sobre el código; el estado real de la base **no ha sido evaluado** (sin acceso al proyecto Supabase de Tu Tesis RD).
- **Recomendación:** Añadir Turnstile/reCAPTCHA v3 o un honeypot, más rate limiting por IP a nivel de Edge Function.
- **Requiere aprobación:** Sí.
