import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/SEO';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import universitiesData from '../../data/universities.json';

const UniversityDirectory: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-white transition-colors duration-300">
            <SEO title="Directorio de Universidades RD | TuTesisRD" description="Encuentra asesores de tesis especializados por universidad: UASD, PUCMM, INTEC, UNIBE y más." />
            <Navbar />

            <div className="container mx-auto px-6 pt-32 pb-20">
                <header className="mb-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-6 animate-fade-in-up">Tu Universidad, Nuestras Reglas</h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto animate-slide-up">
                        Selecciona tu universidad para ver recursos, consejos y asesores especializados en tu normativa.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {universitiesData.map((uni) => (
                        <Link key={uni.id} to={`/tesis/${uni.id}`} className="group">
                            <Card className="h-full p-8 transition-all hover:-translate-y-2 hover:shadow-xl border-l-4" style={{ borderLeftColor: uni.color }}>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-16 h-16 bg-white rounded-full shadow-sm p-2 flex items-center justify-center">
                                        <img src={uni.logo} alt={uni.shortName} className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                                        {uni.programs.length} Fac.
                                    </span>
                                </div>

                                <h2 className="text-2xl font-bold mb-2 group-hover:text-brand-orange transition-colors">
                                    {uni.shortName}
                                </h2>
                                <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                                    {uni.name}
                                </p>

                                <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                                    <span className="material-icons text-base">verified</span>
                                    {uni.regulations.style}
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default UniversityDirectory;
