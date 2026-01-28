import React, { useState, useEffect, useMemo } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { useNotification } from '../contexts/NotificationContext';
import { analyzeConsistencyStrict } from '../services/consistency/strictAnalyzer';
import { ConsistencyAnalysisResult } from '../services/consistency/matrixAnalyzer';
import { ConsistencyAnalysisResults } from '../components/consistency/ConsistencyAnalysisResults';
import { ConsistencyDashboard } from '../components/consistency/ConsistencyDashboard';
import { MatrixInteractive } from '../components/consistency/MatrixInteractive';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';
import universitiesData from '../data/universities.json';

// Configure PDF worker
try {
    // @ts-ignore
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
} catch (e) {
    console.warn("Could not set PDF worker source", e);
}

export const ConsistencyMatrix = () => {
    // Using project content if available, but primarily relying on local file upload
    const { project, uploadedFile, setUploadedFile } = useProject();
    const { showNotification } = useNotification();

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [result, setResult] = useState<ConsistencyAnalysisResult | null>(null);
    const [viewMode, setViewMode] = useState<'dashboard' | 'matrix'>('dashboard');

    const [selectedRegulationId, setSelectedRegulationId] = useState<string>('');

    // Document upload state handled by Context
    const [isUploading, setIsUploading] = useState(false);
    const [useDeepScan, setUseDeepScan] = useState(false);

    // Regulations from universities.json
    const availableRegulations = useMemo(() => {
        return universitiesData.map(uni => ({
            id: uni.id,
            name: uni.name,
            content: `Normativa: ${uni.regulations.style}. Páginas: ${uni.regulations.minPages}-${uni.regulations.maxPages}. Tips: ${uni.tips.join(' ')}`,
            deepAnalysis: undefined // Add specific deep analysis metadata if available in valid json
        }));
    }, []);

    // Select the first available regulation by default
    useEffect(() => {
        if (availableRegulations.length > 0 && !selectedRegulationId) {
            // Default to first or user preference
        }
    }, [availableRegulations, selectedRegulationId]);

    // Handle file upload and parsing
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
        if (!validTypes.includes(file.type)) {
            showNotification("Formato no soportado. Usa PDF o DOCX", "error");
            return;
        }

        setIsUploading(true);

        try {
            let content: string | { page: number; text: string }[] = '';

            // For PDF files
            if (file.type === 'application/pdf') {
                if (useDeepScan && (window as any).scholar?.ocr) {
                    showNotification("Deep Scan activado: Procesando con OCR avanzado...", "info");
                }

                const arrayBuffer = await file.arrayBuffer();
                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;
                const pages: { page: number; text: string }[] = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map((item: any) => (item as any).str).join(' ');
                    pages.push({ page: i, text: pageText });
                }

                content = pages;
                const totalChars = pages.reduce((acc, p) => acc + p.text.length, 0);
                showNotification(`PDF cargado: ${file.name} (${totalChars} caracteres, ${pages.length} págs)`, "success");
            }
            // For DOCX files
            else if (file.name.endsWith('.docx')) {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                content = result.value.trim();
                showNotification(`DOCX cargado: ${file.name} (${result.value.length} caracteres)`, "success");
            }

            setUploadedFile({
                name: file.name,
                type: file.type,
                size: file.size,
                content: content,
                lastModified: file.lastModified
            });

        } catch (error) {
            console.error('File parsing error:', error);
            showNotification("Error al procesar el archivo", "error");
        } finally {
            setIsUploading(false);
            event.target.value = '';
        }
    };

    const handleAnalyze = async () => {
        const contentToAnalyze = uploadedFile?.content || project.content;

        const contentLength = Array.isArray(contentToAnalyze)
            ? contentToAnalyze.reduce((acc, p) => acc + p.text.length, 0)
            : (contentToAnalyze as string)?.length || 0;

        if (!contentToAnalyze || contentLength < 500) {
            showNotification("Necesitas al menos 500 caracteres de contenido para analizar", "warning");
            return;
        }

        setIsAnalyzing(true);
        setAnalysisProgress(0);

        try {
            const progressInterval = setInterval(() => {
                setAnalysisProgress(prev => Math.min(prev + 5, 90));
            }, 500);

            const selectedRegulation = availableRegulations.find(r => r.id === selectedRegulationId);
            const institutionalRules = selectedRegulation?.content || null;

            // Prepare text (join if array)
            const textToProcess = Array.isArray(contentToAnalyze)
                ? contentToAnalyze.map(p => `[Página ${p.page}]\n${p.text}`).join('\n\n')
                : contentToAnalyze as string;

            // Use Strict Analyzer
            const analysis = await analyzeConsistencyStrict(
                textToProcess,
                institutionalRules,
                selectedRegulation?.deepAnalysis
            );

            clearInterval(progressInterval);
            setAnalysisProgress(100);
            setResult(analysis);
            showNotification("Análisis de consistencia completado", "success");
        } catch (error) {
            console.error('Analysis error:', error);
            showNotification("Error al analizar la consistencia", "error");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="h-full w-full bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-hidden flex flex-col">
            {/* Header */}
            <header className="h-20 border-b border-slate-200 dark:border-surface-border bg-white dark:bg-[#111318] flex items-center justify-between px-8 shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-xl">
                        <span className="material-symbols-outlined text-primary">grid_on</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Matriz de Consistencia Académica</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Evaluación Metodológica Integral · Revisor Académico Senior</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* Regulation Selector with updated design */}
                    <div className="flex items-center gap-3 bg-white dark:bg-surface-dark px-4 py-2 rounded-full border border-slate-200 dark:border-surface-border">
                        <span className="material-symbols-outlined text-primary text-sm">account_balance</span>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Normativa</span>
                            <select
                                value={selectedRegulationId}
                                onChange={(e) => setSelectedRegulationId(e.target.value)}
                                className="text-xs font-bold text-slate-900 dark:text-white bg-transparent border-none outline-none cursor-pointer min-w-[150px] focus:ring-0"
                                disabled={availableRegulations.length === 0}
                            >
                                <option value="">{availableRegulations.length === 0 ? "No hay guías cargadas" : "Sin normativa específica"}</option>
                                {availableRegulations.map(reg => (
                                    <option key={reg.id} value={reg.id}>{reg.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Deep Scan Toggle - Minimalist pill */}
                    <button
                        className={`group relative flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${useDeepScan
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-400'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-surface-dark dark:border-surface-border dark:text-slate-300'
                            }`}
                        onClick={() => setUseDeepScan(!useDeepScan)}
                        title="Habilita OCR avanzado para documentos escaneados (Beta)"
                    >
                        <span className={`material-symbols-outlined text-lg transition-transform group-hover:scale-110 ${useDeepScan ? 'fill-current' : ''}`}>
                            {useDeepScan ? 'view_comfy_alt' : 'crop_free'}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wide">Deep Scan</span>
                        {useDeepScan && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                            </span>
                        )}
                    </button>

                    {/* Document Upload Button - Modernized */}
                    <div className="relative group">
                        <input
                            type="file"
                            accept=".pdf,.docx,.doc"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                            id="doc-upload"
                        />
                        <div
                            className={`flex items-center gap-3 px-6 py-2 rounded-full border-2 border-dashed font-bold text-sm transition-all duration-300 ${isUploading
                                ? 'border-slate-300 bg-slate-50 text-slate-400 cursor-wait'
                                : uploadedFile
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-600'
                                    : 'border-slate-300 hover:border-brand-orange hover:text-brand-orange hover:bg-orange-50/50 dark:border-slate-600 dark:text-slate-300'
                                }`}
                        >
                            {isUploading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    <span>Procesando...</span>
                                </>
                            ) : uploadedFile ? (
                                <>
                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                    <span className="max-w-[120px] truncate">{uploadedFile.name}</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-lg group-hover:-translate-y-0.5 transition-transform">upload_file</span>
                                    <span>Subir Tesis</span>
                                </>
                            )}
                        </div>
                    </div>

                    {uploadedFile && (
                        <button
                            onClick={() => {
                                setUploadedFile(null);
                                showNotification("Documento eliminado", "info");
                            }}
                            className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                            title="Eliminar documento"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    )}

                    {/* Execute Analysis Button - Premium Style */}
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || (!uploadedFile && !project.content)}
                        className={`
                            relative overflow-hidden group px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl transition-all duration-300
                            ${isAnalyzing
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
                                : 'bg-slate-900 text-white hover:bg-brand-orange hover:shadow-brand-orange/30 hover:-translate-y-1 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200'
                            }
                        `}
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="absolute inset-0 bg-slate-200/50 dark:bg-slate-700/50 w-full h-full transform origin-left" style={{ width: `${analysisProgress}%`, transition: 'width 0.5s ease' }}></div>
                                <span className="relative z-10 flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    <span>{analysisProgress}%</span>
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">analytics</span>
                                <span>Ejecutar Análisis</span>
                            </>
                        )}
                    </button>

                    {result && (
                        <div className="flex bg-slate-100 dark:bg-surface-border p-1 rounded-xl ml-4">
                            <button
                                onClick={() => setViewMode('dashboard')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'dashboard'
                                    ? 'bg-white dark:bg-surface-dark shadow-sm text-slate-900 dark:text-white'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                    }`}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => setViewMode('matrix')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'matrix'
                                    ? 'bg-white dark:bg-surface-dark shadow-sm text-slate-900 dark:text-white'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                    }`}
                            >
                                Matriz Interactiva
                            </button>
                        </div>
                    )}

                    {result && (
                        <button
                            onClick={async () => {
                                try {
                                    if (result) {
                                        const { generateConsistencyMatrixPDF } = await import('../services/pdfExport');
                                        generateConsistencyMatrixPDF(result, 'Informe_Consistencia_ScholarAI');
                                        showNotification("Informe PDF de alta calidad generado", "success");
                                    }
                                } catch (err) {
                                    console.error("PDF Generation Error", err);
                                    showNotification("Error al generar el PDF", "error");
                                }
                            }}
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 ml-auto text-sm"
                        >
                            <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                            Exportar PDF
                        </button>
                    )}
                    {result && (
                        <button
                            onClick={async () => {
                                try {
                                    const { exportMatrixToWord } = await import('../services/wordExportService');

                                    const matrixData = {
                                        globalDiagnosis: {
                                            score: result.globalDiagnosis?.internalConsistencyDegree || 0,
                                            summary: result.globalDiagnosis?.mainRisks?.join('. ') || 'Sin observaciones'
                                        },
                                        consistencyMatrix: result.consistencyMatrix?.map(item => ({
                                            element: item.element,
                                            status: item.coherenceLevel,
                                            observations: item.technicalObservation
                                        })) || []
                                    };

                                    await exportMatrixToWord(matrixData, result.documentType);
                                    showNotification('Exportado a Word exitosamente', 'success');
                                } catch (error: any) {
                                    showNotification(error.message || 'Error al exportar', 'error');
                                }
                            }}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-blue-500 transition-all active:scale-95 ml-2"
                        >
                            <span className="material-symbols-outlined">description</span>
                            Exportar Word
                        </button>
                    )}
                </div>
            </header>

            {/* Progress Bar */}
            {isAnalyzing && (
                <div className="p-6 border-b border-slate-200 dark:border-surface-border bg-slate-50 dark:bg-[#0b0e14]">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-500 dark:text-slate-400">Análisis Metodológico en Progreso</span>
                        </div>
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{analysisProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full transition-all duration-300" style={{ width: `${analysisProgress}%` }}></div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-500 dark:text-slate-400 italic">Evaluando coherencia estructural, metodológica y normativa...</p>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-[#0d1017]">
                {isAnalyzing ? (
                    <div className="h-full flex flex-col items-center justify-center animate-in fade-in duration-700">
                        <div className="relative mb-8">
                            <div className="size-24 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-brand-orange animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-brand-orange animate-pulse">neurology</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight text-slate-800 dark:text-white mb-2">Analizando Estructura Profunda</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md text-center mb-8">
                            Nuestros agentes están evaluando la coherencia metodológica, normativa y argumentativa de tu tesis.
                        </p>
                        <div className="w-64 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-orange transition-all duration-300" style={{ width: `${analysisProgress}%` }}></div>
                        </div>
                        <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">{analysisProgress}% Completado</p>
                    </div>
                ) : result ? (
                    <div className="py-8 animate-fade-in pb-20">
                        {viewMode === 'dashboard' ? (
                            <ConsistencyDashboard result={result} />
                        ) : (
                            <div className="max-w-7xl mx-auto px-6">
                                <MatrixInteractive matrix={result.consistencyMatrix} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                        <span className="material-symbols-outlined text-9xl mb-6 opacity-20">grid_on</span>
                        <h3 className="text-2xl font-black uppercase tracking-[0.2em] opacity-40">Sin Análisis Generado</h3>
                        <p className="text-sm font-bold mt-2 opacity-60">Sube tu tesis y ejecuta el análisis forense para ver resultados.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ConsistencyMatrix;
