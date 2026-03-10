const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-B_dwzf8W.js","assets/react-vendor-DW-90RE3.js","assets/pdf-vendor-Cfl-j3GV.js","assets/index-DWzUxC8Y.css","assets/pdfExport-C2Sg9s8W.js"])))=>i.map(i=>d[i]);
import{_,G as X}from"./pdf-vendor-Cfl-j3GV.js";import{j as e,s as M,u as q,a as W,b as H}from"./index-B_dwzf8W.js";import{d as x,u as J,L as Y}from"./react-vendor-DW-90RE3.js";import{N as Z}from"./Navbar-DfztusDR.js";import{a as K}from"./client-BHXiI_Ut.js";import{o as c,a as o,e as j,s as a,b as Q,c as f,r as ee,n as d,Z as ae}from"./ai-vendor-DIeukltx.js";import{a as te,w as se}from"./wordExportService-CBEPKwar.js";import re from"./pdf.worker.min-BuDT2eDy.js";import"./index-oeSJlVDm.js";import"./doc-vendor-CULopG2p.js";const ie=`
=== DIMENSIÓN: REDACCIÓN ACADÉMICA Y ESTILO (BASADO EN APA 7MA ED.) ===

1. CITAS EN EL TEXTO:
   - Toda cita textual de >= 40 palabras DEBE estar en bloque separado, sangría 1.27 cm, sin comillas. [Pág. 10]
   - Todo cita textual de < 40 palabras DEBE estar entre comillas dobles. [Pág. 10]
   - Uso de "et al.": Para 3 o más autores, usar "et al." desde la primera aparición. [Pág. 14]
   - Fuentes de 2 autores: Citar siempre a ambos. [Pág. 14]
   - Toda cita en texto DEBE tener correspondencia en la lista de referencias. [Pág. 14, 16]

2. LISTA DE REFERENCIAS:
   - Orden alfabético obligatorio. [Pág. 5]
   - Sangría francesa obligatoria. [Pág. 5]
   - NO incluir ciudad de editorial para libros (ej: Caracas: Panapo -> Sabino, C. (2000). El proceso de investigación. Panapo.). [Pág. 5]

3. PREVENCIÓN DEL PLAGIO:
   - "Autoplagio": Presentar un trabajo propio ya publicado como nuevo es falta grave. [Pág. 7]
   - Atribución rigurosa: Todo hecho o cifra que no sea conocimiento común DEBE citarse. [Pág. 11]

=== PLANTILLA DE FEEDBACK ACCIONABLE (OBLIGATORIA) ===
Para cada error detectado, usa este formato:
- Hallazgo: Descripción clara del error.
- Evidencia: Ubicación exacta [Pág. X].
- Por qué importa: Justificación normativa (citar APA 7).
- Cómo corregir: Instrucción paso a paso.
- Ejemplo breve: Demostración visual del cambio.
`,ne=(t,s="Grado")=>`
IDENTIDAD DEL EVALUADOR:
Eres un evaluador académico de élite con certificación en metodología de investigación, 
auditoría de tesis doctorales, y revisión para revistas indexadas Q1.

MISIÓN CRÍTICA:
Realizar una auditoría FORENSE del documento académico basándote en el MODELO OPERATIVO APA 7.

PERFIL DE EXIGENCIA: Nivel ${s}
(Aplica las ponderaciones de rigor correspondientes a este nivel académico).

═══════════════════════════════════════════════════════════════

REGLAS DE ORO (ESTILO APA 7):
${ie}

═══════════════════════════════════════════════════════════════

FASE 1: VERIFICACIÓN NORMATIVA OBLIGATORIA (SI APLICA)

${t?`
🔴 NORMATIVA INSTITUCIONAL ACTIVA:
El documento DEBE cumplir las siguientes reglas institucionales:

${t}

INSTRUCCIONES DE VERIFICACIÓN:
1. Para CADA regla normativa, verifica si el documento la cumple
2. Si NO cumple, genera una alerta CRÍTICA con:
   - Regla incumplida
   - Evidencia del incumplimiento [Pág. X]
   - Impacto (puede invalidar la tesis)
3. Si cumple, confirma con evidencia [Pág. X]
4. Las violaciones normativas tienen PRIORIDAD MÁXIMA

