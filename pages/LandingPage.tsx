import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="font-sans text-gray-800 bg-background-light dark:bg-background-dark dark:text-gray-100 transition-colors duration-200">
            {/* Header */}
            <header className="bg-white dark:bg-surface-dark shadow-md sticky top-0 z-50 transition-colors duration-200">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-extrabold text-brand-orange tracking-tight flex items-center">
                        <span className="material-icons mr-2 text-gray-800 dark:text-white">school</span>Tu Tesis RD
                    </Link>
                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden text-gray-800 dark:text-gray-200 focus:outline-none"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span className="material-icons text-2xl">menu</span>
                    </button>
                    {/* Desktop Nav */}
                    <nav className="hidden md:flex space-x-8 items-center font-medium">
                        <a href="#inicio" className="hover:text-brand-orange dark:hover:text-brand-orange transition duration-300">Inicio</a>
                        <a href="#nosotros" className="hover:text-brand-orange dark:hover:text-brand-orange transition duration-300">Nosotros</a>
                        <a href="#servicios" className="hover:text-brand-orange dark:hover:text-brand-orange transition duration-300">Servicios</a>
                        <a href="#universidades" className="hover:text-brand-orange dark:hover:text-brand-orange transition duration-300">Universidades</a>
                        <a href="#blog" className="hover:text-brand-orange dark:hover:text-brand-orange transition duration-300">Blog</a>
                        <Link to="/student/register" className="px-5 py-2 bg-brand-orange text-white rounded-full hover:bg-orange-600 transition duration-300 shadow-md">
                            Registrar Proyecto
                        </Link>
                        <Link to="/student/portal" className="text-gray-600 dark:text-gray-300 hover:text-brand-orange transition duration-300">
                            Acceso Alumnos
                        </Link>
                    </nav>
                </div>
                {/* Mobile Nav */}
                <div className={`md:hidden bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-700 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                    <a href="#inicio" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-6 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700">Inicio</a>
                    <a href="#nosotros" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-6 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700">Nosotros</a>
                    <a href="#servicios" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-6 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700">Servicios</a>
                    <a href="#universidades" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-6 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700">Universidades</a>
                    <Link to="/student/register" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-6 text-brand-orange font-bold border-b border-gray-100 dark:border-gray-700">Registrar Proyecto</Link>
                    <Link to="/student/portal" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 px-6 text-gray-600 dark:text-gray-300 font-medium">Acceso Alumnos</Link>
                </div>
            </header>

            {/* Hero Section */}
            <section id="inicio" className="relative pt-20 pb-32 flex items-center bg-white dark:bg-background-dark overflow-hidden transition-colors duration-200">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-12 md:mb-0 animate-fade-in-up">
                            <span className="inline-block py-1 px-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-brand-orange text-sm font-bold mb-6">
                                Expertos en Tesis y Monográficos
                            </span>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                                Aprobamos tu Tesis, <br /> <span className="text-brand-orange">tú celebras tu graduación</span>
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-lg">
                                Somos un equipo de expertos apasionados y con una vasta experiencia en la creación de tesis,
                                monografías, informes y presentaciones impactantes. 📚✍️
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/student/register" className="inline-flex items-center justify-center bg-brand-orange text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-orange-600 transform hover:scale-105 transition duration-300">
                                    <span className="material-icons mr-2 text-xl">play_arrow</span> Empezar Ahora
                                </Link>
                                <a href="#servicios" className="inline-flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white font-bold py-4 px-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300">
                                    Ver Servicios
                                </a>
                            </div>
                        </div>
                        <div className="md:w-1/2 relative animate-fade-in">
                            <div className="absolute inset-0 bg-brand-orange rounded-full opacity-10 filter blur-3xl transform translate-x-10 translate-y-10"></div>
                            <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Estudiantes Graduados" className="relative rounded-2xl shadow-2xl transform -rotate-2 hover:rotate-0 transition duration-500" />
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

                    <div className="bg-white dark:bg-background-dark rounded-3xl shadow-xl p-8 md:p-12 mb-20 border border-gray-100 dark:border-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center p-4">
                                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-orange">
                                    <span className="material-icons text-3xl">check_circle</span>
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Asesoría Personalizada</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Acompañamiento humano en cada paso.</p>
                            </div>
                            <div className="text-center p-4">
                                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-orange">
                                    <span className="material-icons text-3xl">edit_note</span>
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Corrección Profesional</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Calidad y precisión garantizada.</p>
                            </div>
                            <div className="text-center p-4">
                                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-orange">
                                    <span className="material-icons text-3xl">map</span>
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Cobertura Nacional</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Servicio a todo el país desde Higüey.</p>
                            </div>
                            <div className="text-center p-4">
                                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-orange">
                                    <span className="material-icons text-3xl">psychology</span>
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Innovación & IA</h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Integración de herramientas digitales.</p>
                            </div>
                        </div>
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
                            <div key={idx} className="bg-white dark:bg-background-dark p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 hover:-translate-y-2 border-b-4 border-brand-orange">
                                <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-6 text-brand-orange">
                                    <span className="material-icons text-2xl">{service.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{service.desc}</p>
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
                    <Link to="/student/register" className="inline-flex items-center bg-white text-brand-orange font-bold py-5 px-12 rounded-full shadow-xl hover:bg-gray-100 transition duration-300 transform hover:scale-105">
                        <span className="material-icons mr-3 text-2xl">rocket_launch</span> <span className="text-lg">Registrar mi Proyecto</span>
                    </Link>
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
                                <li><Link to="/student/register" className="hover:text-brand-orange transition">Registrarse</Link></li>
                                <li><Link to="/admin/dashboard" className="hover:text-brand-orange transition">Admin</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;