# 01 · Alcance y fuentes

**Fecha de observación:** 2026-07-31
**Modo:** solo lectura. No se modificó ningún archivo del producto, configuración, campaña, etiqueta ni permiso.
**Auditor:** Claude Code (sesión local, Windows 11)

---

## 1. Fuentes efectivamente inspeccionadas

| # | Fuente | Método | Resultado |
|---|--------|--------|-----------|
| F-01 | Repositorio `C:\Users\miang\Downloads\Carpetas\Web_TuTesis` | Lectura de archivos + git | ✅ Acceso completo |
| F-02 | Historial git (`main`, 15 commits recientes) | `git log`, `git diff`, `git ls-files` | ✅ Acceso completo |
| F-03 | `index.html` (estático, head y body) | Lectura directa | ✅ |
| F-04 | `src/utils/analytics.ts`, `useAnalytics.ts`, `AnalyticsTracker.tsx` | Lectura directa | ✅ |
| F-05 | `src/App.tsx` (tabla de rutas) | Lectura directa | ✅ |
| F-06 | `src/pages/LandingPage.tsx`, `Register/RegisterWizard.tsx`, `Register/SuccessScreen.tsx` | Lectura directa | ✅ |
| F-07 | `src/components/SEO.tsx` | Lectura directa | ✅ |
| F-08 | `public/robots.txt`, `public/sitemap.xml` | Lectura directa | ✅ |
| F-09 | `src/data/blogPosts.json` | Lectura directa | ✅ |
| F-10 | `dist/` (bundle compilado) | Grep de IDs inlined | ✅ Confirma IDs reales de build |
| F-11 | `.env`, `.env.local`, `.env.example` | Solo nombres de variables (valores redactados) | ✅ |
| F-12 | `.mcp.json` | Lectura de estructura | ⚠️ Contiene secreto (ver hallazgo H-01) |
| F-13 | `vercel.json`, `.vercel/project.json` | Lectura directa | ✅ |
| F-14 | `https://www.tutesisrd.online/` (producción) | WebFetch sin ejecución de JS | ✅ Parcial (ver H-10) |
| F-15 | `https://www.tutesisrd.online/robots.txt` (producción) | WebFetch | ✅ |
| F-16 | Google Ads API — cuentas accesibles | MCP `google-ads` | ✅ Devuelve solo NES CAMP |
| F-17 | Google Analytics Admin API — resumen de cuentas | MCP `google-analytics` | ✅ Devuelve solo NES CAMP |
| F-18 | Supabase Management API — proyectos | MCP `supabase` | ✅ Devuelve solo NES CAMP |
| F-19 | `google_ads_import.csv`, `CAMPAIGN_PLAN.md` | Lectura directa | ✅ Documentos de planificación, no de ejecución |

---

## 2. Fuentes NO disponibles en esta sesión

| Fuente | Estado | Motivo verificado |
|--------|--------|-------------------|
| GA4 de TuTesisRD (`G-2XTMDMXZFC`) | ❌ No evaluado | La credencial del MCP solo lista la cuenta `NES CAMP – Web` (F-17) |
| Google Ads de TuTesisRD | ❌ No evaluado | `customers_list_accessible_customers` devuelve únicamente `4456869415` = NES CAMP (F-16) |
| Contenedor GTM `GTM-MSLMDDLR` | ❌ No evaluado | Sin acceso a la interfaz de Tag Manager. **Esta es la laguna más costosa de la auditoría** |
| Google Search Console | ❌ No evaluado | Sin acceso ni exportación |
| Meta Business / Pixel `1885949815441420` | ❌ No evaluado | Sin acceso al Business Manager |
| Instagram `@tutesisrd` / Facebook `/tutesisrd` | ❌ No evaluado | Sin acceso a insights nativos |
| Supabase de TuTesisRD (base de leads) | ❌ No evaluado | El MCP solo lista el proyecto NES CAMP (F-18) |
| Google Business Profile | ❌ No evaluado | Existencia no confirmada |
| Vercel (analytics, logs, variables de producción) | ❌ No evaluado | Sin sesión autenticada verificada |

---

## 3. Método de clasificación

Cada hallazgo se etiqueta como:

- **Verificado** — observado directamente en una fuente de la tabla F-01…F-19, con archivo y línea.
- **Inferencia** — conclusión razonable a partir de evidencia parcial; se indica el salto lógico.
- **Recomendación** — propuesta profesional, aún no implementada.
- **No evaluado** — sin acceso o evidencia suficiente. No se emite juicio.

**Regla aplicada:** no se reportan métricas de tráfico, conversiones, inversión, alcance ni engagement, porque **ninguna fuente accesible las contiene para TuTesisRD**. Todo número que aparece en este informe procede de conteo directo sobre archivos del repositorio o de la API de Google Ads de NES CAMP.

---

## 4. Limitaciones que afectan la confianza de las conclusiones

1. **El contenedor GTM es una caja negra.** Varios hallazgos de medición (duplicación de `page_view`, si el clic de WhatsApp está o no instrumentado vía trigger de GTM, qué conversiones se importan a Google Ads) solo pueden cerrarse abriendo el contenedor. Se indica explícitamente en cada caso.
2. **El código auditado es el del árbol de trabajo local, no necesariamente el desplegado.** Hay 13 archivos modificados sin commitear (ver `04_auditoria_web.md`, H-13).
3. **La verificación en producción se hizo sin ejecutar JavaScript.** Confirma el HTML inicial servido, no el DOM final renderizado.
4. **Período de análisis de 90 días: no ejecutable.** Requiere las exportaciones listadas en `14_datos_y_accesos_pendientes.md`.
