import React, { useState } from 'react';
import { ConsistencyMatrixRow } from '../../services/consistency/matrixAnalyzer';

interface MatrixInteractiveProps {
    matrix: ConsistencyMatrixRow[];
}

export const MatrixInteractive: React.FC<MatrixInteractiveProps> = ({ matrix }) => {
    const [activeRow, setActiveRow] = useState<number | null>(null);

    return (
        <div className="bg-white/60 dark:bg-slate-900/60 rounded-[2.5rem] shadow-xl border border-white dark:border-white/5 overflow-hidden backdrop-blur-xl">
            <div className="p-10 border-b border-slate-100 dark:border-white/5">
                <h3 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Matriz de Consistencia Interactiva</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                    Explora los hallazgos forenses de cada dimensión metodológica.
                </p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-white/5">
                {matrix.map((row, idx) => (
                    <div
                        key={idx}
                        className={`group transition-all duration-500 ${activeRow === idx ? 'bg-brand-orange/[0.03] dark:bg-brand-orange/[0.02]' : 'hover:bg-slate-50/50 dark:hover:bg-white/[0.02]'}`}
                    >
                        <div
                            className="p-8 cursor-pointer flex items-center justify-between"
                            onClick={() => setActiveRow(activeRow === idx ? null : idx)}
                        >
                            <div className="flex items-center gap-8">
                                <div className={`
                                    w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-bold text-xl shadow-sm
                                    ${row.coherenceLevel === 'Alta' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' :
                                        row.coherenceLevel === 'Media' ? 'bg-brand-orange/10 text-brand-orange' :
                                            'bg-red-100 text-red-600 dark:bg-red-900/30'}
                                `}>
                                    {activeRow === idx ? (
                                        <span className="material-symbols-outlined text-3xl">keyboard_arrow_up</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-3xl">
                                            {row.coherenceLevel === 'Alta' ? 'verified' : row.coherenceLevel === 'Media' ? 'error' : 'dangerous'}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800 dark:text-white text-xl uppercase tracking-tight">{row.element}</h4>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className={`text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full ${row.coherenceLevel === 'Alta' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                            row.coherenceLevel === 'Media' ? 'bg-brand-orange/10 text-brand-orange' :
                                                'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                            }`}>
                                            Auditoría: {row.coherenceLevel}
                                        </span>
                                        {!row.description && (
                                            <span className="text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-1 opacity-60">
                                                <span className="material-symbols-outlined text-xs">block</span> No Hallado
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="text-right hidden sm:block">
                                <span className={`material-symbols-outlined text-slate-300 group-hover:text-brand-orange transition-all duration-300 ${activeRow === idx ? 'rotate-90 text-brand-orange' : ''}`}>
                                    arrow_forward_ios
                                </span>
                            </div>
                        </div>

                        {/* Expanded Details */}
                        <div className={`
                            overflow-hidden transition-all duration-500 ease-in-out
                            ${activeRow === idx ? 'max-h-[800px] opacity-100 border-t border-slate-100 dark:border-white/5' : 'max-h-0 opacity-0'}
                        `}>
                            <div className="p-10 bg-slate-50/30 dark:bg-black/10">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div>
                                            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Hallazgo Textual</h5>
                                            <div className="relative">
                                                <span className="absolute -left-4 -top-2 text-4xl text-brand-orange/20 font-serif">"</span>
                                                <p className="text-slate-600 dark:text-slate-300 italic font-medium leading-relaxed bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
                                                    {row.description || 'No se logró extraer contenido directo para esta dimensión.'}
                                                </p>
                                                <span className="absolute -right-2 -bottom-4 text-4xl text-brand-orange/20 font-serif">"</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
                                            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Observación Técnica Forense</h5>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{row.technicalObservation}</p>
                                        </div>
                                        <div className="bg-brand-orange/5 p-6 rounded-3xl border border-brand-orange/10 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8 bg-brand-orange/10 rounded-full blur-2xl -mr-4 -mt-4"></div>
                                            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange mb-3 relative z-10">Acción Recomendada</h5>
                                            <div className="flex gap-4 items-start relative z-10">
                                                <div className="size-8 rounded-lg bg-brand-orange/20 flex items-center justify-center shrink-0">
                                                    <span className="material-symbols-outlined text-brand-orange text-lg">auto_fix_high</span>
                                                </div>
                                                <p className="text-sm text-slate-800 dark:text-slate-200 font-bold leading-relaxed">{row.recommendation}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MatrixInteractive;
