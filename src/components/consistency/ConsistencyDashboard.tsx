import React, { useMemo } from 'react';
import { ConsistencyAnalysisResult } from '../../services/consistency/matrixAnalyzer';
import {
    AuditMatrixRow,
    ObjectiveMatrixRow,
    ReferenceMatrixRow,
    RiskMatrixRow,
    StructuralRow,
    buildConsistencyReportViewModel
} from '../../services/consistency/reportViewModel';

interface ConsistencyDashboardProps {
    result: ConsistencyAnalysisResult;
}

type TableColumn<T> = {
    header: string;
    widthClass?: string;
    cell: (row: T) => React.ReactNode;
};

const sectionTitleClass = 'text-lg font-black uppercase tracking-[0.18em] text-slate-900 dark:text-white';

const riskBadgeClass = (value: string) => {
    const normalized = value.toLowerCase();

    if (
        normalized.includes('crít') ||
        normalized.includes('crit') ||
        normalized.includes('alto') ||
        normalized === 'no' ||
        normalized.includes('inexist')
    ) {
        return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300';
    }

    if (normalized.includes('medio') || normalized.includes('parcial')) {
        return 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300';
    }

    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300';
};

const sectionShell = (title: string, description: string, content: React.ReactNode) => (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="border-b border-slate-200 bg-slate-50/90 px-6 py-5 dark:border-slate-800 dark:bg-slate-900/70">
            <h2 className={sectionTitleClass}>{title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <div className="px-6 py-6">{content}</div>
    </section>
);

const MetricCard = ({ label, value, tone }: { label: string; value: string; tone: string }) => (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-950">
        <div className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${tone}`}>
            {label}
        </div>
        <div className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white">{value}</div>
    </div>
);

const EmptyState = ({ message }: { message: string }) => (
    <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        {message}
    </div>
);

function ReportTable<T>({
    rows,
    columns,
    emptyMessage
}: {
    rows: T[];
    columns: TableColumn<T>[];
    emptyMessage: string;
}) {
    if (rows.length === 0) {
        return <EmptyState message={emptyMessage} />;
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
                <thead className="bg-slate-100 text-left text-[11px] font-black uppercase tracking-[0.16em] text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                    <tr>
                        {columns.map((column) => (
                            <th key={column.header} className={`px-4 py-3 align-top ${column.widthClass || ''}`}>
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="align-top odd:bg-white even:bg-slate-50/60 dark:odd:bg-slate-950 dark:even:bg-slate-900/30">
                            {columns.map((column) => (
                                <td key={column.header} className="px-4 py-3 text-slate-700 dark:text-slate-200">
                                    {column.cell(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const structuralColumns: TableColumn<StructuralRow>[] = [
    {
        header: 'Componente',
        widthClass: 'w-[24%]',
        cell: (row) => <span className="font-semibold text-slate-900 dark:text-white">{row.component}</span>
    },
    {
        header: 'Estado',
        widthClass: 'w-[16%]',
        cell: (row) => <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${riskBadgeClass(row.status)}`}>{row.status}</span>
    },
    {
        header: 'Observación',
        widthClass: 'w-[60%]',
        cell: (row) => <span className="leading-6">{row.notes}</span>
    }
];

const auditColumns: TableColumn<AuditMatrixRow>[] = [
    {
        header: 'Componente auditado',
        widthClass: 'w-[12%]',
        cell: (row) => <span className="font-semibold text-slate-900 dark:text-white">{row.component}</span>
    },
    {
        header: 'Formulación o estado actual',
        widthClass: 'w-[16%]',
        cell: (row) => <span className="leading-6">{row.currentState}</span>
    },
    {
        header: 'Hallazgo o discrepancia',
        widthClass: 'w-[16%]',
        cell: (row) => <span className="leading-6">{row.finding}</span>
    },
    {
        header: 'Evidencia',
        widthClass: 'w-[18%]',
        cell: (row) => <span className="font-mono text-[12px] leading-6 text-slate-500 dark:text-slate-400">{row.evidence}</span>
    },
    {
        header: 'Nivel de riesgo',
        widthClass: 'w-[10%]',
        cell: (row) => <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${riskBadgeClass(row.riskLevel)}`}>{row.riskLevel}</span>
    },
    {
        header: 'Impacto en la tesis',
        widthClass: 'w-[14%]',
        cell: (row) => <span className="leading-6">{row.impact}</span>
    },
    {
        header: 'Corrección recomendada',
        widthClass: 'w-[14%]',
        cell: (row) => <span className="font-medium leading-6 text-slate-900 dark:text-white">{row.recommendedFix}</span>
    }
];

const objectiveColumns: TableColumn<ObjectiveMatrixRow>[] = [
    {
        header: 'Objetivo específico',
        widthClass: 'w-[24%]',
        cell: (row) => <span className="font-semibold text-slate-900 dark:text-white">{row.objective}</span>
    },
    {
        header: 'Instrumento(s) que deberían responderlo',
        widthClass: 'w-[20%]',
        cell: (row) => <span className="leading-6">{row.instrument}</span>
    },
    {
        header: 'Resultado visible en la tesis',
        widthClass: 'w-[24%]',
        cell: (row) => <span className="leading-6">{row.result}</span>
    },
    {
        header: '¿Cumple?',
        widthClass: 'w-[10%]',
        cell: (row) => <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${riskBadgeClass(row.complyLabel)}`}>{row.complyLabel}</span>
    },
    {
        header: 'Observación',
        widthClass: 'w-[22%]',
        cell: (row) => <span className="leading-6">{row.observation}</span>
    }
];

