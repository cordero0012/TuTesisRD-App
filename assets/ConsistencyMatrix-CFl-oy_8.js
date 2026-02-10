const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-CXwPkIaI.js","assets/react-vendor-fHhpFJoT.js","assets/pdf-vendor-CfVBgxx6.js","assets/index-B-Kn8Z0V.css","assets/pdfExport-Br2c1UCN.js"])))=>i.map(i=>d[i]);
import{_ as B,g as Q,G as ee}from"./pdf-vendor-CfVBgxx6.js";import{j as e,s as U,u as ae,a as te,b as se}from"./index-CXwPkIaI.js";import{d as p,u as re,L as V}from"./react-vendor-fHhpFJoT.js";import{a as ie}from"./client-kPybf3Mh.js";import{o as c,a as o,e as k,s as a,b as ne,c as y,r as oe,n as d,Z as le}from"./ai-vendor-Cr1lv8uJ.js";import{a as ce,w as de}from"./wordExportService-DKDeIa60.js";import me from"./pdf.worker.min-BuDT2eDy.js";import{m as xe}from"./index-D52QotID.js";import"./doc-vendor-45wm4pqv.js";const pe=`
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
`,ge=(t,s="Grado")=>`
IDENTIDAD DEL EVALUADOR:
Eres un evaluador académico de élite con certificación en metodología de investigación, 
auditoría de tesis doctorales, y revisión para revistas indexadas Q1.

MISIÓN CRÍTICA:
Realizar una auditoría FORENSE del documento académico basándote en el MODELO OPERATIVO APA 7.

PERFIL DE EXIGENCIA: Nivel ${s}
(Aplica las ponderaciones de rigor correspondientes a este nivel académico).

═══════════════════════════════════════════════════════════════

REGLAS DE ORO (ESTILO APA 7):
${pe}

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
`,ue={APP_NAME:"TuTesisRD",VERSION:"2.0.0",CONSISTENCY_AI_MODEL:"gemini-1.5-flash",CONSISTENCY_AI_TEMPERATURE:parseFloat("0.1"),CONSISTENCY_MAX_CHARS:parseInt("350000",10)},be=c({title:a(),authors:o(a()).optional(),publicationYear:d().optional(),doi:a().optional(),hostVenue:a().optional()});c({reference:be,status:k(["verified","valid_no_doi","needs_review","not_found","error"]),score:d().min(0).max(100),sources:o(a()).optional(),validationMessage:a().optional()});const he=c({burstiness:d().optional(),perplexityProxy:d().optional(),lexicalDiversity:d().optional()}),fe=c({chatgpt:d().optional(),gemini:d().optional(),claude:d().optional()}),ve=c({text:a(),probability:d()});c({score:d().min(0).max(1),metrics:he.optional(),sourceProbabilities:fe.optional(),signals:o(a()).optional(),heatmap:o(ve).optional()});const Ne=c({element:a(),description:a(),coherenceLevel:k(["Alta","Media","Baja","Inexistente"]).or(a()),technicalObservation:a(),recommendation:a()}),ye=c({section:a(),strengths:o(a()),weaknesses:o(a()),internalIncoherences:o(a()),methodologicalMisalignments:o(a())}),je=c({approachCoherent:y(),designAdequate:y(),techniquesAppropriate:y(),resultsDeriveFromMethod:y(),conclusionsSupportedByResults:y(),criticalAlerts:o(a()),forensicReasoning:a().optional()}),Ae=c({apa7Score:d(),academicWritingScore:d(),terminologyConsistencyScore:d(),orthographicErrors:o(a()),grammaticalErrors:o(a()),styleIssues:o(a())}),Ee=c({level:k(["Excelente","Aceptable","Débil","Crítico"]).or(a()),mainRisks:o(a()),internalConsistencyDegree:d(),publishabilityLevel:d(),auditSummary:a().optional(),summary:a().optional(),score:d().optional()}),ke=c({priority:k(["Crítica","Alta","Media","Baja"]).or(a()).optional().default("Media"),what:a().optional().default("<<MISSING_CONTENT>>"),why:a().optional().default("<<MISSING_CONTENT>>"),how:a().optional().default("<<MISSING_CONTENT>>")}),Se=c({sectionsFound:oe(a(),c({exists:y(),pages:a().nullable().optional(),completeness:d()})).optional(),missingSections:o(a()).optional(),misplacedSections:o(a()).optional()}),Ce=c({citationsFound:o(c({citation:a(),inBibliography:y(),page:a()})).optional(),referencesCiting:o(a()).optional(),unusedReferences:o(a()).optional(),missingReferences:o(a()).optional()}),we=c({finding:a(),evidence:a(),whyItMatters:a(),howToFix:a(),example:a()}),Ie=c({documentType:a().optional(),methodologicalApproach:a().optional(),disciplinaryArea:a().optional(),applicableStandards:o(a()).optional(),consistencyMatrix:o(Ne).optional(),sectionEvaluations:o(ye).optional(),methodologicalAnalysis:je.optional(),normativeCompliance:Ae.optional(),globalDiagnosis:Ee.optional(),prioritizedRecommendations:o(ke).optional(),structuralVerification:Se.optional(),sourceConsistencySubMatrix:Ce.optional(),actionableFeedback:o(we).optional(),normativeComplianceDetailed:ne().optional(),rawAnalysis:a().optional(),analysisStatus:k(["ok","partial","insufficient_input","model_noncompliant","error"]).optional(),analysisWarnings:o(a()).optional()});c({id:a().uuid().optional(),title:a(),studentName:a().optional(),university:a().optional(),status:k(["draft","review","approved"]).default("draft"),createdAt:a().optional(),updatedAt:a().optional()});c({provider:a(),model:a(),durationMs:d(),inputTokens:d().optional(),outputTokens:d().optional(),success:y(),errorCode:a().optional(),timestamp:d()});const De=c({type:k(["text","heading1","heading2","heading3","list","table","page_break"]),content:a().optional(),tableData:c({headers:o(a()),rows:o(o(a())),isMatrix:y().optional()}).optional(),styling:c({bold:y().optional(),color:a().optional(),align:k(["left","center","right","justify"]).optional(),isCritical:y().optional(),size:d().optional()}).optional()});c({metadata:c({title:a(),subtitle:a().optional(),date:a(),creator:a().default("ScholarAI"),brandingColor:a().optional()}),sections:o(De)});const Re=Ie;function Te(t,s){var i,n,m,j,g;if(!t&&!s)return null;let l=t||"";return s&&(l+=`

INFORMACIÓN ESTRUCTURAL ADICIONAL EXTRAÍDA:
`,(n=(i=s.contentRequirements)==null?void 0:i.mandatorySections)!=null&&n.length&&(l+=`Secciones Obligatorias:
${s.contentRequirements.mandatorySections.map(h=>`- ${h.name} (Obligatoria)`).join(`
`)}

`),s.formattingRules&&(l+=`Reglas de Formato Clave:
- Márgenes: ${JSON.stringify((m=s.formattingRules.pageSetup)==null?void 0:m.margins)}
- Tipografía: ${(j=s.formattingRules.typography)==null?void 0:j.bodyFont}
- Citación: ${(g=s.citationRules)==null?void 0:g.style}
`)),l}async function Oe(t,s,l="Grado",i){var w,_,I;const n=t.replace(/<img[^>]*src="data:[^"]*"[^>]*>/g,"").replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim(),{SemanticChunker:m}=await B(async()=>{const{SemanticChunker:u}=await import("./chunkingService-DehVIyGE.js");return{SemanticChunker:u}},[]),j=m.chunkBySections(n),g=["INTRODUCCI","PROBLEMA","METODOLOG","RESULTADOS","CONCLUSIONES","DISCUSI","OBJETIVO"],h=j.filter(u=>g.some(A=>u.sectionType.toUpperCase().includes(A))),N=h.length>0?h.map(u=>`[SECCIÓN: ${u.sectionType}]
${u.content.substring(0,2e4)}`).join(`

`):n.substring(0,1e5);console.log(`[StrictAnalyzer] Processing text. Total Length: ${N.length}, Chunks Used: ${h.length>0?h.length:"Full Text"}`),N.length<500&&console.warn("[StrictAnalyzer] WARNING: Input text is dangerously short (<500 chars). Analysis may fail.");const L=Te(s,i),O=ge(L,l).replace("{DOCUMENT_TEXT}",N);try{const u=await ie({prompt:O,systemInstruction:"Eres un auditor académico estricto. Analiza el documento buscando inconsistencias fatales y fallos normativos.",temperature:.1,model:ue.CONSISTENCY_AI_MODEL}),A=Re.parse(u);console.log(`[StrictAnalyzer] Validated Result Keys: ${Object.keys(A).join(", ")}`),console.log(`[StrictAnalyzer] Diagnosis Level: ${(w=A.globalDiagnosis)==null?void 0:w.level}, Consistency: ${(_=A.globalDiagnosis)==null?void 0:_.internalConsistencyDegree}%`);let S="ok";const D=[];n.length<500&&(S="insufficient_input",D.push("Texto insuficiente para análisis profundo.")),((I=A.globalDiagnosis)==null?void 0:I.level)==="Pendiente"&&(S="partial",D.push("Diagnóstico global incompleto."));let F=0;if(A.prioritizedRecommendations)for(const f of A.prioritizedRecommendations)(f.what==="<<MISSING_CONTENT>>"||f.why==="<<MISSING_CONTENT>>"||f.how==="<<MISSING_CONTENT>>")&&(F++,f.what==="<<MISSING_CONTENT>>"&&(f.what="Recomendación general"),f.why==="<<MISSING_CONTENT>>"&&(f.why="Justificación no disponible en análisis estricto."),f.how==="<<MISSING_CONTENT>>"&&(f.how="Consultar revisión manual."));return F>0&&(S="partial",D.push(`${F} recomendación(es) marcadas como incompletas.`)),{...A,rawAnalysis:"Análisis Forense Completado",analysisStatus:S,analysisWarnings:D}}catch(u){throw console.error("Strict Analysis Failed. Full Error:",JSON.stringify(u,null,2)),u instanceof le&&console.error("Zod Validation Issues:",u.issues),new Error(`Error en análisis estricto: ${u.message}`)}}const Pe=({result:t})=>{const s=()=>{const n=ce(t);de.generateWordDocument(n,"Analisis_Consistencia.docx")},l=n=>n>=90?"text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20":n>=70?"text-amber-500 bg-amber-50 dark:bg-amber-900/20":"text-red-500 bg-red-50 dark:bg-red-900/20",i={Excelente:"text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",Aceptable:"text-blue-600 bg-blue-100 dark:bg-blue-900/30",Débil:"text-amber-600 bg-amber-100 dark:bg-amber-900/30",Crítico:"text-red-600 bg-red-100 dark:bg-red-900/30"};return e.jsxs("div",{className:"space-y-8 animate-fade-in p-6 max-w-7xl mx-auto",children:[(t.analysisStatus==="partial"||t.analysisWarnings&&t.analysisWarnings.length>0)&&e.jsx("div",{className:"bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg animate-fade-in mx-auto max-w-7xl",children:e.jsxs("div",{className:"flex items-start",children:[e.jsx("div",{className:"flex-shrink-0",children:e.jsx("span",{className:"material-symbols-outlined text-amber-500",children:"warning"})}),e.jsxs("div",{className:"ml-3",children:[e.jsx("h3",{className:"text-sm font-bold text-amber-800 dark:text-amber-200",children:"Análisis Parcialmente Completado"}),e.jsx("div",{className:"mt-2 text-sm text-amber-700 dark:text-amber-300",children:e.jsx("ul",{className:"list-disc pl-5 space-y-1",children:t.analysisWarnings&&t.analysisWarnings.length>0?t.analysisWarnings.map((n,m)=>e.jsx("li",{children:n},m)):e.jsx("li",{children:"Algunas secciones contienen datos genéricos debido a limitaciones en la respuesta del modelo."})})})]})]})}),e.jsx("div",{className:"flex justify-end mb-4",children:e.jsxs("button",{onClick:s,className:"flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-lg hover:-translate-y-1 transition-transform",children:[e.jsx("span",{className:"material-symbols-outlined text-sm",children:"download"}),"Exportar Informe DOCX"]})}),e.jsxs("div",{className:"flex flex-col md:flex-row gap-6 items-start",children:[e.jsxs("div",{className:"flex-1 bg-white dark:bg-surface-dark p-8 rounded-[2rem] border border-slate-100 dark:border-surface-border shadow-xl",children:[e.jsxs("div",{className:"flex items-start justify-between mb-6",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-xs font-black uppercase tracking-[0.2em] text-slate-400",children:"Diagnóstico Global"}),e.jsx("h2",{className:`text-4xl font-black mt-2 ${i[t.globalDiagnosis.level].split(" ")[0]}`,children:t.globalDiagnosis.level})]}),e.jsxs("div",{className:`px-4 py-2 rounded-full font-bold text-sm ${i[t.globalDiagnosis.level]}`,children:["Riesgo: ",t.globalDiagnosis.level==="Excelente"?"Bajo":t.globalDiagnosis.level==="Aceptable"?"Medio":"Alto"]})]}),e.jsxs("p",{className:"text-slate-600 dark:text-slate-300 leading-relaxed mb-6 border-l-4 border-slate-200 dark:border-slate-700 pl-4 py-1 italic",children:['"',t.globalDiagnosis.auditSummary||"Análisis completado exitosamente.",'"']}),e.jsxs("div",{className:"grid grid-cols-3 gap-4",children:[e.jsx(X,{label:"Consistencia",value:t.globalDiagnosis.internalConsistencyDegree,color:l(t.globalDiagnosis.internalConsistencyDegree)}),e.jsx(X,{label:"Publicabilidad",value:t.globalDiagnosis.publishabilityLevel,color:l(t.globalDiagnosis.publishabilityLevel)}),e.jsx(X,{label:"Estilo Académico",value:t.normativeCompliance.academicWritingScore,color:l(t.normativeCompliance.academicWritingScore)})]})]}),e.jsxs("div",{className:"w-full md:w-1/3 bg-slate-50 dark:bg-[#0d1017] p-6 rounded-[2rem] border border-slate-200 dark:border-surface-border h-full",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-6",children:[e.jsx("div",{className:"p-2 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg",children:e.jsx("span",{className:"material-symbols-outlined",children:"warning"})}),e.jsx("h3",{className:"font-bold text-slate-900 dark:text-white",children:"Alertas Críticas"})]}),e.jsx("div",{className:"space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar",children:t.methodologicalAnalysis.criticalAlerts.length>0?t.methodologicalAnalysis.criticalAlerts.map((n,m)=>e.jsxs("div",{className:"flex gap-3 text-sm p-3 bg-white dark:bg-surface-dark rounded-xl border border-red-100 dark:border-red-900/30",children:[e.jsx("span",{className:"material-symbols-outlined text-red-500 text-xs mt-1 shrink-0",children:"error"}),e.jsx("span",{className:"text-slate-700 dark:text-slate-300",children:n})]},m)):e.jsxs("div",{className:"text-center py-8 text-slate-400",children:[e.jsx("span",{className:"material-symbols-outlined text-4xl mb-2 opacity-50",children:"check_circle"}),e.jsx("p",{className:"text-sm",children:"Sin alertas críticas detectadas"})]})})]})]}),t.methodologicalAnalysis.forensicReasoning&&e.jsxs("div",{className:"bg-slate-900 border-2 border-brand-orange/30 text-slate-300 p-8 rounded-[2rem] relative overflow-hidden shadow-2xl shadow-brand-orange/5",children:[e.jsx("div",{className:"absolute top-0 right-0 p-32 bg-brand-orange/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"}),e.jsxs("div",{className:"flex items-center gap-3 mb-4 relative z-10",children:[e.jsx("span",{className:"material-symbols-outlined text-brand-orange text-3xl",children:"psychology"}),e.jsx("h3",{className:"font-black text-white uppercase tracking-[0.2em] text-sm",children:"Dictamen Forense de IA"})]}),e.jsx("p",{className:"text-xl leading-relaxed relative z-10 font-medium text-slate-200",children:t.methodologicalAnalysis.forensicReasoning})]}),e.jsxs("div",{children:[e.jsxs("h3",{className:"text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-4",children:[e.jsx("div",{className:"size-10 rounded-xl bg-brand-orange/10 flex items-center justify-center",children:e.jsx("span",{className:"material-symbols-outlined text-brand-orange",children:"app_registration"})}),"Acciones Correctivas Priorizadas"]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:t.prioritizedRecommendations.map((n,m)=>e.jsxs("div",{className:"bg-white dark:bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 hover:border-brand-orange/30 hover:shadow-2xl hover:shadow-brand-orange/5 transition-all duration-500 group",children:[e.jsxs("div",{className:"flex justify-between items-start mb-6",children:[e.jsxs("span",{className:`text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest ${n.priority==="Crítica"?"bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400":"bg-brand-orange/10 text-brand-orange"}`,children:["Prioridad ",n.priority]}),e.jsx("span",{className:"text-slate-200 dark:text-slate-700 text-5xl font-black opacity-40 group-hover:opacity-100 transition-opacity",children:String(m+1).padStart(2,"0")})]}),e.jsx("h4",{className:"font-black text-slate-800 dark:text-white mb-3 text-lg leading-tight uppercase tracking-tight",children:n.what}),e.jsx("p",{className:"text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed",children:n.why}),e.jsxs("div",{className:"bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-white/5",children:[e.jsx("span",{className:"font-black block mb-2 text-brand-orange uppercase tracking-widest text-[10px]",children:"Hoja de Ruta:"}),e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed",children:n.how})]})]},m))})]})]})},X=({label:t,value:s,color:l})=>e.jsxs("div",{className:`p-6 rounded-[2rem] border border-transparent shadow-sm ${l.split(" ")[1].replace("/20","/5")}`,children:[e.jsxs("div",{className:`text-4xl font-black ${l.split(" ")[0]} mb-2 tracking-tighter`,children:[s,e.jsx("span",{className:"text-base ml-1 opacity-60",children:"%"})]}),e.jsx("div",{className:"text-[10px] font-black uppercase tracking-[0.2em] opacity-60 text-slate-500 dark:text-slate-400",children:t})]}),Le=({matrix:t})=>{const[s,l]=p.useState(null);return e.jsxs("div",{className:"bg-white/60 dark:bg-slate-900/60 rounded-[2.5rem] shadow-xl border border-white dark:border-white/5 overflow-hidden backdrop-blur-xl",children:[e.jsxs("div",{className:"p-10 border-b border-slate-100 dark:border-white/5",children:[e.jsx("h3",{className:"text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight",children:"Matriz de Consistencia Interactiva"}),e.jsx("p",{className:"text-slate-500 dark:text-slate-400 mt-2 text-lg",children:"Explora los hallazgos forenses de cada dimensión metodológica."})]}),e.jsx("div",{className:"divide-y divide-slate-100 dark:divide-white/5",children:t.map((i,n)=>e.jsxs("div",{className:`group transition-all duration-500 ${s===n?"bg-brand-orange/[0.03] dark:bg-brand-orange/[0.02]":"hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"}`,children:[e.jsxs("div",{className:"p-8 cursor-pointer flex items-center justify-between",onClick:()=>l(s===n?null:n),children:[e.jsxs("div",{className:"flex items-center gap-8",children:[e.jsx("div",{className:`
                                    w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-bold text-xl shadow-sm
                                    ${i.coherenceLevel==="Alta"?"bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30":i.coherenceLevel==="Media"?"bg-brand-orange/10 text-brand-orange":"bg-red-100 text-red-600 dark:bg-red-900/30"}
                                `,children:s===n?e.jsx("span",{className:"material-symbols-outlined text-3xl",children:"keyboard_arrow_up"}):e.jsx("span",{className:"material-symbols-outlined text-3xl",children:i.coherenceLevel==="Alta"?"verified":i.coherenceLevel==="Media"?"error":"dangerous"})}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-black text-slate-800 dark:text-white text-xl uppercase tracking-tight",children:i.element}),e.jsxs("div",{className:"flex items-center gap-3 mt-1.5",children:[e.jsxs("span",{className:`text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full ${i.coherenceLevel==="Alta"?"bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400":i.coherenceLevel==="Media"?"bg-brand-orange/10 text-brand-orange":"bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"}`,children:["Auditoría: ",i.coherenceLevel]}),!i.description&&e.jsxs("span",{className:"text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-1 opacity-60",children:[e.jsx("span",{className:"material-symbols-outlined text-xs",children:"block"})," No Hallado"]})]})]})]}),e.jsx("div",{className:"text-right hidden sm:block",children:e.jsx("span",{className:`material-symbols-outlined text-slate-300 group-hover:text-brand-orange transition-all duration-300 ${s===n?"rotate-90 text-brand-orange":""}`,children:"arrow_forward_ios"})})]}),e.jsx("div",{className:`
                            overflow-hidden transition-all duration-500 ease-in-out
                            ${s===n?"max-h-[800px] opacity-100 border-t border-slate-100 dark:border-white/5":"max-h-0 opacity-0"}
                        `,children:e.jsx("div",{className:"p-10 bg-slate-50/30 dark:bg-black/10",children:e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-10",children:[e.jsx("div",{className:"space-y-6",children:e.jsxs("div",{children:[e.jsx("h5",{className:"text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1",children:"Hallazgo Textual"}),e.jsxs("div",{className:"relative",children:[e.jsx("span",{className:"absolute -left-4 -top-2 text-4xl text-brand-orange/20 font-serif",children:'"'}),e.jsx("p",{className:"text-slate-600 dark:text-slate-300 italic font-medium leading-relaxed bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm",children:i.description||"No se logró extraer contenido directo para esta dimensión."}),e.jsx("span",{className:"absolute -right-2 -bottom-4 text-4xl text-brand-orange/20 font-serif",children:'"'})]})]})}),e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{className:"bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm",children:[e.jsx("h5",{className:"text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3",children:"Observación Técnica Forense"}),e.jsx("p",{className:"text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium",children:i.technicalObservation})]}),e.jsxs("div",{className:"bg-brand-orange/5 p-6 rounded-3xl border border-brand-orange/10 shadow-sm relative overflow-hidden",children:[e.jsx("div",{className:"absolute top-0 right-0 p-8 bg-brand-orange/10 rounded-full blur-2xl -mr-4 -mt-4"}),e.jsx("h5",{className:"text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange mb-3 relative z-10",children:"Acción Recomendada"}),e.jsxs("div",{className:"flex gap-4 items-start relative z-10",children:[e.jsx("div",{className:"size-8 rounded-lg bg-brand-orange/20 flex items-center justify-center shrink-0",children:e.jsx("span",{className:"material-symbols-outlined text-brand-orange text-lg",children:"auto_fix_high"})}),e.jsx("p",{className:"text-sm text-slate-800 dark:text-slate-200 font-bold leading-relaxed",children:i.recommendation})]})]})]})]})})})]},n))})]})};class Me extends p.Component{constructor(){super(...arguments),this.state={hasError:!1,error:null},this.resetErrorBoundary=()=>{var s,l;(l=(s=this.props).onReset)==null||l.call(s),this.setState({hasError:!1,error:null})}}static getDerivedStateFromError(s){return{hasError:!0,error:s}}componentDidCatch(s,l){console.error(`[ErrorBoundary] Error in ${this.props.componentName||"Unknown Component"}:`,s,l)}render(){return this.state.hasError?this.props.fallback?this.props.fallback:e.jsxs("div",{className:"p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300",children:[e.jsx("div",{className:"w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-400",children:e.jsx("span",{className:"material-symbols-outlined text-3xl",children:"monitor_heart"})}),e.jsx("h3",{className:"text-lg font-black text-slate-800 dark:text-white mb-2",children:"Algo salió mal al mostrar el análisis"}),e.jsx("p",{className:"text-sm text-slate-600 dark:text-slate-300 mb-6 max-w-md",children:"Ocurrió un error inesperado al renderizar los resultados. Esto puede deberse a datos incompletos o un formato inesperado de la IA."}),this.state.error&&!1,e.jsxs("div",{className:"flex gap-4",children:[e.jsx("button",{onClick:()=>window.location.reload(),className:"px-6 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",children:"Recargar Página"}),e.jsx("button",{onClick:this.resetErrorBoundary,className:"px-6 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/30 transition-all hover:scale-105",children:e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"material-symbols-outlined",children:"refresh"}),"Reintentar Renderizado"]})})]})]}):this.props.children}}const _e=()=>{var j;const[t,s]=p.useState(null),[l,i]=p.useState(!1);p.useEffect(()=>{U.auth.getSession().then(({data:{session:h}})=>{s(h)});const{data:{subscription:g}}=U.auth.onAuthStateChange((h,N)=>{s(N)});return()=>g.unsubscribe()},[]);const n=async()=>{i(!0);try{const{error:g}=await U.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin}});if(g)throw g}catch(g){console.error("Error logging in:",g)}finally{i(!1)}},m=async()=>{i(!0),await U.auth.signOut(),i(!1)};return t?e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs("div",{className:"hidden md:block text-right",children:[e.jsx("div",{className:"text-xs font-bold text-slate-700 dark:text-slate-300",children:t.user.user_metadata.full_name||t.user.email}),e.jsx("div",{className:"text-[10px] text-slate-400",children:"Sesión Activa"})]}),t.user.user_metadata.avatar_url?e.jsx("img",{src:t.user.user_metadata.avatar_url,alt:"User",className:"w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700"}):e.jsx("div",{className:"w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-xs",children:(j=t.user.email)==null?void 0:j.charAt(0).toUpperCase()}),e.jsx("button",{onClick:m,disabled:l,className:"p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500",title:"Cerrar Sesión",children:e.jsx("span",{className:"material-symbols-outlined text-lg",children:"logout"})})]}):e.jsxs("button",{onClick:n,disabled:l,className:"flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm hover:shadow-md transition-all hover:border-brand-orange/50 group",children:[l?e.jsx("span",{className:"material-symbols-outlined animate-spin text-lg",children:"sync"}):e.jsx("img",{src:"https://www.svgrepo.com/show/475656/google-color.svg",className:"w-5 h-5 group-hover:scale-110 transition-transform",alt:"Google"}),e.jsx("span",{children:"Iniciar Sesión"})]})};try{ee.workerSrc=me}catch(t){console.warn("Could not set PDF worker source",t)}const He=()=>{const{project:t,uploadedFile:s,setUploadedFile:l}=ae(),{showNotification:i}=te(),n=re(),[m,j]=p.useState(!1),[g,h]=p.useState(0),[N,L]=p.useState(null);p.useEffect(()=>{var r;(r=n.state)!=null&&r.loadedAnalysis&&(L(n.state.loadedAnalysis),i("Visualizando reporte del historial","info"))},[n.state]);const[M,O]=p.useState("dashboard"),[w,_]=p.useState("Grado"),[I,u]=p.useState(""),[A,S]=p.useState(!1),[D,F]=p.useState(!1),f=p.useMemo(()=>se.map(r=>({id:r.id,name:r.name,content:`Normativa: ${r.regulations.style}. Páginas: ${r.regulations.minPages}-${r.regulations.maxPages}. Tips: ${r.tips.join(" ")}`,deepAnalysis:void 0})),[]);p.useEffect(()=>{f.length>0},[f,I]);const q=async r=>{var v,z;const x=(v=r.target.files)==null?void 0:v[0];if(!x)return;if(!["application/pdf","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/msword"].includes(x.type)){i("Formato no soportado. Usa PDF o DOCX","error");return}S(!0);try{let C="";if(x.type==="application/pdf"){D&&((z=window.scholar)!=null&&z.ocr)&&i("Deep Scan activado: Procesando con OCR avanzado...","info");const R=await x.arrayBuffer(),$=await Q({data:R}).promise,G=[];for(let T=1;T<=$.numPages;T++){const Z=(await(await $.getPage(T)).getTextContent()).items.map(K=>K.str).join(" ");G.push({page:T,text:Z})}C=G;const Y=G.reduce((T,W)=>T+W.text.length,0);i(`PDF cargado: ${x.name} (${Y} caracteres, ${G.length} págs)`,"success")}else if(x.name.endsWith(".docx")){const R=await x.arrayBuffer(),b=await xe.extractRawText({arrayBuffer:R});C=b.value.trim(),i(`DOCX cargado: ${x.name} (${b.value.length} caracteres)`,"success")}l({name:x.name,type:x.type,size:x.size,content:C,lastModified:x.lastModified})}catch(C){console.error("File parsing error:",C),i("Error al procesar el archivo","error")}finally{S(!1),r.target.value=""}},[P,H]=p.useState("idle");p.useEffect(()=>{B(async()=>{const{persistenceService:r}=await import("./index-CXwPkIaI.js").then(x=>x.c);return{persistenceService:r}},__vite__mapDeps([0,1,2,3])).then(({persistenceService:r})=>r.subscribe(H))},[]);const J=async()=>{const r=(s==null?void 0:s.content)||t.content,x=Array.isArray(r)?r.reduce((E,v)=>E+v.text.length,0):(r==null?void 0:r.length)||0;if(!r||x<500){i("Necesitas al menos 500 caracteres de contenido para analizar","warning");return}j(!0),h(0);try{const E=setInterval(()=>{h(b=>Math.min(b+5,90))},500),v=f.find(b=>b.id===I),z=(v==null?void 0:v.content)||null,C=Array.isArray(r)?r.map(b=>`[Página ${b.page}]
${b.text}`).join(`

`):r,R=await Oe(C,z,w,v==null?void 0:v.deepAnalysis);clearInterval(E),h(100),L(R),B(async()=>{const{persistenceService:b}=await import("./index-CXwPkIaI.js").then($=>$.c);return{persistenceService:b}},__vite__mapDeps([0,1,2,3])).then(({persistenceService:b})=>{b.saveAnalysis(t.id||"offline-demo","consistency",R)}),i("Análisis de consistencia completado","success")}catch(E){console.error("Analysis error:",E);const v=E instanceof Error?E.message:"Error desconocido";i(`Error: ${v}`,"error")}finally{j(!1)}};return e.jsxs("div",{className:"min-h-screen flex items-center justify-center p-4 sm:p-8 font-sans text-slate-700 bg-slate-50 dark:bg-slate-900 transition-colors duration-300",children:[e.jsx("input",{type:"file",className:"hidden",accept:".pdf,.docx",onChange:q,id:"hidden-file-upload"}),e.jsxs("div",{className:"w-full max-w-[1600px] h-[90vh] min-h-[700px] rounded-[2.5rem] flex overflow-hidden relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-2xl border border-white/50 dark:border-slate-800/50",children:[e.jsxs("aside",{className:"w-20 lg:w-64 flex flex-col p-6 border-r border-slate-200/50 dark:border-slate-700/50 hidden md:flex z-10 bg-white/50 dark:bg-slate-900/50",children:[e.jsxs(V,{to:"/portal",className:"flex items-center gap-3 mb-10 pl-1 hover:opacity-80 transition-opacity",children:[e.jsx("div",{className:"w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-brand-orange/20",children:e.jsx("span",{className:"material-symbols-outlined text-xl",children:"school"})}),e.jsx("span",{className:"text-lg font-black tracking-tight text-slate-800 dark:text-white hidden lg:block",children:"TuTesisRD"})]}),e.jsxs("nav",{className:"flex-1 space-y-2",children:[e.jsxs(V,{className:"flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-orange/10 text-brand-orange font-bold shadow-sm transition-all",to:"/herramientas/matriz",children:[e.jsx("span",{className:"material-symbols-outlined",children:"grid_view"}),e.jsx("span",{className:"hidden lg:block",children:"Matriz"})]}),e.jsxs(V,{to:"/portal/historial",className:"flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-brand-orange/10 hover:text-brand-orange transition-all",children:[e.jsx("span",{className:"material-symbols-outlined",children:"history"}),e.jsx("span",{className:"hidden lg:block",children:"Historial"})]}),e.jsxs("div",{className:"opacity-40 pointer-events-none hidden lg:block border-t border-slate-100 dark:border-slate-800 pt-4 mt-4",children:[e.jsx("p",{className:"px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2",children:"Próximamente"}),e.jsxs("div",{className:"flex items-center gap-3 px-4 py-3 text-slate-500",children:[e.jsx("span",{className:"material-symbols-outlined",children:"chat"}),e.jsx("span",{children:"IA Chat"})]})]})]}),e.jsx("div",{className:"mt-auto pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4",children:e.jsxs("div",{className:"flex items-center gap-3 px-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer",children:[e.jsx("span",{className:"material-symbols-outlined",children:"settings"}),e.jsx("span",{className:"text-sm font-medium hidden lg:block",children:"Configuración"})]})})]}),e.jsxs("main",{className:"flex-1 flex flex-col p-4 md:p-8 relative overflow-hidden",children:[e.jsxs("header",{className:"flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight",children:"Matriz de Consistencia"}),e.jsx("p",{className:"text-slate-500 dark:text-slate-400 text-sm mt-1",children:s?`Archivo: ${s.name}`:t.content?`Analizando: ${t.title||"Proyecto Actual"}`:"Auditoría Forense con IA"})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"mr-4",children:e.jsx(_e,{})}),N&&e.jsxs("div",{className:"flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl",children:[e.jsx("button",{onClick:()=>O("dashboard"),className:`px-4 py-2 rounded-lg text-sm font-bold transition-all ${M==="dashboard"?"bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white":"text-slate-500 dark:text-slate-400 hover:text-slate-700"}`,children:"Dashboard"}),e.jsx("button",{onClick:()=>O("matrix"),className:`px-4 py-2 rounded-lg text-sm font-bold transition-all ${M==="matrix"?"bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white":"text-slate-500 dark:text-slate-400 hover:text-slate-700"}`,children:"Matriz"})]}),N&&e.jsxs("button",{onClick:async()=>{try{const{generateConsistencyMatrixPDF:r}=await B(async()=>{const{generateConsistencyMatrixPDF:x}=await import("./pdfExport-Br2c1UCN.js");return{generateConsistencyMatrixPDF:x}},__vite__mapDeps([4,2]));r(N,"Informe_Consistencia_ScholarAI"),i("Informe PDF generado","success")}catch{i("Error al generar PDF","error")}},className:"px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform",children:[e.jsx("span",{className:"material-symbols-outlined text-lg",children:"picture_as_pdf"}),"PDF"]}),e.jsxs("div",{className:"flex items-center gap-2",children:[P==="saving"&&e.jsxs("span",{className:"text-xs font-bold text-slate-400 flex items-center gap-1 animate-pulse",children:[e.jsx("span",{className:"material-symbols-outlined text-sm",children:"cloud_upload"})," Guardando..."]}),P==="saved"&&e.jsxs("span",{className:"text-xs font-bold text-emerald-500 flex items-center gap-1 animate-fade-in",children:[e.jsx("span",{className:"material-symbols-outlined text-sm",children:"cloud_done"})," Guardado"]}),P==="error"&&e.jsxs("span",{className:"text-xs font-bold text-red-400 flex items-center gap-1",title:"Reintentando...",children:[e.jsx("span",{className:"material-symbols-outlined text-sm",children:"cloud_off"})," Error"]}),P==="offline"&&e.jsxs("span",{className:"text-xs font-bold text-slate-400 flex items-center gap-1",title:"Inicia sesión para guardar en la nube",children:[e.jsx("span",{className:"material-symbols-outlined text-sm",children:"offline_pin"})," Modo Local"]}),P==="pending"&&e.jsxs("span",{className:"text-xs font-bold text-amber-500 flex items-center gap-1",title:"Pendiente de sincronización",children:[e.jsx("span",{className:"material-symbols-outlined text-sm",children:"schedule_send"})," Pendiente Sinc"]})]})]})]}),e.jsxs("div",{className:"flex-1 flex flex-col xl:flex-row gap-6 h-full overflow-hidden",children:[e.jsx("section",{className:"flex-1 bg-white/60 dark:bg-slate-800/60 rounded-[2rem] border border-white/60 dark:border-slate-700/60 backdrop-blur-xl shadow-sm flex flex-col relative overflow-hidden",children:e.jsx("div",{className:"flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10",children:m?e.jsxs("div",{className:"h-full flex flex-col items-center justify-center animate-in fade-in duration-700",children:[e.jsxs("div",{className:"relative mb-8",children:[e.jsx("div",{className:"size-24 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-brand-orange animate-spin"}),e.jsx("div",{className:"absolute inset-0 flex items-center justify-center",children:e.jsx("span",{className:"material-symbols-outlined text-4xl text-brand-orange animate-pulse",children:"neurology"})})]}),e.jsx("h3",{className:"text-xl font-black uppercase tracking-tight text-slate-800 dark:text-white mb-2",children:"Analizando Estructura Profunda"}),e.jsx("p",{className:"text-sm text-slate-500 dark:text-slate-400 max-w-md text-center mb-8",children:"Evaluando coherencia metodológica y normativa..."}),e.jsx("div",{className:"w-64 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden",children:e.jsx("div",{className:"h-full bg-brand-orange transition-all duration-300",style:{width:`${g}%`}})})]}):N?e.jsx("div",{className:"animate-fade-in pb-10",children:e.jsx(Me,{componentName:"Consistency Display",onReset:()=>O("dashboard"),children:M==="dashboard"?e.jsx(Pe,{result:N}):e.jsx(Le,{matrix:N.consistencyMatrix||[]})})}):e.jsxs("div",{className:"h-full flex flex-col items-center justify-center text-center",children:[e.jsx("div",{className:"mb-8 w-48 md:w-64 opacity-80 mix-blend-multiply dark:mix-blend-normal",children:e.jsx("span",{className:"material-symbols-outlined text-9xl text-slate-200 dark:text-slate-700",children:"grid_on"})}),e.jsx("h2",{className:"text-xl font-black text-slate-800 dark:text-white uppercase tracking-wide mb-2 opacity-60",children:"No Matrix Generated"}),e.jsx("p",{className:"text-slate-500 dark:text-slate-400 max-w-sm text-sm leading-relaxed",children:"Carga tu tesis y espera a que nuestros agentes forenses generen tu reporte de consistencia."})]})})}),e.jsxs("section",{className:"flex flex-col gap-4 w-full xl:w-80 shrink-0",children:[e.jsx("button",{onClick:()=>{var r;return(r=document.getElementById("hidden-file-upload"))==null?void 0:r.click()},className:`w-full py-6 px-6 rounded-[2rem] font-bold transition-all hover:shadow-xl border-2 border-dashed group text-left relative overflow-hidden
                                    ${s?"bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500 hover:border-emerald-600":"bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-brand-orange dark:hover:border-brand-orange"}
                                `,children:e.jsxs("div",{className:"relative z-10 flex items-center gap-4",children:[e.jsx("div",{className:`w-12 h-12 rounded-full flex items-center justify-center transition-colors
                                        ${s?"bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-300":"bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-brand-orange/10 group-hover:text-brand-orange"}
                                    `,children:e.jsx("span",{className:"material-symbols-outlined",children:s?"check_circle":"upload_file"})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("span",{className:`block text-sm font-bold truncate ${s?"text-emerald-700 dark:text-emerald-400":"text-slate-800 dark:text-white"}`,children:s?s.name:"Cargar Documento"}),e.jsx("span",{className:`block text-xs font-normal truncate ${s?"text-emerald-600/70 dark:text-emerald-400/70":"text-slate-400"}`,children:s?"Clic para cambiar archivo":"PDF o DOCX"})]})]})}),e.jsxs("div",{className:"p-6 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700",children:[e.jsx("label",{className:"block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1",children:"Nivel Académico"}),e.jsx("div",{className:"grid grid-cols-1 gap-2",children:["Grado","Maestría","Doctorado"].map(r=>e.jsxs("button",{onClick:()=>_(r),className:`px-4 py-3 rounded-xl text-sm font-bold border-2 transition-all text-left flex items-center justify-between ${w===r?"border-brand-orange bg-brand-orange/5 text-brand-orange":"border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-200"}`,children:[r,w===r&&e.jsx("span",{className:"material-symbols-outlined text-sm",children:"check_circle"})]},r))}),e.jsx("p",{className:"mt-3 text-[10px] text-slate-400 leading-tight px-1",children:"* Ajusta la severidad de detección y pesos de evaluación según el rigor del nivel."})]}),e.jsxs("button",{onClick:J,disabled:m||!s&&!t.content,className:`
                                    w-full py-6 px-6 rounded-[2rem] font-bold text-left transition-all relative overflow-hidden shadow-xl
                                    ${m||!s&&!t.content?"bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600":"bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-brand-orange/20"}
                                `,children:[e.jsxs("div",{className:"relative z-10 flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-12 h-12 rounded-full bg-white/20 dark:bg-slate-200/20 flex items-center justify-center backdrop-blur-sm",children:m?e.jsx("span",{className:"material-symbols-outlined animate-spin",children:"sync"}):e.jsx("span",{className:"material-symbols-outlined",children:"neurology"})}),e.jsxs("div",{children:[e.jsx("span",{className:"block text-lg",children:"Ejecutar Análisis"}),e.jsx("span",{className:"block text-white/60 dark:text-slate-500 text-xs font-normal",children:m?"Procesando...":"Modo Forense Activo"})]})]}),e.jsx("span",{className:"material-symbols-outlined",children:"arrow_forward"})]}),m&&e.jsx("div",{className:"absolute inset-0 bg-brand-orange/20",style:{width:`${g}%`,transition:"width 0.5s ease"}})]}),e.jsxs("div",{className:"mt-auto bg-slate-100 dark:bg-slate-800 p-6 rounded-[2rem] hidden xl:block",children:[e.jsx("h4",{className:"font-bold text-slate-800 dark:text-white mb-2 text-sm",children:"¿Cómo funciona?"}),e.jsxs("ul",{className:"space-y-3",children:[e.jsxs("li",{className:"flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400",children:[e.jsx("span",{className:"text-brand-orange",children:"•"}),e.jsx("span",{children:"Sube tu borrador de tesis o anteproyecto."})]}),e.jsxs("li",{className:"flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400",children:[e.jsx("span",{className:"text-brand-orange",children:"•"}),e.jsx("span",{children:"Nuestra IA audita la coherencia lógica interna."})]}),e.jsxs("li",{className:"flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400",children:[e.jsx("span",{className:"text-brand-orange",children:"•"}),e.jsx("span",{children:"Recibe un reporte de consistencia detallado."})]})]})]})]})]})]})]})]})};export{He as ConsistencyMatrix,He as default};
