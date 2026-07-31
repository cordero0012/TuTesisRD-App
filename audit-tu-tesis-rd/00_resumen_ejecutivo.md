# 00 · Resumen ejecutivo — Auditoría del ecosistema digital de Tu Tesis RD

**Fecha:** 2026-07-31 · **Auditoría:** solo lectura · **Correcciones posteriores:** ver `15_correcciones_aplicadas.md`

---

## 1. Conclusión principal

El sitio de Tu Tesis RD está mejor construido de lo que sus resultados pueden demostrar. Hay una arquitectura SEO sólida, contenido real (10 artículos, 9 páginas de universidad, 3 de recursos) y dos herramientas de producto diferenciadoras. **El problema no es de construcción, es de circuito: el embudo está roto en tres puntos verificables, y ninguno de ellos es visible desde las métricas actuales.**

En concreto:

1. Un estudiante que completa el registro entero **aterriza en una pantalla en blanco**.
2. El formulario principal de la home **descarta los datos que el usuario acaba de introducir**, y aun así registra una conversión.
3. La conversión real del negocio — el clic a WhatsApp, presente en 17 puntos del sitio — **no emite ninguna señal**.

Los tres son de código, los tres tienen evidencia de archivo y línea, y el primero se corrige cambiando una cadena de texto.

---

## 2. Riesgos críticos (P0)

| ID | Hallazgo | Evidencia | Por qué importa |
|----|----------|-----------|-----------------|
| **H-24** | **3 tokens de la API de Meta en texto plano, versionados en git** | 23 entradas en `.claude/settings.local.json`, cuenta `act_777831645113258`, commits `85237fb` y `8219809` | Permiten operar sobre la cuenta de Meta Ads. Siguen en el historial: **rotar** |
| **H-01** | Token de desarrollador de Google Ads **versionado en git** | `.mcp.json` trackeado; commit `dea5f0b`; remoto en GitHub | Está en el historial: borrarlo del archivo no lo elimina. Requiere rotación |
| **H-00** | **Todas las integraciones autenticadas pertenecen a NES CAMP, ninguna a Tu Tesis RD** | Google Ads, GA4 y Supabase devuelven únicamente cuentas de NES CAMP | Bloquea las fases 3, 4 y 5. Y crea riesgo de operar sobre los activos equivocados |
| **H-02** | La ruta `/student/success` **no existe** | `RegisterWizard.tsx:157` navega ahí; `App.tsx:138` define `/exito`; no hay ruta catch-all | Pantalla en blanco tras convertir. El usuario nunca ve su código de seguimiento |
| **H-03** | El formulario "Diagnóstico Rápido" **descarta los datos y dispara `Lead` igualmente** | `LandingPage.tsx:206-218`: los `select` no tienen `name`, `value` ni estado | Se pierde la información de calificación y se entrena a Meta con una señal falsa |
| **H-04** | Los 17 CTA de WhatsApp **no emiten ningún evento** | Solo 2 llamadas a `logEvent` en todo el repositorio | Sin CPA real, sin comparación entre canales, sin conversiones válidas para pujar |
| **H-21** | El plan de campañas **asume una medición que no existe** | `CAMPAIGN_PLAN.md` §3 lista los requisitos; ninguno está cumplido | Invertir ahora es comprar tráfico que no se puede atribuir |

---

## 3. Qué es NES CAMP, y qué se descubrió al respecto

**NES CAMP es un negocio distinto del mismo operador** (`neslidercamp.online`), con su propio stack: cuenta de Google Ads `4456869415`, propiedad GA4 `546040776` creada el 2026-07-17, y proyecto Supabase propio.

**La buena noticia:** no hay mezcla en las plataformas. Los 5 anuncios de NES CAMP apuntan exclusivamente a `neslidercamp.online`; ninguno a `tutesisrd.online`. Sus dos campañas están pausadas, con $0 de gasto en 30 días.

**El problema real está en la capa de credenciales locales.** Las tres integraciones de esta sesión usan el archivo `application_default_credentials.json` **global de Windows**, emitido a la identidad de NES CAMP. Como ese archivo es único por usuario, autenticar Tu Tesis RD lo sobrescribiría y rompería el acceso a NES CAMP — exactamente el conflicto que había que evitar.

