# 14 · Datos, exportaciones y accesos pendientes

**Fecha:** 2026-07-31

Solicitud agrupada, según pedía la Fase 0: una sola petición con el mínimo necesario para desbloquear el resto de la auditoría.

> **Ninguna de estas peticiones incluye contraseñas, cookies, tokens de sesión, códigos de recuperación, claves privadas ni códigos MFA.** Todo se solicita por delegación oficial de la plataforma o como exportación de datos.

---

## A. Accesos delegados — bloquean tres fases enteras

Otorgar a la identidad de Tu Tesis RD (ver `10_separacion_nes_camp.md`), **con permiso de solo lectura durante la auditoría**.

| # | Plataforma | Identificador conocido | Permiso solicitado | Desbloquea |
|---|-----------|------------------------|--------------------|-----------|
| 1 | **Google Tag Manager** | `GTM-MSLMDDLR` | Lectura del contenedor | **Máxima prioridad.** Sin esto, 6 hallazgos de medición quedan sin cerrar |
| 2 | **GA4** | `G-2XTMDMXZFC` | Visualizador + Analista | Fase 5 completa; embudos y calidad de datos |
| 3 | **Google Ads** | ID de cuenta desconocido — indicarlo | Solo lectura | Fase 4 completa |
| 4 | **Search Console** | Propiedad `www.tutesisrd.online` | Restringido | Indexación, consultas, Core Web Vitals de campo |
| 5 | **Meta Business** | Pixel `1885949815441420` | Analista de pixel y páginas | Calidad de eventos, EMQ, Conversions API |
| 6 | **Instagram / Facebook** | `@tutesisrd`, `/tutesisrd` | Analista | Fase 3 completa |
| 7 | **Supabase** | Proyecto de Tu Tesis RD | Read-only | Políticas RLS, calidad de la base de leads |
| 8 | **Vercel** | Proyecto `tu-tesis-rd-app` | Viewer | Variables de producción, logs, analytics |
| 9 | **Google Business Profile** | Confirmar si existe | Administrador o gerente | SEO local de Higüey |

---

## B. Exportaciones (alternativa si no se puede delegar acceso)

Período recomendado: **últimos 90 días** (2026-05-02 → 2026-07-31).

### Analítica
- GA4 → Adquisición de tráfico, por canal predeterminado, con sesiones, sesiones con interacción y conversiones.
- GA4 → Páginas y pantallas, con vistas, tiempo de interacción y conversiones.
- GA4 → Lista de eventos y cuáles están marcados como **eventos clave**.
- GTM → Exportación del contenedor en JSON (no contiene secretos).

### Google Ads
- Informe de campañas: inversión, impresiones, clics, conversiones, valor de conversión, CPA.
- Informe de términos de búsqueda con coste y conversiones.
- Lista de acciones de conversión, indicando cuáles son primarias y cuáles secundarias, y su fuente.

### Search Console
- Rendimiento: consultas y páginas, con clics, impresiones, CTR y posición.
- Informe de cobertura de indexación.

### Redes sociales
- Instagram Insights: exportación de publicaciones de 90 días con alcance, impresiones, interacciones, guardados, compartidos y clics en el enlace.
- Facebook Insights: equivalente.
- Meta Ads: informe de campañas si hubo inversión.

### Comercial
- Volumen de conversaciones de WhatsApp en el período (aunque sea una estimación).
- Número de clientes cerrados y valor medio del proyecto.

---

## C. Información que solo el propietario puede confirmar

Preguntas concretas; ninguna requiere credenciales:

1. **¿El repositorio de GitHub es público o privado?** Determina si el token expuesto (H-01) debe tratarse como comprometido. *La respuesta más urgente de esta lista.*
2. **¿Hay campañas de Google Ads activas ahora mismo?** ¿Cuál es la inversión mensual? De ello depende si H-20 y H-21 son P0 o teóricos.
3. **¿Existe un Google Business Profile para la oficina de Higüey?**
4. **¿`@tutesisrd` en X/Twitter pertenece a la marca?** (H-22)
5. **¿Cuál es el número de teléfono canónico?** Circulan tres (H-11).
6. **¿Cómo se gestionan hoy los leads de WhatsApp?** ¿Existe alguna hoja de cálculo o registro?
7. **¿Alguien más tiene acceso a alguna de estas plataformas** (excolaboradores, agencias)? Relevante para el riesgo de usuarios antiguos.
8. **¿Cuál es el objetivo comercial principal de los próximos 90 días?** ¿Volumen de leads, rentabilidad, o un servicio concreto? Determina el orden del backlog.
9. **¿Qué presupuesto y capacidad operativa hay disponibles?** Condiciona si el plan de 90 días es realista.
10. **¿La rama `origin/gh-pages` sigue sirviendo contenido?** Podría haber una copia indexable del sitio (B-01).

---

## D. Lo que quedó sin evaluar y por qué

| Área | Estado | Bloqueante |
|------|--------|-----------|
| Contenedor GTM | No evaluado | Acceso #1 |
| GA4 de Tu Tesis RD | No evaluado | Acceso #2 |
| Google Ads de Tu Tesis RD | No evaluado | Acceso #3 |
| Search Console | No evaluado | Acceso #4 |
| Redes sociales (Fase 3 completa) | No evaluado | Accesos #5 y #6 |
| Calidad de la base de leads y RLS | No evaluado | Acceso #7 |
| Core Web Vitals reales | No evaluado | Acceso #4 |
| SEO local / GBP | No evaluado | Acceso #9 y pregunta C-3 |
| Perfil de backlinks | No evaluado | Herramienta externa |
| Rentabilidad real por canal | No evaluado | Accesos #3, #5 y datos comerciales de §B |

**Nota metodológica:** ninguna de estas áreas recibió una valoración provisional en este informe. Marcarlas como "no evaluado" es un resultado, no una omisión: presentar estimaciones sin fuente habría contaminado el resto de conclusiones, que sí están respaldadas por evidencia directa.
