import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SEO from '../components/SEO';

const About: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-800 dark:text-white">
            <SEO
                title="Sobre Nosotros"
                description="Conoce a Miguel Ángel Cordero y al equipo de TuTesisRD. Expertos con más de 7 años de experiencia en asesoría académica."
            />
            <Navbar />

            <section className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">¿Por qué elegir Tu Tesis RD?</h1>
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

            <Footer />
        </div>
    );
};

export default About;
