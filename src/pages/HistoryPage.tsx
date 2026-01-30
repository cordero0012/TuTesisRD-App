import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { persistenceService, SavedAnalysisRecord } from '../services/persistenceService';
import { useProject } from '../contexts/ProjectContext';
import { MatrixAnalysisDTO } from '../types/schemas';

const HistoryPage = () => {
    const { project, session } = useProject();
    const navigate = useNavigate();
    const [analyses, setAnalyses] = useState<SavedAnalysisRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (project.id && project.id !== 'offline-demo') {
                const data = await persistenceService.listAnalyses(project.id);
                setAnalyses(data);
            }
            setLoading(false);
        };
        fetchHistory();
    }, [project.id]);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'ok': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'partial': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    if (!session) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">lock</span>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Historial Privado</h2>
                <p className="text-slate-500 max-w-md">
                    Debes iniciar sesión para ver y gestionar tu historial de análisis en la nube.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto animate-fade-in">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Historial de Análisis</h1>
                    <p className="text-slate-500">Consulta tus reportes previos de {project.title}</p>
                </div>
                <button
                    onClick={() => navigate('/portal')}
                    className="flex items-center gap-2 text-slate-500 hover:text-brand-orange transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Volver al Dashboard
                </button>
            </header>

            {loading ? (
                <div className="flex justify-center p-20">
                    <span className="material-symbols-outlined animate-spin text-4xl text-brand-orange">sync</span>
                </div>
            ) : analyses.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-20 text-center">
                    <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">folder_open</span>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No hay reportes aún</h3>
                    <p className="text-slate-500 mb-6">Realiza tu primer análisis para comenzar a construir tu historial.</p>
                    <button
                        onClick={() => navigate('/herramientas/matriz')}
                        className="px-6 py-3 bg-brand-orange text-white rounded-xl font-bold hover:scale-105 transition-transform"
                    >
                        Empezar Análisis
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {analyses.map((it) => {
                        const result = it.result as MatrixAnalysisDTO;
                        const diagnosis = result.globalDiagnosis;

                        return (
                            <div
                                key={it.id}
                                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl hover:border-brand-orange/30 transition-all flex flex-wrap md:flex-nowrap items-center gap-6"
                            >
                                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
                                    <span className="material-symbols-outlined">
                                        {it.type === 'consistency' ? 'matrix' : 'rule'}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-[200px]">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                                            {it.type === 'consistency' ? 'Matriz de Consistencia' : 'Auditoría Normativa'}
                                        </h3>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getStatusColor(it.status)}`}>
                                            {it.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                                        {formatDate(it.created_at)}
                                    </p>
                                </div>

                                {diagnosis && (
                                    <div className="text-center px-6 border-x border-slate-100 dark:border-slate-800 hidden md:block">
                                        <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Diagnóstico</div>
                                        <div className={`text-sm font-black ${diagnosis.level === 'Excelente' ? 'text-emerald-500' :
                                                diagnosis.level === 'Aceptable' ? 'text-blue-500' : 'text-amber-500'
                                            }`}>
                                            {diagnosis.level}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 ml-auto">
                                    <button
                                        onClick={() => {
                                            // Ideally we'd store the selected analysis in a state management system
                                            // or pass via location state. For now, let's just log.
                                            console.log("Loading analysis:", it.id);
                                            navigate('/herramientas/matriz', { state: { loadedAnalysis: it.result } });
                                        }}
                                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-brand-orange/10 hover:text-brand-orange text-slate-600 dark:text-slate-400 rounded-lg text-sm font-bold transition-all"
                                    >
                                        Ver Detalle
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
