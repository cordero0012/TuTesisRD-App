# 08 · Auditoría de analítica y medición

**Fecha:** 2026-07-31 · **Modo:** solo lectura

Esta es el área con mayor densidad de evidencia verificable, porque toda la instrumentación vive en el repositorio. También es el área con el problema estructural más grave del ecosistema.

---

## A. Arquitectura de medición actual (verificada)

### Identificadores confirmados

| Activo | ID | Fuente de verificación |
|--------|-----|------------------------|
| Google Tag Manager | `GTM-MSLMDDLR` | `index.html:10`, `index.html:188`, presente en `dist/` |
| GA4 Measurement ID | `G-2XTMDMXZFC` | Inlined en `dist/` (build real de producción) |
| Meta Pixel | `1885949815441420` | `index.html:192`, presente en `dist/` |
| Google Ads Conversion ID | — | **No encontrado en el repositorio.** No hay `AW-` en código ni en bundle |

**Inferencia (confianza alta):** las conversiones de Google Ads, si existen, se definen dentro del contenedor GTM o se importan desde GA4. No hay etiqueta `gtag` de Ads en el código fuente.

### Flujo de carga

```
index.html (head)
  └── GTM-MSLMDDLR  ← carga síncrona del contenedor
       └── [contenido del contenedor NO AUDITABLE]

React monta
  └── <AnalyticsTracker />  → useAnalytics()
       ├── useEffect #1 (mount)        → initGA()
       │     ├── crea stub window.gtag → dataLayer.push(arguments)
       │     └── inyecta Meta Pixel → fbq('init') + fbq('track','PageView')
       └── useEffect #2 (cada ruta)    → logPageView()
             ├── gtag('event','page_view', {send_to: G-2XTMDMXZFC, ...})
             └── fbq('track','PageView')
```

---

## B. Hallazgos

### H-02 · Ruta de éxito inexistente: el usuario que convierte ve una pantalla en blanco

- **Clasificación:** Verificado
- **Evidencia:**
  - `src/pages/Register/RegisterWizard.tsx:157` → `navigate('/student/success', { state: { trackingCode: projectData.tracking_code } });`
  - `src/App.tsx:138` → la única ruta de éxito declarada es `<Route path="/exito" element={<SuccessScreen />} />`
  - `grep 'path="\*"' src/**/*.tsx` → **no existe ruta catch-all**
  - `vercel.json` reescribe `/(.*)` → `/`, por lo que el servidor devuelve `index.html` y el SPA renderiza `null`
- **Impacto:** El usuario completa el registro entero (se crean cuenta de auth, registro en `students` y proyecto en `projects` en Supabase) y aterriza en una **página en blanco**. Nunca ve su código de seguimiento (`SuccessScreen.tsx:8` lo lee de `location.state`). Se pierde: la confirmación, el código de tracking, la percepción de que el registro funcionó, y cualquier `page_view` de una URL de gracias utilizable como conversión.
- **Prioridad:** P0
- **Confianza:** Alta — es un desajuste literal de cadena entre dos archivos.
- **Recomendación:** Cambiar `navigate('/student/success', …)` por `navigate('/exito', …)`. Añadir además una ruta `path="*"` con una página 404 real.
- **Validación propuesta:** Completar un registro de prueba en producción y confirmar que se renderiza `SuccessScreen` con el código. Verificar en GA4 Realtime que llega un `page_view` de `/exito`.
- **Requiere aprobación:** Sí (cambio de código en producción).

---

### H-03 · El formulario "Diagnóstico Rápido" descarta los datos del usuario pero dispara conversión

- **Clasificación:** Verificado
- **Evidencia:** `src/pages/LandingPage.tsx:206-218`. El `<form>` tiene `onSubmit` que:
  1. hace `dataLayer.push({ event: 'form_submit', 'dlv - service_type': 'Diagnostico Rapido' })`
  2. hace `fbq('track', 'Lead')`
  3. hace `window.open('https://wa.me/18297513267', '_blank')`

  Los `<select>` de las líneas 221-234 (`hero-etapa`, `hero-nivel`) **no tienen `name`, ni `value`, ni `onChange`, ni estado de React asociado.** No hay ninguna llamada de red. Los datos seleccionados no se envían a ningún sistema.
