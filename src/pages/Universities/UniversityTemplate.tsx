import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/SEO';
import { Card } from '../../components/ui/Card';
import universitiesData from '../../data/universities.json';
import { buildWhatsAppUrl } from '../../config';

interface University {
    id: string;
    name: string;
    shortName: string;
    color: string;
    logo: string;
    description: string;
    regulations: {
        style: string;
        minPages: number;
        maxPages: number;
    };
    tips: string[];
    programs: string[];
}

const UniversityTemplate: React.FC = () => {
    const { universityId } = useParams<{ universityId: string }>();
    const university = (universitiesData as University[]).find(u => u.id === universityId);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [universityId]);

    if (!university) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans flex flex-col items-center justify-center p-6 text-center">
                <SEO title="Universidad No Encontrada | TuTesisRD" description="La universidad que buscas no está registrada en nuestra base de datos activa." />
                <Navbar />
                <main className="pt-32 pb-20 max-w-md mx-auto">
                    <span className="material-icons text-brand-orange text-5xl mb-4">school</span>
                    <h1 className="text-3xl font-black mb-4 text-slate-900 dark:text-white">Universidad no encontrada</h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                        No encontramos información registrada para esta institución. Explora nuestro directorio general para consultar las universidades disponibles.
                    </p>
                    <Link
                        to="/universidades"
                        className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white hover:bg-orange-600 font-bold px-6 py-3 rounded-xl shadow-md transition-colors"
                    >
                        <span className="material-icons text-lg">arrow_back</span>
                        <span>Volver al Directorio de Universidades</span>
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    const whatsappUrl = buildWhatsAppUrl(`Hola TuTesisRD, deseo cotización y asesoría académica ajustada a la normativa de la ${university.shortName}.`);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-white transition-colors duration-300">
            <SEO
                title={`Tesis y Monográficos para ${university.shortName} | TuTesisRD`}
                description={`Asesoría experta adaptada a la normativa de la ${university.name}. Estilo ${university.regulations.style}, ${university.regulations.minPages}-${university.regulations.maxPages} páginas.`}
            />
            <Navbar />

            <main className="pt-28 pb-20">
                {/* Breadcrumb Navigation */}
                <div className="bg-slate-100 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 py-3">
                    <div className="container mx-auto px-6">
                        <nav aria-label="Miga de pan" className="flex items-center gap-2 text-xs md:text-sm text-slate-600 dark:text-slate-400">
                            <Link to="/" className="hover:text-brand-orange transition-colors">Inicio</Link>
                            <span className="material-icons text-xs text-slate-400">chevron_right</span>
                            <Link to="/universidades" className="hover:text-brand-orange transition-colors">Universidades</Link>
                            <span className="material-icons text-xs text-slate-400">chevron_right</span>
                            <span className="font-semibold text-slate-900 dark:text-white">{university.shortName}</span>
                        </nav>
                    </div>
                </div>

                {/* Hero Section */}
                <section className="bg-slate-900 text-white py-14 md:py-20 relative overflow-hidden">
                    <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
                        <div className="inline-block p-3 bg-white rounded-2xl shadow-xl mb-6">
                            <img src={university.logo} alt={`Logo de ${university.name}`} className="h-16 md:h-20 object-contain mx-auto" />
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
                            Asesoría de Tesis para <span className="text-brand-orange">{university.shortName}</span>
                        </h1>

                        <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                            {university.description} Te acompañamos paso a paso respetando los criterios metodológicos exigidos por la {university.shortName}.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white hover:bg-orange-600 font-extrabold text-base px-6 py-4 rounded-xl shadow-lg transition-transform hover:scale-105"
                            >
                                <span className="material-icons">chat</span>
                                <span>Cotizar mi Tesis en {university.shortName}</span>
                            </a>
                            <Link
                                to="/herramientas/matriz"
                                className="inline-flex items-center justify-center gap-2 border border-slate-700 bg-slate-800 text-white hover:bg-slate-700 font-bold text-base px-6 py-4 rounded-xl transition-colors"
                            >
                                <span className="material-icons">assessment</span>
                                <span>Auditar Borrador con Matriz</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Regulations Section */}
                <section className="py-16 container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="inline-block py-1 px-3 rounded-full bg-brand-orange/10 text-brand-orange font-bold uppercase tracking-widest text-xs mb-3">
                            Lineamientos Específicos
                        </span>
                        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                            Normativa de Grado y Posgrado ({university.shortName})
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card className="p-6 md:p-8 text-center bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 shadow-sm">
                            <span className="material-icons text-brand-orange text-4xl mb-3">gavel</span>
                            <h3 className="text-lg font-bold mb-2">Estilo de Citas Requerido</h3>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{university.regulations.style}</p>
                        </Card>

                        <Card className="p-6 md:p-8 text-center bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 shadow-sm">
                            <span className="material-icons text-brand-orange text-4xl mb-3">description</span>
                            <h3 className="text-lg font-bold mb-2">Rango de Extensión</h3>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                {university.regulations.minPages} a {university.regulations.maxPages} páginas
                            </p>
                        </Card>

                        <Card className="p-6 md:p-8 text-center bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 shadow-sm">
                            <span className="material-icons text-brand-orange text-4xl mb-3">school</span>
                            <h3 className="text-lg font-bold mb-2">Programas Destacados</h3>
                            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
                                {university.programs.join(', ')}
                            </p>
                        </Card>
                    </div>

                    {/* Disclaimer */}
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl flex items-start gap-3 max-w-4xl mx-auto">
                        <span className="material-icons text-amber-600 dark:text-amber-400 shrink-0">info</span>
                        <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                            <strong>Nota institucional:</strong> Consulta siempre el manual o reglamento oficial vigente emitido por la {university.name} para verificar eventuales cambios en las guías metodológicas de tu facultad.
                        </p>
                    </div>
                </section>

                {/* Tips & Guidance Section */}
                <section className="py-12 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black mb-6 tracking-tight">
                                    Consejos clave para tu trabajo en {university.shortName}
                                </h2>
                                <ul className="space-y-4">
                                    {university.tips.map((tip, idx) => (
                                        <li key={idx} className="flex items-start gap-3 bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                            <span className="flex shrink-0 w-7 h-7 rounded-full bg-brand-orange text-white font-bold text-xs items-center justify-center">
                                                {idx + 1}
                                            </span>
                                            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                                {tip}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-slate-900 text-white rounded-3xl p-8 text-center shadow-xl border border-slate-800">
                                <span className="material-icons text-brand-orange text-4xl mb-4">forum</span>
                                <h3 className="text-xl md:text-2xl font-bold mb-3">¿Necesitas orientación con tu tema u objetivos?</h3>
                                <p className="text-slate-300 text-xs md:text-sm mb-6 leading-relaxed">
                                    Te ayudamos a estructurar el problema de investigación y la metodología siguiendo los parámetros exigidos en la {university.shortName}.
                                </p>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white hover:bg-orange-600 font-bold px-6 py-3.5 rounded-xl w-full transition-colors"
                                >
                                    <span className="material-icons">chat</span>
                                    <span>Hablar con un asesor metodológico</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default UniversityTemplate;
