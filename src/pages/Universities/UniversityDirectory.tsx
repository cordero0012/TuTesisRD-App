import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/SEO';
import { Card } from '../../components/ui/Card';
import universitiesData from '../../data/universities.json';
import { buildWhatsAppUrl } from '../../config';

const UniversityDirectory: React.FC = () => {
    const unlistedUniUrl = buildWhatsAppUrl('Hola TuTesisRD, mi universidad no está listada en el directorio. Deseo consultar la orientación para mi institución.');

    return (
        <div className="min-h-screen bg-tutesis-white dark:bg-tutesis-black font-sans text-tutesis-black dark:text-tutesis-white transition-colors duration-300">
            <SEO
                title="Directorio de Universidades RD | TuTesisRD"
                description="Guías metodológicas y normativas específicas para UASD, PUCMM, INTEC, UNIBE, O&M, UNPHU, UAPA, UCATECI y UNEV."
            />
            <Navbar />

            <main className="pt-28 pb-20">
                {/* Hero Section */}
                <section className="bg-tutesis-black text-tutesis-white border-b border-tutesis-white/20 py-12 md:py-16 mb-12">
                    <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10 text-center max-w-4xl">
                        <span className="inline-block py-1 px-3 rounded-full bg-tutesis-orange/20 text-tutesis-orange font-bold uppercase tracking-widest text-xs mb-4">
                            Normativas Académicas RD
                        </span>
                        <h1 className="font-display text-3xl md:text-5xl font-black mb-6 tracking-tight text-tutesis-white">
                            Guías de Tesis por <span className="text-tutesis-orange">Universidad</span>
                        </h1>
                        <p className="text-base md:text-xl text-tutesis-white/75 max-w-2xl mx-auto leading-relaxed">
                            Conoce los requisitos de formato, paginación y estructura exigidos por las principales instituciones de educación superior en República Dominicana.
                        </p>
                    </div>
                </section>

                <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
                    {/* University Cards Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
                        {universitiesData.map((uni) => (
                            <Link key={uni.id} to={`/tesis/${uni.id}`} className="group block h-full">
                                <Card className="h-full p-6 md:p-8 flex flex-col justify-between border border-tutesis-black/15 dark:border-tutesis-white/20 bg-tutesis-white dark:bg-tutesis-black group-hover:border-tutesis-orange relative overflow-hidden rounded-md transition-all duration-200">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-tutesis-white dark:bg-tutesis-black rounded-md p-2.5 flex items-center justify-center border border-tutesis-black/15 dark:border-tutesis-white/20 shadow-sm">
                                            <img src={uni.logo} alt={`Logo ${uni.shortName}`} className="max-w-full max-h-full object-contain" />
                                        </div>
                                        <span className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-tutesis-orange text-tutesis-black">
                                            {uni.programs.length} Programas
                                        </span>
                                    </div>

                                    <div>
                                        <h2 className="font-display text-2xl font-black mb-1 group-hover:text-tutesis-orange transition-colors tracking-tight text-tutesis-black dark:text-tutesis-white">
                                            {uni.shortName}
                                        </h2>
                                        <p className="text-xs md:text-sm text-tutesis-black/70 dark:text-tutesis-white/70 mb-4 line-clamp-2 min-h-10">
                                            {uni.name}
                                        </p>

                                        <div className="space-y-2 mb-4 text-xs md:text-sm text-tutesis-black/80 dark:text-tutesis-white/80">
                                            <div className="flex items-center gap-2 bg-tutesis-black/5 dark:bg-tutesis-white/5 p-2.5 rounded-md border border-tutesis-black/10 dark:border-tutesis-white/10">
                                                <span className="material-icons text-tutesis-orange text-base">gavel</span>
                                                <span className="font-semibold truncate">{uni.regulations.style}</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-tutesis-black/5 dark:bg-tutesis-white/5 p-2.5 rounded-md border border-tutesis-black/10 dark:border-tutesis-white/10">
                                                <span className="material-icons text-tutesis-orange text-base">description</span>
                                                <span>{uni.regulations.minPages} - {uni.regulations.maxPages} páginas</span>
                                            </div>
                                        </div>

                                        {/* Visible Program Names List */}
                                        <div className="mb-6">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-tutesis-black/70 dark:text-tutesis-white/70 mb-2 block">
                                                Programas orientados:
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {uni.programs.map((prog, pIdx) => (
                                                    <span key={pIdx} className="text-xs font-semibold px-2 py-1 rounded bg-tutesis-black/5 dark:bg-tutesis-white/10 text-tutesis-black dark:text-tutesis-white border border-tutesis-black/10 dark:border-tutesis-white/10">
                                                        {prog}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-tutesis-black/15 dark:border-tutesis-white/20 flex items-center justify-between text-sm font-bold text-tutesis-black dark:text-tutesis-white group-hover:text-tutesis-orange transition-colors">
                                        <span>Ver guía de {uni.shortName}</span>
                                        <span className="material-icons text-base">arrow_forward</span>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* Unlisted University CTA */}
                    <div className="bg-tutesis-black text-tutesis-white rounded-md p-8 md:p-12 text-center max-w-4xl mx-auto border border-tutesis-white/20">
                        <span className="material-icons text-tutesis-orange text-4xl mb-4">help_outline</span>
                        <h3 className="font-display text-2xl md:text-3xl font-extrabold mb-3 text-tutesis-white">¿Tu universidad no aparece en este listado?</h3>
                        <p className="text-tutesis-white/75 max-w-xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
                            Si tu universidad no aparece en este listado, escríbenos directamente por WhatsApp para revisar tu manual y guías vigentes.
                        </p>
                        <a
                            href={unlistedUniUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-tutesis-orange text-tutesis-black hover:bg-tutesis-gold font-extrabold text-sm md:text-base px-8 py-4 rounded-md shadow-md transition-colors"
                        >
                            <span className="material-icons">chat</span>
                            <span>Consultar mi universidad por WhatsApp</span>
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default UniversityDirectory;
