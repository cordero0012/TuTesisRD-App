import React, { useState } from 'react';
import { ConsistencyMatrixRow } from '../../services/consistency/matrixAnalyzer';

interface MatrixInteractiveProps {
    matrix: ConsistencyMatrixRow[];
}

export const MatrixInteractive: React.FC<MatrixInteractiveProps> = ({ matrix }) => {
    const [activeRow, setActiveRow] = useState<number | null>(null);

    return (
        <div className="bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-surface-border overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-surface-border">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Matriz de Consistencia Interactiva</h3>
                <p className="text-slate-500 dark:text-slate-400">
                    Haz clic en cada elemento para inspeccionar su coherencia interna y recomendaciones técnicas.
                </p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-surface-border">
                {matrix.map((row, idx) => (
                    <div
                        key={idx}
                        className={`group transition-all duration-300 ${activeRow === idx ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : 'hover:bg-slate-50 dark:hover:bg-surface-border/50'}`}
                    >
                        <div
                            className="p-6 cursor-pointer flex items-center justify-between"
                            onClick={() => setActiveRow(activeRow === idx ? null : idx)}
                        >
                            <div className="flex items-center gap-6">
                                <div className={`
                                    w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-bold text-lg
                                    ${row.coherenceLevel === 'Alta' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' :
                                        row.coherenceLevel === 'Media' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' :
                                            'bg-red-100 text-red-600 dark:bg-red-900/30'}
                                `}>
                                    {activeRow === idx ? (
                                        <span className="material-symbols-outlined">expand_less</span>
                                    ) : (
                                        <span className="material-symbols-outlined">
                                            {row.coherenceLevel === 'Alta' ? 'check' : row.coherenceLevel === 'Media' ? 'warning' : 'priority_high'}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">{row.element}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${row.coherenceLevel === 'Alta' ? 'bg-emerald-100 text-emerald-700' :
                                                row.coherenceLevel === 'Media' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            Coherencia {row.coherenceLevel}
                                        </span>
                                        {!row.description && (
                                            <span className="text-xs text-red-400 italic flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[10px]">cancel</span> No encontrado
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="text-right hidden sm:block">
                                <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-500 transition-colors">
                                    chevron_right
                                </span>
                            </div>
                        </div>

                        {/* Expanded Details */}
                        <div className={`
                            overflow-hidden transition-all duration-300 ease-in-out
                            ${activeRow === idx ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                        `}>
                            <div className="p-6 pt-0 ml-[5.5rem] pr-12 grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
                                <div>
                                    <h5 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Contenido Identificado</h5>
                                    <p className="text-slate-600 dark:text-slate-300 italic bg-white dark:bg-black/20 p-4 rounded-xl border border-slate-100 dark:border-white/5 text-sm leading-relaxed">
                                        "{row.description || 'No se encontró contenido para este elemento.'}"
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h5 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Observación Técnica</h5>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">{row.technicalObservation}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-2">Recomendación</h5>
                                        <div className="flex gap-3 items-start">
                                            <span className="material-symbols-outlined text-emerald-500 text-lg shrink-0">auto_fix_high</span>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{row.recommendation}</p>
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