const referenceColumns: TableColumn<ReferenceMatrixRow>[] = [
    {
        header: 'Referencia',
        widthClass: 'w-[30%]',
        cell: (row) => <span className="leading-6 text-slate-900 dark:text-white">{row.reference}</span>
    },
    {
        header: '¿Existe?',
        widthClass: 'w-[10%]',
        cell: (row) => <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${riskBadgeClass(row.existsLabel)}`}>{row.existsLabel}</span>
    },
    {
        header: 'Calidad académica',
        widthClass: 'w-[14%]',
        cell: (row) => <span>{row.quality}</span>
    },
    {
        header: 'Estado de citación',
        widthClass: 'w-[14%]',
        cell: (row) => <span>{row.citationStatus}</span>
    },
    {
        header: 'Veredicto',
        widthClass: 'w-[12%]',
        cell: (row) => <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${riskBadgeClass(row.verdict)}`}>{row.verdict}</span>
    },
    {
        header: 'Acción',
        widthClass: 'w-[20%]',
        cell: (row) => <span className="leading-6">{row.action}</span>
    }
];

const riskColumns: TableColumn<RiskMatrixRow>[] = [
    {
        header: 'Sección',
        widthClass: 'w-[16%]',
        cell: (row) => <span className="font-semibold text-slate-900 dark:text-white">{row.section}</span>
    },
    {
        header: 'Tipo de riesgo detectado',
        widthClass: 'w-[18%]',
        cell: (row) => <span>{row.riskType}</span>
    },
    {
        header: 'Nivel de riesgo',
        widthClass: 'w-[10%]',
        cell: (row) => <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${riskBadgeClass(row.riskLevel)}`}>{row.riskLevel}</span>
    },
    {
        header: 'Evidencia',
        widthClass: 'w-[28%]',
        cell: (row) => <span className="font-mono text-[12px] leading-6 text-slate-500 dark:text-slate-400">{row.evidence}</span>
    },
    {
        header: 'Acción sugerida',
        widthClass: 'w-[28%]',
        cell: (row) => <span className="leading-6">{row.action}</span>
    }
];

export const ConsistencyDashboard: React.FC<ConsistencyDashboardProps> = ({ result }) => {
    const report = useMemo(() => buildConsistencyReportViewModel(result), [result]);

    const summaryCards = [
        {
            label: 'Consistencia interna',
            value: `${result.globalDiagnosis?.internalConsistencyDegree ?? 0}%`,
            tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
        },
        {
            label: 'Consistencia metodológica',
            value: result.closingDiagnosis?.methodologicalConsistency || 'Media',
            tone: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
        },
        {
            label: 'APA 7',
            value: `${Math.round(result.apaComplianceScore?.weightedFinalScore ?? result.normativeCompliance?.apa7Score ?? 0)}%`,
            tone: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'
        },
        {
            label: 'Publicabilidad',
            value: `${result.globalDiagnosis?.publishabilityLevel ?? 0}%`,
            tone: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
        }
    ];

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 pb-12">
            {(result.analysisStatus === 'partial' || result.analysisWarnings?.length) && (
                <div className="rounded-[2rem] border border-amber-300 bg-amber-50 px-6 py-5 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
                    <p className="font-bold uppercase tracking-[0.18em]">Advertencia de análisis parcial</p>
                    <ul className="mt-3 space-y-2 leading-6">
                        {(result.analysisWarnings || ['La salida llegó incompleta y requiere validación manual puntual.']).map((warning, index) => (
                            <li key={index}>- {warning}</li>
                        ))}
                    </ul>
                </div>
            )}

            {sectionShell(
                'A. Diagnóstico General',
                'Resumen ejecutivo del estado estructural, metodológico y de defendibilidad del manuscrito auditado.',
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {summaryCards.map((item) => (
                            <MetricCard key={item.label} label={item.label} value={item.value} tone={item.tone} />
                        ))}
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-5 dark:border-slate-800 dark:bg-slate-900/50">
                            <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200">
                                Síntesis de auditoría
                            </h3>
                            <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                                {report.diagnosticLines.length > 0 ? (
                                    report.diagnosticLines.map((line, index) => (
                                        <li key={index} className="flex gap-3">
                                            <span className="min-w-[1.75rem] font-black text-slate-400 dark:text-slate-500">{String(index + 1).padStart(2, '0')}</span>
                                            <span>{line}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li>No se generó un diagnóstico general suficiente.</li>
                                )}
                            </ol>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5 dark:border-slate-800 dark:bg-slate-950">
                            <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-700 dark:text-slate-200">
                                Cumplimiento estructural
                            </h3>
                            <div className="mt-4 grid grid-cols-3 gap-3">
                                <MetricCard
                                    label="Cumple"
                                    value={String(report.structuralSummary.comply)}
                                    tone="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                                />
                                <MetricCard
                                    label="Parcial"
                                    value={String(report.structuralSummary.partial)}
                                    tone="bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                                />
                                <MetricCard
                                    label="No cumple"
                                    value={String(report.structuralSummary.fail)}
                                    tone="bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                                />
                            </div>
                        </div>
                    </div>

                    <ReportTable
                        rows={report.structuralRows}
                        columns={structuralColumns}
                        emptyMessage="La auditoría no devolvió una matriz explícita de cumplimiento estructural."
                    />
                </div>
            )}

            {sectionShell(
                'B. Matriz de Auditoría Integral',
                'Hallazgos sistémicos verificados contra el manuscrito, ordenados por nivel de riesgo e impacto académico.',
                <ReportTable
                    rows={report.auditRows}
                    columns={auditColumns}
                    emptyMessage="No se encontraron hallazgos estructurados en la salida del auditor."
                />
            )}

            {sectionShell(
                'C. Matriz Objetivo - Instrumento - Resultado',
                'Trazabilidad empírica para detectar objetivos sin evidencia, instrumentos declarados sin salida visible y resultados sin soporte metodológico.',
                <ReportTable
                    rows={report.objectiveRows}
                    columns={objectiveColumns}
                    emptyMessage="No se recibió una matriz de correspondencia objetivo-instrumento-resultado."
                />
            )}

            {sectionShell(
                'D. Matriz de Validación de Referencias',
                'Validación una por una de las referencias declaradas, su estado de citación y la acción correctiva sugerida.',
                <ReportTable
                    rows={report.referenceRows}
                    columns={referenceColumns}
                    emptyMessage="No se recibieron referencias estructuradas para validar."
                />
            )}

            {sectionShell(
                'E. Matriz de Riesgo de Plagio / IA',
                'Patrones verificables compatibles con paráfrasis deficiente, ensamblaje documental o redacción asistida que requieren intervención editorial.',
                <ReportTable
                    rows={report.riskRows}
                    columns={riskColumns}
                    emptyMessage="No se reportaron riesgos textuales o patrones compatibles con IA."
                />
            )}

            {sectionShell(
                'F. Priorización de Correcciones',
                'Correcciones agrupadas por severidad para orientar la intervención académica antes del cierre del manuscrito.',
                <div className="grid gap-4 lg:grid-cols-3">
                    {(['Crítico', 'Alto', 'Medio'] as const).map((severity) => {
                        const items = report.prioritizedCorrections[severity];
                        return (
                            <div key={severity} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-5 dark:border-slate-800 dark:bg-slate-900/50">
                                <div className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${riskBadgeClass(severity)}`}>
                                    {severity}
                                </div>
                                <div className="mt-4 space-y-4">
                                    {items.length > 0 ? (
                                        items.map((item, index) => (
                                            <article key={`${severity}-${index}`} className="space-y-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950">
                                                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{item.component}</p>
                                                <p className="text-sm font-semibold leading-6 text-slate-900 dark:text-white">{item.finding}</p>
                                                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{item.recommendedFix}</p>
                                                <p className="font-mono text-[12px] leading-5 text-slate-400 dark:text-slate-500">{item.evidence}</p>
                                            </article>
                                        ))
                                    ) : (
                                        <EmptyState message={`No hay hallazgos clasificados como ${severity.toLowerCase()}.`} />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {sectionShell(
                'G. Dictamen Final',
                'Cierre técnico consolidado del auditor académico para decisión de revisión, corrección o cierre.',
                <div className="rounded-[2rem] border border-slate-200 bg-slate-50 px-6 py-6 dark:border-slate-800 dark:bg-slate-900/60">
                    <blockquote className="border-l-4 border-slate-900 pl-5 text-base leading-8 text-slate-700 dark:border-slate-200 dark:text-slate-200">
                        {report.finalVerdict}
                    </blockquote>
                </div>
            )}
        </div>
    );
};

export default ConsistencyDashboard;