- **Impacto:** Triple:
  1. **Pérdida comercial** — el estudiante declara su etapa y nivel académico (la información de calificación más valiosa que existe en este negocio) y esa información se destruye. El asesor recibe un chat de WhatsApp sin contexto.
  2. **Conversiones infladas** — cada envío cuenta como `Lead` en Meta y `form_submit` en GTM, aunque no se haya capturado ningún lead. Si esta señal alimenta la optimización de campañas de Meta, el algoritmo se está optimizando hacia un evento que no representa un lead real.
  3. **Atribución rota** — el enlace `wa.me` no lleva `?text=` prellenado (verificado: los 17 enlaces `wa.me` del sitio son idénticos y sin parámetros), así que no hay forma de saber desde qué página o campaña llegó la conversación.
- **Prioridad:** P0
- **Confianza:** Alta
- **Recomendación:** Vincular los `select` a estado, persistir el lead (Supabase o el CRM que se decida) **antes** de disparar el evento, y construir el `wa.me` con `?text=` prellenado incluyendo etapa, nivel y origen. Disparar `generate_lead` solo tras confirmación de escritura.
- **Validación propuesta:** Envío de prueba → confirmar fila en base de datos + evento con parámetros en GA4 DebugView + mensaje de WhatsApp con contexto.
- **Requiere aprobación:** Sí.

---

### H-04 · WhatsApp es la conversión principal y no está instrumentada en código

- **Clasificación:** Verificado (código) / No evaluado (GTM)
- **Evidencia:** 17 enlaces `wa.me/18297513267` distribuidos en `LandingPage.tsx` (×9), `Navbar.tsx` (×2), `Footer.tsx`, `About.tsx`, `BlogPostTemplate.tsx`, `Universities.tsx`, `UniversityTemplate.tsx`, `Legal/DataDeletion.tsx`. En todo el repositorio existen **solo 2 llamadas a `logEvent`**, ambas en `src/pages/BlogPostTemplate.tsx` (líneas 19 y 23).
- **Impacto:** El camino de conversión dominante del negocio no emite ninguna señal desde el código. Sin esto, no se puede calcular CPA real, ni comparar canales, ni alimentar Smart Bidding con conversiones válidas.
- **Limitación:** Es posible que el contenedor GTM tenga un trigger de clic sobre enlaces `wa.me` que cubra esto. **No se puede confirmar sin acceso a GTM.** Este es el primer punto a revisar cuando haya acceso.
- **Prioridad:** P0
- **Confianza:** Alta sobre el código; nula sobre GTM.
- **Recomendación:** Definir `contact_whatsapp` como evento con parámetros (`link_position`, `page_path`, `service_context`), disparado por trigger de GTM sobre clic en `a[href*="wa.me"]` — preferible al código, porque cubre los 17 enlaces sin tocar componentes.
- **Validación propuesta:** Tag Assistant en modo vista previa, clic en cada uno de los 17 puntos.
- **Requiere aprobación:** Sí (cambio en contenedor GTM).

---

### H-05 · Meta Pixel dispara `PageView` duplicado en la primera carga

- **Clasificación:** Verificado
- **Evidencia:** En `src/hooks/useAnalytics.ts` ambos `useEffect` se ejecutan en el montaje inicial:
  - `useEffect` #1 → `initGA()` → `analytics.ts:70` → `window.fbq('track', 'PageView')`
  - `useEffect` #2 → `logPageView()` → `analytics.ts:93` → `window.fbq('track', 'PageView')`

  El script del pixel se inyecta con `innerHTML` y `appendChild` (`analytics.ts:53-65`), lo que se ejecuta de forma síncrona, así que `window.fbq` ya está definido cuando se evalúa la línea 68.
