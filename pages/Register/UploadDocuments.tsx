import React from 'react';
import { Link } from 'react-router-dom';

const UploadDocuments: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display transition-colors duration-200">
            <header className="bg-white dark:bg-[#1a2230] px-8 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-2 text-primary font-bold text-xl"><span className="material-symbols-outlined">school</span>TuTesisRD</div>
            </header>
            <main className="max-w-5xl mx-auto p-8 animate-fade-in">
                <div className="mb-8">
                        <div className="flex justify-between text-sm mb-2 text-primary font-bold"><span>Paso 3 de 3</span><span>Finalizando</span></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full"><div className="h-full w-full bg-primary rounded-full shadow-[0_0_10px_theme('colors.primary')]"></div></div>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Carga de Documentos</h1>
                <p className="text-slate-500 mb-8">Sube los archivos requeridos en PDF o DOCX.</p>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                        <h3 className="font-bold dark:text-white flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-xs flex items-center justify-center">1</span> Anteproyecto</h3>
                        <div className="h-64 border-2 border-dashed border-primary/40 bg-white dark:bg-[#1a2230] rounded-xl flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-primary/5 hover:border-primary transition-all group relative overflow-hidden">
                            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors"></div>
                            <span className="material-symbols-outlined text-4xl text-primary mb-2 group-hover:scale-110 transition-transform">cloud_upload</span>
                            <span className="text-sm font-bold dark:text-gray-300">Click para subir</span>
                            <span className="text-xs text-slate-400 mt-1">PDF max 5MB</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-bold dark:text-white flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-xs flex items-center justify-center">2</span> Normativa</h3>
                        <div className="h-64 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2230] rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2"><span className="material-symbols-outlined text-green-500">check_circle</span></div>
                                <div className="flex justify-between z-10">
                                    <div className="size-10 bg-red-100 rounded flex items-center justify-center text-red-500"><span className="material-symbols-outlined">picture_as_pdf</span></div>
                                    <button className="text-gray-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined">delete</span></button>
                                </div>
                                <div className="z-10">
                                    <p className="font-bold text-sm truncate dark:text-white">Normativa_2024.pdf</p>
                                    <p className="text-xs text-green-500 flex items-center gap-1 mt-1 font-medium"><span className="material-symbols-outlined text-sm">check_circle</span> Validado por IA</p>
                                </div>
                        </div>
                    </div>
                        <div className="space-y-3">
                        <h3 className="font-bold dark:text-white flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-xs flex items-center justify-center">3</span> Carta Compromiso</h3>
                        <div className="h-64 border-2 border-dashed border-red-300 bg-red-50 dark:bg-red-900/10 rounded-xl flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                                <span className="material-symbols-outlined text-red-500 text-3xl mb-2 animate-bounce">priority_high</span>
                                <p className="text-red-700 dark:text-red-400 text-sm font-bold">Error de formato</p>
                                <p className="text-red-600/70 dark:text-red-400/70 text-xs mt-1">Solo se aceptan archivos PDF</p>
                                <button className="mt-4 px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 text-xs rounded-full hover:bg-red-200 transition-colors">Reintentar</button>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <Link to="/student/details" className="text-primary font-bold flex items-center gap-2 hover:underline"><span className="material-symbols-outlined">arrow_back</span> Atrás</Link>
                    <Link to="/student/success" className="px-8 py-3 bg-[#FFC107] text-black font-bold rounded-lg hover:shadow-lg hover:bg-yellow-400 transition-all transform hover:-translate-y-1 flex items-center gap-2">
                        Finalizar Registro
                        <span className="material-symbols-outlined">check</span>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default UploadDocuments;