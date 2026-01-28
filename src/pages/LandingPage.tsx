import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SEO from '../components/SEO';

const LandingPage: React.FC = () => {
    const mainSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "TuTesisRD",
        "image": "https://www.tutesisrd.online/favicon.png",
        "@id": "https://www.tutesisrd.online",
        "url": "https://www.tutesisrd.online",
        "telephone": "+18294435985",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "República Dominicana",
            "addressLocality": "Santo Domingo",
            "addressCountry": "DO"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 18.4861,
            "longitude": -69.9312
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "18:00"
        },
        "sameAs": [
            "https://wa.me/message/YESJDSE3MZ3IM1"
        ]
    };

    return (
        <div className="font-sans text-gray-800 bg-background-light dark:bg-background-dark dark:text-gray-100 transition-colors duration-200">
            <SEO
                title="Inicio"
                description="Tu Tesis Aprobada, Sin Estrés. Expertos en redacción académica y metodología en República Dominicana."
                schema={mainSchema}
            />
            <Navbar />

            {/* Hero Section */}
            <section id="inicio" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-background-light dark:bg-background-dark">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                        <div className="md:w-1/2 animate-fade-in-up text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 shadow-sm mb-8">
                                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-200">Disponible para nuevos proyectos</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
                                Tu Tesis Aprobada,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-500">Sin Estrés.</span>
                            </h1>

                            <p className="text-lg lg:text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-lg mx-auto md:mx-0">
                                Expertos en redacción académica y metodología. Te acompañamos desde el anteproyecto hasta la defensa final.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <a href="https://wa.me/message/YESJDSE3MZ3IM1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-brand-orange text-white font-bold py-4 px-8 rounded-full shadow-xl shadow-brand-orange/20 hover:shadow-2xl hover:shadow-brand-orange/30 hover:-translate-y-1 transition-all duration-300">
                                    <span className="material-icons mr-2" aria-hidden="true">chat</span> Contactar Asesor
                                </a>
                                <Link to="/servicios" className="inline-flex items-center justify-center bg-white dark:bg-white/5 text-slate-700 dark:text-white font-bold py-4 px-8 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300">
                                    Ver Servicios
                                </Link>
                            </div>

                            <div className="mt-12 inline-flex items-center gap-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-3 pr-6 rounded-full border border-white/50 dark:border-slate-700/50 shadow-sm">
                                <div className="flex -space-x-3">
                                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Estudiante satisfecha" className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover" />
                                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Estudiante satisfecho" className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover" />
                                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-brand-orange flex items-center justify-center text-xs text-white font-bold">+300</div>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white leading-tight">Estudiantes</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Graduados exitosamente</p>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-1/2 relative animate-fade-in group perspective-1000">
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange to-yellow-400 rounded-[2rem] transform rotate-3 scale-105 opacity-20 blur-2xl group-hover:rotate-6 transition-transform duration-500"></div>
                            <img
                                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Estudiante celebrando graduación con éxito"
                                className="relative rounded-[2rem] shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02] border border-white/20"
                            />

                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow border border-gray-100 dark:border-gray-700">
                                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600">
                                    <span className="material-icons" aria-hidden="true">check_circle</span>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Resultado</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">100% Aprobado</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-brand-orange relative overflow-hidden">
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">¡Únete a los cientos de estudiantes satisfechos!</h2>
                    <p className="text-white text-xl mb-10 max-w-2xl mx-auto font-medium">Han alcanzado el éxito académico con nuestra ayuda. ¿Qué esperas para ser el próximo?</p>
                    <a href="https://wa.me/message/YESJDSE3MZ3IM1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-white text-brand-orange font-bold py-5 px-12 rounded-full shadow-xl hover:bg-gray-100 transition duration-300 transform hover:scale-105">
                        <span className="material-icons mr-3 text-2xl">chat</span> <span className="text-lg">Hablar con un Asesor</span>
                    </a>
                </div>
            </section>

            {/* Registration CTA Section */}
            <section className="py-16 bg-white dark:bg-background-dark border-t border-slate-100 dark:border-slate-800">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-6">¿Prefieres gestionar todo en línea?</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                        Puedes registrar tu proyecto directamente en nuestra plataforma y enviarnos tus archivos para una revisión inicial.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/registro" className="w-full sm:w-auto px-10 py-4 bg-brand-orange text-white rounded-full font-bold text-lg hover:shadow-xl hover:shadow-brand-orange/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                            Registrar Proyecto <span className="material-icons">arrow_forward</span>
                        </Link>

                        <Link to="/monitoreo" className="w-full sm:w-auto px-10 py-4 bg-transparent text-brand-orange border-2 border-brand-orange rounded-full font-bold text-lg hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                            <span className="material-icons">search</span> Monitorear
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;