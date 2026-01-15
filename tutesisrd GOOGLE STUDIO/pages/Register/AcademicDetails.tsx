import React from 'react';
import { Link } from 'react-router-dom';

const AcademicDetails: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col transition-colors duration-200">
            <header className="bg-white dark:bg-[#101622] border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
                <div className="flex items-center gap-2 text-primary font-bold text-xl"><span className="material-symbols-outlined">school</span>TuTesisRD</div>
            </header>
            <main className="flex-1 max-w-4xl mx-auto w-full p-8 animate-slide-up">
                <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-primary font-bold">Paso 2 de 3</span>
                        <span className="text-slate-600 dark:text-slate-400">50% Completado</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-1/2 rounded-full shadow-[0_0_10px_theme('colors.primary')]"></div>
                    </div>
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Detalles Académicos</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white dark:bg-[#1a2230] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <label className="block font-bold mb-2 text-slate-900 dark:text-white">Facultad</label>
                            <select className="w-full p-3 rounded-lg border-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary outline-none">
                                <option>Facultad de Ingeniería y Arquitectura</option>
                                <option>Facultad de Ciencias de la Salud</option>
                                <option>Facultad de Ciencias Económicas</option>
                            </select>
                        </div>
                        <div className="bg-white dark:bg-[#1a2230] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Hitos Requeridos</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
                                    <input type="checkbox" className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary" checked readOnly/>
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Aprobación de Anteproyecto</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
                                    <input type="checkbox" className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"/>
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Carta de Asignación de Asesor</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
                                    <input type="checkbox" className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"/>
                                    <span className="text-sm text-slate-700 dark:text-slate-300">Certificado de Finalización de Materias</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl text-sm text-blue-800 dark:text-blue-200 border border-blue-100 dark:border-blue-800 sticky top-24">
                            <h4 className="font-bold flex items-center gap-2 mb-2"><span className="material-symbols-outlined text-lg">info</span> Reglamento</h4>
                            <p className="leading-relaxed">Según el Artículo 14 del reglamento estudiantil, debes tener al menos el 85% de los créditos aprobados para inscribir el proyecto final.</p>
                            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800/50 text-xs">
                                <a href="#" className="underline hover:text-blue-600 dark:hover:text-blue-100">Ver reglamento completo</a>
                            </div>
                        </div>
                    </div>
                </div>
                    <div className="mt-8 flex justify-between">
                        <Link to="/student/register" className="px-6 py-3 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors">Atrás</Link>
                        <Link to="/student/upload" className="px-8 py-3 bg-primary text-white rounded-lg font-bold shadow-lg hover:bg-primary-dark transition-all transform hover:-translate-y-1">Siguiente</Link>
                </div>
            </main>
        </div>
    );
};

export default AcademicDetails;