# HANDOFF — TuTesisRD · Matriz de Consistencia Forense
**Fecha:** 2026-04-20 | **Commit:** `cce5642` | **Branch:** `main` → Vercel desplegado

---

## 1. Estado actual del sistema

La herramienta de Matriz de Consistencia ejecuta ahora un **protocolo de auditoría forense sistémica de 10 fases** que cubre todos los elementos de una tesis académica como sistema lógico, no solo APA ni objetivos.

**Deploy activo:** https://www.tutesisrd.online  
**Supabase Edge Function:** `ai-bridge` (`--no-verify-jwt`) — modelo Gemini 3 Flash Preview

---

## 2. Flujo técnico

```
PDF del usuario
    ↓ (pdfjs)
Texto limpio hasta 500 000 chars
    ↓ (strictAnalyzer.ts)
Regex detección sección de referencias → budget split cuerpo/bibliografía
    ↓
getStrictPrompt() → Gemini 3 Flash Preview (v1beta)
    ↓ jsonMode:true, maxOutputTokens:16384
ai-bridge Edge Function → Google Gemini API
    ↓
Zod validation → MatrixAnalysisDTO
    ↓
Dashboard + PDF exportado 14 secciones (paleta TuTesisRD #F29727)
```

---

## 3. Protocolo de 10 Fases (strictPrompts.ts)

| Fase | Nombre | Campo JSON generado |
|------|--------|---------------------|
| 1 | Extracción de inventarios APA | `citationInventory`, `referenceInventory` |
| 2 | Validación regla-por-regla R01–R13 | `ruleValidationResults` |
| 3 | Scoring ponderado por nivel académico | `apaComplianceScore` |
| 4 | Evaluación de 20 elementos de la tesis | `thesisElementsEvaluation` |
| 5 | Trazabilidad objetivo↔instrumento↔resultado | `correspondenceMatrix` |
| 6 | Coherencia numérica (cifras contradictorias) | `numericalCoherence` |
| 7 | Hallazgos clasificados Crítico/Alto/Medio (≥12) | `auditFindings` |
| 8 | Plagio + patrones de redacción asistida IA | `plagiarismRiskAnalysis`, `aiWritingPatterns` |
| 9 | Clasificación propuesta (diseñada/implementada/proyectada) | `proposalClassification` |
| 10 | Diagnóstico técnico de cierre | `closingDiagnosis` |

**Perfiles:** Grado (umbral 70) · Maestría (80) · Doctorado (90)

---

## 4. Archivos clave modificados

### `src/services/consistency/strictPrompts.ts`
- Protocolo expandido de 4 → 10 fases
- 10 preguntas guía internas como checkpoints obligatorios del auditor
- Regla de sobreafirmación: si conclusión habla de "impacto real" sin intervención → `discrepancyWarning` + hallazgo Crítico
- 20 elementos de tesis evaluados (antes solo objetivos)
- Restricciones ineludibles: 10 reglas (antes 6)

### `src/types/schemas.ts`
Nuevos schemas añadidos al `MatrixAnalysisSchema`:
```
AuditFindingSchema           hallazgo + severidad + evidencia + relación violada + corrección
CorrespondenceEntrySchema    objetivo↔instrumento↔resultado↔status
NumericalInconsistencySchema cifra en sección A ≠ cifra en sección B
PlagiarismRiskAnalysisSchema nivel + señales + fragmentos sospechosos
AiWritingPatternsSchema      compatibilidad + patrones detectados
ProposalClassificationSchema tipo propuesta + alerta de sobreafirmación
ClosingDiagnosisSchema       cumplimiento + consistencia + declaración técnica
```

### `src/services/pdfExport.ts`
14 secciones en el PDF (antes 8). Nuevas secciones 9–14:
- **9. Trazabilidad Empírica** — tabla objetivo↔instrumento↔resultado con status coloreado
- **10. Coherencia Numérica** — tabla cifras contradictorias entre secciones
- **11. Hallazgos por Severidad** — cards con badge lateral rojo/amarillo/gris, ordenados Crítico→Alto→Medio, dashboard de contadores
- **12. Plagio + Patrones IA** — badge nivel riesgo, señales, fragmentos sospechosos con motivo
- **13. Clasificación Propuesta** — badge tipo + alerta roja si hay sobreafirmación
- **14. Diagnóstico de Cierre** — cards cumplimiento estructural/metodológico + lista fortalezas/debilidades + declaración técnica en caja naranja

