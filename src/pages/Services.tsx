import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SEO from '../components/SEO';

const Services: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-800 dark:text-white">
            <SEO
                title="Servicios"
                description="Ofrecemos asesoría de tesis, corrección de estilo, análisis estadístico y revisión anti-plagio con Turnitin."
            />
            <Navbar />

            <section className="pt-32 pb-20 bg-background-light dark:bg-surface-dark relative transition-colors duration-200">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Nuestros Servicios</h2>
                        <div className="w-20 h-1.5 bg-brand-orange mx-auto rounded-full"></div>
                        <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                            Ofrecemos un paquete completo de soluciones académicas diseñadas para garantizar el éxito de tu proyecto de grado.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: 'book', title: 'Asesoría de Tesis', desc: 'Acompañamiento metodológico completo desde el anteproyecto hasta la defensa final. Te guiamos en cada capítulo.' },
                            { icon: 'edit', title: 'Corrección de Estilo', desc: 'Revisión ortotipográfica y gramatical profesional. Adaptación estricta a normas APA (6ta y 7ma ed.), Vancouver, o IEEE.' },
                            { icon: 'analytics', title: 'Análisis Estadístico', desc: 'Procesamiento de datos con SPSS, Excel o R. Interpretación de resultados cuantitativos y cualitativos.' },
                            { icon: 'science', title: 'Investigación y Desarrollo', desc: 'Soporte en la búsqueda de información académica, construcción del marco teórico y validación de instrumentos.' }
                        ].map((service, idx) => (
                            <div key={idx} className="bg-white dark:bg-white/5 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 dark:border-white/5 group flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/40 dark:to-orange-900/10 rounded-full flex items-center justify-center mb-6 text-brand-orange group-hover:scale-110 transition-transform shadow-inner">
                                    <span className="material-icons text-3xl">{service.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-orange transition-colors">{service.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{service.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Additional Service Info can go here */}
                    <div className="mt-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-700">
                        <h3 className="text-2xl font-bold text-center mb-8">¿Qué incluye nuestro servicio Premium?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600">
                                    <span className="material-icons text-sm">check</span>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-2">Revisión Anti-Plagio</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Garantizamos originalidad con reportes detallados de similitud (Turnitin).</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600">
                                    <span className="material-icons text-sm">check</span>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-2">Soporte Continuo</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Comunicación directa con tu asesor vía WhatsApp y Correo.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600">
                                    <span className="material-icons text-sm">check</span>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-2">Entrega Puntual</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Cronograma de entregas riguroso para cumplir con las fechas de tu universidad.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Services;