SECCIÓN DE SALIDA OBLIGATORIA:
normativeComplianceDetailed: {
  overallCompliance: number (0-100),
  violations: [{
    rule: string,
    severity: 'Critical' | 'High' | 'Medium' | 'Low',
    evidence: string (con [Pág. X]),
    impact: string
  }],
  compliantItems: [{
    rule: string,
    evidence: string (con [Pág. X])
  }]
}
`:"No hay normativa institucional activa. Evalúa contra estándares generales APA 7 y buenas prácticas académicas."}

═══════════════════════════════════════════════════════════════

FASE 2: VERIFICACIÓN ESTRUCTURAL GRANULAR

Verifica la PRESENCIA y CALIDAD de cada sección esperada:

SECCIONES OBLIGATORIAS (según tipo de documento):
1. Portada / Carátula
2. Dedicatoria / Agradecimientos (opcional pero común)
3. Resumen / Abstract
4. Índice / Tabla de contenidos
5. Introducción
6. Planteamiento del problema
7. Justificación
8. Objetivos (general y específicos)
9. Marco teórico / Estado del arte
10. Marco conceptual
11. Marco metodológico (diseño, población, técnicas, instrumentos)
12. Resultados
13. Análisis / Discusión
14. Conclusiones
15. Recomendaciones
16. Referencias bibliográficas
17. Anexos (si aplica)

Para CADA sección, verifica:
- ¿Existe? (Sí/No) → Si NO existe y es obligatoria: ALERTA CRÍTICA
- ¿Está completa? (nivel de desarrollo: 0-100%)
- ¿Cumple su propósito? (evaluación cualitativa)
- ¿Está en el lugar correcto? (considera ROE si está en normativa)
- Evidencia: [Pág. X-Y donde aparece]

═══════════════════════════════════════════════════════════════

FASE 3: MATRIZ DE CONSISTENCIA DETALLADA

Genera UNA TABLA con las siguientes columnas y filas:

ELEMENTOS A VERIFICAR:
1. Problema de investigación
2. Pregunta de investigación (general)
3. Preguntas específicas (si aplica)
4. Justificación
5. Objetivo general
6. Objetivos específicos (cada uno por separado)
7. Hipótesis / Supuestos (si aplica)
8. Variables / Categorías de análisis
9. Enfoque metodológico (cuanti/cuali/mixto)
10. Diseño de investigación
11. Población objetivo
12. Muestra / Participantes
13. Técnicas de recolección
14. Instrumentos utilizados
15. Procedimiento de análisis
16. Resultados (cada objetivo específico)
17. Conclusiones (cada objetivo específico)
18. Recomendaciones

Para CADA ELEMENTO:
- Descripción textual encontrada (citar [Pág. X])
- Nivel de coherencia con elementos relacionados: Alta / Media / Baja / Inexistente
- Observación técnica detallada (¿qué falla exactamente?)
- Recomendación concreta y accionable

CRITERIOS DE COHERENCIA:
- Alta (90-100%): Alineación perfecta, sin contradicciones
- Media (60-89%): Alineación parcial, inconsistencias menores
- Baja (30-59%): Desalineación significativa, contradicciones evidentes
- Inexistente (0-29%): No hay relación o está ausente

FASE 3.1: SUB-MATRIZ DE CONSISTENCIA DE FUENTES
Instrucciones:
1. Extrae TODAS las citas únicas del texto (citationsFound).
2. Verifica si están en la lista de referencias (inBibliography).
3. Identifica referencias sobrantes (unusedReferences) y faltantes (missingReferences).

═══════════════════════════════════════════════════════════════

FASE 4: EVALUACIÓN METODOLÓGICA FORENSE

Analiza CON LUPA la coherencia metodológica:

4.1 ALINEACIÓN ENFOQUE-DISEÑO:
- ¿El diseño elegido es apropiado para el enfoque declarado?
- ¿Las técnicas corresponden al diseño?
- Evidencia: [Pág. X]

4.2 POBLACIÓN Y MUESTRA:
- ¿Está claramente definida la población?
- ¿El muestreo es adecuado? (probabilístico/no probabilístico según diseño)
- ¿El tamaño muestral está justificado?
- Evidencia: [Pág. X]

4.3 INSTRUMENTOS:
- ¿Los instrumentos están descritos con detalle?
- ¿Se reporta validez y confiabilidad?
- ¿Son coherentes con las variables/categorías?
- Evidencia: [Pág. X]

4.4 RESULTADOS VS MÉTODO:
- ¿Los resultados reportados PODRÍAN haberse obtenido con el método descrito?
- ¿Hay resultados "mágicos" (aparecen sin instrumentos que los capturen)?
- ¿Los análisis estadísticos/cualitativos son apropiados?
- Evidencia: [Pág. X]

4.5 CONCLUSIONES VS RESULTADOS:
- ¿CADA conclusión tiene soporte EN los resultados?
- ¿Hay conclusiones "inventadas" (sin datos que las respalden)?
- ¿Se respetan las limitaciones del método?
- Evidencia: [Pág. X]

ALERTAS CRÍTICAS:
Marca como "INVALIDANTE" si:
- El diseño no puede responder a los objetivos
- Los instrumentos no capturan las variables
- Las conclusiones no derivan de los resultados
- Hay fabricación evidente de datos

═══════════════════════════════════════════════════════════════

FASE 5: CALIDAD DE ESCRITURA ACADÉMICA

Verifica RIGUROSAMENTE:

5.1 ORTOGRAFÍA:
- Lista TODOS los errores ortográficos encontrados (máx 50 primeros)
- Formato: "Palabra incorrecta [Pág. X]: debería ser 'corrección'"

5.2 GRAMÁTICA:
- Lista errores de concordancia, pronombres, tiempos verbales
- Formato: "Error [Pág. X]: '...' → debería ser '...'"

5.3 ESTILO ACADÉMICO:
- ¿Usa lenguaje formal?
- ¿Evita primera persona (excepto en investigación cualitativa reflexiva)?
- ¿Usa voz activa apropiadamente?
- ¿Los párrafos tienen estructura lógica?

5.4 CITACIÓN:
- ¿Sigue consistentemente un estilo (APA7, Vancouver, etc.)?
- ¿Todas las citas en texto tienen referencia completa?
- ¿Todas las referencias fueron citadas en el texto?
- Lista las primeras 20 inconsistencias encontradas

═══════════════════════════════════════════════════════════════

FASE 6: DIAGNÓSTICO GLOBAL Y RECOMENDACIONES

6.1 NIVEL GLOBAL:
- Excelente (90-100): Listo para defensa con ajustes menores
- Aceptable (70-89): Requiere revisiones substanciales
- Débil (50-69): Necesita reescritura de secciones clave
- Crítico (<50): NO apto para defensa, requiere refactorización total

6.2 RIESGOS PRINCIPALES:
- Lista los 5-10 riesgos MÁS GRAVES que podrían causar rechazo

6.3 RECOMENDACIONES PRIORIZADAS:
Para cada recomendación:
- Prioridad: Crítica / Alta / Media / Baja
- Qué hacer: acción concreta
- Por qué: justificación técnica
- Cómo: pasos específicos
- Dónde: [Pág. X] afectadas

6.4 FEEDBACK ACCIONABLE (Visual):
Genera al menos 5-10 items CLAROS para las tarjetas de feedback:
- Hallazgo
- Evidencia [Pág. X]
- Por qué importa
- Cómo corregir
- Ejemplo breve

═══════════════════════════════════════════════════════════════

FORMATO DE SALIDA (JSON ESTRICTO):
{
  "documentType": string,
  "methodologicalApproach": string,
  "disciplinaryArea": string,
  "applicableStandards": string[],
  
  "structuralVerification": {
    "sectionsFound": { "NombreSección": { "exists": boolean, "pages": string, "completeness": number } },
    "missingSections": string[],
    "misplacedSections": string[]
  },
  
  "normativeComplianceDetailed": {
    "overallCompliance": number,
    "violations": [{ "rule": string, "severity": "Critical" | "High" | "Medium" | "Low", "evidence": string, "impact": string }],
    "compliantItems": [{ "rule": string, "evidence": string }]
  },
  
  "consistencyMatrix": [
    {
      "element": string,
      "description": string,
      "coherenceLevel": "Alta/Media/Baja/Inexistente",
      "technicalObservation": string,
      "recommendation": string
    }
  ],
  "sectionEvaluations": [ ... ],
  "methodologicalAnalysis": {
    "approachCoherent": boolean,
    "designAdequate": boolean,
    "techniquesAppropriate": boolean,
    "resultsDeriveFromMethod": boolean,
    "conclusionsSupportedByResults": boolean,
    "criticalAlerts": [],
    "invalidatingIssues": []
  },
  "normativeCompliance": { 
     "apa7Score": 0-100, 
     "academicWritingScore": 0-100,
     "terminologyConsistencyScore": 0-100,
     "orthographicErrors": [],
     "grammaticalErrors": [],
     "styleIssues": [] 
  },
  "sourceConsistencySubMatrix": {
    "citationsFound": [{ "citation": string, "inBibliography": boolean, "page": string }],
    "referencesCiting": [string],
    "unusedReferences": [string],
    "missingReferences": [string]
  },
  "globalDiagnosis": { 
    "level": "Excelente/Aceptable/Débil/Crítico", 
    "mainRisks": [], 
    "internalConsistencyDegree": number, 
    "publishabilityLevel": number 
  },
  "prioritizedRecommendations": [ ... ],
  "actionableFeedback": [
    { "finding": string, "evidence": string, "whyItMatters": string, "howToFix": string, "example": string }
  ]
}

RESTRICCIONES:
- No inventes información. Si falta algo, indícalo explícitamente.
- Mantén lenguaje académico claro y profesional.
- Prioriza RIGOR sobre simplicidad.
- SIEMPRE CITA LA PÁGINA DE REFERENCIA cuando sea posible.
- EVITA EL markdown en la respuesta JSON. Devuelve JSON puro.

DOCUMENTO A EVALUAR:
{DOCUMENT_TEXT}
`,oe={APP_NAME:"TuTesisRD",VERSION:"2.0.0",CONSISTENCY_AI_MODEL:"gemini-1.5-flash",CONSISTENCY_AI_TEMPERATURE:parseFloat("0.1"),CONSISTENCY_MAX_CHARS:parseInt("350000",10)},le=c({title:a(),authors:o(a()).optional(),publicationYear:d().optional(),doi:a().optional(),hostVenue:a().optional()});c({reference:le,status:j(["verified","valid_no_doi","needs_review","not_found","error"]),score:d().min(0).max(100),sources:o(a()).optional(),validationMessage:a().optional()});const ce=c({burstiness:d().optional(),perplexityProxy:d().optional(),lexicalDiversity:d().optional()}),de=c({chatgpt:d().optional(),gemini:d().optional(),claude:d().optional()}),me=c({text:a(),probability:d()});c({score:d().min(0).max(1),metrics:ce.optional(),sourceProbabilities:de.optional(),signals:o(a()).optional(),heatmap:o(me).optional()});const xe=c({element:a(),description:a(),coherenceLevel:j(["Alta","Media","Baja","Inexistente"]).or(a()),technicalObservation:a(),recommendation:a()}),pe=c({section:a(),strengths:o(a()),weaknesses:o(a()),internalIncoherences:o(a()),methodologicalMisalignments:o(a())}),ge=c({approachCoherent:f(),designAdequate:f(),techniquesAppropriate:f(),resultsDeriveFromMethod:f(),conclusionsSupportedByResults:f(),criticalAlerts:o(a()),forensicReasoning:a().optional()}),ue=c({apa7Score:d(),academicWritingScore:d(),terminologyConsistencyScore:d(),orthographicErrors:o(a()),grammaticalErrors:o(a()),styleIssues:o(a())}),be=c({level:j(["Excelente","Aceptable","Débil","Crítico"]).or(a()),mainRisks:o(a()),internalConsistencyDegree:d(),publishabilityLevel:d(),auditSummary:a().optional(),summary:a().optional(),score:d().optional()}),he=c({priority:j(["Crítica","Alta","Media","Baja"]).or(a()).optional().default("Media"),what:a().optional().default("<<MISSING_CONTENT>>"),why:a().optional().default("<<MISSING_CONTENT>>"),how:a().optional().default("<<MISSING_CONTENT>>")}),fe=c({sectionsFound:ee(a(),c({exists:f(),pages:a().nullable().optional(),completeness:d()})).optional(),missingSections:o(a()).optional(),misplacedSections:o(a()).optional()}),ve=c({citationsFound:o(c({citation:a(),inBibliography:f(),page:a()})).optional(),referencesCiting:o(a()).optional(),unusedReferences:o(a()).optional(),missingReferences:o(a()).optional()}),Ne=c({finding:a(),evidence:a(),whyItMatters:a(),howToFix:a(),example:a()}),Ae=c({documentType:a().optional(),methodologicalApproach:a().optional(),disciplinaryArea:a().optional(),applicableStandards:o(a()).optional(),consistencyMatrix:o(xe).optional(),sectionEvaluations:o(pe).optional(),methodologicalAnalysis:ge.optional(),normativeCompliance:ue.optional(),globalDiagnosis:be.optional(),prioritizedRecommendations:o(he).optional(),structuralVerification:fe.optional(),sourceConsistencySubMatrix:ve.optional(),actionableFeedback:o(Ne).optional(),normativeComplianceDetailed:Q().optional(),rawAnalysis:a().optional(),analysisStatus:j(["ok","partial","insufficient_input","model_noncompliant","error"]).optional(),analysisWarnings:o(a()).optional()});c({id:a().uuid().optional(),title:a(),studentName:a().optional(),university:a().optional(),status:j(["draft","review","approved"]).default("draft"),createdAt:a().optional(),updatedAt:a().optional()});c({provider:a(),model:a(),durationMs:d(),inputTokens:d().optional(),outputTokens:d().optional(),success:f(),errorCode:a().optional(),timestamp:d()});const ye=c({type:j(["text","heading1","heading2","heading3","list","table","page_break"]),content:a().optional(),tableData:c({headers:o(a()),rows:o(o(a())),isMatrix:f().optional()}).optional(),styling:c({bold:f().optional(),color:a().optional(),align:j(["left","center","right","justify"]).optional(),isCritical:f().optional(),size:d().optional()}).optional()});c({metadata:c({title:a(),subtitle:a().optional(),date:a(),creator:a().default("ScholarAI"),brandingColor:a().optional()}),sections:o(ye)});const je=Ae;function Ee(t,s){var n,r,m,v,p;if(!t&&!s)return null;let l=t||"";return s&&(l+=`

INFORMACIÓN ESTRUCTURAL ADICIONAL EXTRAÍDA:
`,(r=(n=s.contentRequirements)==null?void 0:n.mandatorySections)!=null&&r.length&&(l+=`Secciones Obligatorias:
${s.contentRequirements.mandatorySections.map(u=>`- ${u.name} (Obligatoria)`).join(`
`)}

`),s.formattingRules&&(l+=`Reglas de Formato Clave:
- Márgenes: ${JSON.stringify((m=s.formattingRules.pageSetup)==null?void 0:m.margins)}
- Tipografía: ${(v=s.formattingRules.typography)==null?void 0:v.bodyFont}
- Citación: ${(p=s.citationRules)==null?void 0:p.style}
`)),l}async function ke(t,s,l="Grado",n){var k,P,S;const r=t.replace(/<img[^>]*src="data:[^"]*"[^>]*>/g,"").replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim(),{SemanticChunker:m}=await _(async()=>{const{SemanticChunker:g}=await import("./chunkingService-DehVIyGE.js");return{SemanticChunker:g}},[]),v=m.chunkBySections(r),p=["INTRODUCCI","PROBLEMA","METODOLOG","RESULTADOS","CONCLUSIONES","DISCUSI","OBJETIVO"],u=v.filter(g=>p.some(N=>g.sectionType.toUpperCase().includes(N))),h=u.length>0?u.map(g=>`[SECCIÓN: ${g.sectionType}]
${g.content.substring(0,2e4)}`).join(`

`):r.substring(0,1e5);console.log(`[StrictAnalyzer] Processing text. Total Length: ${h.length}, Chunks Used: ${u.length>0?u.length:"Full Text"}`),h.length<500&&console.warn("[StrictAnalyzer] WARNING: Input text is dangerously short (<500 chars). Analysis may fail.");const O=Ee(s,n),w=ne(O,l).replace("{DOCUMENT_TEXT}",h);try{const g=await K({prompt:w,systemInstruction:"Eres un auditor académico estricto. Analiza el documento buscando inconsistencias fatales y fallos normativos.",temperature:.1,model:oe.CONSISTENCY_AI_MODEL}),N=je.parse(g);console.log(`[StrictAnalyzer] Validated Result Keys: ${Object.keys(N).join(", ")}`),console.log(`[StrictAnalyzer] Diagnosis Level: ${(k=N.globalDiagnosis)==null?void 0:k.level}, Consistency: ${(P=N.globalDiagnosis)==null?void 0:P.internalConsistencyDegree}%`);let R="ok";const D=[];r.length<500&&(R="insufficient_input",D.push("Texto insuficiente para análisis profundo.")),((S=N.globalDiagnosis)==null?void 0:S.level)==="Pendiente"&&(R="partial",D.push("Diagnóstico global incompleto."));let L=0;if(N.prioritizedRecommendations)for(const b of N.prioritizedRecommendations)(b.what==="<<MISSING_CONTENT>>"||b.why==="<<MISSING_CONTENT>>"||b.how==="<<MISSING_CONTENT>>")&&(L++,b.what==="<<MISSING_CONTENT>>"&&(b.what="Recomendación general"),b.why==="<<MISSING_CONTENT>>"&&(b.why="Justificación no disponible en análisis estricto."),b.how==="<<MISSING_CONTENT>>"&&(b.how="Consultar revisión manual."));return L>0&&(R="partial",D.push(`${L} recomendación(es) marcadas como incompletas.`)),{...N,rawAnalysis:"Análisis Forense Completado",analysisStatus:R,analysisWarnings:D}}catch(g){throw console.error("Strict Analysis Failed. Full Error:",JSON.stringify(g,null,2)),g instanceof ae&&console.error("Zod Validation Issues:",g.issues),new Error(`Error en análisis estricto: ${g.message}`)}}const Se=({result:t})=>{const s=()=>{const r=te(t);se.generateWordDocument(r,"Analisis_Consistencia.docx")},l=r=>r>=90?"text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20":r>=70?"text-amber-500 bg-amber-50 dark:bg-amber-900/20":"text-red-500 bg-red-50 dark:bg-red-900/20",n={Excelente:"text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",Aceptable:"text-blue-600 bg-blue-100 dark:bg-blue-900/30",Débil:"text-amber-600 bg-amber-100 dark:bg-amber-900/30",Crítico:"text-red-600 bg-red-100 dark:bg-red-900/30"};return e.jsxs("div",{className:"space-y-8 animate-fade-in p-6 max-w-7xl mx-auto",children:[(t.analysisStatus==="partial"||t.analysisWarnings&&t.analysisWarnings.length>0)&&e.jsx("div",{className:"bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg animate-fade-in mx-auto max-w-7xl",children:e.jsxs("div",{className:"flex items-start",children:[e.jsx("div",{className:"flex-shrink-0",children:e.jsx("span",{className:"material-symbols-outlined text-amber-500",children:"warning"})}),e.jsxs("div",{className:"ml-3",children:[e.jsx("h3",{className:"text-sm font-bold text-amber-800 dark:text-amber-200",children:"Análisis Parcialmente Completado"}),e.jsx("div",{className:"mt-2 text-sm text-amber-700 dark:text-amber-300",children:e.jsx("ul",{className:"list-disc pl-5 space-y-1",children:t.analysisWarnings&&t.analysisWarnings.length>0?t.analysisWarnings.map((r,m)=>e.jsx("li",{children:r},m)):e.jsx("li",{children:"Algunas secciones contienen datos genéricos debido a limitaciones en la respuesta del modelo."})})})]})]})}),e.jsx("div",{className:"flex justify-end mb-4",children:e.jsxs("button",{onClick:s,className:"flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-lg hover:-translate-y-1 transition-transform",children:[e.jsx("span",{className:"material-symbols-outlined text-sm",children:"download"}),"Exportar Informe DOCX"]})}),e.jsxs("div",{className:"flex flex-col md:flex-row gap-6 items-start",children:[e.jsxs("div",{className:"flex-1 bg-white dark:bg-surface-dark p-8 rounded-[2rem] border border-slate-100 dark:border-surface-border shadow-xl",children:[e.jsxs("div",{className:"flex items-start justify-between mb-6",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-xs font-black uppercase tracking-[0.2em] text-slate-400",children:"Diagnóstico Global"}),e.jsx("h2",{className:`text-4xl font-black mt-2 ${n[t.globalDiagnosis.level].split(" ")[0]}`,children:t.globalDiagnosis.level})]}),e.jsxs("div",{className:`px-4 py-2 rounded-full font-bold text-sm ${n[t.globalDiagnosis.level]}`,children:["Riesgo: ",t.globalDiagnosis.level==="Excelente"?"Bajo":t.globalDiagnosis.level==="Aceptable"?"Medio":"Alto"]})]}),e.jsxs("p",{className:"text-slate-600 dark:text-slate-300 leading-relaxed mb-6 border-l-4 border-slate-200 dark:border-slate-700 pl-4 py-1 italic",children:['"',t.globalDiagnosis.auditSummary||"Análisis completado exitosamente.",'"']}),e.jsxs("div",{className:"grid grid-cols-3 gap-4",children:[e.jsx(F,{label:"Consistencia",value:t.globalDiagnosis.internalConsistencyDegree,color:l(t.globalDiagnosis.internalConsistencyDegree)}),e.jsx(F,{label:"Publicabilidad",value:t.globalDiagnosis.publishabilityLevel,color:l(t.globalDiagnosis.publishabilityLevel)}),e.jsx(F,{label:"Estilo Académico",value:t.normativeCompliance.academicWritingScore,color:l(t.normativeCompliance.academicWritingScore)})]})]}),e.jsxs("div",{className:"w-full md:w-1/3 bg-slate-50 dark:bg-[#0d1017] p-6 rounded-[2rem] border border-slate-200 dark:border-surface-border h-full",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-6",children:[e.jsx("div",{className:"p-2 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg",children:e.jsx("span",{className:"material-symbols-outlined",children:"warning"})}),e.jsx("h3",{className:"font-bold text-slate-900 dark:text-white",children:"Alertas Críticas"})]}),e.jsx("div",{className:"space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar",children:t.methodologicalAnalysis.criticalAlerts.length>0?t.methodologicalAnalysis.criticalAlerts.map((r,m)=>e.jsxs("div",{className:"flex gap-3 text-sm p-3 bg-white dark:bg-surface-dark rounded-xl border border-red-100 dark:border-red-900/30",children:[e.jsx("span",{className:"material-symbols-outlined text-red-500 text-xs mt-1 shrink-0",children:"error"}),e.jsx("span",{className:"text-slate-700 dark:text-slate-300",children:r})]},m)):e.jsxs("div",{className:"text-center py-8 text-slate-400",children:[e.jsx("span",{className:"material-symbols-outlined text-4xl mb-2 opacity-50",children:"check_circle"}),e.jsx("p",{className:"text-sm",children:"Sin alertas críticas detectadas"})]})})]})]}),t.methodologicalAnalysis.forensicReasoning&&e.jsxs("div",{className:"bg-slate-900 border-2 border-brand-orange/30 text-slate-300 p-8 rounded-[2rem] relative overflow-hidden shadow-2xl shadow-brand-orange/5",children:[e.jsx("div",{className:"absolute top-0 right-0 p-32 bg-brand-orange/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"}),e.jsxs("div",{className:"flex items-center gap-3 mb-4 relative z-10",children:[e.jsx("span",{className:"material-symbols-outlined text-brand-orange text-3xl",children:"psychology"}),e.jsx("h3",{className:"font-black text-white uppercase tracking-[0.2em] text-sm",children:"Dictamen Forense de IA"})]}),e.jsx("p",{className:"text-xl leading-relaxed relative z-10 font-medium text-slate-200",children:t.methodologicalAnalysis.forensicReasoning})]}),e.jsxs("div",{children:[e.jsxs("h3",{className:"text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-4",children:[e.jsx("div",{className:"size-10 rounded-xl bg-brand-orange/10 flex items-center justify-center",children:e.jsx("span",{className:"material-symbols-outlined text-brand-orange",children:"app_registration"})}),"Acciones Correctivas Priorizadas"]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:t.prioritizedRecommendations.map((r,m)=>e.jsxs("div",{className:"bg-white dark:bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 hover:border-brand-orange/30 hover:shadow-2xl hover:shadow-brand-orange/5 transition-all duration-500 group",children:[e.jsxs("div",{className:"flex justify-between items-start mb-6",children:[e.jsxs("span",{className:`text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest ${r.priority==="Crítica"?"bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400":"bg-brand-orange/10 text-brand-orange"}`,children:["Prioridad ",r.priority]}),e.jsx("span",{className:"text-slate-200 dark:text-slate-700 text-5xl font-black opacity-40 group-hover:opacity-100 transition-opacity",children:String(m+1).padStart(2,"0")})]}),e.jsx("h4",{className:"font-black text-slate-800 dark:text-white mb-3 text-lg leading-tight uppercase tracking-tight",children:r.what}),e.jsx("p",{className:"text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed",children:r.why}),e.jsxs("div",{className:"bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-white/5",children:[e.jsx("span",{className:"font-black block mb-2 text-brand-orange uppercase tracking-widest text-[10px]",children:"Hoja de Ruta:"}),e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed",children:r.how})]})]},m))})]})]})},F=({label:t,value:s,color:l})=>e.jsxs("div",{className:`p-6 rounded-[2rem] border border-transparent shadow-sm ${l.split(" ")[1].replace("/20","/5")}`,children:[e.jsxs("div",{className:`text-4xl font-black ${l.split(" ")[0]} mb-2 tracking-tighter`,children:[s,e.jsx("span",{className:"text-base ml-1 opacity-60",children:"%"})]}),e.jsx("div",{className:"text-[10px] font-black uppercase tracking-[0.2em] opacity-60 text-slate-500 dark:text-slate-400",children:t})]}),Ce=({matrix:t})=>{const[s,l]=x.useState(null);return e.jsxs("div",{className:"bg-white/60 dark:bg-slate-900/60 rounded-[2.5rem] shadow-xl border border-white dark:border-white/5 overflow-hidden backdrop-blur-xl",children:[e.jsxs("div",{className:"p-10 border-b border-slate-100 dark:border-white/5",children:[e.jsx("h3",{className:"text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight",children:"Matriz de Consistencia Interactiva"}),e.jsx("p",{className:"text-slate-500 dark:text-slate-400 mt-2 text-lg",children:"Explora los hallazgos forenses de cada dimensión metodológica."})]}),e.jsx("div",{className:"divide-y divide-slate-100 dark:divide-white/5",children:t.map((n,r)=>e.jsxs("div",{className:`group transition-all duration-500 ${s===r?"bg-brand-orange/[0.03] dark:bg-brand-orange/[0.02]":"hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"}`,children:[e.jsxs("div",{className:"p-8 cursor-pointer flex items-center justify-between",onClick:()=>l(s===r?null:r),children:[e.jsxs("div",{className:"flex items-center gap-8",children:[e.jsx("div",{className:`
                                    w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-bold text-xl shadow-sm
                                    ${n.coherenceLevel==="Alta"?"bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30":n.coherenceLevel==="Media"?"bg-brand-orange/10 text-brand-orange":"bg-red-100 text-red-600 dark:bg-red-900/30"}
                                `,children:s===r?e.jsx("span",{className:"material-symbols-outlined text-3xl",children:"keyboard_arrow_up"}):e.jsx("span",{className:"material-symbols-outlined text-3xl",children:n.coherenceLevel==="Alta"?"verified":n.coherenceLevel==="Media"?"error":"dangerous"})}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-black text-slate-800 dark:text-white text-xl uppercase tracking-tight",children:n.element}),e.jsxs("div",{className:"flex items-center gap-3 mt-1.5",children:[e.jsxs("span",{className:`text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full ${n.coherenceLevel==="Alta"?"bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400":n.coherenceLevel==="Media"?"bg-brand-orange/10 text-brand-orange":"bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"}`,children:["Auditoría: ",n.coherenceLevel]}),!n.description&&e.jsxs("span",{className:"text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-1 opacity-60",children:[e.jsx("span",{className:"material-symbols-outlined text-xs",children:"block"})," No Hallado"]})]})]})]}),e.jsx("div",{className:"text-right hidden sm:block",children:e.jsx("span",{className:`material-symbols-outlined text-slate-300 group-hover:text-brand-orange transition-all duration-300 ${s===r?"rotate-90 text-brand-orange":""}`,children:"arrow_forward_ios"})})]}),e.jsx("div",{className:`
                            overflow-hidden transition-all duration-500 ease-in-out
                            ${s===r?"max-h-[800px] opacity-100 border-t border-slate-100 dark:border-white/5":"max-h-0 opacity-0"}
                        `,children:e.jsx("div",{className:"p-10 bg-slate-50/30 dark:bg-black/10",children:e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-10",children:[e.jsx("div",{className:"space-y-6",children:e.jsxs("div",{children:[e.jsx("h5",{className:"text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1",children:"Hallazgo Textual"}),e.jsxs("div",{className:"relative",children:[e.jsx("span",{className:"absolute -left-4 -top-2 text-4xl text-brand-orange/20 font-serif",children:'"'}),e.jsx("p",{className:"text-slate-600 dark:text-slate-300 italic font-medium leading-relaxed bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm",children:n.description||"No se logró extraer contenido directo para esta dimensión."}),e.jsx("span",{className:"absolute -right-2 -bottom-4 text-4xl text-brand-orange/20 font-serif",children:'"'})]})]})}),e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{className:"bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm",children:[e.jsx("h5",{className:"text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3",children:"Observación Técnica Forense"}),e.jsx("p",{className:"text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium",children:n.technicalObservation})]}),e.jsxs("div",{className:"bg-brand-orange/5 p-6 rounded-3xl border border-brand-orange/10 shadow-sm relative overflow-hidden",children:[e.jsx("div",{className:"absolute top-0 right-0 p-8 bg-brand-orange/10 rounded-full blur-2xl -mr-4 -mt-4"}),e.jsx("h5",{className:"text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange mb-3 relative z-10",children:"Acción Recomendada"}),e.jsxs("div",{className:"flex gap-4 items-start relative z-10",children:[e.jsx("div",{className:"size-8 rounded-lg bg-brand-orange/20 flex items-center justify-center shrink-0",children:e.jsx("span",{className:"material-symbols-outlined text-brand-orange text-lg",children:"auto_fix_high"})}),e.jsx("p",{className:"text-sm text-slate-800 dark:text-slate-200 font-bold leading-relaxed",children:n.recommendation})]})]})]})]})})})]},r))})]})};class Ie extends x.Component{constructor(){super(...arguments),this.state={hasError:!1,error:null},this.resetErrorBoundary=()=>{var s,l;(l=(s=this.props).onReset)==null||l.call(s),this.setState({hasError:!1,error:null})}}static getDerivedStateFromError(s){return{hasError:!0,error:s}}componentDidCatch(s,l){console.error(`[ErrorBoundary] Error in ${this.props.componentName||"Unknown Component"}:`,s,l)}render(){return this.state.hasError?this.props.fallback?this.props.fallback:e.jsxs("div",{className:"p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300",children:[e.jsx("div",{className:"w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-400",children:e.jsx("span",{className:"material-symbols-outlined text-3xl",children:"monitor_heart"})}),e.jsx("h3",{className:"text-lg font-black text-slate-800 dark:text-white mb-2",children:"Algo salió mal al mostrar el análisis"}),e.jsx("p",{className:"text-sm text-slate-600 dark:text-slate-300 mb-6 max-w-md",children:"Ocurrió un error inesperado al renderizar los resultados. Esto puede deberse a datos incompletos o un formato inesperado de la IA."}),this.state.error&&!1,e.jsxs("div",{className:"flex gap-4",children:[e.jsx("button",{onClick:()=>window.location.reload(),className:"px-6 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",children:"Recargar Página"}),e.jsx("button",{onClick:this.resetErrorBoundary,className:"px-6 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/30 transition-all hover:scale-105",children:e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"material-symbols-outlined",children:"refresh"}),"Reintentar Renderizado"]})})]})]}):this.props.children}}const we=()=>{var v;const[t,s]=x.useState(null),[l,n]=x.useState(!1);x.useEffect(()=>{M.auth.getSession().then(({data:{session:u}})=>{s(u)});const{data:{subscription:p}}=M.auth.onAuthStateChange((u,h)=>{s(h)});return()=>p.unsubscribe()},[]);const r=async()=>{n(!0);try{const{error:p}=await M.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin}});if(p)throw p}catch(p){console.error("Error logging in:",p)}finally{n(!1)}},m=async()=>{n(!0),await M.auth.signOut(),n(!1)};return t?e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs("div",{className:"hidden md:block text-right",children:[e.jsx("div",{className:"text-xs font-bold text-slate-700 dark:text-slate-300",children:t.user.user_metadata.full_name||t.user.email}),e.jsx("div",{className:"text-[10px] text-slate-400",children:"Sesión Activa"})]}),t.user.user_metadata.avatar_url?e.jsx("img",{src:t.user.user_metadata.avatar_url,alt:"User",className:"w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700"}):e.jsx("div",{className:"w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-xs",children:(v=t.user.email)==null?void 0:v.charAt(0).toUpperCase()}),e.jsx("button",{onClick:m,disabled:l,className:"p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500",title:"Cerrar Sesión",children:e.jsx("span",{className:"material-symbols-outlined text-lg",children:"logout"})})]}):e.jsxs("button",{onClick:r,disabled:l,className:"flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm hover:shadow-md transition-all hover:border-brand-orange/50 group",children:[l?e.jsx("span",{className:"material-symbols-outlined animate-spin text-lg",children:"sync"}):e.jsx("img",{src:"https://www.svgrepo.com/show/475656/google-color.svg",className:"w-5 h-5 group-hover:scale-110 transition-transform",alt:"Google"}),e.jsx("span",{children:"Iniciar Sesión"})]})};try{X.workerSrc=re}catch(t){console.warn("Could not set PDF worker source",t)}const $e=()=>{const{project:t,uploadedFile:s,setUploadedFile:l}=q(),{showNotification:n}=W(),r=J(),[m,v]=x.useState(!1),[p,u]=x.useState(0),[h,O]=x.useState(null);x.useEffect(()=>{var i;(i=r.state)!=null&&i.loadedAnalysis&&(O(r.state.loadedAnalysis),n("Visualizando reporte del historial","info"))},[r.state]);const[T,w]=x.useState("dashboard"),[k,P]=x.useState("Grado"),[S,g]=x.useState(""),[N,R]=x.useState(!1),[D,L]=x.useState(!1),b=x.useMemo(()=>H.map(i=>({id:i.id,name:i.name,content:`Normativa: ${i.regulations.style}. Páginas: ${i.regulations.minPages}-${i.regulations.maxPages}. Tips: ${i.tips.join(" ")}`,deepAnalysis:void 0})),[]);x.useEffect(()=>{b.length>0},[b,S]);const[C,$]=x.useState("idle");x.useEffect(()=>{_(async()=>{const{persistenceService:i}=await import("./index-B_dwzf8W.js").then(I=>I.e);return{persistenceService:i}},__vite__mapDeps([0,1,2,3])).then(({persistenceService:i})=>i.subscribe($))},[]);const G=async()=>{const i=(s==null?void 0:s.content)||t.content,I=Array.isArray(i)?i.reduce((E,A)=>E+A.text.length,0):(i==null?void 0:i.length)||0;if(!i||I<500){n("Necesitas al menos 500 caracteres de contenido para analizar","warning");return}v(!0),u(0);try{const E=setInterval(()=>{u(y=>Math.min(y+5,90))},500),A=b.find(y=>y.id===S),U=(A==null?void 0:A.content)||null,B=Array.isArray(i)?i.map(y=>`[Página ${y.page}]
${y.text}`).join(`

`):i,z=await ke(B,U,k,A==null?void 0:A.deepAnalysis);clearInterval(E),u(100),O(z),_(async()=>{const{persistenceService:y}=await import("./index-B_dwzf8W.js").then(V=>V.e);return{persistenceService:y}},__vite__mapDeps([0,1,2,3])).then(({persistenceService:y})=>{y.saveAnalysis(t.id||"offline-demo","consistency",z)}),n("Análisis de consistencia completado","success")}catch(E){console.error("Analysis error:",E);const A=E instanceof Error?E.message:"Error desconocido";n(`Error: ${A}`,"error")}finally{v(!1)}};return e.jsxs("div",{className:"min-h-screen font-sans text-slate-700 bg-slate-50 dark:bg-slate-900 transition-colors duration-300",children:[e.jsx(Z,{}),e.jsx("div",{className:"w-full max-w-[1600px] mx-auto h-[85vh] min-h-[700px] mt-24 rounded-[2.5rem] flex overflow-hidden relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-2xl border border-white/50 dark:border-slate-800/50",children:e.jsxs("main",{className:"flex-1 flex flex-col p-4 md:p-8 relative overflow-hidden",children:[e.jsxs("header",{className:"flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0",children:[e.jsxs("div",{children:[e.jsxs("h1",{className:"text-3xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-4",children:[e.jsx(Y,{to:"/herramientas",className:"flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors",children:e.jsx("span",{className:"material-symbols-outlined text-slate-600 dark:text-slate-300",children:"arrow_back"})}),"Matriz de Consistencia"]}),e.jsx("p",{className:"text-slate-500 dark:text-slate-400 text-sm mt-1",children:s?`Archivo: ${s.name}`:t.content?`Analizando: ${t.title||"Proyecto Actual"}`:"Auditoría Forense con IA"})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"mr-4",children:e.jsx(we,{})}),h&&e.jsxs("div",{className:"flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl",children:[e.jsx("button",{onClick:()=>w("dashboard"),className:`px-4 py-2 rounded-lg text-sm font-bold transition-all ${T==="dashboard"?"bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white":"text-slate-500 dark:text-slate-400 hover:text-slate-700"}`,children:"Dashboard"}),e.jsx("button",{onClick:()=>w("matrix"),className:`px-4 py-2 rounded-lg text-sm font-bold transition-all ${T==="matrix"?"bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white":"text-slate-500 dark:text-slate-400 hover:text-slate-700"}`,children:"Matriz"})]}),h&&e.jsxs("button",{onClick:async()=>{try{const{generateConsistencyMatrixPDF:i}=await _(async()=>{const{generateConsistencyMatrixPDF:I}=await import("./pdfExport-C2Sg9s8W.js");return{generateConsistencyMatrixPDF:I}},__vite__mapDeps([4,2]));i(h,"Informe_Consistencia_ScholarAI"),n("Informe PDF generado","success")}catch{n("Error al generar PDF","error")}},className:"px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform",children:[e.jsx("span",{className:"material-symbols-outlined text-lg",children:"picture_as_pdf"}),"PDF"]}),e.jsxs("div",{className:"flex items-center gap-2",children:[C==="saving"&&e.jsxs("span",{className:"text-xs font-bold text-slate-400 flex items-center gap-1 animate-pulse",children:[e.jsx("span",{className:"material-symbols-outlined text-sm",children:"cloud_upload"})," Guardando..."]}),C==="saved"&&e.jsxs("span",{className:"text-xs font-bold text-emerald-500 flex items-center gap-1 animate-fade-in",children:[e.jsx("span",{className:"material-symbols-outlined text-sm",children:"cloud_done"})," Guardado"]}),C==="error"&&e.jsxs("span",{className:"text-xs font-bold text-red-400 flex items-center gap-1",title:"Reintentando...",children:[e.jsx("span",{className:"material-symbols-outlined text-sm",children:"cloud_off"})," Error"]}),C==="offline"&&e.jsxs("span",{className:"text-xs font-bold text-slate-400 flex items-center gap-1",title:"Inicia sesión para guardar en la nube",children:[e.jsx("span",{className:"material-symbols-outlined text-sm",children:"offline_pin"})," Modo Local"]}),C==="pending"&&e.jsxs("span",{className:"text-xs font-bold text-amber-500 flex items-center gap-1",title:"Pendiente de sincronización",children:[e.jsx("span",{className:"material-symbols-outlined text-sm",children:"schedule_send"})," Pendiente Sinc"]})]})]})]}),e.jsxs("div",{className:"flex-1 flex flex-col xl:flex-row gap-6 h-full overflow-hidden",children:[e.jsx("section",{className:"flex-1 bg-white/60 dark:bg-slate-800/60 rounded-[2rem] border border-white/60 dark:border-slate-700/60 backdrop-blur-xl shadow-sm flex flex-col relative overflow-hidden",children:e.jsx("div",{className:"flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10",children:m?e.jsxs("div",{className:"h-full flex flex-col items-center justify-center animate-in fade-in duration-700",children:[e.jsxs("div",{className:"relative mb-8",children:[e.jsx("div",{className:"size-24 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-brand-orange animate-spin"}),e.jsx("div",{className:"absolute inset-0 flex items-center justify-center",children:e.jsx("span",{className:"material-symbols-outlined text-4xl text-brand-orange animate-pulse",children:"neurology"})})]}),e.jsx("h3",{className:"text-xl font-black uppercase tracking-tight text-slate-800 dark:text-white mb-2",children:"Analizando Estructura Profunda"}),e.jsx("p",{className:"text-sm text-slate-500 dark:text-slate-400 max-w-md text-center mb-8",children:"Evaluando coherencia metodológica y normativa..."}),e.jsx("div",{className:"w-64 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden",children:e.jsx("div",{className:"h-full bg-brand-orange transition-all duration-300",style:{width:`${p}%`}})})]}):h?e.jsx("div",{className:"animate-fade-in pb-10",children:e.jsx(Ie,{componentName:"Consistency Display",onReset:()=>w("dashboard"),children:T==="dashboard"?e.jsx(Se,{result:h}):e.jsx(Ce,{matrix:h.consistencyMatrix||[]})})}):e.jsxs("div",{className:"h-full flex flex-col items-center justify-center text-center",children:[e.jsx("div",{className:"mb-8 w-48 md:w-64 opacity-80 mix-blend-multiply dark:mix-blend-normal",children:e.jsx("span",{className:"material-symbols-outlined text-9xl text-slate-200 dark:text-slate-700",children:"grid_on"})}),e.jsx("h2",{className:"text-xl font-black text-slate-800 dark:text-white uppercase tracking-wide mb-2 opacity-60",children:"No Matrix Generated"}),e.jsx("p",{className:"text-slate-500 dark:text-slate-400 max-w-sm text-sm leading-relaxed",children:"Carga tu tesis y espera a que nuestros agentes forenses generen tu reporte de consistencia."})]})})}),e.jsxs("section",{className:"flex flex-col gap-4 w-full xl:w-80 shrink-0",children:[e.jsx("button",{onClick:()=>{var i;return(i=document.getElementById("hidden-file-upload"))==null?void 0:i.click()},className:`w-full py-6 px-6 rounded-[2rem] font-bold transition-all hover:shadow-xl border-2 border-dashed group text-left relative overflow-hidden
                                    ${s?"bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500 hover:border-emerald-600":"bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-brand-orange dark:hover:border-brand-orange"}
                                `,children:e.jsxs("div",{className:"relative z-10 flex items-center gap-4",children:[e.jsx("div",{className:`w-12 h-12 rounded-full flex items-center justify-center transition-colors
                                        ${s?"bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-300":"bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-brand-orange/10 group-hover:text-brand-orange"}
                                    `,children:e.jsx("span",{className:"material-symbols-outlined",children:s?"check_circle":"upload_file"})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("span",{className:`block text-sm font-bold truncate ${s?"text-emerald-700 dark:text-emerald-400":"text-slate-800 dark:text-white"}`,children:s?s.name:"Cargar Documento"}),e.jsx("span",{className:`block text-xs font-normal truncate ${s?"text-emerald-600/70 dark:text-emerald-400/70":"text-slate-400"}`,children:s?"Clic para cambiar archivo":"PDF o DOCX"})]})]})}),e.jsxs("div",{className:"p-6 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700",children:[e.jsx("label",{className:"block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1",children:"Nivel Académico"}),e.jsx("div",{className:"grid grid-cols-1 gap-2",children:["Grado","Maestría","Doctorado"].map(i=>e.jsxs("button",{onClick:()=>P(i),className:`px-4 py-3 rounded-xl text-sm font-bold border-2 transition-all text-left flex items-center justify-between ${k===i?"border-brand-orange bg-brand-orange/5 text-brand-orange":"border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-200"}`,children:[i,k===i&&e.jsx("span",{className:"material-symbols-outlined text-sm",children:"check_circle"})]},i))}),e.jsx("p",{className:"mt-3 text-[10px] text-slate-400 leading-tight px-1",children:"* Ajusta la severidad de detección y pesos de evaluación según el rigor del nivel."})]}),e.jsxs("button",{onClick:G,disabled:m||!s&&!t.content,className:`
                                    w-full py-6 px-6 rounded-[2rem] font-bold text-left transition-all relative overflow-hidden shadow-xl
                                    ${m||!s&&!t.content?"bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600":"bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-brand-orange/20"}
                                `,children:[e.jsxs("div",{className:"relative z-10 flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 rounded-full bg-white/20 dark:bg-slate-200/20 flex items-center justify-center backdrop-blur-sm",children:m?e.jsx("span",{className:"material-symbols-outlined animate-spin",children:"sync"}):e.jsx("span",{className:"material-symbols-outlined",children:"neurology"})}),e.jsxs("div",{children:[e.jsx("span",{className:"block text-lg",children:"Ejecutar Análisis"}),e.jsx("span",{className:"block text-white/60 dark:text-slate-500 text-xs font-normal",children:m?"Procesando...":"Modo Forense Activo"})]})]}),e.jsx("span",{className:"material-symbols-outlined",children:"arrow_forward"})]}),m&&e.jsx("div",{className:"absolute inset-0 bg-brand-orange/20",style:{width:`${p}%`,transition:"width 0.5s ease"}})]}),e.jsxs("div",{className:"mt-auto bg-slate-100 dark:bg-slate-800 p-6 rounded-[2rem] hidden xl:block",children:[e.jsx("h4",{className:"font-bold text-slate-800 dark:text-white mb-2 text-sm",children:"¿Cómo funciona?"}),e.jsxs("ul",{className:"space-y-3",children:[e.jsxs("li",{className:"flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400",children:[e.jsx("span",{className:"text-brand-orange",children:"•"}),e.jsx("span",{children:"Sube tu borrador de tesis o anteproyecto."})]}),e.jsxs("li",{className:"flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400",children:[e.jsx("span",{className:"text-brand-orange",children:"•"}),e.jsx("span",{children:"Nuestra IA audita la coherencia lógica interna."})]}),e.jsxs("li",{className:"flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400",children:[e.jsx("span",{className:"text-brand-orange",children:"•"}),e.jsx("span",{children:"Recibe un reporte de consistencia detallado."})]})]})]})]})]})]})})]})};export{$e as ConsistencyMatrix,$e as default};
