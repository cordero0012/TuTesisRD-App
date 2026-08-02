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
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-white transition-colors duration-300">
            <SEO
                title="Directorio de Universidades RD | TuTesisRD"
                description="Guías metodológicas y normativas específicas para UASD, PUCMM, INTEC, UNIBE, O&M, UNPHU, UAPA, UCATECI y UNEV."
            />
            <Navbar />

            <main className="pt-28 pb-20">
                {/* Hero Section */}
                <section className="bg-slate-900 text-white py-14 md:py-20 mb-12">
                    <div className="container mx-auto px-6 text-center max-w-4xl">
                        <span className="inline-block py-1 px-3 rounded-full bg-brand-orange/20 text-brand-orange font-bold uppercase tracking-widest text-xs mb-4">
                            Normativas Académicas RD
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                            Guías de Tesis por <span className="text-brand-orange">Universidad</span>
                        </h1>
                        <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            Conoce los requisitos de formato, paginación y estructura exigidos por las principales instituciones de educación superior en República Dominicana.
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-6">
                    {/* University Cards Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {universitiesData.map((uni) => (
                            <Link key={uni.id} to={`/tesis/${uni.id}`} className="group block h-full">
                                <Card className="h-full p-6 md:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark group-hover:border-brand-orange/50 relative overflow-hidden">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3 flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform">
                                            <img src={uni.logo} alt={`Logo ${uni.shortName}`} className="max-w-full max-h-full object-contain" />
                                        </div>
                                        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange border border-brand-orange/20">
                                            {uni.programs.length} Programas
                                        </span>
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-black mb-1 group-hover:text-brand-orange transition-colors tracking-tight text-slate-900 dark:text-white">
                                            {uni.shortName}
                                        </h2>
                                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 min-h-10">
                                            {uni.name}
                                        </p>

                                        <div className="space-y-2 mb-6 text-xs md:text-sm text-slate-600 dark:text-slate-300">
                                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                                <span className="material-icons text-brand-orange text-base">gavel</span>
                                                <span className="font-semibold truncate">{uni.regulations.style}</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                                <span className="material-icons text-brand-orange text-base">description</span>
                                                <span>{uni.regulations.minPages} - {uni.regulations.maxPages} páginas</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm font-bold text-brand-orange group-hover:translate-x-1 transition-transform">
                                        <span>Ver guía de {uni.shortName}</span>
                                        <span className="material-icons text-base">arrow_forward</span>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* Unlisted University CTA */}
                    <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-2xl">
                        <span className="material-icons text-brand-orange text-4xl mb-4">help_outline</span>
                        <h3 className="text-2xl md:text-3xl font-extrabold mb-3">¿Tu universidad no aparece en este listado?</h3>
                        <p className="text-slate-300 max-w-xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
                            Trabajamos con normativas de todas las instituciones de educación superior del país. Escríbenos directamente para revisar tus requisitos.
                        </p>
                        <a
                            href={unlistedUniUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-brand-orange text-white hover:bg-orange-600 font-extrabold text-sm md:text-base px-8 py-4 rounded-xl shadow-lg transition-transform hover:scale-105"
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
