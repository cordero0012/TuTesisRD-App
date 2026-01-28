import React from 'react';
import { ConsistencyAnalysisResult, ConsistencyMatrixRow } from '../../services/consistency/matrixAnalyzer';

interface ConsistencyAnalysisResultsProps {
    result: ConsistencyAnalysisResult;
    onRowSelect?: (row: ConsistencyMatrixRow) => void;
}

export const ConsistencyAnalysisResults: React.FC<ConsistencyAnalysisResultsProps> = ({ result, onRowSelect }) => {

    const [selectedRow, setSelectedRow] = React.useState<ConsistencyMatrixRow | null>(null);

    const getCoherenceBadge = (level: string) => {
        switch (level) {
            case 'Alta':
                return { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-600 dark:text-emerald-400', icon: 'check_circle' };
            case 'Media':
                return { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-600 dark:text-amber-400', icon: 'warning' };
            case 'Baja':
                return { bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-600 dark:text-red-400', icon: 'error' };
            default:
                return { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-500 dark:text-slate-400', icon: 'help_outline' };
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'Crítica': return 'bg-red-100 text-red-700';
            case 'Alta': return 'bg-orange-100 text-orange-700';
            case 'Media': return 'bg-amber-100 text-amber-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Crítica': return 'bg-red-500';
            case 'Alta': return 'bg-orange-500';
            case 'Media': return 'bg-amber-500';
            default: return 'bg-blue-500';
        }
    };

    // Internal handler to manage local state if onRowSelect is not provided or in addition to it
    const handleRowSelect = (row: ConsistencyMatrixRow) => {
        setSelectedRow(row);
        if (onRowSelect) onRowSelect(row);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Identificación */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-slate-200 dark:border-surface-border p-8 shadow-xl">
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">badge</span>
                    Identificación del Documento
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Tipo</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{result.documentType}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Enfoque</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{result.methodologicalApproach}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Área</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{result.disciplinaryArea}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Normativas</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{result.applicableStandards.join(', ')}</p>
                    </div>
                </div>
            </div>

            {/* FASE 1: VERIFICACIÓN DE CUMPLIMIENTO NORMATIVO (STRICT MODE) */}
            {result.normativeComplianceDetailed && (
                <div className="bg-white dark:bg-surface-dark rounded-3xl border border-slate-200 dark:border-surface-border p-8 shadow-xl">
                    <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-orange-500">policy</span>
                        Cumplimiento Normativo Institucional
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Overall Score */}
                        <div className="col-span-1 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <div className="relative size-32 mb-4">
                                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-slate-200 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                    <path className={`${result.normativeComplianceDetailed.overallCompliance >= 80 ? 'text-emerald-500' : result.normativeComplianceDetailed.overallCompliance >= 60 ? 'text-orange-500' : 'text-red-500'}`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${result.normativeComplianceDetailed.overallCompliance}, 100`} strokeWidth="3" strokeLinecap="round"></path>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-slate-900 dark:text-white">{result.normativeComplianceDetailed.overallCompliance}%</span>
                                    <span className="text-[10px] font-bold uppercase text-slate-500">Cumplimiento</span>
                                </div>
                            </div>
                        </div>

                        {/* Violations List */}
                        <div className="col-span-1 lg:col-span-2 space-y-4">
                            {result.normativeComplianceDetailed.violations.length > 0 ? (
                                <>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-red-500 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">warning</span>
                                        Violaciones Detectadas ({result.normativeComplianceDetailed.violations.length})
                                    </h4>
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                        {result.normativeComplianceDetailed.violations.map((violation, idx) => (
                                            <div key={idx} className={`p-4 rounded-xl border-l-4 ${violation.severity === 'Critical' ? 'bg-red-50 dark:bg-red-900/10 border-red-500' : violation.severity === 'High' ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-500' : 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-500'}`}>
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${violation.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                                        {violation.severity === 'Critical' ? 'Crítico' : violation.severity === 'High' ? 'Alto' : 'Medio'}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-slate-500 italic">{violation.evidence.match(/\[Pág\. [^\]]+\]/)?.[0] || 'Ubicación n/a'}</span>
                                                </div>
                                                <p className="font-bold text-sm text-slate-900 dark:text-white mt-1">{violation.rule}</p>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{violation.impact}</p>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                                    <span className="material-symbols-outlined text-4xl text-emerald-500 mb-2">verified</span>
                                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">¡Excelente! No se detectaron violaciones normativas.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* FASE 2: VERIFICACIÓN ESTRUCTURAL (STRICT MODE) */}
            {result.structuralVerification && (
                <div className="bg-white dark:bg-surface-dark rounded-3xl border border-slate-200 dark:border-surface-border p-8 shadow-xl">
                    <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-indigo-500">account_tree</span>
                        Verificación Estructural
                    </h3>

                    {result.structuralVerification.missingSections.length > 0 && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl flex items-start gap-3">
                            <span className="material-symbols-outlined text-red-500 mt-0.5">error</span>
                            <div>
                                <p className="font-bold text-red-700 dark:text-red-400 text-sm">Secciones Obligatorias Faltantes</p>
                                <p className="text-xs text-red-600 dark:text-red-300 mt-1">El documento no cumple con la estructura requerida. Faltan: {result.structuralVerification.missingSections.join(', ')}.</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(result.structuralVerification.sectionsFound).map(([name, data]) => (
                            <div key={name} className={`p-4 rounded-xl border ${data.exists ? (data.completeness >= 80 ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700' : 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-700') : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800 opacity-60'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`w-2 h-2 rounded-full ${data.exists ? (data.completeness >= 80 ? 'bg-emerald-500' : 'bg-yellow-500') : 'bg-red-500'}`}></span>
                                    <span className="text-[10px] font-mono text-slate-400">{data.pages || 'N/A'}</span>
                                </div>
                                <p className={`text-sm font-bold truncate ${data.exists ? 'text-slate-700 dark:text-slate-200' : 'text-red-600 dark:text-red-400 line-through decoration-red-500/50'}`}>{name}</p>

                                {data.exists && (
                                    <div className="mt-3">
                                        <div className="flex justify-between text-[10px] mb-1">
                                            <span className="text-slate-400">Completitud</span>
                                            <span className="font-bold">{data.completeness}%</span>
                                        </div>
                                        <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${data.completeness >= 80 ? 'bg-emerald-500' : 'bg-yellow-500'}`} style={{ width: `${data.completeness}%` }}></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* FASE 2.5: SUB-MATRIZ DE CONSISTENCIA DE FUENTES (NEW) */}
            {result.sourceConsistencySubMatrix && (
                <div className="bg-white dark:bg-surface-dark rounded-3xl border border-slate-200 dark:border-surface-border p-8 shadow-xl">
                    <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-500">menu_book</span>
                        Sub-matriz de Consistencia de Fuentes (APA 7)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Status Summary */}
                        <div className="space-y-4">
                            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Alineación de Citación</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">Referencias Citadas</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{result.sourceConsistencySubMatrix.referencesCiting.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">Referencias NO Usadas</span>
                                        <span className={`font-bold ${result.sourceConsistencySubMatrix.unusedReferences.length > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                            {result.sourceConsistencySubMatrix.unusedReferences.length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">Citas sin Referencia</span>
                                        <span className={`font-bold ${result.sourceConsistencySubMatrix.missingReferences.length > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                            {result.sourceConsistencySubMatrix.missingReferences.length}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {result.sourceConsistencySubMatrix.missingReferences.length > 0 && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl">
                                    <h5 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">Citas Críticas (Faltan en Bibliografía)</h5>
                                    <ul className="text-xs space-y-1 text-red-700 dark:text-red-400">
                                        {result.sourceConsistencySubMatrix.missingReferences.map((ref, i) => (
                                            <li key={i} className="flex gap-2">
                                                <span className="material-symbols-outlined text-xs">close</span>
                                                {ref}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Citations List */}
                        <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Citas Encontradas en Texto</h4>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {result.sourceConsistencySubMatrix.citationsFound.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <div className="flex items-center gap-3">
                                            <span className={`material-symbols-outlined text-sm ${item.inBibliography ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {item.inBibliography ? 'check_circle' : 'cancel'}
                                            </span>
                                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{item.citation}</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-400">Pág. {item.page}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Diagnóstico Global */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`col-span-1 md:col-span-1 p-8 rounded-3xl border-2 ${result?.globalDiagnosis?.level === 'Excelente' ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500/30' :
                    result?.globalDiagnosis?.level === 'Aceptable' ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-500/30' :
                        result?.globalDiagnosis?.level === 'Débil' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-500/30' :
                            'bg-red-50 dark:bg-red-900/10 border-red-500/30'
                    } shadow-lg flex flex-col items-center justify-center text-center relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <span className="material-symbols-outlined text-[48px] mb-4 text-slate-700 dark:text-slate-200 group-hover:scale-110 transition-transform">assessment</span>
                    <p className="text-[10px] font-black text-slate-500 dark:text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Diagnóstico General</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{result?.globalDiagnosis?.level || 'N/A'}</p>
                </div>

                <div className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-6 bg-white dark:bg-surface-dark rounded-3xl border border-slate-200 dark:border-surface-border shadow-sm flex flex-col items-center justify-center">
                        <div className="relative size-24 mb-3">
                            <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-slate-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${result?.globalDiagnosis?.internalConsistencyDegree || 0}, 100`} strokeWidth="3" strokeLinecap="round"></path>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-black text-slate-900 dark:text-white">{result?.globalDiagnosis?.internalConsistencyDegree || 0}%</span>
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Consistencia Interna</p>
                    </div>

                    <div className="p-6 bg-white dark:bg-surface-dark rounded-3xl border border-slate-200 dark:border-surface-border shadow-sm flex flex-col items-center justify-center">
                        <div className="relative size-24 mb-3">
                            <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-slate-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                <path className="text-emerald-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${result?.globalDiagnosis?.publishabilityLevel || 0}, 100`} strokeWidth="3" strokeLinecap="round"></path>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-black text-slate-900 dark:text-white">{result?.globalDiagnosis?.publishabilityLevel || 0}%</span>
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Publicabilidad</p>
                    </div>

                    <div className="p-6 bg-white dark:bg-surface-dark rounded-3xl border border-slate-200 dark:border-surface-border shadow-sm flex flex-col items-center justify-center">
                        <div className="relative size-24 mb-3">
                            <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-slate-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                <path className="text-purple-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${result?.normativeCompliance?.apa7Score || 0}, 100`} strokeWidth="3" strokeLinecap="round"></path>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-black text-slate-900 dark:text-white">{result?.normativeCompliance?.apa7Score || 0}%</span>
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Cumplimiento APA 7</p>
                    </div>
                </div>
            </div>

            {/* Matriz de Consistencia - Redesigned Table */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-slate-200 dark:border-surface-border shadow-xl overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#15181f] flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">table_view</span>
                            Matriz de Alineación
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-500 dark:text-slate-400 mt-1">Evaluación de coherencia horizontal entre componentes.</p>
                    </div>
                    <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20">
                        {result?.consistencyMatrix?.length || 0} Componentes
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800/80 text-xs uppercase text-slate-500 dark:text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-left w-1/5 tracking-wider">Componente</th>
                                <th className="px-6 py-4 text-left w-2/5 tracking-wider">Contenido Detectado</th>
                                <th className="px-6 py-4 text-center w-1/6 tracking-wider">Estado</th>
                                <th className="px-6 py-4 text-center w-1/6 tracking-wider">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {result?.consistencyMatrix?.map((row, idx) => {
                                const badge = getCoherenceBadge(row.coherenceLevel);
                                return (
                                    <tr
                                        key={idx}
                                        className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group cursor-pointer"
                                        onClick={() => handleRowSelect(row)}
                                    >
                                        <td className="px-6 py-5 align-top">
                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">{row.element}</span>
                                        </td>
                                        <td className="px-6 py-5 align-top">
                                            <p className="text-xs text-slate-600 dark:text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2">{row.description}</p>
                                            {row.technicalObservation && (
                                                <div className="flex items-start gap-1 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded border border-amber-100 dark:border-amber-800/30 w-fit">
                                                    <span className="material-symbols-outlined text-[12px]">warning</span>
                                                    <span className="truncate max-w-[200px]">{row.technicalObservation}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 align-top">
                                            <div className="flex justify-center">
                                                <span className={`${badge.bg} ${badge.text} text-[10px] px-3 py-1 rounded-full font-black uppercase flex items-center gap-1.5 shadow-sm border border-transparent`}>
                                                    <span className="material-symbols-outlined text-[14px]">{badge.icon}</span>
                                                    {row.coherenceLevel}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 align-middle text-center">
                                            <button
                                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-primary transition-all group-hover:scale-110"
                                                title="Ver detalles completos"
                                            >
                                                <span className="material-symbols-outlined">open_in_full</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Análisis Metodológico */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-slate-200 dark:border-surface-border p-8 shadow-xl">
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">science</span>
                    Análisis Metodológico Profundo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl border-2 ${result.methodologicalAnalysis.approachCoherent ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`material-symbols-outlined ${result.methodologicalAnalysis.approachCoherent ? 'text-emerald-600' : 'text-red-600'}`}>
                                {result.methodologicalAnalysis.approachCoherent ? 'check_circle' : 'cancel'}
                            </span>
                            <span className="text-xs font-black uppercase text-slate-700 dark:text-white">Enfoque Coherente</span>
                        </div>
                    </div>
                    <div className={`p-4 rounded-xl border-2 ${result.methodologicalAnalysis.designAdequate ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`material-symbols-outlined ${result.methodologicalAnalysis.designAdequate ? 'text-emerald-600' : 'text-red-600'}`}>
                                {result.methodologicalAnalysis.designAdequate ? 'check_circle' : 'cancel'}
                            </span>
                            <span className="text-xs font-black uppercase text-slate-700 dark:text-white">Diseño Adecuado</span>
                        </div>
                    </div>
                    <div className={`p-4 rounded-xl border-2 ${result.methodologicalAnalysis.techniquesAppropriate ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`material-symbols-outlined ${result.methodologicalAnalysis.techniquesAppropriate ? 'text-emerald-600' : 'text-red-600'}`}>
                                {result.methodologicalAnalysis.techniquesAppropriate ? 'check_circle' : 'cancel'}
                            </span>
                            <span className="text-xs font-black uppercase text-slate-700 dark:text-white">Técnicas Apropiadas</span>
                        </div>
                    </div>
                    <div className={`p-4 rounded-xl border-2 ${result.methodologicalAnalysis.conclusionsSupportedByResults ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`material-symbols-outlined ${result.methodologicalAnalysis.conclusionsSupportedByResults ? 'text-emerald-600' : 'text-red-600'}`}>
                                {result.methodologicalAnalysis.conclusionsSupportedByResults ? 'check_circle' : 'cancel'}
                            </span>
                            <span className="text-xs font-black uppercase text-slate-700 dark:text-white">Conclusiones Sustentadas</span>
                        </div>
                    </div>
                </div>
                {result.methodologicalAnalysis.criticalAlerts.length > 0 && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                        <h4 className="text-xs font-black text-red-900 dark:text-red-200 uppercase mb-2">Alertas Críticas</h4>
                        <ul className="space-y-1">
                            {result.methodologicalAnalysis.criticalAlerts.map((alert, idx) => (
                                <li key={idx} className="text-xs text-red-800 dark:text-red-300 flex items-start gap-2">
                                    <span className="material-symbols-outlined text-sm mt-0.5">error</span>
                                    <span>{alert}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Evaluación por Secciones */}
            {result.sectionEvaluations && result.sectionEvaluations.length > 0 && (
                <div className="bg-white dark:bg-surface-dark rounded-3xl border border-slate-200 dark:border-surface-border p-8 shadow-xl">
                    <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">menu_book</span>
                        Evaluación por Secciones
                    </h3>
                    <div className="space-y-4">
                        {result.sectionEvaluations.map((section, idx) => (
                            <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <h4 className="text-base font-black text-slate-900 dark:text-white mb-4">{section.section}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {section.strengths.length > 0 && (
                                        <div>
                                            <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">thumb_up</span>
                                                Fortalezas
                                            </h5>
                                            <ul className="space-y-1">
                                                {section.strengths.map((s, i) => (
                                                    <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                                                        <span className="text-emerald-500 mt-0.5">•</span>
                                                        <span>{s}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {section.weaknesses.length > 0 && (
                                        <div>
                                            <h5 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">thumb_down</span>
                                                Debilidades
                                            </h5>
                                            <ul className="space-y-1">
                                                {section.weaknesses.map((w, i) => (
                                                    <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                                                        <span className="text-red-500 mt-0.5">•</span>
                                                        <span>{w}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Normativa y Estilo */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-slate-200 dark:border-surface-border p-8 shadow-xl">
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">gavel</span>
                    Normativa y Estilo Académico
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                        <div className="relative h-24 w-24 mx-auto mb-3">
                            <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 36 36">
                                <path className="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                <path className="text-blue-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${result.normativeCompliance.apa7Score}, 100`} strokeWidth="3" strokeLinecap="round"></path>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-black text-slate-900 dark:text-white">{result.normativeCompliance.apa7Score}%</span>
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">APA 7</p>
                    </div>
                    <div className="text-center">
                        <div className="relative h-24 w-24 mx-auto mb-3">
                            <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 36 36">
                                <path className="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                <path className="text-purple-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${result.normativeCompliance.academicWritingScore}, 100`} strokeWidth="3" strokeLinecap="round"></path>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-black text-slate-900 dark:text-white">{result.normativeCompliance.academicWritingScore}%</span>
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Redacción</p>
                    </div>
                    <div className="text-center">
                        <div className="relative h-24 w-24 mx-auto mb-3">
                            <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 36 36">
                                <path className="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                                <path className="text-amber-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${result.normativeCompliance.terminologyConsistencyScore}, 100`} strokeWidth="3" strokeLinecap="round"></path>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-black text-slate-900 dark:text-white">{result.normativeCompliance.terminologyConsistencyScore}%</span>
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Terminología</p>
                    </div>
                </div>
                {(result.normativeCompliance.orthographicErrors.length > 0 || result.normativeCompliance.grammaticalErrors.length > 0 || result.normativeCompliance.styleIssues.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {result.normativeCompliance.orthographicErrors.length > 0 && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                <h5 className="text-[10px] font-black text-red-900 dark:text-red-200 uppercase tracking-widest mb-2">Errores Ortográficos</h5>
                                <ul className="space-y-1">
                                    {result.normativeCompliance.orthographicErrors.slice(0, 3).map((err, idx) => (
                                        <li key={idx} className="text-xs text-red-800 dark:text-red-300">• {err}</li>
                                    ))}
                                    {result.normativeCompliance.orthographicErrors.length > 3 && (
                                        <li className="text-xs text-red-600 font-bold">+{result.normativeCompliance.orthographicErrors.length - 3} más</li>
                                    )}
                                </ul>
                            </div>
                        )}
                        {result.normativeCompliance.grammaticalErrors.length > 0 && (
                            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                                <h5 className="text-[10px] font-black text-amber-900 dark:text-amber-200 uppercase tracking-widest mb-2">Errores Gramaticales</h5>
                                <ul className="space-y-1">
                                    {result.normativeCompliance.grammaticalErrors.slice(0, 3).map((err, idx) => (
                                        <li key={idx} className="text-xs text-amber-800 dark:text-amber-300">• {err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>



            {/* Recomendaciones Prioritarias */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl border border-slate-200 dark:border-surface-border p-8 shadow-xl">
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">priority_high</span>
                    Plan de Acción Prioritario
                </h3>
                <div className="space-y-4">
                    {result?.prioritizedRecommendations?.map((rec, idx) => (
                        <div key={idx} className="flex gap-4 p-5 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:border-l-4 hover:border-l-primary transition-all">
                            <div className="shrink-0">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md ${getPriorityColor(rec.priority)}`}>
                                    {idx + 1}
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rec.what}</h4>
                                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${getPriorityBadge(rec.priority)}`}>
                                        {rec.priority}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-500 dark:text-slate-400 mb-3">{rec.why}</p>
                                <div className="text-xs bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex gap-2">
                                    <span className="material-symbols-outlined text-sm text-primary">build_circle</span>
                                    <span className="font-medium">{rec.how}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FASE 4: FEEDBACK ACCIONABLE (OPERATIONAL MODEL) */}
            {result.actionableFeedback && result.actionableFeedback.length > 0 && (
                <div className="bg-slate-900 border-2 border-brand-orange/30 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-brand-orange/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <h3 className="text-xl font-black uppercase tracking-tight text-white mb-8 flex items-center gap-2 relative z-10">
                        <span className="material-symbols-outlined text-brand-orange text-3xl">lightbulb_circle</span>
                        Feedback de Mejora Directa
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
                        {result.actionableFeedback.map((fb, idx) => (
                            <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/15 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-brand-orange font-black uppercase tracking-widest text-xs">Hallazgo #{idx + 1}</h4>
                                    <span className="text-[10px] bg-white/20 text-white px-2 py-1 rounded-md font-mono">{fb.evidence}</span>
                                </div>
                                <p className="text-white font-bold mb-4">{fb.finding}</p>

                                <div className="space-y-4">
                                    <div className="text-xs">
                                        <span className="text-brand-orange font-black uppercase tracking-tighter block mb-1">Por qué importa:</span>
                                        <span className="text-slate-300 leading-relaxed">{fb.whyItMatters}</span>
                                    </div>
                                    <div className="text-xs bg-slate-800/50 p-3 rounded-lg border border-white/5">
                                        <span className="text-emerald-400 font-black uppercase tracking-tighter block mb-1">Cómo corregir:</span>
                                        <span className="text-slate-200">{fb.howToFix}</span>
                                    </div>
                                    <div className="text-xs italic text-slate-400 border-l-2 border-brand-orange/50 pl-3">
                                        <span className="text-[10px] text-brand-orange font-black uppercase block mb-1">Ejemplo:</span>
                                        "{fb.example}"
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Principales Riesgos */}
            {result.globalDiagnosis?.mainRisks && result.globalDiagnosis.mainRisks.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-800/50 rounded-3xl p-8">
                    <h3 className="text-lg font-black uppercase tracking-tight text-red-900 dark:text-red-200 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined">warning</span>
                        Principales Riesgos Académicos
                    </h3>
                    <ul className="space-y-2">
                        {result.globalDiagnosis.mainRisks.map((risk, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-red-800 dark:text-red-300">
                                <span className="material-symbols-outlined text-red-500 mt-0.5">error</span>
                                <span>{risk}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Detail Modal */}
            {
                selectedRow && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8 text-left" onClick={() => setSelectedRow(null)}>
                        <div className="bg-white dark:bg-surface-dark rounded-[3rem] border border-slate-200 dark:border-surface-border shadow-2xl max-w-3xl w-full p-10" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{selectedRow.element}</h2>
                                    <span className={`${getCoherenceBadge(selectedRow.coherenceLevel).bg} ${getCoherenceBadge(selectedRow.coherenceLevel).text} text-xs px-3 py-1 rounded-full font-black uppercase`}>
                                        {selectedRow.coherenceLevel}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedRow(null)}
                                    className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Descripción Encontrada</h3>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{selectedRow.description}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Observación Técnica</h3>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{selectedRow.technicalObservation}</p>
                                </div>
                                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl">
                                    <h3 className="text-xs font-black text-blue-900 dark:text-blue-200 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined">lightbulb</span>
                                        Recomendación Concreta
                                    </h3>
                                    <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">{selectedRow.recommendation}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
