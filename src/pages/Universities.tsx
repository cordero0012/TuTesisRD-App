import React from 'react';
import { CheckCircle2, GraduationCap, Landmark, MessageCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SEO from '../components/SEO';
import { buildWhatsAppUrl } from '../config';

const Universities: React.FC = () => {
    const contactUrl = buildWhatsAppUrl('Hola, quiero consultar la disponibilidad y normativa para mi universidad.');

    return (
        <div className="min-h-screen bg-tutesis-white dark:bg-tutesis-black font-sans text-tutesis-black dark:text-tutesis-white transition-colors duration-200">
            <SEO
                title="Universidades"
                description="Trabajamos con todas las universidades de República Dominicana: UASD, PUCMM, O&M, UAPA y más. Adaptamos tu tesis a cualquier normativa."
            />
            <Navbar />

            <section className="pt-28 pb-16 md:pt-36 md:pb-24">
                <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10 text-center">
                    <span className="inline-block rounded-full bg-tutesis-orange px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-tutesis-black mb-3">
                        Cobertura Académica Nacional
                    </span>
                    <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-tutesis-black dark:text-tutesis-white mb-4 tracking-tight">
                        Nuestra Experiencia <span className="text-tutesis-orange">Universitaria</span>
                    </h1>
                    <p className="text-base md:text-lg text-tutesis-black/75 dark:text-tutesis-white/75 mb-12 max-w-3xl mx-auto leading-relaxed">
                        En Tu Tesis RD, entendemos que cada universidad tiene su propia identidad, normativa y rigor académico.
                        Hemos trabajado exitosamente con estudiantes de las principales instituciones de educación superior del país.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
                        {['UASD', 'PUCMM', 'O&M', 'UAPA', 'UNIBE', 'UNPHU', 'UTESA', 'INTEC', 'UNAPEC', 'UCNE', 'UCATECI', 'UFHEC'].map((uni) => (
                            <div
                                key={uni}
                                className="flex flex-col items-center justify-center p-6 md:p-8 border border-tutesis-black/15 dark:border-tutesis-white/20 rounded-xl bg-tutesis-white dark:bg-tutesis-black/80 hover:shadow-md hover:border-tutesis-orange dark:hover:border-tutesis-orange transition-all group"
                            >
                                <div className="w-14 h-14 bg-tutesis-gold/15 dark:bg-tutesis-gold/10 rounded-full flex items-center justify-center mb-4 text-tutesis-orange group-hover:scale-110 transition-transform">
                                    <Landmark className="h-7 w-7" aria-hidden="true" />
                                </div>
                                <span className="text-lg md:text-xl font-black font-display text-tutesis-black dark:text-tutesis-white group-hover:text-tutesis-orange transition-colors">{uni}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-tutesis-black text-tutesis-white rounded-2xl p-8 md:p-12 shadow-xl mx-auto max-w-4xl border border-tutesis-white/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-2xl md:text-3xl font-black font-display mb-4 text-tutesis-white">¿Tu universidad no está en la lista?</h2>
                            <p className="mb-8 text-sm md:text-base text-tutesis-white/80 max-w-2xl mx-auto leading-relaxed">
                                No te preocupes. Nuestra metodología es adaptable a cualquier normativa institucional (APA 7, Vancouver, Chicago, ISO).
                                Analizamos el manual oficial de tu universidad para garantizar el 100% de cumplimiento.
                            </p>
                            <a
                                href={contactUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-tutesis-orange px-8 py-3.5 text-base font-extrabold text-tutesis-black shadow-md transition-colors hover:bg-tutesis-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange"
                            >
                                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                                <span>Consultar Disponibilidad</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Universities;
