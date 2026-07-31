# 15 · Correcciones aplicadas y acciones pendientes de tu intervención

**Fecha:** 2026-07-31 · **Rama:** `fix/auditoria-p0-medicion-conversion` · **Base:** `main` (`66ffcb8`)
**Estado:** 5 commits locales. **No se ha hecho push, no se ha desplegado nada a producción.**

Ningún activo de NES CAMP fue tocado. `.mcp.json` sigue en disco intacto, así que sus conexiones MCP siguen operativas.

---

## A. HALLAZGO NUEVO Y CRÍTICO detectado durante la corrección

### H-24 · Tokens de la API de Meta en texto plano, versionados en git

- **Clasificación:** Verificado
- **Evidencia:** `.claude/settings.local.json` estaba **trackeado en git** y contenía **23 entradas** de comandos permitidos con tokens de acceso de Graph API incrustados (`access_token=EAA…`), correspondientes a **3 tokens distintos** y a la cuenta publicitaria **`act_777831645113258`**. Presentes en el historial al menos desde los commits `85237fb` y `8219809`.
- **Impacto:** Más grave que H-01. Un token de Graph API con permisos de marketing permite leer y potencialmente modificar campañas, públicos y datos del pixel de la cuenta de Meta Ads de Tu Tesis RD. Como están en el historial de git, siguen siendo recuperables desde cualquier clon aunque el archivo ya esté limpio.
- **Dato colateral útil:** este hallazgo **identifica la cuenta de Meta Ads de Tu Tesis RD** (`act_777831645113258`), que hasta ahora figuraba como desconocida en el inventario.
- **Prioridad:** **P0**
- **Qué hice:** eliminé las 23 entradas del archivo, lo saqué del control de versiones y lo añadí a `.gitignore`. El archivo local sigue funcionando.
- **Qué NO puedo hacer:** rotar los tokens. **Requiere tu intervención.**
- **Requiere aprobación:** Sí.

---

## B. Correcciones aplicadas y verificadas

| ID | Corrección | Verificación realizada |
|----|-----------|------------------------|
| **H-02** | `navigate('/student/success')` → `/exito` | ✅ Navegué a `/exito` en el servidor local: renderiza `SuccessScreen` con el bloque de código de rastreo |
| **H-17** | Página 404 + ruta catch-all `path="*"` | ✅ Navegué a `/una-ruta-que-no-existe-12345`: muestra la página 404 con accesos a Servicios, Universidades, Blog, Matriz y CTA de WhatsApp |
| **H-03** | Formulario del hero controlado; los datos viajan al evento y al mensaje | ✅ Simulé un envío con "Me preparo para la defensa" + "Doctorado". Resultado capturado: `wa.me/18297513267?text=Hola, quiero mi diagnóstico gratis. Etapa: Me preparo para la defensa. Nivel académico: Doctorado`, y el push a dataLayer incluye `diagnostico_etapa` y `diagnostico_nivel` |
| **H-04** | Listener delegado para los CTA de WhatsApp | ✅ Simulé un clic: se dispara `contact_whatsapp` con `send_to: G-2XTMDMXZFC` y `event_category: Contacto` |
| **H-05** | `PageView` duplicado de Meta eliminado | ✅ `initGA()` ya solo hace `fbq('init')`; el `PageView` lo emite únicamente `logPageView()` |
| **H-06** | `fbq('trackCustom', …)` para eventos no estándar | ✅ Typecheck y build correctos; `contact_whatsapp` mapeado además a `Lead` |
| **H-09** | 6 slugs semánticos + 6 redirecciones 301 | ✅ Navegué a `/blog/como-defender-tu-tesis`: carga el artículo con su título correcto |
| **H-12** | `robots.txt` con las rutas reales | ✅ Ahora bloquea `/registro`, `/monitoreo`, `/exito`, `/design`, `/admin`, `/portal` |
| **H-19** | SEO en `/blog`, `/herramientas`, `/herramientas/matriz` + `noIndex` en rutas privadas | ✅ Nueva prop `noIndex` en `SEO.tsx` |
| **H-11 / H-13** | Cambios de NAP que estaban sin commitear, ahora commiteados | ✅ Se completó la sustitución de `wa.me/message/YESJDSE3MZ3IM1` y del teléfono en schema.org |
| **H-01** | `.mcp.json` fuera de git + `.mcp.json.example` | ✅ Archivo local intacto |
| **H-24** | `.claude/settings.local.json` limpio y fuera de git | ✅ 0 tokens restantes en el archivo |
| — | Títulos duplicados (`… \| TuTesisRD \| TuTesisRD - …`) | ✅ Detectado durante la verificación y corregido en `SEO.tsx`; afectaba a 5 páginas |

**Verificación global:** `tsc --noEmit` sin errores · **35/35 tests pasan** (incluidas las pruebas de accesibilidad de LandingPage y RegisterWizard, ambas modificadas) · build de producción correcto.

