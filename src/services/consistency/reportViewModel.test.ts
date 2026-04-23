import { describe, expect, it } from 'vitest';
import { MatrixAnalysisDTO } from '../../types/schemas';
import { buildConsistencyReportViewModel, normalizeSeverity } from './reportViewModel';

const baseResult: MatrixAnalysisDTO = {
    documentType: 'Tesis de grado',
    methodologicalApproach: 'Cuantitativo',
    disciplinaryArea: 'Educacion',
    applicableStandards: ['APA 7th ed.'],
    globalDiagnosis: {
        level: 'Debil',
        mainRisks: ['Los instrumentos no tienen salida empirica visible.'],
        internalConsistencyDegree: 68,
        publishabilityLevel: 52,
        auditSummary: 'La tesis mantiene coherencia tematica parcial, pero exhibe fallas metodologicas relevantes.'
    },
    executiveSummary: {
        overview: 'El manuscrito presenta estructura parcial. La consistencia metodologica es insuficiente.',
        mainStrengths: ['El problema esta delimitado.', 'Las variables fueron identificadas.'],
        mainWeaknesses: ['No hay trazabilidad instrumental.', 'Las conclusiones exceden los resultados.', 'La bibliografia necesita depuracion.'],
        defensibilityLevel: 'Debil'
    },
    structuralCompliance: [
        { component: 'Portada', status: 'cumple', notes: 'Visible en la primera pagina.' },
        { component: 'Conclusiones', status: 'cumple_parcial', notes: 'No responden todos los objetivos.' },
        { component: 'Anexos', status: 'no_cumple', notes: 'No se localizaron.' }
    ],
    auditFindings: [
        {
            component: 'instrumentos',
            currentFormulation: 'Se declara una encuesta estructurada.',
            finding: 'No aparecen resultados derivados de la encuesta.',
            evidence: 'Pag. 66 - "se aplico un cuestionario estructurado"',
            severity: 'Critico',
            violatedRelation: 'Objetivos especificos vs. resultados',
            impactOnThesis: 'Compromete la validez del analisis.',
            recommendedFix: 'Incorporar resultados observables o ajustar la metodologia.',
            priority: 'Inmediata'
        },
        {
            component: 'conclusiones',
            currentFormulation: 'Se afirma reduccion del problema.',
            finding: 'La conclusion afirma impacto real sin intervencion demostrada.',
            evidence: 'Pag. 101 - "se redujo el riesgo"',
            severity: 'Alto',
            violatedRelation: 'Resultados vs. conclusiones',
            impactOnThesis: 'Sobreafirma el alcance del estudio.',
            recommendedFix: 'Reformular en terminos de proyeccion o simulacion.',
            priority: 'Alta'
        }
    ],
    correspondenceMatrix: [
        {
            objective: 'Determinar la relacion entre las variables.',
            instrumentDeclared: 'Encuesta',
            expectedOutput: 'Tabla comparativa de resultados.',
            actualResultFound: 'No encontrado',
            resultSection: 'Capitulo IV',
            status: 'sin_evidencia',
            observation: 'No hay tablas ni graficos asociados.'
        }
    ],
    referenceValidationMatrix: [
        {
            reference: 'Autor, A. (2023). Manual aplicado.',
            exists: true,
            academicQuality: 'Media',
            citationStatus: 'mal_citada',
            category: 'valida_mal_citada',
            verdict: 'corregir',
            actionDetail: 'Ajustar autor y ano en el texto.'
        }
    ],
    plagiarismMatrix: [
        {
            section: 'Marco teorico',
            riskType: 'parafrasis_deficiente',
            riskLevel: 'Medio',
            evidence: 'Pag. 22 - "la investigacion es..."',
            suggestedAction: 'Reescribir con integracion critica.'
        }
    ],
    closingDiagnosis: {
        structuralCompliance: 'Medio',
        methodologicalConsistency: 'Baja',
        mainStrengths: ['Problema delimitado'],
        mainWeaknesses: ['Sin trazabilidad empirica'],
        criticalFixesRequired: ['Reconstruir la matriz objetivo-instrumento-resultado'],
        pendingValidations: ['Verificar referencias'],
        technicalClosingStatement:
            'La tesis presenta consistencia tematica media y consistencia metodologica baja. Cumple parcialmente con la estructura institucional. Sus principales debilidades se concentran en la trazabilidad empirica y la formulacion de conclusiones. Antes de considerarse version final cerrada, requiere correccion prioritaria en la evidencia de resultados y la depuracion bibliografica.'
    }
};

describe('reportViewModel', () => {
    it('normalizes severities in descending order of risk', () => {
        expect(normalizeSeverity('Critico')).toBe('Crítico');
        expect(normalizeSeverity('Alto')).toBe('Alto');
        expect(normalizeSeverity('Medio')).toBe('Medio');
    });

    it('builds structural, audit and objective matrices for the report view', () => {
        const report = buildConsistencyReportViewModel(baseResult);

        expect(report.structuralSummary).toEqual({ comply: 1, partial: 1, fail: 1 });
        expect(report.auditRows[0].riskLevel).toBe('Crítico');
        expect(report.objectiveRows[0].complyLabel).toBe('Sin evidencia');
        expect(report.referenceRows[0].verdict).toBe('corregir');
        expect(report.riskRows[0].riskLevel).toBe('Medio');
    });

    it('prefers the technical closing statement as the final verdict', () => {
        const report = buildConsistencyReportViewModel(baseResult);
        expect(report.finalVerdict).toContain('consistencia tematica media');
        expect(report.finalVerdict).toContain('consistencia metodologica baja');
    });
});