- **Impacto:** Todas las sesiones registran 2 `PageView` en la primera vista. Infla el volumen de Meta ~2× en la landing de entrada, distorsiona tasas de conversión por vista y degrada la comparación entre Meta y GA4.
- **Prioridad:** P1
- **Confianza:** Alta
- **Recomendación:** Eliminar `fbq('track','PageView')` de `initGA()` y dejar que `logPageView()` sea la única fuente, o al revés — pero no ambas.
- **Validación propuesta:** Meta Pixel Helper sobre la home; contar eventos.
- **Requiere aprobación:** Sí.

---

### H-06 · `fbq('track', 'CustomEvent')` es una llamada inválida

- **Clasificación:** Verificado
- **Evidencia:** `src/utils/analytics.ts:114` inicializa `let fbEvent = 'CustomEvent';` y la línea 128 ejecuta `window.fbq('track', fbEvent, params);`. `track` solo admite los nombres estándar de Meta; para eventos propios hay que usar `trackCustom`.
- **Impacto:** Cualquier acción que no sea `generate_lead`/`contact`/`view_item`/`purchase`/`sign_up` se envía como un evento estándar inexistente. Meta lo descarta o lo registra con advertencia; el dato no es utilizable para audiencias ni optimización.
- **Prioridad:** P1
- **Confianza:** Alta
- **Recomendación:** Usar `fbq('trackCustom', nombre, params)` en la rama por defecto.
- **Validación propuesta:** Consola del navegador + Meta Events Manager (columna de eventos con errores de diagnóstico).
- **Requiere aprobación:** Sí.

---

### H-08 · PII en texto plano en el `dataLayer`, sin capa de consentimiento

- **Clasificación:** Verificado
- **Evidencia:** `src/pages/Register/RegisterWizard.tsx:145-152` publica en el dataLayer:
  ```
  { event: 'form_submit', 'dlv - service_type': …,
    user_data: { email: formData.email, phone_number: formData.phone } }
  ```
  Búsqueda de gestión de consentimiento en `src/`: **cero coincidencias** para `cookie consent`, `consent mode`, `gtag('consent'`, banner o equivalente. `PrivacyPolicy.tsx` menciona "Google Analytics" y "Meta" una vez cada uno, sin mecanismo de opt-out.
- **Impacto:** El correo y el teléfono quedan disponibles en el `dataLayer` para **cualquier** etiqueta del contenedor GTM, incluidas las de terceros. Es el formato que espera Enhanced Conversions de Google (que hashea en cliente), así que probablemente sea intencional — pero sin Consent Mode v2 y sin banner, se envían señales de marketing sin base de consentimiento. Riesgo regulatorio moderado en RD, alto si se anuncia a audiencias en UE/EEE.
- **Prioridad:** P1
- **Confianza:** Alta sobre el hecho; media sobre la exposición real (depende de qué etiquetas haya en GTM).
- **Recomendación:** Implementar Consent Mode v2 con banner; restringir `user_data` a las etiquetas que lo necesiten; documentar el tratamiento en la política de privacidad.
- **Validación propuesta:** Auditar la lista completa de etiquetas del contenedor y cuáles leen `user_data`.
- **Requiere aprobación:** Sí.

---

### H-15 · Filtro de tráfico interno frágil

- **Clasificación:** Verificado
- **Evidencia:** `src/utils/analytics.ts:8-24`. `isInternalTraffic()` solo devuelve `true` si `document.referrer` contiene `tagassistant.google.com` o `vercel.com`.
- **Impacto:** `document.referrer` está vacío en navegación directa y solo se conserva en la primera vista de la sesión. El tráfico propio del equipo (escribir la URL, recargar, navegar entre rutas) **no se filtra**. En un sitio de volumen bajo, la contaminación por tráfico interno puede ser una fracción significativa del total.
- **Prioridad:** P2
- **Confianza:** Alta
- **Recomendación:** Complementar con filtro de IP interna en GA4 Admin y persistir la marca de sesión interna en `sessionStorage`.
- **Requiere aprobación:** Sí.

---

### H-16 · Eventos GA4 con esquema de Universal Analytics

