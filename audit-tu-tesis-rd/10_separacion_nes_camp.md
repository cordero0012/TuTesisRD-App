# 10 · Separación de sesiones: NES CAMP ↔ Tu Tesis RD

**Fecha:** 2026-07-31 · **Modo:** solo lectura · **No implementado**

---

## 1. Qué es NES CAMP (confirmado, no supuesto)

La Fase 0 pedía definir NES CAMP antes de auditar. Queda confirmado con evidencia directa de API:

| Dimensión | Valor verificado | Fuente |
|-----------|------------------|--------|
| Naturaleza | Organización/negocio distinto, con su propio dominio | `neslidercamp.online` en los Final URLs de sus anuncios |
| Cuenta Google Ads | `4456869415` — "NES CAMP", USD, `America/Santo_Domingo`, activa, no-manager, no-test | `mcp google-ads: customer` |
| Cuenta manager (MCC) | `6869393137` usada como `login-customer-id` | `.mcp.json` |
| Propiedad GA4 | `properties/546040776` — "NES CAMP – Web", cuenta `401455987`, creada **2026-07-17** | `mcp google-analytics` |
| Proyecto Supabase | `uifedpxyatrzrbyrdjvb` — "NES CAMP", org `rpkwqeaenhgmcfqkwono`, creado 2026-04-16 | `mcp supabase` |
| Campañas | `NES26_SEARCH_BRAND_RD_ES`, `NES26_SEARCH_HIGHINTENT_RD_ES` — ambas **PAUSED**, presupuesto $0.50/día, 0 gasto/clics/impresiones en 30 días | `mcp google-ads: campaign` |

**NES CAMP no es un perfil de navegador ni una agencia: es una identidad Google + un stack propio (Ads + GA4 + Supabase) perteneciente al mismo operador.**

---

## 2. El hallazgo central de esta auditoría

### H-00 · Todas las integraciones autenticadas de esta sesión pertenecen a NES CAMP; ninguna a Tu Tesis RD

- **Clasificación:** Verificado
- **Evidencia — tres llamadas independientes, resultado consistente:**

| Herramienta | Llamada | Resultado |
|-------------|---------|-----------|
| Google Ads | `customers_list_accessible_customers` | `["4456869415"]` → solo NES CAMP |
| Google Analytics | `get_account_summaries` | Una sola cuenta: `NES CAMP – Web` |
| Supabase | `list_projects` | Un solo proyecto: `NES CAMP` |

- **Mecanismo identificado:** `.mcp.json` apunta a
  `GOOGLE_APPLICATION_CREDENTIALS = C:\Users\miang\AppData\Roaming\gcloud\application_default_credentials.json`
  Es decir, las Application Default Credentials **globales de la máquina**. Esa credencial ADC está emitida a la identidad Google de NES CAMP. Como es un único archivo por usuario de Windows, **cualquier herramienta que la use hereda la identidad de NES CAMP** — y volver a autenticar para Tu Tesis RD la sobrescribiría, rompiendo el acceso a NES CAMP. Ese es exactamente el conflicto que el proyecto quería evitar.

- **Impacto:**
  1. Las fases 3, 4 y 5 (redes, Google Ads, GA4 de Tu Tesis RD) **no son ejecutables** en la configuración actual. No es una limitación temporal: es estructural.
  2. Existe riesgo real de **contaminación cruzada**: cualquier operación de escritura ejecutada "para Tu Tesis RD" en esta sesión impactaría activos de NES CAMP.
  3. Se confirma que **no hay mezcla en la capa de anuncios**: los 5 anuncios de NES CAMP apuntan exclusivamente a `neslidercamp.online`. Ninguno apunta a `tutesisrd.online`. Los ecosistemas están hoy limpiamente separados *en las plataformas*; el problema está en la **capa de credenciales locales**.

- **Prioridad:** P0 (bloqueante para el resto de la auditoría)
- **Confianza:** Alta
- **Requiere aprobación:** Sí — ninguna opción de abajo debe ejecutarse sin decisión explícita.

---

## 3. Evaluación de alternativas

| Opción | Seguridad | Aislamiento | Complejidad | Coste | Mantenimiento | Plataformas compatibles | Riesgos | Recomendación |
|--------|-----------|-------------|-------------|-------|---------------|------------------------|---------|---------------|
| **A. Perfil de navegador independiente** | Media-alta | Alto para cookies; **nulo para ADC/CLI** | Muy baja | $0 | Muy bajo | Todas las de interfaz web | No resuelve el conflicto de esta sesión (MCP no usa el navegador) | ✅ **Adoptar** — pero solo para trabajo manual en interfaz |
| **B. Navegador distinto por organización** | Media-alta | Alto | Baja | $0 | Bajo | Todas las web | Mismo límite que A; más fricción diaria | Alternativa a A, no superior |
| **C. Accesos delegados oficiales por plataforma** | **Alta** | **Alto** | Media | $0 | Bajo | Ads, GA4, GSC, GTM, Meta, GBP | Requiere que el propietario de cada activo invite | ✅ **Adoptar — base de la solución** |
| **D. Cuentas empresariales / centros de administración separados** | Alta | Muy alto | Alta | Coste de Workspace | Medio | Todas | Sobredimensionado para el tamaño actual | ⏸️ Diferir a 90+ días |
| **E. OAuth / cuentas de servicio con credenciales por proyecto** | **Alta** | **Muy alto** | Media | $0 | Medio | Ads API, GA4 API, Supabase | Exige gestionar archivos de credencial separados y no versionarlos | ✅ **Adoptar — resuelve el conflicto técnico** |
| **F. Entorno remoto/automatizado aprobado** | Alta | Muy alto | Alta | Coste de infra | Alto | Según implementación | Innecesario hoy | ❌ Descartar por ahora |

