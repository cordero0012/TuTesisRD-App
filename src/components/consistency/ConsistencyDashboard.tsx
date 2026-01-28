import React from 'react';
import { ConsistencyAnalysisResult } from '../../services/consistency/matrixAnalyzer';

interface ConsistencyDashboardProps {
    result: ConsistencyAnalysisResult;
}

export const ConsistencyDashboard: React.FC<ConsistencyDashboardProps> = ({ result }) => {

    // Helper colors for scores
    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
        if (score >= 70) return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
    };

    const riskLevelColor = {
        'Excelente': 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30',
        'Aceptable': 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
        'Débil': 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
        'Crítico': 'text-red-600 bg-red-100 dark:bg-red-900/30'
    };

    return (
        <div className="space-y-8 animate-fade-in p-6 max-w-7xl mx-auto">

            {/* 1. Global Diagnosis Header */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 bg-white dark:bg-surface-dark p-8 rounded-[2rem] border border-slate-100 dark:border-surface-border shadow-xl">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Diagnóstico Global</span>
                            <h2 className={`text-4xl font-black mt-2 ${riskLevelColor[result.globalDiagnosis.level].split(' ')[0]}`}>
                                {result.globalDiagnosis.level}
                            </h2>
                        </div>
                        <div className={`px-4 py-2 rounded-full font-bold text-sm ${riskLevelColor[result.globalDiagnosis.level]}`}>
                            Riesgo: {result.globalDiagnosis.level === 'Excelente' ? 'Bajo' : result.globalDiagnosis.level === 'Aceptable' ? 'Medio' : 'Alto'}
                        </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 border-l-4 border-slate-200 dark:border-slate-700 pl-4 py-1 italic">
                        "{result.globalDiagnosis.auditSummary || "Análisis completado exitosamente."}"
                    </p>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <MetricCard
                            label="Consistencia"
                            value={result.globalDiagnosis.internalConsistencyDegree}
                            color={getScoreColor(result.globalDiagnosis.internalConsistencyDegree)}
                        />
                        <MetricCard
                            label="Publicabilidad"
                            value={result.globalDiagnosis.publishabilityLevel}
                            color={getScoreColor(result.globalDiagnosis.publishabilityLevel)}
                        />
                        <MetricCard
                            label="Estilo Académico"
                            value={result.normativeCompliance.academicWritingScore}
                            color={getScoreColor(result.normativeCompliance.academicWritingScore)}
                        />
                    </div>
                </div>

                {/* 2. Critical Alerts Panel */}
                <div className="w-full md:w-1/3 bg-slate-50 dark:bg-[#0d1017] p-6 rounded-[2rem] border border-slate-200 dark:border-surface-border h-full">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg">
                            <span className="material-symbols-outlined">warning</span>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white">Alertas Críticas</h3>
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {result.methodologicalAnalysis.criticalAlerts.length > 0 ? (
                            result.methodologicalAnalysis.criticalAlerts.map((alert, i) => (
                                <div key={i} className="flex gap-3 text-sm p-3 bg-white dark:bg-surface-dark rounded-xl border border-red-100 dark:border-red-900/30">
                                    <span className="material-symbols-outlined text-red-500 text-xs mt-1 shrink-0">error</span>
                                    <span className="text-slate-700 dark:text-slate-300">{alert}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-400">
                                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">check_circle</span>
                                <p className="text-sm">Sin alertas críticas detectadas</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. Forensic Reasoning Box */}
            {result.methodologicalAnalysis.forensicReasoning && (
                <div className="bg-slate-900 border-2 border-brand-orange/30 text-slate-300 p-8 rounded-[2rem] relative overflow-hidden shadow-2xl shadow-brand-orange/5">
                    <div className="absolute top-0 right-0 p-32 bg-brand-orange/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <span className="material-symbols-outlined text-brand-orange text-3xl">psychology</span>
                        <h3 className="font-black text-white uppercase tracking-[0.2em] text-sm">Dictamen Forense de IA</h3>
                    </div>
                    <p className="text-xl leading-relaxed relative z-10 font-medium text-slate-200">
                        {result.methodologicalAnalysis.forensicReasoning}
                    </p>
                </div>
            )}

            {/* 4. Recommendations List */}
            <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-brand-orange/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-brand-orange">app_registration</span>
                    </div>
                    Acciones Correctivas Priorizadas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {result.prioritizedRecommendations.map((rec, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 hover:border-brand-orange/30 hover:shadow-2xl hover:shadow-brand-orange/5 transition-all duration-500 group">
                            <div className="flex justify-between items-start mb-6">
                                <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest ${rec.priority === 'Crítica' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-brand-orange/10 text-brand-orange'}`}>
                                    Prioridad {rec.priority}
                                </span>
                                <span className="text-slate-200 dark:text-slate-700 text-5xl font-black opacity-40 group-hover:opacity-100 transition-opacity">
                                    {String(idx + 1).padStart(2, '0')}
                                </span>
                            </div>
                            <h4 className="font-black text-slate-800 dark:text-white mb-3 text-lg leading-tight uppercase tracking-tight">{rec.what}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{rec.why}</p>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-white/5">
                                <span className="font-black block mb-2 text-brand-orange uppercase tracking-widest text-[10px]">Hoja de Ruta:</span>
                                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{rec.how}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

// Subcomponent: Metric Card
const MetricCard = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className={`p-6 rounded-[2rem] border border-transparent shadow-sm ${color.split(' ')[1].replace('/20', '/5')}`}>
        <div className={`text-4xl font-black ${color.split(' ')[0]} mb-2 tracking-tighter`}>{value}<span className="text-base ml-1 opacity-60">%</span></div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 text-slate-500 dark:text-slate-400">{label}</div>
    </div>
);