- **Clasificación:** Verificado
- **Evidencia:** `src/utils/analytics.ts:103-108` envía `event_category`, `event_label`, `value`.
- **Impacto:** No son parámetros recomendados de GA4. No se registran como dimensiones personalizadas salvo que se declaren manualmente en la propiedad, así que probablemente estén llegando y descartándose. Limita el análisis en Exploraciones.
- **Prioridad:** P2
- **Confianza:** Alta en el código; el destino final depende de la configuración de la propiedad GA4 (no evaluada).
- **Recomendación:** Migrar a parámetros con nombre semántico y registrarlos como dimensiones personalizadas.
- **Requiere aprobación:** Sí.

---

## C. Diccionario de medición propuesto

Estado **Propuesto** = aún no existe. Estado **Verificado** = confirmado en código.

| Evento | Definición | Disparador | Parámetros | Plataforma | ¿Conversión? | Propietario | Validación | Estado |
|--------|-----------|------------|------------|-----------|--------------|-------------|-----------|--------|
| `page_view` | Vista de ruta SPA | Cambio de ruta React Router | `page_path`, `page_location`, `page_title` | GA4 (+GTM) | No | Marketing | DebugView | Verificado — revisar duplicidad con la etiqueta de GTM |
| `contact_whatsapp` | Clic en cualquier enlace `wa.me` | Trigger GTM `a[href*="wa.me"]` | `link_position`, `page_path`, `service_context` | GA4 + Ads + Meta | **Sí (principal)** | Marketing | Tag Assistant sobre los 17 enlaces | **Propuesto** |
| `form_submit_diagnostico` | Envío del formulario del hero | Submit tras persistir el lead | `etapa`, `nivel`, `page_path` | GA4 + Meta | Sí (micro) | Marketing | Fila en BD + DebugView | **Propuesto** (hoy dispara sin capturar — H-03) |
| `generate_lead` | Registro completo en `/registro` | Tras inserción exitosa en `projects` | `service_type`, `plan`, `value` | GA4 + Ads + Meta | **Sí (principal)** | Producto | Registro de prueba end-to-end | Parcial — existe `form_submit` en dataLayer, sin evento GA4 nombrado |
| `view_item` | Vista de artículo de blog | Montaje de `BlogPostTemplate` | `item_name` (título) | GA4 + Meta | No | Contenido | DebugView | Verificado (`BlogPostTemplate.tsx:19`) |
| `click_call` | Clic en `tel:+18094557280` | Trigger GTM | `page_path` | GA4 + Ads | Sí (micro) | Marketing | Tag Assistant | **Propuesto** |
| `click_email` | Clic en `mailto:ttesisrd@gmail.com` | Trigger GTM | `page_path` | GA4 | No | Marketing | Tag Assistant | **Propuesto** |
| `tool_start` / `tool_complete` | Uso del Auditor y la Matriz | Inicio/fin de análisis | `tool_name`, `duration` | GA4 | Sí (micro) | Producto | DebugView | **Propuesto** — herramientas hoy sin instrumentar |

---

## D. Pendiente de auditar (bloqueado por acceso)

Al abrir GTM y GA4, resolver en este orden:

1. ¿La etiqueta de Google (GA4) en GTM dispara `page_view` en History Change? Si sí, se suma al `page_view` de `logPageView()` → **duplicación de vistas** en todo el sitio.
2. ¿Existe trigger de clic sobre `wa.me`? (Determina si H-04 es crítico o ya está mitigado.)
3. ¿Qué conversiones están marcadas como *eventos clave* en GA4 y cuáles se importan a Google Ads? ¿Hay solapamiento con conversiones nativas de Ads → doble conteo?
4. ¿Está activo Enhanced Conversions y consume `user_data`?
5. ¿Hay filtro de tráfico interno activo en GA4 Admin? (`analytics.ts` envía `traffic_type='internal'` asumiendo que sí — si no está activo, ese parámetro no hace nada.)
6. Lista de exclusión de referencias, configuración cross-domain y ventana de atribución.
