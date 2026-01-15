import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col font-display bg-background-light dark:bg-background-dark transition-colors duration-200">
            <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center gap-3">
                            <span className="material-icons text-primary text-4xl">school</span>
                            <span className="font-bold text-2xl text-gray-900 dark:text-white">Tu Tesis RD</span>
                        </div>
                        <div className="hidden md:flex space-x-8 items-center">
                            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary transition">Inicio</Link>
                            <Link to="/student/portal" className="text-gray-600 dark:text-gray-300 hover:text-primary transition">Portal</Link>
                            <Link to="/admin/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-primary transition">Admin</Link>
                            <Link to="/student/register" className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-yellow-600 transition shadow-lg">Comenzar</Link>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="flex-grow flex items-center justify-center py-12 px-4">
                    <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                    <div className="lg:col-span-5 flex flex-col justify-center space-y-8 animate-fade-in">
                        <div>
                            <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                                <span className="material-icons text-base">verified</span>
                                <span>Más de 7 años de experiencia</span>
                            </div>
                            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">Comienza tu camino hacia el éxito académico</h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">Regístrate hoy para recibir asesoría personalizada. Nuestro equipo de expertos está listo para ayudarte con la IA más avanzada.</p>
                        </div>
                    </div>
                    <div className="lg:col-span-7 animate-slide-up">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="bg-gray-50 dark:bg-gray-900/50 px-8 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Registro de Proyecto</h2>
                            </div>
                            <form className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                                        <input className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" type="text" placeholder="Ej. Juan"/>
                                    </div>
                                        <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellido</label>
                                        <input className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" type="text" placeholder="Ej. Pérez"/>
                                    </div>
                                </div>
                                <Link to="/student/register" className="w-full flex justify-center items-center py-3 px-4 rounded-lg bg-primary text-white font-bold hover:bg-yellow-600 transition shadow-md hover:shadow-lg">
                                    Registrar Proyecto
                                    <span className="material-icons ml-2">arrow_forward</span>
                                </Link>
                            </form>
                        </div>
                    </div>
                    </div>
            </main>
        </div>
    );
};

export default LandingPage;