---

## 4. Solución recomendada (C + E + A, en capas)

La clave técnica es **dejar de depender del archivo ADC global**, que es de instancia única por usuario de Windows y por tanto irreconciliablemente compartido.

### Capa 1 — Credenciales separadas por organización (resuelve el conflicto de raíz)

En lugar de `application_default_credentials.json` compartido, cada organización usa su propio archivo de credencial, referenciado explícitamente por su propia configuración MCP:

```
~/.config/tutesisrd/google-credentials.json   → identidad Tu Tesis RD
~/.config/nescamp/google-credentials.json     → identidad NES CAMP (la actual)
```

Cada proyecto declara en **su** `.mcp.json` la ruta que le corresponde. Ninguna autenticación sobrescribe a la otra, ambas sesiones conviven, y `gcloud auth application-default login` deja de ser un interruptor destructivo.

Cumple los ocho requisitos exigidos: la sesión de NES CAMP queda intacta, no se comparten cookies ni credenciales, los activos permanecen separados, los permisos se revocan por credencial, es compatible con MFA (el flujo OAuth lo respeta), deja trazabilidad por identidad y no requiere cuentas personales compartidas.

### Capa 2 — Delegación formal de accesos (resuelve la propiedad)

Para cada plataforma de Tu Tesis RD, otorgar acceso **a la identidad de Tu Tesis RD**, con el permiso mínimo necesario y **solo lectura durante la fase de auditoría**:

| Plataforma | Mecanismo | Permiso para auditar |
|-----------|-----------|---------------------|
| Google Ads | Invitación de usuario o vinculación a MCC propio de Tu Tesis RD | Solo lectura |
| GA4 (`G-2XTMDMXZFC`) | Admin → Gestión de acceso | Visualizador + Analista |
| GTM (`GTM-MSLMDDLR`) | Admin del contenedor | Lectura (subir a Publicar solo tras aprobación) |
| Search Console | Propiedad → Usuarios | Restringido |
| Meta (pixel `1885949815441420`, IG, FB) | Business Portfolio → permisos por activo | Analista |
| Supabase | Invitación a la organización del proyecto | Read-only / Developer |
| Vercel | Miembro del proyecto `tu-tesis-rd-app` | Viewer |

> Importante: **no** vincular la cuenta de Ads de Tu Tesis RD al MCC `6869393137` (el de NES CAMP). Eso reintroduciría la mezcla organizativa que se busca evitar. Si se quiere gestión centralizada, crear un MCC distinto o mantenerlas independientes.

### Capa 3 — Perfil de navegador dedicado (higiene diaria)

Un perfil de Chrome/Edge exclusivo para Tu Tesis RD, para trabajo manual en interfaces. No resuelve el problema de las APIs, pero evita el error humano de operar en la cuenta equivocada — que es el fallo más frecuente en la práctica.

---

## 5. Procedimiento de prueba reversible (antes de adoptar)

Ejecutar solo tras aprobación explícita. Cada paso es reversible y ninguno toca activos de NES CAMP.

1. **Respaldar** la credencial actual de NES CAMP (copiar `application_default_credentials.json` a `~/.config/nescamp/`). Punto de retorno garantizado.
2. **Repuntar** la configuración MCP de NES CAMP a esa copia. Verificar que `list_projects` y `customers_list_accessible_customers` siguen devolviendo NES CAMP. → *Si falla, se restaura el archivo original y no se ha perdido nada.*
3. **Solicitar** los accesos delegados de la Capa 2 para la identidad de Tu Tesis RD.
4. **Autenticar** Tu Tesis RD en su propia ruta de credencial, sin tocar la de NES CAMP.
5. **Prueba de aislamiento (criterio de aceptación):** con ambas configuraciones activas, la de Tu Tesis RD debe listar la propiedad `G-2XTMDMXZFC` y **no** la de NES CAMP; la de NES CAMP debe seguir listando `546040776` y **no** la de Tu Tesis RD. Si una lista ambas, el aislamiento ha fallado y se revierte.
6. **Registrar** el resultado en `03_matriz_accesos.csv`.

**Reversión:** restaurar el `.mcp.json` original y el archivo ADC del paso 1. Sin efectos residuales en ninguna plataforma.

---

## 6. Riesgo de acceso detectado en paralelo

Ver `H-01` en `04_auditoria_web.md`: el token de desarrollador de Google Ads está en `.mcp.json`, **archivo versionado en git** y presente en el historial público del repositorio (commit `dea5f0b`). Cualquier rediseño de la gestión de credenciales debe empezar por rotar ese token y sacar el archivo del control de versiones — de lo contrario, el aislamiento que se construya arriba se apoya sobre un secreto ya expuesto.
