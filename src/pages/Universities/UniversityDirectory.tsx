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
                            <Card className="h-full p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 dark:border-gray-800 relative overflow-hidden group-hover:border-transparent">
                                <div className="absolute top-0 left-0 w-1 h-full transition-all duration-300 group-hover:w-2" style={{ backgroundColor: uni.color }}></div>
                                <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full opacity-5 transition-transform duration-500 group-hover:scale-150" style={{ backgroundColor: uni.color }}></div>

                                <div className="flex items-start justify-between mb-6 relative z-10">
                                    <div className="w-20 h-20 bg-white dark:bg-white/90 rounded-2xl shadow-sm p-3 flex items-center justify-center border border-gray-50 dark:border-gray-700 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                                        <img src={uni.logo} alt={uni.shortName} className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                        {uni.programs.length} Facultades
                                    </span>
                                </div>

                                <div className="relative z-10">
                                    <h2 className="text-2xl font-black mb-2 group-hover:text-brand-orange transition-colors tracking-tight">
                                        {uni.shortName}
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 h-10">
                                        {uni.name}
                                    </p>

                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">
                                        <span className="material-icons text-brand-orange text-lg">verified</span>
                                        <span className="truncate">{uni.regulations.style}</span>
                                    </div>
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