---

## C. Evidencia nueva sobre el contenedor GTM

Durante la prueba del listener de WhatsApp se observó que, junto a `contact_whatsapp`, el dataLayer recibió un evento **`gtm.linkClick`**.

- **Qué significa:** el contenedor `GTM-MSLMDDLR` **tiene activado el listener automático de clics en enlaces** ("Click - Just Links").
- **Por qué importa:** si además existe una etiqueta enganchada a ese activador que apunte a enlaces `wa.me`, ahora habría **doble conteo** de la conversión de WhatsApp: la del código nuevo y la de GTM.
- **Acción requerida:** al abrir GTM, comprobar si hay una etiqueta sobre clics de `wa.me`. Si la hay, **desactivar una de las dos** — preferentemente la de GTM, ya que la del código emite parámetros más ricos y cubre enlaces futuros automáticamente.
- **Clasificación:** Verificado (el listener está activo) / No evaluado (si hay etiqueta enganchada).

Esto reduce parcialmente la incertidumbre de H-04 pero **no la cierra**.

---

## D. Requiere tu intervención — no puedo hacerlo yo

### D.1 Urgente (seguridad)

| # | Acción | Por qué solo puedes hacerlo tú |
|---|--------|-------------------------------|
| 1 | **Rotar los 3 tokens de Meta Graph API** (cuenta `act_777831645113258`) | Requiere sesión en Meta for Developers / Business Manager |
| 2 | **Rotar el token de desarrollador de Google Ads** | Requiere el centro de API de Google Ads |
| 3 | **Confirmar si el repositorio de GitHub es público** | `gh` no está autenticado (`HTTP 401`). Determina si hay que purgar el historial con urgencia |
| 4 | **Purgar el historial de git** si el repositorio es o fue público | Reescribe la historia y requiere `push --force`: decisión tuya |

> Ordena así: primero rota (invalida el secreto de inmediato), después decide sobre la purga (limpia el rastro).

### D.2 Desplegar los cambios

Los 5 commits están **solo en local**, en la rama `fix/auditoria-p0-medicion-conversion`. No hice push porque un push a `main` dispara el auto-deploy de Vercel a producción, y eso es una acción hacia fuera que no me corresponde decidir.

Para revisar los cambios:

```bash
git log --oneline main..fix/auditoria-p0-medicion-conversion
```

Para publicar cuando lo apruebes:

```bash
git checkout main && git merge fix/auditoria-p0-medicion-conversion && git push origin main
```

### D.3 Requiere accesos que no tengo

| # | Acción | Bloqueante |
|---|--------|-----------|
| 5 | Verificar en GTM si hay etiqueta duplicada sobre clics de `wa.me` (sección C) | Acceso a GTM |
| 6 | Confirmar que `contact_whatsapp` llega a GA4 y marcarlo como evento clave | Acceso a GA4 |
| 7 | Enviar el nuevo `sitemap.xml` en Search Console y vigilar las 6 redirecciones 301 | Acceso a GSC |
| 8 | Revisar en Meta Events Manager que el `PageView` ya no se duplica | Acceso a Meta |
| 9 | Auditar las políticas RLS de Supabase de Tu Tesis RD | Acceso al proyecto |
| 10 | Separar credenciales por organización (procedimiento en `10_separacion_nes_camp.md` §5) | Decisión tuya |

### D.4 Decisiones de negocio pendientes

| # | Decisión | Contexto |
|---|----------|----------|
| 11 | **Persistir los leads del formulario del hero en base de datos** | Hoy los datos viajan al mensaje de WhatsApp, que ya recupera el valor comercial. Guardarlos además en Supabase exige crear una tabla nueva: es un cambio de esquema que no hago sin tu visto bueno |
| 12 | **Definir el teléfono canónico** | Siguen conviviendo `18297513267` (WhatsApp, 19 usos) y `+18094557280` (schema.org y footer) |
| 13 | **Reducir la fricción del wizard** (C-1: importes, C-2: `signUp` obligatorio) | Son hipótesis de CRO; conviene medirlas antes de cambiar |
| 14 | **Antispam en el formulario de registro** (H-18) | Elegir entre Turnstile, reCAPTCHA o honeypot |
| 15 | **Consent Mode v2 y banner** (H-08) | Tiene implicaciones legales |
| 16 | **Prerenderizado / SSR** (H-10) | Cambio arquitectónico de calado |

---

## E. Lo que deliberadamente no toqué

- **Nada de NES CAMP.** Ni sus campañas, ni su propiedad GA4, ni su proyecto Supabase, ni sus credenciales.
- **`package.json` y `package-lock.json`**, que tienen cambios tuyos sin relación (`axios`, `cheerio`, `tsx`, probablemente para `scripts/scrapers/`). Los dejé como estaban.
- **El historial de git**, porque reescribirlo es irreversible y requiere tu decisión.
- **Producción**, porque no hice push.
