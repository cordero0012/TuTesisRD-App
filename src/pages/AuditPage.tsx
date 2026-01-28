import React from 'react';
import { useProject } from '../contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';

export const AuditPage = () => {
    const { uploadedFile, setUploadedFile } = useProject();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const handleClearFile = () => {
        setUploadedFile(null);
        showNotification("Archivo removido del contexto", "info");
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-white pt-20 px-8 pb-12">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <header className="space-y-4">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        Centro de Auditoría de Tesis
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                        Evaluación integral de tu investigación. Verifica la originalidad, consistencia metodológica y cumplimiento normativo en un solo lugar.
                    </p>
                </header>

                {/* Context / File Status */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                                Contexto de Análisis
                            </h3>
                            {uploadedFile ? (
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-emerald-500">description</span>
                                    <span className="text-xl font-bold">{uploadedFile.name}</span>
                                    <span className="text-sm text-slate-400 font-medium">
                                        ({Array.isArray(uploadedFile.content) ? `${uploadedFile.content.length} páginas` : `${(uploadedFile.content as string).length} caracteres`})
                                    </span>
                                </div>
                            ) : (
                                <div className="text-lg font-medium text-slate-400 italic flex items-center gap-2">
                                    <span className="material-symbols-outlined">upload_file</span>
                                    Ningún archivo cargado actualmente
                                </div>
                            )}
                        </div>

                        {uploadedFile && (
                            <button
                                onClick={handleClearFile}
                                className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">delete</span>
                                Limpiar Contexto
                            </button>
                        )}
                    </div>
                </div>

                {/* Tools Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Card: AI Detection */}
                    <div
                        onClick={() => navigate('/herramientas/auditor')}
                        className="group bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                <span className="material-symbols-outlined text-3xl text-primary">security</span>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">Auditoría Forense (IA)</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Detecta patrones de Inteligencia Artificial (ChatGPT, Gemini, Claude) y analiza la originalidad de tu redacción.
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">Anti-Plagio</span>
                                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">Firmas Lingüísticas</span>
                            </div>
                        </div>
                    </div>

                    {/* Card: Consistency Matrix */}
                    <div
                        onClick={() => navigate('/herramientas/matriz')}
                        className="group bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-all"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                <span className="material-symbols-outlined text-3xl text-blue-600">grid_on</span>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold group-hover:text-blue-600 transition-colors">Matriz de Consistencia</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Valida la coherencia lógica entre el problema, objetivos, hipótesis y variables. Análisis metodológico estricto.
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">Metodología</span>
                                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">Normativa</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditPage;