**Solución recomendada:** credenciales separadas por ruta y por organización, más accesos delegados oficiales por plataforma. Es la única de las seis opciones evaluadas que resuelve el conflicto técnico en lugar de esquivarlo. Detalle, tabla comparativa y **procedimiento de prueba reversible** en `10_separacion_nes_camp.md`. **No implementado — requiere aprobación.**

---

## 4. Estado por área

| Área | Estado | Nota |
|------|--------|------|
| **Web (código, seguridad, rendimiento)** | ✅ Auditado | Base técnica correcta; 3 fallos de conversión graves |
| **SEO** | ✅ Auditado (código) / ❌ Sin datos | Arquitectura sólida; 6 artículos con slug de marcador de posición; sin SSR |
| **CRO** | ✅ Auditado (código) / ❌ Sin datos | Recorrido roto en 3 puntos; fricciones identificadas sin poder cuantificarlas |
| **Analítica y medición** | ✅ Auditado (código) / ❌ GTM sin acceso | Área con más hallazgos. El contenedor GTM es el punto ciego mayor |
| **Google Ads** | ❌ No evaluado | Cuenta inaccesible. Solo hay artefactos de planificación |
| **Redes sociales** | ❌ No evaluado | Sin acceso a ninguna cuenta. Protocolo preparado |
| **Integraciones** | ✅ Auditado | Mapa completo con 3 rupturas de flujo documentadas |
| **Separación NES CAMP** | ✅ Resuelto en diseño | Solución propuesta, no implementada |

---

## 5. Lo que está bien y conviene no romper

- Componente `SEO.tsx` centralizado, con normalización correcta de canonical (https, host `www`, sin query ni hash).
- Schema.org `EducationalOrganization` + `WebSite` con dirección, geo y `sameAs`.
- Estrategia de contenido bien orientada al long-tail local (9 universidades × servicio).
- Carga de fuentes optimizada con `preconnect`, `preload` y fallback `<noscript>`.
- Code splitting por ruta con `React.lazy`.
- Redirección apex → www con 301 correcto.
- `.env` y `.env.local` **no** versionados; el escaneo de secretos en archivos trackeados solo detectó el caso de `.mcp.json`.
- Las claves de IA se movieron correctamente a Supabase Secrets, fuera del bundle del navegador.

---

## 6. Recomendación de secuencia

**Semana 1 — detener el daño.** Rotar el token (H-01). Corregir la ruta de éxito (H-02): es un cambio de una línea que recupera el final del embudo. Eliminar el `PageView` duplicado y el `fbq` inválido. Solicitar los accesos delegados.

**Días 8-30 — reconstruir la medición.** Abrir GTM, instrumentar `contact_whatsapp`, arreglar el formulario del hero, eliminar conversiones duplicadas.

**Días 31-60 — recuperar el valor del contenido.** Slugs semánticos con 301, prerenderizado, NAP unificado, Google Business Profile, CRM.

**Días 61-90 — escalar.** Solo aquí la inversión publicitaria tiene una base defendible.

Detalle completo en `12_plan_7_30_60_90_dias.md`.

---

## 7. Decisiones que requieren aprobación

1. **Rotar el token de Google Ads** y confirmar la visibilidad del repositorio.
2. **Pausar la inversión publicitaria** hasta cerrar H-02, H-03 y H-04 — recomendación técnica; la decisión es comercial.
3. **Adoptar el esquema de credenciales separadas** y ejecutar la prueba reversible.
4. **Solicitar los 9 accesos delegados** de `14_datos_y_accesos_pendientes.md`.
5. **Autorizar los cambios de código** de la semana 1.
6. **Definir el número de teléfono canónico** entre los tres en circulación.
7. **Decidir si se implanta un CRM** — sin él, la mitad de los KPIs de `13_diccionario_kpis.csv` no son calculables.

---

## 8. Honestidad sobre el alcance

Se auditó a fondo lo que era verificable: el repositorio completo, el código de medición, el HTML servido en producción, y tres APIs autenticadas. **No se auditó nada de Google Ads de Tu Tesis RD, GA4, Search Console, GTM ni redes sociales, porque no hay acceso.** Esas áreas figuran como *No evaluado*, sin estimaciones provisionales.

No se reporta ninguna métrica de tráfico, conversiones, inversión, alcance ni engagement, porque ninguna fuente accesible las contiene para Tu Tesis RD. Los únicos números de este informe proceden de conteo directo sobre archivos del repositorio o de la API de Google Ads de NES CAMP.
