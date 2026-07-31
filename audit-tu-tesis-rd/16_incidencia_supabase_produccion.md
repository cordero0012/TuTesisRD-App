# 16 · INCIDENCIA P0 — El backend de producción apunta a un proyecto Supabase inexistente

**Fecha:** 2026-07-31 · **Clasificación:** Verificado · **Confianza:** Alta

Descubierto al intentar aplicar la persistencia de leads. Es el hallazgo más grave de todo el trabajo.

---

## 1. El hecho

El bundle **actualmente servido en producción** apunta a un host de Supabase que **no existe en DNS**.

| Paso | Comprobación | Resultado |
|------|-------------|-----------|
| 1 | Descarga del bundle real de producción `https://www.tutesisrd.online/assets/index-B_xsf07o.js` (487 202 bytes) | ✅ Contiene `https://svtcteibilcazhphvmgn.supabase.co` |
| 2 | Resolución DNS del host vía Google DNS (DoH) | ❌ **Status 3 — NXDOMAIN** |
| 3 | Resolución vía Cloudflare DNS (DoH) | ❌ **Status 3 — NXDOMAIN** |
| 4 | Resolución vía `Resolve-DnsName` (Windows) | ❌ "El nombre DNS no existe" |
| 5 | `curl` al host | ❌ exit 6 — couldn't resolve host |

### Control (para descartar un problema de mi red o del método)

Se repitió la comprobación con el proyecto Supabase de NES CAMP, del que sabemos por la API que está `ACTIVE_HEALTHY`, y con **el mismo formato de host**:

| Host | DNS | HTTP |
|------|-----|------|
| `uifedpxyatrzrbyrdjvb.supabase.co` (NES CAMP) | ✅ Status 0 — resuelve a `172.64.149.246`, `104.18.38.10` | ✅ HTTP 401 (esperado sin apikey) |
| `svtcteibilcazhphvmgn.supabase.co` (Tu Tesis RD) | ❌ Status 3 — NXDOMAIN | ❌ no conecta |

Se verificó además que la red del entorno funciona: `google.com` → HTTP 200, `www.tutesisrd.online` → HTTP 200.

**El método es sólido y el resultado es inequívoco: el proyecto Supabase de Tu Tesis RD ya no existe.** Un proyecto pausado sigue resolviendo en DNS; NXDOMAIN es consistente con un proyecto **eliminado**.

---

## 2. Consecuencias en producción

Todo lo que depende de Supabase está caído ahora mismo:

| Función | Ruta | Estado |
|---------|------|--------|
| Registro de proyecto | `/registro` | ❌ `supabase.auth.signUp` falla — **no se puede registrar ningún estudiante** |
| Consulta de estado | `/monitoreo` | ❌ Sin lectura de `projects` |
| Portal del estudiante | `/portal` | ❌ Sin datos |
| Panel de administración | `/admin` | ❌ Sin autenticación ni datos |
| Herramientas de IA | `/herramientas/*` | ⚠️ Dependen de la Edge Function `ai-bridge`, alojada en el mismo proyecto |

**El sitio informativo funciona; el producto no.**

---

## 3. Esto reordena las prioridades de la auditoría

**H-02 queda reinterpretado.** Diagnostiqué que el usuario que completa el registro aterriza en pantalla blanca por la ruta `/student/success` inexistente. Ese fallo es real y está corregido, **pero hoy no llega a manifestarse**: el registro falla antes, en `supabase.auth.signUp`. H-02 era un bug latente que aparecerá en cuanto el backend vuelva. La corrección sigue siendo necesaria; simplemente no es lo primero.

**Ventana temporal estimada (Inferencia, confianza media):** `.env` se modificó por última vez el 2026-03-10 y `.env.local` el 2026-04-19; el último commit es del 2026-04-30. No hay evidencia de cuándo desapareció el proyecto. **Podría llevar caído hasta tres meses.** Determinarlo requiere el panel de Supabase y los logs de Vercel.

---

## 4. Efecto sobre la persistencia de leads que me pediste

El código está **escrito, commiteado y verificado hasta donde el entorno permite**:

- ✅ Migración `supabase/migrations/20260731_hero_leads.sql` con RLS restrictivo.
- ✅ Servicio `src/services/leads/heroLeadService.ts`.
- ✅ Formulario conectado; typecheck limpio, 35/35 tests pasan.
- ✅ Prueba en navegador con `?utm_source=instagram&utm_medium=cpc&utm_campaign=prueba_auditoria`: el payload enviado fue exactamente

  ```json
  {"etapa":"Aplicando Metodología / Instrumentos","nivel":"Maestría / Posgrado",
   "page_path":"/","referrer":null,"utm_source":"instagram",
   "utm_medium":"cpc","utm_campaign":"prueba_auditoria"}
  ```

- ⚠️ La escritura devolvió `lead_stored: false` y **el enlace de WhatsApp se abrió igualmente** con el contexto prellenado.

Ese último punto es la validación accidental de la decisión de diseño: **con el backend caído, el formulario sigue llevando al estudiante a WhatsApp con su etapa y nivel en el mensaje.** El negocio no se detiene aunque la base de datos no responda, y `lead_stored: false` deja el fallo visible en la analítica en lugar de esconderlo tras una conversión aparentemente exitosa.

**No puedo aplicar la migración**: no tengo acceso al proyecto de Tu Tesis RD y, además, el proyecto no existe. El MCP de Supabase disponible apunta solo a NES CAMP y **no lo he usado**, porque crear ahí la tabla sería exactamente la contaminación cruzada que este trabajo debe evitar.

---

## 5. Qué hacer, en orden

1. **Entrar al panel de Supabase y determinar qué pasó** con el proyecto `svtcteibilcazhphvmgn`: ¿eliminado, migrado a otro proyecto, o cambiado de organización?
2. **Si hay proyecto nuevo:** actualizar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en las variables de entorno de **Vercel** (no solo en el `.env` local — las `VITE_` se compilan dentro del bundle, así que hace falta **redesplegar**).
3. **Si el proyecto se eliminó sin copia:** evaluar si hay backup. Esto determina si se perdieron datos de estudiantes y proyectos.
4. **Reaplicar el esquema** desde `supabase/migrations/` en el proyecto que corresponda.
5. **Aplicar la migración nueva** `20260731_hero_leads.sql`.
6. **Redesplegar y verificar** un registro de prueba de extremo a extremo: debe crear la fila y aterrizar en `/exito` con el código de rastreo (H-02 ya corregido).
7. **Volver a probar el formulario del hero** y confirmar que ahora devuelve `lead_stored: true`.

---

## 6. Aviso adicional detectado en el mismo repaso

El archivo `fix_rls.sql` de la raíz del repositorio contiene:

```sql
CREATE POLICY "Enable read access for all users" ON public.students FOR SELECT USING (true);
```

Esa política concede **lectura pública de la tabla `students`**, que contiene nombres, correos y teléfonos. La migración `20260209_enhanced_rls_policies.sql` la elimina explícitamente (`DROP POLICY IF EXISTS "Enable read access for all users"`), así que en algún momento se identificó como un error.

El archivo sigue en la raíz, sin contexto y listo para ejecutarse por descuido. **Recomendación:** borrarlo, o renombrarlo a algo inequívoco. **No lo he tocado**, porque no sé si cumple alguna función que desconozco.

- **Prioridad:** P1
- **Clasificación:** Verificado (el contenido del archivo) / No evaluado (si la política llegó a aplicarse en el proyecto)