Paleta: `#F29727` naranja · `#D99A4E` gold · `#0D0D0D` brandBlack · `type RGB = [number, number, number]`

---

## 5. Configuración activa

```typescript
// src/config.ts
CONSISTENCY_AI_MODEL         = "gemini-3-flash-preview"
CONSISTENCY_AI_TEMPERATURE   = 0.1
CONSISTENCY_MAX_CHARS        = 500_000
CONSISTENCY_MAX_OUTPUT_TOKENS = 16_384

// supabase/functions/ai-bridge/index.ts
maxOutputTokens              → propagado del cliente
jsonMode: true               → responseMimeType: "application/json"
FALLBACK_MODELS              = ['gemini-3-flash-preview', 'gemini-3-pro-preview',
                                'gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-1.5-pro']
```

---

## 6. Errores resueltos en el historial de la sesión

| Error | Causa raíz | Solución aplicada |
|-------|-----------|-------------------|
| CORS bloqueado en producción | Función `gemini-proxy` deprecada / sin JWT | Renombrada a `ai-bridge` con `--no-verify-jwt` |
| Bibliografía truncada | Filtro `prioritySections` descartaba chunks | Regex `/referencias?\|bibliograf[íi]a/i` + tail fallback garantizado |
| Output IA truncado | Default Gemini 8k tokens insuficiente | `maxOutputTokens: 16384` en ai-bridge + cliente |
| JSON inválido del modelo | Sin mime type | `responseMimeType: "application/json"` cuando `jsonMode: true` |
| TS error `number[]` vs Color | Arrays sin tuple type | `type RGB = [number, number, number]` + `as RGB` en COLORS |
| Análisis limitado a objetivos | Prompt no cubría todos los elementos | FASE 4: 20 elementos + FASE 5: trazabilidad + FASE 7: severidad |

---

## 7. Pendientes priorizados

| Prioridad | Tarea |
|-----------|-------|
| 🔴 Alta | Validar en producción: confirmar que `auditFindings` retorna ≥12 entradas y `correspondenceMatrix` cubre todos los objetivos específicos de la tesis |
| 🔴 Alta | Añadir UI cards en Dashboard para secciones 9–14 (actualmente solo aparecen en PDF exportado) |
| 🟡 Media | Selector de nivel académico en UI (Grado/Maestría/Doctorado) — actualmente hardcodeado en `'Grado'` |
| 🟡 Media | Corregir `registerWizard.a11y.test.tsx` — error TS pre-existente (`screen` no exportado de `@testing-library/react`) |
| 🟢 Baja | Fallback inteligente: si doc > 500k chars, mostrar banner "Se leyó el X% del documento" |
| 🟢 Baja | Probar `gemini-3-pro-preview` como modelo primario para tesis doctorales complejas |

---

## 8. Comandos de referencia rápida

```bash
# Typecheck (solo archivos relevantes)
npx tsc --noEmit 2>&1 | grep -v registerWizard

# Deploy Edge Function (si se modifica ai-bridge)
supabase functions deploy ai-bridge --no-verify-jwt

# Push a producción (Vercel auto-deploy)
git push origin main

# Ver logs en tiempo real del Edge Function
supabase functions logs ai-bridge --tail
```

---

## 9. Principios del auditor forense implementados en el prompt

1. No asumir que lo escrito es correcto por sonar académico
2. Auditar RELACIONES entre apartados, no apartados aislados
3. Cada instrumento declarado DEBE tener resultado visible → hallazgo Crítico si no
4. Cada objetivo DEBE tener evidencia de cumplimiento → `correspondenceMatrix`
5. Toda conclusión DEBE derivar de datos → no de deseos del autor
6. Toda referencia DEBE existir y ser académicamente apropiada
7. Propuesta diseñada ≠ implementada ≠ proyectada → clasificación obligatoria + `discrepancyWarning`
8. Plagio: clasificar nivel Bajo/Medio/Alto estructuralmente, no acusar
9. IA: "patrones compatibles con redacción asistida", nunca acusación concluyente
10. `closingDiagnosis.technicalClosingStatement` es OBLIGATORIO — párrafo tipo auditoría defensible ante jurado
