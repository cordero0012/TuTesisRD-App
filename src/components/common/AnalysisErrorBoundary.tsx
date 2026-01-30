import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onReset?: () => void;
    componentName?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class AnalysisErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`[ErrorBoundary] Error in ${this.props.componentName || 'Unknown Component'}:`, error, errorInfo);
        // Here we could log to a telemetry service
    }

    public resetErrorBoundary = () => {
        this.props.onReset?.();
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
                        <span className="material-symbols-outlined text-3xl">monitor_heart</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">
                        Algo salió mal al mostrar el análisis
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 max-w-md">
                        Ocurrió un error inesperado al renderizar los resultados. Esto puede deberse a datos incompletos o un formato inesperado de la IA.
                    </p>

                    {(this.state.error && import.meta.env.DEV) && (
                        <div className="w-full max-w-lg mb-6 text-left">
                            <details className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-500 overflow-x-auto">
                                <summary className="cursor-pointer font-bold mb-1 hover:text-red-500">Ver detalles técnicos</summary>
                                <pre className="mt-2 whitespace-pre-wrap">{this.state.error.message}</pre>
                            </details>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            Recargar Página
                        </button>
                        <button
                            onClick={this.resetErrorBoundary}
                            className="px-6 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/30 transition-all hover:scale-105"
                        >
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined">refresh</span>
                                Reintentar Renderizado
                            </span>
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
