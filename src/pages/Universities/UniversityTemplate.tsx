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
            <div className="min-h-screen bg-tutesis-white dark:bg-tutesis-black font-sans flex flex-col items-center justify-center p-6 text-center text-tutesis-black dark:text-tutesis-white">
                <SEO title="Universidad No Encontrada | TuTesisRD" description="La universidad que buscas no está registrada en nuestra base de datos activa." />
                <Navbar />
                <main className="pt-32 pb-20 max-w-md mx-auto">
                    <span className="material-icons text-tutesis-orange text-5xl mb-4">school</span>
                    <h1 className="font-display text-3xl font-black mb-4 text-tutesis-black dark:text-tutesis-white">Universidad no encontrada</h1>
                    <p className="text-tutesis-black/70 dark:text-tutesis-white/70 mb-8 leading-relaxed">
                        No encontramos información registrada para esta institución. Explora nuestro directorio general para consultar las universidades disponibles.
                    </p>
                    <Link
                        to="/universidades"
                        className="inline-flex items-center justify-center gap-2 bg-tutesis-orange text-tutesis-black hover:bg-tutesis-gold font-bold px-6 py-3 rounded-md shadow-md transition-colors"
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
        <div className="min-h-screen bg-tutesis-white dark:bg-tutesis-black font-sans text-tutesis-black dark:text-tutesis-white transition-colors duration-300">
            <SEO
                title={`Tesis y Monográficos para ${university.shortName} | TuTesisRD`}
                description={`Asesoría experta adaptada a la normativa de la ${university.name}. Estilo ${university.regulations.style}, ${university.regulations.minPages}-${university.regulations.maxPages} páginas.`}
            />
            <Navbar />

            <main className="pt-28 pb-20">
                {/* Breadcrumb Navigation */}
                <div className="bg-tutesis-black/5 dark:bg-tutesis-white/5 border-b border-tutesis-black/15 dark:border-tutesis-white/20 py-3">
                    <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
                        <nav aria-label="Miga de pan" className="flex items-center gap-2 text-xs md:text-sm text-tutesis-black/70 dark:text-tutesis-white/70">
                            <Link to="/" className="hover:text-tutesis-orange transition-colors">Inicio</Link>
                            <span className="material-icons text-xs text-tutesis-orange">chevron_right</span>
                            <Link to="/universidades" className="hover:text-tutesis-orange transition-colors">Universidades</Link>
                            <span className="material-icons text-xs text-tutesis-orange">chevron_right</span>
                            <span className="font-semibold text-tutesis-black dark:text-tutesis-white">{university.shortName}</span>
                        </nav>
                    </div>
                </div>

                {/* Hero Section */}
                <section className="bg-tutesis-black text-tutesis-white border-b border-tutesis-white/20 py-12 md:py-16 relative overflow-hidden">
                    <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10 relative z-10 text-center max-w-4xl">
                        <div className="inline-block p-3 bg-tutesis-white rounded-md shadow-md mb-6">
                            <img src={university.logo} alt={`Logo de ${university.name}`} className="h-16 md:h-20 object-contain mx-auto" />
                        </div>

                        <h1 className="font-display text-3xl md:text-5xl font-black mb-6 tracking-tight text-tutesis-white">
                            Asesoría de Tesis para <span className="text-tutesis-orange">{university.shortName}</span>
                        </h1>

                        <p className="text-base md:text-xl text-tutesis-white/75 max-w-2xl mx-auto mb-8 leading-relaxed">
                            {university.description} Te acompañamos paso a paso respetando los criterios metodológicos exigidos por la {university.shortName}.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-tutesis-orange text-tutesis-black hover:bg-tutesis-gold font-extrabold text-base px-6 py-4 rounded-md shadow-md transition-colors"
                            >
                                <span className="material-icons">chat</span>
                                <span>Cotizar mi Tesis en {university.shortName}</span>
                            </a>
                            <Link
                                to="/herramientas/matriz"
                                className="inline-flex items-center justify-center gap-2 border border-tutesis-white/30 bg-tutesis-black text-tutesis-white hover:bg-tutesis-white/10 font-bold text-base px-6 py-4 rounded-md transition-colors"
                            >
                                <span className="material-icons">assessment</span>
                                <span>Auditar Borrador con Matriz</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Regulations Section */}
                <section className="py-12 md:py-16 mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <span className="inline-block py-1 px-3 rounded-full bg-tutesis-orange text-tutesis-black font-extrabold uppercase tracking-widest text-xs mb-3">
                            Lineamientos Específicos
                        </span>
                        <h2 className="font-display text-2xl md:text-4xl font-extrabold tracking-tight text-tutesis-black dark:text-tutesis-white">
                            Normativa de Grado y Posgrado ({university.shortName})
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <Card className="p-6 md:p-8 text-center bg-tutesis-white dark:bg-tutesis-black border border-tutesis-black/15 dark:border-tutesis-white/20 rounded-md">
                            <span className="material-icons text-tutesis-orange text-4xl mb-3">gavel</span>
                            <h3 className="font-display text-lg font-bold mb-2 text-tutesis-black dark:text-tutesis-white">Estilo de Citas Requerido</h3>
                            <p className="text-sm font-semibold text-tutesis-black/80 dark:text-tutesis-white/80">{university.regulations.style}</p>
                        </Card>

                        <Card className="p-6 md:p-8 text-center bg-tutesis-white dark:bg-tutesis-black border border-tutesis-black/15 dark:border-tutesis-white/20 rounded-md">
                            <span className="material-icons text-tutesis-orange text-4xl mb-3">description</span>
                            <h3 className="font-display text-lg font-bold mb-2 text-tutesis-black dark:text-tutesis-white">Rango de Extensión</h3>
                            <p className="text-sm font-semibold text-tutesis-black/80 dark:text-tutesis-white/80">
                                {university.regulations.minPages} a {university.regulations.maxPages} páginas
                            </p>
                        </Card>

                        <Card className="p-6 md:p-8 text-center bg-tutesis-white dark:bg-tutesis-black border border-tutesis-black/15 dark:border-tutesis-white/20 rounded-md">
                            <span className="material-icons text-tutesis-orange text-4xl mb-3">school</span>
                            <h3 className="font-display text-lg font-bold mb-2 text-tutesis-black dark:text-tutesis-white">Programas Destacados</h3>
                            <p className="text-xs md:text-sm text-tutesis-black/70 dark:text-tutesis-white/70">
                                {university.programs.join(', ')}
                            </p>
                        </Card>
                    </div>

                    {/* Disclaimer */}
                    <div className="p-4 bg-tutesis-gold/15 border border-tutesis-orange/30 rounded-md flex items-start gap-3 max-w-4xl mx-auto">
                        <span className="material-icons text-tutesis-orange shrink-0">info</span>
                        <p className="text-xs md:text-sm text-tutesis-black/80 dark:text-tutesis-white/80 font-medium leading-relaxed">
                            <strong>Nota institucional:</strong> Consulta siempre el manual o reglamento oficial vigente emitido por la {university.name} para verificar eventuales cambios en las guías metodológicas de tu facultad.
                        </p>
                    </div>
                </section>

                {/* Tips & Guidance Section */}
                <section className="py-12 bg-tutesis-black/5 dark:bg-tutesis-white/5 border-y border-tutesis-black/15 dark:border-tutesis-white/20">
                    <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
                        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
                            <div>
                                <h2 className="font-display text-2xl md:text-3xl font-black mb-6 tracking-tight text-tutesis-black dark:text-tutesis-white">
                                    Consejos clave para tu trabajo en {university.shortName}
                                </h2>
                                <ul className="space-y-4">
                                    {university.tips.map((tip, idx) => (
                                        <li key={idx} className="flex items-start gap-3 bg-tutesis-white dark:bg-tutesis-black p-4 rounded-md border border-tutesis-black/15 dark:border-tutesis-white/20">
                                            <span className="flex shrink-0 w-7 h-7 rounded-full bg-tutesis-orange text-tutesis-black font-extrabold text-xs items-center justify-center">
                                                {idx + 1}
                                            </span>
                                            <p className="text-xs md:text-sm text-tutesis-black/80 dark:text-tutesis-white/80 leading-relaxed">
                                                {tip}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-tutesis-black text-tutesis-white rounded-md p-8 text-center border border-tutesis-white/20">
                                <span className="material-icons text-tutesis-orange text-4xl mb-4">forum</span>
                                <h3 className="font-display text-xl md:text-2xl font-bold mb-3 text-tutesis-white">¿Necesitas orientación con tu tema u objetivos?</h3>
                                <p className="text-tutesis-white/75 text-xs md:text-sm mb-6 leading-relaxed">
                                    Te ayudamos a estructurar el problema de investigación y la metodología siguiendo los parámetros exigidos en la {university.shortName}.
                                </p>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 bg-tutesis-orange text-tutesis-black hover:bg-tutesis-gold font-bold px-6 py-3.5 rounded-md w-full transition-colors"
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
