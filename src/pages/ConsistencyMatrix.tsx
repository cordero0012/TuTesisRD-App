import React, { useState, useEffect, useMemo } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { useNotification } from '../contexts/NotificationContext';
import { analyzeConsistencyStrict } from '../services/consistency/strictAnalyzer';
import { ConsistencyAnalysisResult } from '../services/consistency/matrixAnalyzer';
import { ConsistencyAnalysisResults } from '../components/consistency/ConsistencyAnalysisResults';
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
    const { project } = useProject();
    const { showNotification } = useNotification();

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [result, setResult] = useState<ConsistencyAnalysisResult | null>(null);

    const [selectedRegulationId, setSelectedRegulationId] = useState<string>('');

    // Document upload state
    const [uploadedContent, setUploadedContent] = useState<string | { page: number; text: string }[]>('');
    const [uploadedFileName, setUploadedFileName] = useState<string>('');
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
        setUploadedFileName(file.name);

        try {
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

                setUploadedContent(pages);
                const totalChars = pages.reduce((acc, p) => acc + p.text.length, 0);
                showNotification(`PDF cargado: ${file.name} (${totalChars} caracteres, ${pages.length} págs)`, "success");
            }
            // For DOCX files
            else if (file.name.endsWith('.docx')) {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                setUploadedContent(result.value.trim());
                showNotification(`DOCX cargado: ${file.name} (${result.value.length} caracteres)`, "success");
            }
        } catch (error) {
            console.error('File parsing error:', error);
            showNotification("Error al procesar el archivo", "error");
        } finally {
            setIsUploading(false);
            event.target.value = '';
        }
    };

    const handleAnalyze = async () => {
        const contentToAnalyze = uploadedContent || project.content;

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
                    <div className="flex items-center gap-3 bg-white dark:bg-surface-dark px-4 py-2 rounded-xl border border-slate-200 dark:border-surface-border">
                        <span className="material-symbols-outlined text-primary text-sm">account_balance</span>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Normativa</span>
                            <select
                                value={selectedRegulationId}
                                onChange={(e) => setSelectedRegulationId(e.target.value)}
                                className="text-xs font-bold text-slate-900 dark:text-white bg-transparent border-none outline-none cursor-pointer min-w-[150px]"
                                disabled={availableRegulations.length === 0}
                            >
                                <option value="">{availableRegulations.length === 0 ? "No hay guías cargadas" : "Sin normativa específica"}</option>
                                {availableRegulations.map(reg => (
                                    <option key={reg.id} value={reg.id}>{reg.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Deep Scan Toggle */}
                    <div
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all ${useDeepScan ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800' : 'bg-white border-slate-200 dark:bg-surface-dark dark:border-surface-border'}`}
                        onClick={() => setUseDeepScan(!useDeepScan)}
                        title="Habilita OCR avanzado para documentos escaneados (Beta)"
                    >
                        <span className={`material-symbols-outlined text-sm ${useDeepScan ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
                            {useDeepScan ? 'view_comfy_alt' : 'crop_free'}
                        </span>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Deep Scan</span>
                            <span className={`text-[10px] font-bold ${useDeepScan ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>
                                {useDeepScan ? 'Activado' : 'Desactivado'}
                            </span>
                        </div>
                    </div>

                    {/* Document Upload Button */}
                    <div className="relative">
                        <input
                            type="file"
                            accept=".pdf,.docx,.doc"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            id="doc-upload"
                        />
                        <label
                            htmlFor="doc-upload"
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed font-bold text-sm transition-all cursor-pointer ${isUploading
                                ? 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 cursor-wait'
                                : uploadedContent
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                    : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary'
                                }`}
                        >
                            {isUploading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                                    <span>Procesando...</span>
                                </>
                            ) : uploadedContent ? (
                                <>
                                    <span className="material-symbols-outlined text-base">check_circle</span>
                                    <span className="max-w-[150px] truncate">{uploadedFileName}</span>
                                    <span className="text-[9px] opacity-60">
                                        ({Array.isArray(uploadedContent) ? uploadedContent.length + ' págs' : uploadedContent.length + ' chars'})
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-base">upload_file</span>
                                    <span>Subir Tesis</span>
                                </>
                            )}
                        </label>
                    </div>

                    {uploadedContent && (
                        <button
                            onClick={() => {
                                setUploadedContent('');
                                setUploadedFileName('');
                                showNotification("Documento eliminado", "info");
                            }}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-all"
                            title="Eliminar documento"
                        >
                            <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                    )}

                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || (!uploadedContent && !project.content)}
                        className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAnalyzing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Analizando...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">analytics</span>
                                Ejecutar Análisis
                            </>
                        )}
                    </button>

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
                            className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-slate-700 transition-all active:scale-95 ml-4"
                        >
                            <span className="material-symbols-outlined">picture_as_pdf</span>
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

            <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar relative z-10">
                {isAnalyzing ? (
                    <div className="h-full flex flex-col items-center justify-center animate-in fade-in duration-700">
                        <div className="relative mb-8">
                            <div className="size-24 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-primary animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-primary animate-pulse">neurology</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight text-slate-800 dark:text-white mb-2">Analizando Estructura Profunda</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md text-center mb-8">
                            Nuestros agentes están evaluando la coherencia metodológica, normativa y argumentativa de tu tesis.
                        </p>
                        <div className="w-64 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary animate-progress" style={{ width: `${analysisProgress}%` }}></div>
                        </div>
                        <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">{analysisProgress}% Completado</p>
                    </div>
                ) : result ? (
                    <ConsistencyAnalysisResults result={result} />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-6 opacity-20 select-none">
                        <span className="material-symbols-outlined text-[120px]">grid_on</span>
                        <div className="text-center">
                            <h3 className="text-xl font-black uppercase tracking-[0.2em] mb-2">No Matrix Generated</h3>
                            <p className="text-xs font-bold uppercase tracking-widest">Click "Ejecutar Análisis" to evaluate your document</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConsistencyMatrix;
