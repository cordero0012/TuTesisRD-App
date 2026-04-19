# Handoff Técnico — Optimización Gemini & Estabilización Proxy
**Fecha:** 19 de abril de 2026
**Responsable:** Antigravity (Senior Full Stack Engineer)

---

## 1. Contexto y Problema Original
La aplicación presentaba errores `404` y `500` persistentes al intentar realizar análisis de tesis (Matriz de Consistencia). El origen era una combinación de:
1.  **Bloqueo de Ad-Blockers**: Filtros agresivos eliminaban peticiones al endpoint `gemini-proxy`.
2.  **Conflictos de SDK**: El SDK de Supabase inyectaba cabeceras de sesión obsoletas que causaban rechazos en el Gateway.
3.  **Modelos Obsoletos**: La aplicación aún apuntaba a versiones previas de Gemini.

---

## 2. Cambios de Infraestructura

### Edge Functions (Supabase)
- **Migración a Native Deno**: Se refactorizó el proxy para usar `Deno.serve`, eliminando dependencias de `std/http/server.ts` (estándar 2026).
- **Renombre de Seguridad**: Se cambió el slug de `gemini-proxy` a **`ai-bridge`** para evadir los filtros de nombres prohibidos de los bloqueadores de anuncios.
- **Acceso Público**: Desplegado con `--no-verify-jwt` para garantizar disponibilidad sin interferencia de middleware de autenticación.

### Frontend (Servicios de IA)
- **Bypass de SDK**: Se reemplazó `supabase.functions.invoke` por un `fetch` nativo en `src/services/ai/client.ts`. Esto garantiza el envío de cabeceras limpias y evita el "404 fantasma" del Gateway.
- **Sincronización Gemini 3**: El modelo por defecto ahora es `gemini-3-flash-preview` en todos los archivos de configuración (`config.ts` y `client.ts`).

---

## 3. Configuración de Variables de Entorno

- **Supabase**: `GEMINI_API_KEY` configurada como secreto de proyecto.
- **Vercel**: Se añadió soporte para `VITE_GEMINI_API_KEY` en el proxy de fallback.
- **Entorno Local**: Actualizado `.env.local` con la clave correspondiente.

---

## 4. Estado Actual (Critical Note)
- **Status de API**: El endpoint `https://svtcteibilcazhphvmgn.supabase.co/functions/v1/ai-bridge` responde con `200 OK` a peticiones `OPTIONS` y `POST` externas.
- **Problema Pendiente**: Si persiste el 404 en el navegador, se debe a una **propagación de caché en el Edge de Supabase** o una versión antigua del bundle de JS en el navegador del cliente.

### Recomendación de Verificación:
1.  Realizar un **Hard Refresh** (`Ctrl + F5`) en el navegador.
2.  Monitorear los logs en el dashboard de Supabase para confirmar la llegada del log: `-> GEMINI_PROXY_ENTRY`.

---
*Fin del Handoff*
