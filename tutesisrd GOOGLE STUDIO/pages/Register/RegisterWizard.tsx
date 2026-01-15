import React from 'react';
import { Link } from 'react-router-dom';

const RegisterWizard: React.FC = () => {
    return (
        <div className="flex h-screen w-full font-display bg-background-light dark:bg-background-dark text-slate-800 dark:text-white transition-colors duration-200">
            <aside className="hidden md:flex w-80 lg:w-96 flex-col bg-blue-900 relative overflow-hidden shrink-0 z-20 shadow-2xl p-8 justify-between">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-900"></div>
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 text-white mb-12">
                            <span className="material-symbols-outlined text-2xl">school</span>
                            <span className="font-bold text-xl">TuTesisRD</span>
                        </div>
                        <div className="space-y-6">
                        <div className="flex gap-4 items-center opacity-50 text-white relative step-connector">
                            <div className="size-10 rounded-full border border-white flex items-center justify-center font-bold">1</div>
                            <span className="font-medium">Datos Personales</span>
                        </div>
                            <div className="flex gap-4 items-center text-white font-bold relative step-connector">
                            <div className="size-10 rounded-full bg-white text-blue-900 flex items-center justify-center shadow-lg scale-110">2</div>
                            <span className="text-lg">Detalles Proyecto</span>
                        </div>
                            <div className="flex gap-4 items-center opacity-50 text-white last-step">
                            <div className="size-10 rounded-full border border-white flex items-center justify-center font-bold">3</div>
                            <span className="font-medium">Archivos</span>
                        </div>
                        </div>
                    </div>
                    <div className="text-white/60 text-sm relative z-10">© 2023 TuTesisRD</div>
            </aside>
            <main className="flex-1 overflow-y-auto p-8 lg:p-16 animate-fade-in">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">Cuéntanos sobre tu proyecto</h2>
                    <p className="text-slate-500 mb-8">Personaliza tu experiencia seleccionando los detalles clave.</p>
                    
                    <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Universidad</label>
                                <input type="text" className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" placeholder="Ej. UASD"/>
                            </div>
                            <div>
                                <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Normativa</label>
                                <select className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow">
                                    <option>Normas APA (7ma)</option>
                                    <option>IEEE</option>
                                    <option>Vancouver</option>
                                </select>
                            </div>
                            </div>
                            <div>
                            <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Tipo de Trabajo</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 border-2 border-primary bg-blue-50 dark:bg-primary/10 dark:border-primary rounded-xl cursor-pointer relative shadow-sm">
                                    <div className="absolute top-3 right-3 text-primary"><span className="material-symbols-outlined text-lg">check_circle</span></div>
                                    <div className="font-bold text-primary mb-1">Tesis de Grado</div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Investigación original y profunda.</p>
                                </div>
                                <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                    <div className="font-bold mb-1 text-slate-800 dark:text-white">Monográfico</div>
                                    <p className="text-xs text-slate-500">Estudio descriptivo.</p>
                                </div>
                            </div>
                            </div>
                    </div>
                    <div className="mt-12 flex justify-between">
                            <Link to="/" className="px-6 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium transition-colors">Atrás</Link>
                            <Link to="/student/details" className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:bg-primary-dark transition-all transform hover:-translate-y-1">Siguiente Paso</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RegisterWizard;