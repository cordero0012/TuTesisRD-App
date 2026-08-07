import React from 'react';
import { Award, BookOpen, CheckCircle2, Clock, Globe, GraduationCap, MapPin, MessageCircle, Sparkles, Users } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SEO from '../components/SEO';
import { buildWhatsAppUrl } from '../config';

const About: React.FC = () => {
    const contactUrl = buildWhatsAppUrl('Hola Miguel, deseo recibir asesoría para mi tesis.');

    return (
        <div className="min-h-screen bg-tutesis-white dark:bg-tutesis-black font-sans text-tutesis-black dark:text-tutesis-white transition-colors duration-200">
            <SEO
                title="Sobre Nosotros"
                description="Conoce a Miguel Ángel Cordero y al equipo de TuTesisRD. Expertos con más de 7 años de experiencia en asesoría académica."
            />
            <Navbar />

            <section className="pt-28 pb-16 md:pt-36 md:pb-24">
                <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
                    <div className="text-center mb-12 md:mb-16">
                        <span className="inline-block rounded-full bg-tutesis-orange px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-tutesis-black mb-3">
                            Trayectoria y Rigor
                        </span>
                        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-tutesis-black dark:text-tutesis-white mb-4 tracking-tight">
                            ¿Por qué elegir <span className="text-tutesis-orange">Tu Tesis RD</span>?
                        </h1>
                        <p className="text-base md:text-lg text-tutesis-black/75 dark:text-tutesis-white/75 max-w-2xl mx-auto leading-relaxed">
                            Más de 7 años de experiencia y 300+ tesis trabajadas nos respaldan con una metodología clara y estructurada.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 md:mb-20">
                        {[
                            { icon: Clock, title: '+7 Años', desc: 'Experiencia' },
                            { icon: BookOpen, title: '300+', desc: 'Tesis Asesoradas' },
                            { icon: CheckCircle2, title: '100%', desc: 'Tasa de Aprobación' },
                            { icon: Globe, title: 'Nacional', desc: 'Cobertura en todo RD' }
                        ].map((stat, idx) => {
                            const IconComponent = stat.icon;
                            return (
                                <div
                                    key={idx}
                                    className="bg-tutesis-white dark:bg-tutesis-black/80 p-6 md:p-8 rounded-xl border border-tutesis-black/15 dark:border-tutesis-white/20 shadow-sm hover:shadow-md hover:border-tutesis-orange dark:hover:border-tutesis-orange transition-all text-center group"
                                >
                                    <div className="w-12 h-12 bg-tutesis-gold/20 dark:bg-tutesis-gold/15 rounded-xl flex items-center justify-center mx-auto mb-4 text-tutesis-orange group-hover:scale-110 transition-transform">
                                        <IconComponent className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black text-tutesis-black dark:text-tutesis-white mb-1 font-display">{stat.title}</h2>
                                    <p className="text-xs md:text-sm text-tutesis-black/70 dark:text-tutesis-white/70 font-semibold">{stat.desc}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Specialist Profile Card */}
                    <div className="bg-tutesis-white dark:bg-tutesis-black rounded-2xl shadow-xl overflow-hidden border border-tutesis-black/15 dark:border-tutesis-white/20">
                        <div className="flex flex-col lg:flex-row">
                            <div className="lg:w-1/3 bg-tutesis-gold/10 dark:bg-tutesis-black/90 relative min-h-[380px]">
                                <img
                                    src="/miguel-cordero.jpg"
                                    alt="Miguel Ángel Cordero Trinidad"
                                    className="absolute inset-0 w-full h-full object-cover object-top"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-tutesis-black/90 via-tutesis-black/60 to-transparent p-6 text-tutesis-white">
                                    <h3 className="text-xl font-black font-display text-tutesis-white">Miguel Ángel Cordero</h3>
                                    <p className="text-tutesis-orange font-bold text-sm">CEO & Especialista Académico</p>
                                </div>
                            </div>
                            <div className="lg:w-2/3 p-6 sm:p-8 md:p-12">
                                <span className="inline-block py-1 px-3 rounded-full bg-tutesis-orange/20 text-tutesis-black dark:text-tutesis-orange text-xs font-extrabold uppercase tracking-wider mb-4">
                                    Sobre el Especialista
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-black font-display text-tutesis-black dark:text-tutesis-white mb-6">
                                    Pasión por la Educación y la Investigación
                                </h3>
                                <div className="text-tutesis-black/80 dark:text-tutesis-white/80 space-y-4 mb-8 text-sm md:text-base leading-relaxed">
                                    <p>
                                        Miguel Ángel Cordero Trinidad es un educador y asesor académico con más de cinco años de
                                        experiencia en el diseño, desarrollo y acompañamiento de investigaciones científicas en
                                        República Dominicana.
                                    </p>
                                    <p>
                                        Graduado <strong className="font-bold text-tutesis-black dark:text-tutesis-white">Summa Cum Laude</strong> en Educación Primaria por la UCE, combina su
                                        perfil con formación avanzada en competencias digitales, innovación educativa e IA
                                        aplicada a la investigación académica.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 items-center bg-tutesis-gold/10 dark:bg-tutesis-white/5 p-4 sm:p-5 rounded-xl border border-tutesis-black/10 dark:border-tutesis-white/10">
                                    <div className="flex-1 text-center sm:text-left">
                                        <p className="text-xs text-tutesis-black/60 dark:text-tutesis-white/60 font-bold uppercase tracking-wider">Atención y Sede</p>
                                        <p className="text-tutesis-black dark:text-tutesis-white font-bold text-sm">Higüey, La Altagracia (Atención en todo el país)</p>
                                    </div>
                                    <a
                                        href={contactUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-tutesis-orange px-6 py-3 text-sm font-extrabold text-tutesis-black shadow-md transition-colors hover:bg-tutesis-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange"
                                    >
                                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                                        <span>Contactar a Miguel</span>
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
