import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface RegisterMonitorProps {
    onSearch: (trackingCode: string) => void;
    searchResult: any; // Type needs to be defined properly in a real scenario
}

export const RegisterMonitor: React.FC<RegisterMonitorProps> = ({ onSearch, searchResult }) => {
    const [trackingCode, setTrackingCode] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(trackingCode);
    };

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-2xl md:text-3xl font-black mb-2 text-slate-900 dark:text-white">Rastrea tu Proyecto</h2>
            <p className="text-slate-500 mb-8">Ingresa el código proporcionado al momento del registro.</p>

            <form onSubmit={handleSubmit} className="mb-10">
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        value={trackingCode}
                        onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                        className="flex-1 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none uppercase tracking-widest font-bold placeholder:normal-case placeholder:tracking-normal w-full"
                        placeholder="Ej. TRX-8492"
                    />
                    <button
                        type="submit"
                        className="bg-brand-orange text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 w-full md:w-auto"
                    >
                        Buscar
                    </button>
                </div>
            </form>

            {searchResult && (
                <div className="bg-white dark:bg-[#1a2230] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl animate-fade-in mb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold mb-2">
                                {searchResult.status}
                            </span>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-2">Tesis: {searchResult.university}</h3>
                            <p className="text-sm text-slate-500">{searchResult.type}</p>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                            <div className="text-xs text-slate-400">Última actualización</div>
                            <div className="font-medium text-slate-700 dark:text-slate-300">{searchResult.lastUpdate}</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-bold text-slate-700 dark:text-slate-300">Progreso General</span>
                                <span className="text-brand-orange font-bold">{searchResult.progress}%</span>
                            </div>
                            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-orange rounded-full" style={{ width: `${searchResult.progress}%` }}></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                <div className="text-xs text-slate-400 mb-1">Asesor Asignado</div>
                                <div className="font-bold text-slate-800 dark:text-white truncate">{searchResult.advisor}</div>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                <div className="text-xs text-slate-400 mb-1">Próxima Entrega</div>
                                <div className="font-bold text-slate-800 dark:text-white truncate">Capítulo 1</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Back Button for Monitor Mode */}
            <div className="text-center">
                <Link to="/" className="inline-flex items-center text-slate-500 hover:text-brand-orange font-medium transition-colors">
                    <span className="material-icons mr-2">arrow_back</span> Volver al inicio
                </Link>
            </div>
        </div>
    );
};
