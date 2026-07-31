# 06 · Auditoría de redes sociales

**Fecha:** 2026-07-31 · **Modo:** solo lectura

---

## A. Estado: NO EVALUADO

Las redes sociales son una de las áreas prioritarias del encargo. **No se pudo auditar ninguna cuenta.** Esta sección documenta lo verificable desde el repositorio, y deja preparado el protocolo completo para ejecutarlo en cuanto haya acceso.

No se emiten juicios sobre frecuencia, alcance, engagement, crecimiento ni rendimiento de contenido, porque **no existe ninguna fuente accesible que los contenga**. Cualquier cifra en esta materia sería inventada.

---

## B. Lo verificable desde el código

### Perfiles declarados por la marca

| Red | Identificador | Fuente | Estado |
|-----|--------------|--------|--------|
| Instagram | `https://www.instagram.com/tutesisrd/` | `index.html:92` (`sameAs` de schema.org) | Declarado — existencia y actividad no verificadas |
| Facebook | `https://www.facebook.com/tutesisrd` | `index.html:93` | Declarado — no verificado |
| WhatsApp | `https://wa.me/18297513267` | `index.html:91` + 17 enlaces en la app | ✅ Canal activo y central |
| Twitter/X | `@tutesisrd` | `SEO.tsx:125` (`twitter:site`) | ⚠️ Declarado en meta tags; **no aparece en `sameAs`**. Puede no existir |

### H-22 · Inconsistencia entre los perfiles sociales declarados

- **Clasificación:** Verificado
- **Evidencia:** `SEO.tsx:125` declara `twitter:site = @tutesisrd` en todas las páginas, pero el bloque `sameAs` del schema.org (`index.html:90-94`) solo lista Instagram, Facebook y WhatsApp. No hay enlace a X/Twitter en ninguna parte de la interfaz.
- **Impacto:** Bajo directamente, pero es un síntoma: si `@tutesisrd` en X no existe o no está controlado por la marca, se está atribuyendo la autoría de las previsualizaciones a un perfil ajeno. Además, un `sameAs` incompleto debilita las señales de entidad para el Knowledge Graph.
- **Prioridad:** P3
- **Confianza:** Alta sobre la inconsistencia; la existencia del perfil no ha sido verificada.
- **Recomendación:** Confirmar la titularidad de `@tutesisrd` en X. Si no es de la marca, retirar el meta tag. Si lo es, añadirlo a `sameAs`. Incluir también TikTok si existe.
- **Requiere aprobación:** Sí.

### Evidencia de estrategia planificada (no ejecutada)

`CAMPAIGN_PLAN.md` contiene una estrategia de Meta Ads redactada pero cuyo estado de ejecución no consta:

- **Objetivo declarado:** Tráfico, optimizado a visitas de landing.
- **Segmentación propuesta:** RD, 20-35 años, intereses UASD / PUCMM / UNIBE / tesis / educación superior, usuarios móviles.
- **Tres creatividades definidas** con marcos PAS y prueba social, apoyadas en artículos del blog (temas de tesis, defensa de tesis, errores APA).
- **Estado:** el propio documento marca la configuración de la cuenta publicitaria como tarea pendiente del usuario.

**Observación con impacto real:** los tres anuncios planificados dirigen a artículos del blog, y **dos de los tres apuntan a artículos con slug de marcador de posición** (`/blog/blog-6`, `/blog/blog-9` — ver H-09). Corregir los slugs debe hacerse **antes** de lanzar, o habrá que rehacer las URLs de los anuncios y se perderá el historial de rendimiento.

### Pixel de Meta

Instalado y verificado: `1885949815441420` (`index.html:192` y presente en el bundle). Su configuración de eventos, calidad de emparejamiento (EMQ), estado de la Conversions API y deduplicación **no han sido evaluados** — requieren acceso al Events Manager. Los defectos de implementación detectados en código están en `08_auditoria_analytics_tracking.md` (H-05: PageView duplicado; H-06: `trackCustom` mal usado; H-03: `Lead` disparado sin capturar lead).

---

## C. Riesgo prioritario para el área social

### H-23 · Todo el tráfico social converge en un canal sin atribución

- **Clasificación:** Verificado
- **Evidencia:** Los 17 enlaces `wa.me` del sitio son idénticos, sin `?text=` ni parámetros. No hay UTMs en ningún enlace interno. El formulario del hero también termina en WhatsApp descartando los datos (H-03).
- **Impacto:** Aunque las redes generen conversaciones, **es imposible saber cuáles vienen de Instagram, cuáles de Facebook y cuáles de búsqueda orgánica**. Sin eso, cualquier análisis de rendimiento por canal —el objetivo declarado de esta fase— es indemostrable, y la decisión de presupuesto entre canales queda sin base.
- **Prioridad:** P0
- **Confianza:** Alta
- **Recomendación:** Antes de medir nada en redes: (1) mensajes prellenados en `wa.me` con origen codificado; (2) UTMs consistentes en todos los enlaces de bio y publicaciones; (3) evento `contact_whatsapp` en GTM. Sin estos tres, la auditoría de redes producirá métricas de vanidad.
- **Requiere aprobación:** Sí.

---

## D. Protocolo listo para ejecutar

Al obtener acceso de analista a Meta Business Suite e Instagram Insights:

### Fase 1 — Auditoría de perfil (sin datos históricos)

Identidad visual, nombre y usuario, biografía, enlace en bio y su UTM, información de contacto, CTA del perfil, coherencia con el sitio (incluida la consistencia NAP — ver H-11), destacados, y correspondencia entre el mensaje social y el de la web.

### Fase 2 — Auditoría de contenido (últimos 90 días)

Frecuencia y regularidad reales; formatos empleados; pilares editoriales implícitos; calidad creativa; uso de vídeo; equilibrio entre contenido educativo, de confianza y comercial; presencia de testimonios y casos; y tiempo de respuesta a comentarios y mensajes directos.

### Fase 3 — Rendimiento (requiere exportaciones)

Analizar alcance, impresiones, interacciones, guardados, compartidos, clics en el enlace, seguidores ganados y conversaciones iniciadas.

**Regla de normalización obligatoria:** no comparar valores absolutos. Normalizar por número de publicaciones, alcance, seguidores, inversión y duración del período. Un carrusel con 5 000 alcances y 200 interacciones (4 %) rinde mejor que un Reel con 20 000 y 400 (2 %), y la lectura en bruto diría lo contrario.

### Fase 4 — Entregables

Diagnóstico por canal; contenidos de mejor y peor rendimiento con hipótesis del porqué; brechas de perfil y de contenido; oportunidades de conversión; propuesta de pilares editoriales; matriz de formatos; cadencia inicial; sistema de producción y aprobación; e hipótesis a validar mediante pruebas.

**No se establecerán benchmarks de sector** salvo que se disponga de una fuente citable. Los promedios de referencia que circulan para "educación" no aplican a asesoría de tesis en República Dominicana.

---

## E. Datos necesarios

Ver `14_datos_y_accesos_pendientes.md`, apartado de redes sociales, para la solicitud agrupada exacta.
