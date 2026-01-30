import React, { useState, useEffect, useMemo } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { useNotification } from '../contexts/NotificationContext';
import { analyzeConsistencyStrict } from '../services/consistency/strictAnalyzer';
import { ConsistencyAnalysisResult } from '../services/consistency/matrixAnalyzer';
import { ConsistencyAnalysisResults } from '../components/consistency/ConsistencyAnalysisResults';
import { ConsistencyDashboard } from '../components/consistency/ConsistencyDashboard';
import { MatrixInteractive } from '../components/consistency/MatrixInteractive';
import { AnalysisErrorBoundary } from '../components/common/AnalysisErrorBoundary';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';
import universitiesData from '../data/universities.json';
import { AuthButton } from '../components/common/AuthButton';

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
    const [academicLevel, setAcademicLevel] = useState<'Grado' | 'Maestría' | 'Doctorado'>('Grado');

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

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    useEffect(() => {
        import('../services/persistenceService').then(({ persistenceService }) => {
            const unsub = persistenceService.subscribe(setSaveStatus);
            return unsub;
        });
    }, []);

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
                academicLevel,
                selectedRegulation?.deepAnalysis
            );

            clearInterval(progressInterval);
            setAnalysisProgress(100);
            setResult(analysis);

            // Persist to Supabase
            if (project.id && project.id !== 'offline-demo') {
                import('../services/persistenceService').then(({ persistenceService }) => {
                    persistenceService.saveAnalysis(project.id, 'consistency', analysis);
                });
            }

            showNotification("Análisis de consistencia completado", "success");
        } catch (error) {
            console.error('Analysis error:', error);
            const errorMessage = error instanceof Error ? error.message : "Error desconocido";
            showNotification(`Error: ${errorMessage}`, "error");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 font-sans text-slate-700 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Hidden File Input */}
            <input
                type="file"
                className="hidden"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                id="hidden-file-upload"
            />

            {/* BEGIN: Main Dashboard Container */}
            <div className="w-full max-w-[1600px] h-[90vh] min-h-[700px] rounded-[2.5rem] flex overflow-hidden relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-2xl border border-white/50 dark:border-slate-800/50">

                {/* BEGIN: Sidebar */}
                <aside className="w-20 lg:w-64 flex flex-col p-6 border-r border-slate-200/50 dark:border-slate-700/50 hidden md:flex z-10 bg-white/50 dark:bg-slate-900/50">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 mb-10 pl-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-brand-orange/20">
                            <span className="material-symbols-outlined text-xl">school</span>
                        </div>
                        <span className="text-lg font-black tracking-tight text-slate-800 dark:text-white hidden lg:block">TuTesisRD</span>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 space-y-2">
                        <a className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-orange/10 text-brand-orange font-bold shadow-sm transition-all" href="#">
                            <span className="material-symbols-outlined">grid_view</span>
                            <span className="hidden lg:block">Matriz</span>
                        </a>
                        {/* Disabled/Hidden Links as per request */}
                        <div className="opacity-40 pointer-events-none hidden lg:block">
                            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mt-6 mb-2">Próximamente</p>
                            <div className="flex items-center gap-3 px-4 py-3 text-slate-500">
                                <span className="material-symbols-outlined">folder</span>
                                <span>Mis Proyectos</span>
                            </div>
                        </div>
                    </nav>

                    {/* Bottom Settings */}
                    <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
                        <div className="flex items-center gap-3 px-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer">
                            <span className="material-symbols-outlined">settings</span>
                            <span className="text-sm font-medium hidden lg:block">Configuración</span>
                        </div>
                    </div>
                </aside>

                {/* BEGIN: Main Content Area */}
                <main className="flex-1 flex flex-col p-4 md:p-8 relative overflow-hidden">

                    {/* Header Section */}
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0">
                        <div>
                            <h1 className="text-3xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                                Matriz de Consistencia
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                {uploadedFile
                                    ? `Archivo: ${uploadedFile.name}`
                                    : project.content
                                        ? `Analizando: ${project.title || 'Proyecto Actual'}`
                                        : 'Auditoría Forense con IA'
                                }
                            </p>
                        </div>

                        {/* View Toggles & Export Actions */}
                        <div className="flex items-center gap-4">
                            <div className="mr-4">
                                <AuthButton />
                            </div>

                            {result && (
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                    <button
                                        onClick={() => setViewMode('dashboard')}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'dashboard'
                                            ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                                            }`}
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        onClick={() => setViewMode('matrix')}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'matrix'
                                            ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                                            }`}
                                    >
                                        Matriz
                                    </button>
                                </div>
                            )}

                            {result && (
                                <button
                                    onClick={async () => {
                                        try {
                                            const { generateConsistencyMatrixPDF } = await import('../services/pdfExport');
                                            generateConsistencyMatrixPDF(result, 'Informe_Consistencia_ScholarAI');
                                            showNotification("Informe PDF generado", "success");
                                        } catch (err) {
                                            showNotification("Error al generar PDF", "error");
                                        }
                                    }}
                                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                                >
                                    <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                                    PDF
                                </button>
                            )}
                            <div className="flex items-center gap-2">
                                {saveStatus === 'saving' && (
                                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1 animate-pulse">
                                        <span className="material-symbols-outlined text-sm">cloud_upload</span> Guardando...
                                    </span>
                                )}
                                {saveStatus === 'saved' && (
                                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 animate-fade-in">
                                        <span className="material-symbols-outlined text-sm">cloud_done</span> Guardado
                                    </span>
                                )}
                                {saveStatus === 'error' && (
                                    <span className="text-xs font-bold text-red-400 flex items-center gap-1" title="Reintentando...">
                                        <span className="material-symbols-outlined text-sm">cloud_off</span> Error
                                    </span>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Dashboard Body */}
                    <div className="flex-1 flex flex-col xl:flex-row gap-6 h-full overflow-hidden">

                        {/* Central Card Area */}
                        <section className="flex-1 bg-white/60 dark:bg-slate-800/60 rounded-[2rem] border border-white/60 dark:border-slate-700/60 backdrop-blur-xl shadow-sm flex flex-col relative overflow-hidden">

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
                                {isAnalyzing ? (
                                    <div className="h-full flex flex-col items-center justify-center animate-in fade-in duration-700">
                                        <div className="relative mb-8">
                                            <div className="size-24 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-brand-orange animate-spin"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-4xl text-brand-orange animate-pulse">neurology</span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-black uppercase tracking-tight text-slate-800 dark:text-white mb-2">Analizando Estructura Profunda</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md text-center mb-8">
                                            Evaluando coherencia metodológica y normativa...
                                        </p>
                                        <div className="w-64 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-orange transition-all duration-300" style={{ width: `${analysisProgress}%` }}></div>
                                        </div>
                                    </div>
                                ) : result ? (
                                    <div className="animate-fade-in pb-10">
                                        <AnalysisErrorBoundary componentName="Consistency Display" onReset={() => setViewMode('dashboard')}>
                                            {viewMode === 'dashboard' ? (
                                                <ConsistencyDashboard result={result} />
                                            ) : (
                                                <MatrixInteractive matrix={result.consistencyMatrix || []} />
                                            )}
                                        </AnalysisErrorBoundary>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center">
                                        <div className="mb-8 w-48 md:w-64 opacity-80 mix-blend-multiply dark:mix-blend-normal">
                                            <span className="material-symbols-outlined text-9xl text-slate-200 dark:text-slate-700">grid_on</span>
                                        </div>
                                        <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wide mb-2 opacity-60">
                                            No Matrix Generated
                                        </h2>
                                        <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm leading-relaxed">
                                            Carga tu tesis y espera a que nuestros agentes forenses generen tu reporte de consistencia.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Right Action Column */}
                        <section className="flex flex-col gap-4 w-full xl:w-80 shrink-0">

                            {/* Upload Button */}
                            <button
                                onClick={() => document.getElementById('hidden-file-upload')?.click()}
                                className={`w-full py-6 px-6 rounded-[2rem] font-bold transition-all hover:shadow-xl border-2 border-dashed group text-left relative overflow-hidden
                                    ${uploadedFile
                                        ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500 hover:border-emerald-600'
                                        : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-brand-orange dark:hover:border-brand-orange'
                                    }
                                `}
                            >
                                <div className="relative z-10 flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors
                                        ${uploadedFile
                                            ? 'bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-300'
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-brand-orange/10 group-hover:text-brand-orange'
                                        }
                                    `}>
                                        <span className="material-symbols-outlined">
                                            {uploadedFile ? 'check_circle' : 'upload_file'}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className={`block text-sm font-bold truncate ${uploadedFile ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>
                                            {uploadedFile ? uploadedFile.name : 'Cargar Documento'}
                                        </span>
                                        <span className={`block text-xs font-normal truncate ${uploadedFile ? 'text-emerald-600/70 dark:text-emerald-400/70' : 'text-slate-400'}`}>
                                            {uploadedFile ? 'Clic para cambiar archivo' : 'PDF o DOCX'}
                                        </span>
                                    </div>
                                </div>
                            </button>

                            {/* Academic Level Selector */}
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">
                                    Nivel Académico
                                </label>
                                <div className="grid grid-cols-1 gap-2">
                                    {(['Grado', 'Maestría', 'Doctorado'] as const).map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setAcademicLevel(level)}
                                            className={`px-4 py-3 rounded-xl text-sm font-bold border-2 transition-all text-left flex items-center justify-between ${academicLevel === level
                                                ? 'border-brand-orange bg-brand-orange/5 text-brand-orange'
                                                : 'border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-200'
                                                }`}
                                        >
                                            {level}
                                            {academicLevel === level && (
                                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-3 text-[10px] text-slate-400 leading-tight px-1">
                                    * Ajusta la severidad de detección y pesos de evaluación según el rigor del nivel.
                                </p>
                            </div>

                            {/* Analyze Button */}
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || (!uploadedFile && !project.content)}
                                className={`
                                    w-full py-6 px-6 rounded-[2rem] font-bold text-left transition-all relative overflow-hidden shadow-xl
                                    ${isAnalyzing || (!uploadedFile && !project.content)
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
                                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-brand-orange/20'
                                    }
                                `}
                            >
                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white/20 dark:bg-slate-200/20 flex items-center justify-center backdrop-blur-sm">
                                            {isAnalyzing ? (
                                                <span className="material-symbols-outlined animate-spin">sync</span>
                                            ) : (
                                                <span className="material-symbols-outlined">neurology</span>
                                            )}
                                        </div>
                                        <div>
                                            <span className="block text-lg">Ejecutar Análisis</span>
                                            <span className="block text-white/60 dark:text-slate-500 text-xs font-normal">
                                                {isAnalyzing ? 'Procesando...' : 'Modo Forense Activo'}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </div>
                                {isAnalyzing && (
                                    <div className="absolute inset-0 bg-brand-orange/20" style={{ width: `${analysisProgress}%`, transition: 'width 0.5s ease' }}></div>
                                )}
                            </button>

                            {/* Info Card / Extra Actions */}
                            <div className="mt-auto bg-slate-100 dark:bg-slate-800 p-6 rounded-[2rem] hidden xl:block">
                                <h4 className="font-bold text-slate-800 dark:text-white mb-2 text-sm">¿Cómo funciona?</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                                        <span className="text-brand-orange">•</span>
                                        <span>Sube tu borrador de tesis o anteproyecto.</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                                        <span className="text-brand-orange">•</span>
                                        <span>Nuestra IA audita la coherencia lógica interna.</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                                        <span className="text-brand-orange">•</span>
                                        <span>Recibe un reporte de consistencia detallado.</span>
                                    </li>
                                </ul>
                            </div>

                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ConsistencyMatrix;
