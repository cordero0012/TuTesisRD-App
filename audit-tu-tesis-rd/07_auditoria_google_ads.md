# 07 · Auditoría de Google Ads

**Fecha:** 2026-07-31 · **Modo:** solo lectura

---

## A. Estado del acceso

**La cuenta de Google Ads de Tu Tesis RD no fue auditada porque no es accesible desde esta sesión.**

- `customers_list_accessible_customers` devuelve exactamente una cuenta: `4456869415` → **NES CAMP**.
- El `login-customer-id` configurado en `.mcp.json` es el MCC `6869393137`, que tampoco expone ninguna cuenta de Tu Tesis RD.

Detalle completo del hallazgo y su solución en `10_separacion_nes_camp.md` (H-00).

---

## B. Lo que sí se pudo verificar sobre NES CAMP

Se documenta únicamente para dejar constancia de que **no hay contaminación cruzada entre ambos negocios en la capa publicitaria**, que era un riesgo explícito del encargo.

| Campo | Valor |
|-------|-------|
| Cuenta | `4456869415` — "NES CAMP" |
| Moneda / zona horaria | USD / `America/Santo_Domingo` |
| Estado | ENABLED · no manager · no test |
| Auto-tagging | Activado |
| Campañas | `NES26_SEARCH_BRAND_RD_ES` (PAUSED), `NES26_SEARCH_HIGHINTENT_RD_ES` (PAUSED) |
| Presupuesto | $0.50/día cada una |
| Métricas últimos 30 días | 0 impresiones · 0 clics · $0 gasto · 0 conversiones |
| Final URLs de los 5 anuncios | `neslidercamp.online` (raíz, `/inscripcion/`, `/informacion/`, `/invitados/`) |

**Conclusión verificada:** ningún anuncio de NES CAMP apunta a `tutesisrd.online`. Los ecosistemas publicitarios están separados. El riesgo de mezcla está en las credenciales locales, no en las plataformas.

---

## C. Evidencia sobre la actividad publicitaria de Tu Tesis RD

Existen artefactos de **planificación** en el repositorio. No constituyen evidencia de campañas ejecutadas.

### `google_ads_import.csv` (modificado 2026-03-26)

Estructura preparada para importación, no verificada como activa:

| Campaña | Grupo de anuncios | Keywords | Concordancia | Presupuesto |
|---------|-------------------|----------|--------------|-------------|
| Search - Non-Brand RD | Asesoría Integral | `[asesoría de tesis]`, `[ayuda con tesis universitaria]`, `"hacer tesis rapido"` | Exacta / Frase | $15 |
| Search - Non-Brand RD | Tesis Maestría | `[tesis de maestría]`, `"asesoria tesis maestria"` | Exacta / Frase | — |
| Search - Non-Brand RD | Formato APA | `[correccion norma apa]`, `[formato apa tesis]` | Exacta | — |
| Search - Local Higüey | Oficina Local | `+asesoria +tesis +higuey`, `[quien hace tesis en higuey]` | Amplia modificada / Exacta | $10 |

Tres RSA definidos, **los tres con la misma Final URL: `https://www.tutesisrd.online/`**.

### Otros artefactos

- `google-ads-script-semana1.js` (15 KB) y `google-ads-script-sitelinks.js` (7 KB), fechados 2026-04-08 — scripts de Google Ads no ejecutados en esta auditoría.
- `CAMPAIGN_PLAN.md` — plan de campañas para Meta y Google Search orientado a promocionar artículos del blog.

---

## D. Hallazgos derivables de los artefactos de planificación

### H-20 · Todos los anuncios planificados apuntan a la home, incluidos los de intención específica

- **Clasificación:** Verificado (sobre el CSV) / Inferencia (sobre las campañas en vivo)
- **Evidencia:** Los tres RSA de `google_ads_import.csv` tienen `Final URL = https://www.tutesisrd.online/`, incluyendo el grupo "Formato APA" y el de "Oficina Local Higüey".
- **Impacto:** Una búsqueda de `[formato apa tesis]` aterriza en una home generalista, no en una página sobre corrección APA — pese a que el sitio **tiene** contenido específico (`/blog/errores-apa-7`, `/servicios`). Lo mismo con Higüey, que no tiene landing local propia. Esto deprime el nivel de calidad, encarece el CPC y reduce la conversión.
- **Prioridad:** P1 (si las campañas están activas)
- **Confianza:** Alta sobre el CSV; **no verificado** que estas campañas se hayan lanzado.
- **Recomendación:** Emparejar cada grupo de anuncios con su landing más relevante y crear una página local de Higüey.
- **Requiere aprobación:** Sí.

### H-21 · El plan de campañas asume una medición que no existe

- **Clasificación:** Verificado
- **Evidencia:** `CAMPAIGN_PLAN.md` §3 lista como checklist previo al lanzamiento: instalar el pixel, asegurar que el botón "Contactar Asesor" dispare `Contact`/`Lead`, y aplicar etiquetado UTM. Contrastado con el código: el clic de WhatsApp **no está instrumentado** (H-04) y no hay UTM en ningún enlace interno.
- **Impacto:** El propio plan identificó los requisitos correctos, y están **sin cumplir**. Invertir presupuesto antes de cerrarlos significa comprar tráfico que no se puede atribuir ni optimizar. Con H-03 encima (conversiones `Lead` que se disparan sin capturar lead), Smart Bidding se entrenaría con una señal falsa.
- **Prioridad:** **P0 — bloqueante para cualquier inversión publicitaria**
- **Confianza:** Alta
- **Recomendación:** No activar ni escalar campañas hasta cerrar H-02, H-03 y H-04.
- **Requiere aprobación:** Sí (es una decisión de negocio, no técnica).

---

## E. Tabla de campañas — pendiente

No puede completarse sin acceso. Formato acordado, a rellenar cuando se disponga de la cuenta:

| Campaña | Objetivo | Inversión | Conversiones verificadas | CPA | Calidad de medición | Problema principal | Oportunidad | Acción |
|---------|----------|-----------|-------------------------|-----|--------------------|--------------------|-------------|--------|
| *(pendiente de acceso)* | | | | | | | | |

---

## F. Protocolo de auditoría listo para ejecutar

Al obtener acceso de solo lectura, ejecutar en este orden — el orden importa, porque los puntos 1-3 determinan si las métricas de los siguientes son fiables:

1. **Integridad de conversiones.** Acciones de conversión activas, cuáles son primarias vs secundarias, si hay duplicados entre importadas de GA4 y nativas de Ads, y ventanas de conversión.
2. **Vinculación GA4 ↔ Ads.** Confirmar el enlace con la propiedad `G-2XTMDMXZFC` y que las conversiones importadas coinciden con eventos clave reales.
3. **Enhanced Conversions.** Si está activo, verificar que consume el `user_data` del dataLayer (H-08) y que hay base legal para ello.
4. **Gasto sin retorno.** Términos de búsqueda con coste y cero conversiones en 90 días; cobertura de negativas.
5. **Estructura.** Tipos de campaña, geo (¿limitada a RD?), idioma, programación, estrategias de puja y si el volumen de conversiones sostiene el Smart Bidding.
6. **Concordancias y canibalización** entre "Non-Brand RD" y "Local Higüey".
7. **Anuncios y recursos.** RSA con recursos suficientes, extensiones activas, coherencia anuncio↔landing.
8. **Recomendaciones automáticas.** Verificar si la aplicación automática está activada — puede haber alterado la cuenta sin supervisión.
9. **Audiencias, remarketing y exclusiones.**
10. **Modelo de atribución** y su coherencia con el de GA4.
