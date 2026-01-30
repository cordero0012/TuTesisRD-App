
import React, { useState, useEffect } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { useNotification } from '../contexts/NotificationContext';
import { detectAiContent, detectAiContentBatch, AiDetectionResult } from '../services/analysis/detection';
import { generateAuditPDF } from '../services/reports/auditReport';
import { mapAuditToWordExport } from '../services/export/mapper';
import { wordExportService } from '../services/wordExportService';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateText, GROQ_MODEL_FAST } from '../services/ai/client';

/**
 * AI Audit Lab - Ultra-Premium Version
 * Integrates forensics metrics, split-view editing, and statistical signature visualization.
 */
export const AiAudit = () => {
    const { project, uploadedFile, setUploadedFile } = useProject();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AiDetectionResult | null>(null);
    const [viewMode, setViewMode] = useState<'split' | 'audit'>('audit'); // Default to audit for landing page

    // New States for "Split Modes"
    const [auditMode, setAuditMode] = useState<'quick' | 'full'>('full'); // Default to full for better results
    const [progress, setProgress] = useState(0);
    const [progressStatus, setProgressStatus] = useState("");
    const [executiveSummary, setExecutiveSummary] = useState("");
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);

    // Sync with uploaded file or project content
    useEffect(() => {
        if (uploadedFile?.content) {
            const fileText = Array.isArray(uploadedFile.content)
                ? uploadedFile.content.map(p => p.text).join('\n\n')
                : uploadedFile.content;

            if (typeof fileText === 'string' && fileText !== text) {
                setText(fileText);
                if (fileText.length > 5000) setAuditMode('full');
            }
        } else if (project.content && !text) {
            setText(project.content);
            if (project.content.length > 5000) setAuditMode('full');
        }
    }, [uploadedFile, project.content]);

    const handleAnalyze = async () => {
        if (!text.trim()) return;

        // Validation for Quick Mode
        if (auditMode === 'quick' && text.length > 6000) {
            if (!confirm(`El texto excede el límite recomendado para Análisis Rápido (6000 caracteres). ¿Quieres cambiar a Auditoría Completa?`)) {
                return;
            } else {
                setAuditMode('full');
            }
        }

        setLoading(true);
        setResult(null);
        setProgress(0);
        setProgressStatus("Iniciando análisis forense...");

        try {
            let data: AiDetectionResult;

            if (auditMode === 'full') {
                // Batch Analysis with Progress
                data = await detectAiContentBatch(text, (prog, status) => {
                    setProgress(prog);
                    setProgressStatus(status);
                });
            } else {
                // Quick Single Analysis
                data = await detectAiContent(text);
            }

            setResult(data);
        } catch (e) {
            console.error("Analysis Error:", e);
            showNotification("Hubo un error al realizar el análisis. Por favor intenta nuevamente.", "error");
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };

    const handleGroqSummary = async () => {
        if (!text.trim()) return;
        setIsSummaryLoading(true);
        try {
            const summary = await generateText({
                prompt: `Genera un resumen ejecutivo de máximo 3 párrafos para el siguiente documento académico. Enfócate n los puntos clave, metodología y conclusiones principales. Texto:\n\n${text.substring(0, 30000)}`,
                systemInstruction: "Eres un asistente académico experto que resume tesis de forma clara y profesional.",
                provider: 'groq',
                model: GROQ_MODEL_FAST,
                temperature: 0.5
            });
            setExecutiveSummary(summary);
            showNotification("Resumen instantáneo generado con Groq", "success");
        } catch (e) {
            console.error("Groq Summary Error:", e);
            showNotification("Error al generar resumen con Groq", "error");
        } finally {
            setIsSummaryLoading(false);
        }
    };

    // Statistical Signature SVG Generator
    const renderStatisticalSignature = () => {
        if (!result || !result.metrics) return null;

        // Safety checks for metrics
        const burstiness = result.metrics.burstiness || 0;
        const perplexity = result.metrics.perplexityProxy || 0;

        // We'll map metrics to the graph
        // Burstiness -> Amplitude of lines
        const points = [];
        const factor = Math.min(burstiness, 10) / 2; // Cap burstiness to avoid huge spikes

        for (let i = 0; i <= 100; i += 5) {
            // Use safe values
            const y = 80 + Math.sin(i * 0.5) * factor + (Math.random() * Math.min(perplexity, 5) * 20);
            points.push(`${(i / 100) * 800},${y}`);
        }
        const d = `M 0,100 Q ${points.join(' ')}`;

        return (
            <svg className="absolute inset-0 w-full h-full z-10 overflow-visible" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="gradient-line" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#135bec" stopOpacity="0.3"></stop>
                        <stop offset="100%" stopColor="#135bec" stopOpacity="1"></stop>
                    </linearGradient>
                </defs>
                <path d={`${d} L 800 150 L 0 150 Z`} fill="url(#gradient-line)" opacity="0.1"></path>
                <path d={d} fill="none" stroke="#135bec" strokeWidth="3" vectorEffect="non-scaling-stroke"></path>
                <circle className="fill-white dark:fill-[#135bec] stroke-[#135bec] dark:stroke-white stroke-2" cx="95%" cy="80" r="6"></circle>
            </svg>
        );
    };

    return (
        <div className="flex h-[calc(100vh-64px)] w-full bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-white overflow-hidden">
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header Section */}
                <header className="h-20 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 bg-white dark:bg-slate-900 shrink-0 z-40">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">security</span>
                            Laboratorio de Auditoría Forense
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Análisis Estratégico de Texto y Verificación de Integridad Académica</p>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Mode Selector */}
                        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center">
                            <button
                                onClick={() => setAuditMode('quick')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${auditMode === 'quick' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                Análisis Rápido
                            </button>
                            <button
                                onClick={() => setAuditMode('full')}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${auditMode === 'full' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                Auditoría Completa
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".pdf,.docx,.txt"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setLoading(true);
                                        setProgress(0);
                                        setProgressStatus("Iniciando lectura...");

                                        // Auto-switch to full mode for uploaded files
                                        setAuditMode('full');

                                        try {
                                            let content = '';

                                            if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
                                                const arrayBuffer = await file.arrayBuffer();
                                                const pdfjsLib = await import('pdfjs-dist');
                                                // Ensure worker is loaded - simplified for Vite
                                                // @ts-ignore
                                                if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
                                                    // @ts-ignore
                                                    const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
                                                    // @ts-ignore
                                                    pdfjsLib.GlobalWorkerOptions.workerSrc = worker.default;
                                                }

                                                try {
                                                    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                                                    const totalPages = pdf.numPages;

                                                    if (totalPages > 150) {
                                                        if (!confirm(`Este documento tiene ${totalPages} páginas. ¿Deseas procesarlo por completo?`)) {
                                                            setLoading(false);
                                                            return;
                                                        }
                                                    }

                                                    for (let i = 1; i <= totalPages; i++) {
                                                        const pageProgress = Math.round((i / totalPages) * 100);
                                                        setProgress(pageProgress);
                                                        setProgressStatus(`Extrayendo texto: página ${i} de ${totalPages}...`);

                                                        const page = await pdf.getPage(i);
                                                        const textContent = await page.getTextContent();
                                                        let lastY = -1;
                                                        let pageText = "";

                                                        // @ts-ignore
                                                        for (const item of textContent.items) {
                                                            // @ts-ignore
                                                            if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 5) {
                                                                pageText += "\n";
                                                            }
                                                            // @ts-ignore
                                                            pageText += item.str;
                                                            // @ts-ignore
                                                            lastY = item.transform[5];
                                                        }
                                                        content += pageText + '\n\n';
                                                    }
                                                } catch (pdfErr) {
                                                    console.error("PDF Parsing error:", pdfErr);
                                                    throw new Error("No se pudo extraer el texto del PDF.");
                                                }
                                            } else if (file.name.toLowerCase().endsWith('.docx')) {
                                                setProgressStatus("Procesando Word...");
                                                const arrayBuffer = await file.arrayBuffer();
                                                // Import mammoth dynamically
                                                const mammoth = await import('mammoth');
                                                const result = await mammoth.extractRawText({ arrayBuffer });
                                                content = result.value;
                                            } else {
                                                setProgressStatus("Leyendo archivo de texto...");
                                                content = await new Promise((resolve) => {
                                                    const reader = new FileReader();
                                                    reader.onload = (e) => resolve(e.target?.result as string || '');
                                                    reader.readAsText(file);
                                                });
                                            }

                                            if (content.trim()) {
                                                setUploadedFile({
                                                    name: file.name,
                                                    type: file.type,
                                                    size: file.size,
                                                    content: content,
                                                    lastModified: file.lastModified
                                                });
                                                setText(content);
                                                showNotification("Documento cargado correctamente", "success");
                                            } else {
                                                showNotification("No se detectó texto en el documento", "warning");
                                            }
                                        } catch (err) {
                                            console.error("Upload error:", err);
                                            showNotification("Error al procesar el archivo", "error");
                                        } finally {
                                            setLoading(false);
                                            setProgress(0);
                                            if (e.target) e.target.value = '';
                                        }
                                    }}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                                    <span className="material-symbols-outlined text-[18px]">upload_file</span>
                                    Cargar Doc
                                </button>
                            </div>
                            <button
                                onClick={() => {
                                    setText('');
                                    setUploadedFile(null);
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                            >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                Limpiar
                            </button>
                            <button
                                onClick={handleGroqSummary}
                                disabled={isSummaryLoading || !text.trim()}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-bold hover:bg-primary/5 transition-all"
                            >
                                <span className="material-symbols-outlined text-[18px]">{isSummaryLoading ? 'bolt' : 'speed'}</span>
                                {isSummaryLoading ? 'Resumiendo...' : 'Resumen Groq'}
                            </button>
                            <button
                                onClick={handleAnalyze}
                                disabled={loading || !text.trim()}
                                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-600 shadow-lg shadow-primary/20 disabled:opacity-50 transition-all"
                            >
                                <span className="material-symbols-outlined text-[18px] text-white">{loading ? 'hourglass_empty' : 'troubleshoot'}</span>
                                {loading ? 'Analizando...' : 'Ejecutar Auditoría'}
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left Sidebar: Metrics */}
                    <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-y-auto p-6 flex flex-col gap-8 shrink-0">
                        {/* Human/AI Probability Score */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Matriz de Probabilidad</h3>
                            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="relative size-20 shrink-0">
                                    <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                        <path className="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"></path>
                                        <path
                                            className={`${result ? (result.score > 0.6 ? 'text-red-500' : result.score > 0.3 ? 'text-amber-500' : 'text-emerald-500') : 'text-slate-300'} transition-all duration-1000 ease-out`}
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none" stroke="currentColor"
                                            strokeDasharray={`${result ? result.score * 100 : 0}, 100`}
                                            strokeWidth="3.5"
                                            strokeLinecap="round"
                                        ></path>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <span className="text-lg font-black text-slate-900 dark:text-white">{result ? (result.score * 100).toFixed(0) : '0'}%</span>
                                    </div>
                                </div>
                                <div className="z-10">
                                    <p className="text-xs font-bold text-slate-500 uppercase">Probabilidad de IA</p>
                                    {result && (
                                        <div className="mt-2 flex items-center gap-1.5">
                                            <div className={`h-2 w-2 rounded-full ${result.score > 0.4 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}></div>
                                            <span className={`text-[11px] font-black uppercase ${result.score > 0.4 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                {result.score > 0.6 ? 'Riesgo Alto' : result.score > 0.3 ? 'Riesgo Medio' : 'Seguro'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Engines / Indicators */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Indicadores Forenses</h3>
                            <div className="space-y-3">
                                <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">Origen del Análisis</span>
                                    </div>
                                    <div className="space-y-3 mt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-medium text-slate-500">Patrones ChatGPT</span>
                                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{result?.sourceProbabilities?.chatgpt || 0}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1 overflow-hidden">
                                            <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${result?.sourceProbabilities?.chatgpt || 0}%` }}></div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-medium text-slate-500">Patrones Gemini</span>
                                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{result?.sourceProbabilities?.gemini || 0}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1 overflow-hidden">
                                            <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${result?.sourceProbabilities?.gemini || 0}%` }}></div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-medium text-slate-500">Patrones Claude</span>
                                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{result?.sourceProbabilities?.claude || 0}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1 overflow-hidden">
                                            <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${result?.sourceProbabilities?.claude || 0}%` }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">Ráfagas (Burstiness)</span>
                                        <span className="text-xs font-mono font-bold text-primary">{result?.metrics.burstiness.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${Math.min((result?.metrics.burstiness || 0) * 10, 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Signaling */}
                        {result && (
                            <div className="flex flex-col gap-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Señales Detectadas</h3>
                                <div className="space-y-2">
                                    {result.signals.map((sig, i) => (
                                        <div key={i} className="flex gap-3 p-3 bg-red-50 dark:bg-red-500/5 rounded-xl border border-red-100 dark:border-red-500/10 text-[11px] text-red-700 dark:text-red-400 font-medium leading-tight">
                                            <span className="material-symbols-outlined text-sm shrink-0">warning</span>
                                            {sig}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Groq Executive Summary Section */}
                        {executiveSummary && (
                            <div className="flex flex-col gap-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Resumen Instantáneo (Groq)</h3>
                                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed relative group">
                                    <button
                                        onClick={() => setExecutiveSummary("")}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
                                    >
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                    {executiveSummary}
                                </div>
                            </div>
                        )}
                    </aside>

                    {/* Main Workspace */}
                    <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900">

                        {/* Progress Overlay */}
                        {loading && auditMode === 'full' && (
                            <div className="absolute inset-0 z-[60] bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-8">
                                <div className="w-full max-w-md space-y-4">
                                    <div className="flex justify-between items-end">
                                        <h3 className="text-lg font-black uppercase text-slate-900 dark:text-white">Procesando Documento</h3>
                                        <span className="text-sm font-bold text-primary">{progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden shadow-inner">
                                        <div
                                            className="bg-primary h-full transition-all duration-300 ease-out"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">{progressStatus}</p>
                                    <div className="grid grid-cols-4 gap-2 mt-8 opacity-50">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className={`h-1 bg-primary rounded-full animate-pulse`} style={{ animationDelay: `${i * 0.1}s` }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Statistical Signature Graph Area */}
                        <div className="h-48 border-b border-slate-200 dark:border-slate-800 p-8 flex flex-col gap-4 relative overflow-hidden bg-slate-50/50 dark:bg-slate-950">
                            <div className="flex justify-between items-start z-10">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-widest">
                                        <span className="material-symbols-outlined text-primary text-lg">monitoring</span>
                                        Firma Lingüística
                                    </h3>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Distribución Estática vs Aleatoria</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Perplejidad</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Ráfagas</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 w-full relative">
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="w-full h-px bg-slate-300 dark:bg-slate-700"></div>
                                    ))}
                                </div>
                                {result ? renderStatisticalSignature() : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="text-xs font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest italic animate-pulse">Esperando datos del análisis...</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Editor Section */}
                        <div className="flex-1 flex flex-col min-h-0">
                            {/* Toolbar */}
                            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <button
                                        onClick={() => setViewMode('split')}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'split' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
                                    >
                                        Vista Dividida
                                    </button>
                                    <button
                                        onClick={() => setViewMode('audit')}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'audit' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
                                    >
                                        Mapa de Auditoría
                                    </button>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{text.trim().split(/\s+/).length} Palabras</span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(text);
                                        }}
                                        className="text-[10px] font-black text-primary hover:text-blue-400 flex items-center gap-1 uppercase tracking-widest transition-all"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                        Copiar Texto
                                    </button>
                                </div>
                            </div>

                            {/* Text Area */}
                            <div className="flex-1 flex min-h-0 font-sans">
                                {viewMode === 'split' ? (
                                    <>
                                        {/* Input area */}
                                        <div className="flex-1 flex flex-col border-r border-slate-200 dark:border-slate-800 min-w-0 group">
                                            <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Fuente Original</span>
                                                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors text-[18px]">terminal</span>
                                            </div>
                                            <textarea
                                                className="flex-1 w-full bg-slate-50 dark:bg-slate-950 p-8 resize-none focus:outline-none text-slate-700 dark:text-slate-300 leading-relaxed overflow-y-auto font-sans text-base"
                                                value={text}
                                                onChange={(e) => setText(e.target.value)}
                                                placeholder={auditMode === 'quick' ? "Pega un párrafo corto para análisis rápido (Máx 5000 carácteres)..." : "Carga un documento completo pare el escaneo profundo..."}
                                            />
                                        </div>
                                        {/* Result preview */}
                                        <div className="flex-1 flex flex-col min-w-0">
                                            <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Visualizador de Auditoría</span>
                                                {result && (
                                                    <span className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded border ${result.score < 0.3 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                                        <span className="material-symbols-outlined text-[14px]">
                                                            {result.score < 0.3 ? 'verified_user' : 'dangerous'}
                                                        </span>
                                                        {result.score < 0.3 ? 'AUTÉNTICO' : 'PATRÓN DE IA'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1 bg-white dark:bg-slate-900 p-8 overflow-y-auto text-slate-800 dark:text-slate-200 leading-relaxed">
                                                {result ? (
                                                    <div className="space-y-4">
                                                        {result.heatmap.map((seg, i) => (
                                                            <span
                                                                key={i}
                                                                className={`inline rounded px-1 transition-all duration-300 cursor-help ${seg.probability > 0.7 ? 'bg-red-500/20 text-red-900 dark:text-red-200 border-b-2 border-red-500' :
                                                                    seg.probability > 0.4 ? 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border-b-2 border-amber-500' :
                                                                        'hover:bg-emerald-500/10 transition-colors'
                                                                    }`}
                                                                title={`Riesgo Local: ${(seg.probability * 100).toFixed(0)}%`}
                                                            >
                                                                {seg.text}{' '}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="h-full flex flex-col items-center justify-center opacity-30 select-none">
                                                        <span className="material-symbols-outlined text-[64px] mb-4">analytics</span>
                                                        <p className="text-sm font-black uppercase tracking-widest">Esperando escaneo forense...</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 bg-white dark:bg-slate-900 p-12 overflow-y-auto">
                                        <div className="max-w-4xl mx-auto space-y-8">
                                            <h3 className="text-center text-xs font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 mb-12">Mapa de Auditoría Completa</h3>
                                            {result ? (
                                                <div className="grid grid-cols-1 gap-6">
                                                    {result.heatmap.map((seg, i) => (
                                                        <div key={i} className={`p-6 rounded-2xl border transition-all pointer-default ${seg.probability > 0.7 ? 'bg-red-50 dark:bg-red-500/5 border-red-100 dark:border-red-500/10' :
                                                            seg.probability > 0.4 ? 'bg-amber-50 dark:bg-amber-500/5 border-amber-100 dark:border-amber-500/10' :
                                                                'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5'
                                                            }`}>
                                                            <div className="flex justify-between items-center mb-3">
                                                                <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">Sección {i + 1}</span>
                                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${seg.probability > 0.7 ? 'bg-red-500 text-white' :
                                                                    seg.probability > 0.4 ? 'bg-amber-500 text-white' :
                                                                        'bg-emerald-500 text-white'
                                                                    }`}>
                                                                    {(seg.probability * 100).toFixed(0)}% Huella de IA
                                                                </span>
                                                            </div>
                                                            <p className="text-lg leading-relaxed text-slate-800 dark:text-slate-200">{seg.text}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="mt-20 flex flex-col items-center justify-center opacity-20">
                                                    <span className="material-symbols-outlined text-[120px] mb-8">microscope</span>
                                                    <p className="text-xl font-black uppercase tracking-widest animate-pulse">Escaneo Incompleto</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Footer */}
                        <footer className="h-12 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-8 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <span className="material-symbols-outlined text-base text-emerald-500">check_circle</span>
                                    Sistema Operativo
                                </span>
                                <span className="h-4 w-px bg-slate-200 dark:bg-slate-800"></span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Gemini-Pro Forensics v1.0</span>
                            </div>
                            <div className="flex gap-6 items-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Sin política de retención activa (Los textos no se guardan)</p>
                            </div>
                        </footer>
                    </div>
                </div>

                {/* Floating Export Button (Visible when result exists) */}
                {result && (
                    <div className="absolute bottom-8 right-8 z-50">
                        <button
                            onClick={async () => {
                                try {
                                    await generateAuditPDF(result, "Analisis_Texto");
                                    showNotification("Reporte PDF descargado", "success");
                                } catch (e) {
                                    showNotification("Error al generar PDF", "error");
                                }
                            }}
                            className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all text-sm font-bold animate-bounce-in"
                        >
                            <span className="material-symbols-outlined">picture_as_pdf</span>
                            Exportar PDF
                        </button>

                        <button
                            onClick={async () => {
                                try {
                                    const dto = mapAuditToWordExport(result);
                                    await wordExportService.generateWordDocument(dto, 'Auditoria_IA.docx');
                                    showNotification("Documento Word generado correctamente", "success");
                                } catch (e) {
                                    console.error("Word export error:", e);
                                    showNotification("Error exportando a Word", "error");
                                }
                            }}
                            className="flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all text-sm font-bold animate-bounce-in ml-4"
                        >
                            <span className="material-symbols-outlined">description</span>
                            Exportar Word
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};
