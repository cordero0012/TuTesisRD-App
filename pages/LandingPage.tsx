import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="font-sans text-gray-800 bg-background-light dark:bg-background-dark dark:text-gray-100 transition-colors duration-200">
            {/* Header */}
            <header className="fixed w-full top-0 z-50 transition-all duration-300 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center group">
                        <span className="material-icons mr-2 text-brand-orange group-hover:rotate-12 transition-transform duration-300">school</span>
                        TuTesis<span className="text-brand-orange">RD</span>
                    </Link>
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span className="material-icons text-2xl text-slate-800 dark:text-white">menu</span>
                    </button>
                    {/* Desktop Nav */}
                    <nav className="hidden md:flex space-x-1 items-center font-medium text-sm">
                        <a href="#inicio" className="px-4 py-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-gray-800 transition-all duration-300">Inicio</a>
                        <a href="#nosotros" className="px-4 py-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-gray-800 transition-all duration-300">Nosotros</a>
                        <a href="#servicios" className="px-4 py-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-gray-800 transition-all duration-300">Servicios</a>
                        <a href="#universidades" className="px-4 py-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-gray-800 transition-all duration-300">Universidades</a>
                        <a href="#blog" className="px-4 py-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-gray-800 transition-all duration-300">Blog</a>
                        <a href="https://wa.me/message/YESJDSE3MZ3IM1" target="_blank" rel="noopener noreferrer" className="ml-4 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 font-bold">
                            <i className="fab fa-whatsapp text-lg"></i> Contactar
                        </a>
                    </nav>
                </div>
                {/* Mobile Nav */}
                <div className={`md:hidden bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 absolute w-full ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                    <a href="#inicio" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 px-8 font-medium text-slate-800 dark:text-slate-200 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">Inicio</a>
                    <a href="#nosotros" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 px-8 font-medium text-slate-800 dark:text-slate-200 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">Nosotros</a>
                    <a href="#servicios" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 px-8 font-medium text-slate-800 dark:text-slate-200 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">Servicios</a>
                    <a href="#universidades" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 px-8 font-medium text-slate-800 dark:text-slate-200 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">Universidades</a>
                    <a href="https://wa.me/message/YESJDSE3MZ3IM1" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 px-8 text-brand-orange font-bold bg-orange-50/50 dark:bg-orange-900/10">
                        <i className="fab fa-whatsapp mr-2"></i> Contactar por WhatsApp
                    </a>
                </div>
            </header>

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
                                <a href="https://wa.me/message/YESJDSE3MZ3IM1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 px-8 rounded-full shadow-xl shadow-brand-orange/20 hover:shadow-2xl hover:shadow-brand-orange/30 hover:-translate-y-1 transition-all duration-300">
                                    <span className="material-icons mr-2">chat</span> Contactar Asesor
                                </a>
                                <a href="#servicios" className="inline-flex items-center justify-center bg-white dark:bg-white/5 text-slate-700 dark:text-white font-bold py-4 px-8 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300">
                                    Ver Servicios
                                </a>
                            </div>

                            <div className="mt-12 flex items-center justify-center md:justify-start gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                                <div className="flex -space-x-3">
                                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-gray-200"></div>
                                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-gray-300"></div>
                                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-gray-400 flex items-center justify-center text-xs text-white font-bold">+300</div>
                                </div>
                                <p>Estudiantes graduados</p>
                            </div>
                        </div>

                        <div className="md:w-1/2 relative animate-fade-in group perspective-1000">
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange to-yellow-400 rounded-[2rem] transform rotate-3 scale-105 opacity-20 blur-2xl group-hover:rotate-6 transition-transform duration-500"></div>
                            <img
                                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Estudiante celebrando"
                                className="relative rounded-[2rem] shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02] border border-white/20"
                            />

                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow border border-gray-100 dark:border-gray-700">
                                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600">
                                    <span className="material-icons">check_circle</span>
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

            {/* Specialist Section */}
            <section id="nosotros" className="py-20 bg-background-light dark:bg-surface-dark transition-colors duration-200">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">¿Por qué elegir Tu Tesis RD?</h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Más de 7 años de experiencia y 300+ tesis trabajadas nos respaldan.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                        {[
                            { icon: 'history_edu', title: '+7 Años', desc: 'Experiencia' },
                            { icon: 'groups', title: '300+', desc: 'Tesis Asesoradas' },
                            { icon: 'verified', title: '100%', desc: 'Tasa de Aprobación' },
                            { icon: 'language', title: 'Nacional', desc: 'Cobertura en todo el país' }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all text-center group">
                                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-brand-orange group-hover:scale-110 transition-transform">
                                    <span className="material-icons">{stat.icon}</span>
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{stat.title}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Specialist Profile */}
                    <div className="bg-white dark:bg-background-dark rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col lg:flex-row">
                            <div className="lg:w-1/3 bg-gray-100 dark:bg-gray-800 relative min-h-[400px]">
                                <img src="/miguel-cordero.jpg" alt="Miguel Ángel Cordero Trinidad" className="absolute inset-0 w-full h-full object-cover object-top" />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                                    <h3 className="text-2xl font-bold">Miguel Ángel Cordero</h3>
                                    <p className="text-brand-orange font-medium">CEO & Especialista Académico</p>
                                </div>
                            </div>
                            <div className="lg:w-2/3 p-8 md:p-12">
                                <span className="inline-block py-1 px-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-brand-orange text-sm font-bold mb-4">Sobre el Especialista</span>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Pasión por la Educación y la Investigación</h2>
                                <div className="prose prose-gray dark:prose-invert text-gray-600 dark:text-gray-300 mb-8">
                                    <p className="mb-4">
                                        Miguel Ángel Cordero Trinidad es un educador y asesor académico con más de cinco años de
                                        experiencia en el diseño, desarrollo y acompañamiento de investigaciones científicas en
                                        República Dominicana.
                                    </p>
                                    <p className="mb-4">
                                        Graduado <strong>Summa Cum Laude</strong> en Educación Primaria por la UCE, combina su
                                        perfil con formación avanzada en competencias digitales, innovación educativa e IA
                                        aplicada.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Contacto Directo</p>
                                        <p className="text-gray-900 dark:text-white font-medium">Higüey, La Altagracia (Servicio Nacional)</p>
                                    </div>
                                    <a href="https://wa.me/message/YESJDSE3MZ3IM1" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-brand-orange text-white rounded-lg font-bold hover:bg-orange-600 transition shadow-md flex items-center">
                                        <i className="fab fa-whatsapp mr-2"></i> Contactar a Miguel
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Universities Section */}
            <section id="universidades" className="py-16 bg-white dark:bg-background-dark transition-colors duration-200">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Trabajamos con todas las universidades del país</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">Conocemos los formatos y normativas específicas de cada institución académica.</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-70 grayscale hover:grayscale-0 transition duration-500">
                        {['UASD', 'PUCMM', 'O&M', 'UAPA', 'UNIBE', 'UNPHU', 'UTESA', 'INTEC', 'UNAPEC', 'UCNE', 'UCATECI', 'UFHEC'].map((uni) => (
                            <div key={uni} className="flex justify-center">
                                <span className="text-xl font-bold text-gray-400 dark:text-gray-500 border-2 border-gray-200 dark:border-gray-700 p-4 rounded-lg w-full hover:border-brand-orange hover:text-brand-orange transition-colors cursor-default">{uni}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="servicios" className="py-20 bg-background-light dark:bg-surface-dark relative transition-colors duration-200">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Nuestros Servicios</h2>
                        <div className="w-20 h-1.5 bg-brand-orange mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: 'book', title: 'Asesoría de Tesis', desc: 'Acompañamiento metodológico completo desde el anteproyecto hasta la defensa final.' },
                            { icon: 'edit', title: 'Corrección de Estilo', desc: 'Revisión ortotipográfica y gramatical. Adaptación a normas APA, Vancouver, etc.' },
                            { icon: 'analytics', title: 'Análisis Estadístico', desc: 'Procesamiento de datos con SPSS/Excel e interpretación de resultados.' },
                            { icon: 'science', title: 'Investigación y Desarrollo', desc: 'Soporte en la búsqueda de información, marco teórico y desarrollo de contenido.' }
                        ].map((service, idx) => (
                            <div key={idx} className="bg-white dark:bg-white/5 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 dark:border-white/5 group">
                                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/40 dark:to-orange-900/10 rounded-2xl flex items-center justify-center mb-6 text-brand-orange group-hover:scale-110 transition-transform shadow-inner">
                                    <span className="material-icons text-2xl">{service.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-orange transition-colors">{service.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{service.desc}</p>
                            </div>
                        ))}
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
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/student/register" className="inline-flex items-center px-8 py-3 bg-brand-orange text-white font-bold rounded-full hover:bg-orange-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <span className="material-icons mr-2">edit_document</span> Registrar Proyecto
                        </Link>
                        <Link to="/student/register?mode=monitor" className="inline-flex items-center px-8 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border-2 border-slate-200 dark:border-slate-700 font-bold rounded-full hover:border-brand-orange hover:text-brand-orange transition-all duration-300">
                            <span className="material-icons mr-2">travel_explore</span> Monitorear
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contacto" className="bg-gray-900 text-gray-400 py-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <span className="text-2xl font-bold text-white block mb-4 flex items-center">
                                <span className="material-icons mr-2 text-brand-orange">school</span>Tu Tesis RD
                            </span>
                            <p className="text-sm mb-6">Tu aliado académico número uno en República Dominicana. Calidad, confianza y resultados garantizados.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-lg mb-6">Contacto</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <span className="material-icons mt-1 mr-3 text-brand-orange text-sm">location_on</span>
                                    <span>Higüey, La Altagracia, Rep. Dom.<br /><span className="text-xs text-gray-500">(Servicio a todo el país)</span></span>
                                </li>
                                <li className="flex items-center">
                                    <span className="material-icons mr-3 text-brand-orange text-sm">email</span>
                                    <a href="mailto:ttesisrd@gmail.com" className="hover:text-white transition">ttesisrd@gmail.com</a>
                                </li>
                                <li className="flex items-center">
                                    <span className="material-icons mr-3 text-brand-orange text-sm">chat</span>
                                    <a href="https://wa.me/message/YESJDSE3MZ3IM1" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Chat WhatsApp</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-lg mb-6">Enlaces Rápidos</h4>
                            <ul className="space-y-2">
                                <li><a href="#inicio" className="hover:text-brand-orange transition">Inicio</a></li>
                                <li><a href="#servicios" className="hover:text-brand-orange transition">Servicios</a></li>
                                <li><Link to="/student/register" className="hover:text-brand-orange transition text-brand-orange font-medium">Registrar Proyecto</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;