# Plan de Campaña de Ads: TuTesisRD 🚀

Este documento detalla la estrategia de publicidad pagada para generar tráfico cualificado hacia los nuevos artículos del blog y convertirlos en leads (consultas de asesoría).

**Skill Utilizado:** `paid-ads` (Estrategia de Performance Marketing)

---

## 1. Resumen Ejecutivo
*   **Objetivo Principal:** Generar Tráfico de Calidad hacia el Blog.
*   **Objetivo Secundario:** Conversión a Leads (clics en "Contactar Asesor" o "Registrar Proyecto" dentro del artículo).
*   **Presupuesto Sugerido:** (A definir por el usuario, estructura escalable).
*   **Plataformas:** Meta Ads (Instagram/Facebook) y Google Search.

---

## 2. Estrategia por Plataforma

### A. Meta Ads (Instagram y Facebook)
**Enfoque:** "Content Marketing" - Atraer con valor (los artículos) para generar confianza y luego vender. Ideal para estudiantes que no están buscando activamente pero tienen el problema latente.

#### Estructura de Campaña
*   **Objetivo de Campaña:** Tráfico (Optimización a visitas a la página de destino).
*   **Público (Audiencia):**
    *   **Lugar:** República Dominicana (Todo el país o foco en Santo Domingo/Santiago).
    *   **Edad:** 20 - 35 años.
    *   **Intereses:** Universidad Autónoma de Santo Domingo (UASD), Pontificia Universidad Católica Madre y Maestra (PUCMM), Universidad Iberoamericana (UNIBE), Tesis, Educación Superior, Investigación.
    *   **Comportamiento:** Usuarios de dispositivos móviles.

#### Creativos y Copy (Basado en Frameworks PAS/BAB)

**Anuncio 1: Promocionando "50+ Temas de Tesis" (Blog 10)**
*   *Formato:* Carrusel o Imagen Única (Diseño llamativo con lista borrosa).
*   *Gancho (Hook):* "¿Te rechazaron el tema de tesis otra vez?"
*   *Cuerpo (PAS - Problema-Agitación-Solución):*
    *   **P:** Elegir tema es la parte más estresante.
    *   **A:** Pasan los meses y sigues sin aprobar el anteproyecto.
    *   **S:** Hemos curado 50+ temas validados para Contabilidad, Finanzas y Auditoría en RD.
*   *CTA:* "Ver Lista Completa Gratis ⬇️"

**Anuncio 2: Promocionando "Defensa de Tesis" (Blog 9)**
*   *Formato:* Video Corto (Reel) o Imagen de persona nerviosa vs. confiada.
*   *Headline:* 🛑 "No vayas a tu defensa sin leer esto"
*   *Cuerpo (Social Proof):*
    *   "Consejos reales de jurados de la UASD y PUCMM."
    *   "Aprende cómo responder cuando no sabes la respuesta."
    *   "La guía definitiva para no morir de nervios."
*   *CTA:* "Leer consejos de oratoria 🎤"

**Anuncio 3: Promocionando "Errores APA" (Blog 6)**
*   *Formato:* Imagen con texto "Error Común #1".
*   *Copy:* "¿Tu tesis está llena de tinta roja? Evita los 5 errores de APA 7ma edición que bajan más puntos."
*   *CTA:* "Corregir mi tesis ahora 📝"

---

### B. Google Ads (Search)
**Enfoque:** "High Intent" - Capturar a estudiantes que buscan ayuda *activamente* en este momento.

#### Estructura de Campaña
*   **Objetivo:** Tráfico al Sitio Web o Clientes Potenciales.
*   **Palabras Clave (Keywords):**
    *   `"temas de tesis contabilidad"` -> Dirige al Blog 10.
    *   `"ejemplos de encuestas tesis"` -> Dirige al Blog 7.
    *   `"asesoría de tesis santo domingo"` -> Dirige a Landing Page / Blog.
    *   `"corregir estilo tesis apa"` -> Dirige a Servicios / Blog 6.

#### Anuncios de Texto (RSAs)

**Variación 1 (Enfoque en Temas):**
*   **Título 1:** 50+ Temas de Tesis 2026
*   **Título 2:** Aprobados para UASD y PUCMM
*   **Título 3:** TuTesisRD Asesoría
*   **Descripción 1:** ¿Sin ideas? Descarga nuestra lista gratuita de temas actuales de Contabilidad y Finanzas.
*   **Descripción 2:** Asesoría experta para desarrollar tu anteproyecto desde cero. Garantía de aprobación.

---

## 3. Checklist de Implementación Técnica (`analytics-tracking`)

Antes de lanzar, debemos asegurar que el "pixel" y las conversiones estén listas:

1.  [ ] **Instalar Meta Pixel:** Verificar que esté en `index.html` o vía GTM.
2.  [ ] **Eventos Personalizados:**
    *   El evento `view_item` ya se dispara al ver un blog (verificado en código).
    *   Asegurar que el botón "Contactar Asesor" dispare un evento de conversión (`Contact` o `Lead`).
3.  [ ] **UTM Tagging:** Usar URLs con parámetros para saber qué blog trae más clientes.
    *   Ejemplo: `tutesisrd.online/blog/temas-tesis?utm_source=instagram&utm_medium=cpc&utm_campaign=blog_promo`

## 4. Próximos Pasos Recomendados

1.  **Crear las imágenes/videos** para los Anuncios 1, 2 y 3 (Podemos usar la herramienta `generate_image` si deseas bocetos).
2.  **Configurar la cuenta publicitaria** (Esto lo haces tú en Meta Business Suite).
3.  **Lanzar fase de prueba** (Low Budget) por 3-5 días para ver cuál artículo tiene mejor CTR.
