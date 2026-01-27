import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Blog: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-800 dark:text-white">
            <Navbar />

            <section className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Blog Académico</h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Consejos, guías y recursos para estudiantes universitarios.
                        </p>
                    </div>

                    {/* Placeholder Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                                <div className="h-48 bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                        <span className="material-icons text-4xl">image</span>
                                    </div>
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <div className="p-6">
                                    <span className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-2 block">Metodología</span>
                                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-brand-orange transition-colors">Cómo elegir el tema perfecto para tu tesis</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3">
                                        Descubre los criterios clave para seleccionar un tema de investigación que sea relevante, viable y apasionante para ti. Guía paso a paso para no equivocarte.
                                    </p>
                                    <div className="flex items-center text-xs text-slate-400">
                                        <span className="material-icons text-sm mr-1">schedule</span> 5 min de lectura
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <div className="inline-block p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                            <span className="material-icons text-4xl text-slate-400 mb-2">construction</span>
                            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">Próximamente</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2">
                                Estamos preparando contenido de alto valor para ayudarte en tu camino académico. ¡Vuelve pronto!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Blog;
