import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/SEO';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import universitiesData from '../../data/universities.json';

// Type definition matches the JSON structure
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

    // Scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [universityId]);

    if (!university) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans flex flex-col items-center justify-center p-4">
                <SEO title="Universidad No Encontrada" description="La universidad que buscas no está en nuestra base de datos." />
                <h1 className="text-3xl font-bold mb-4">Universidad no encontrada</h1>
                <p className="mb-4">Lo sentimos, no tenemos información específica para esta universidad todavía.</p>
                <Link to="/">
                    <Button variant="primary">Volver al Inicio</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-white transition-colors duration-300">
            <SEO
                title={`Tesis y Monográficos para ${university.shortName} | TuTesisRD`}
                description={`Asesoría experta para estudiantes de la ${university.name}. Cumplimos con normativa ${university.regulations.style}. ¡Cotiza hoy!`}
            />
            <Navbar />

            {/* HERO SECTION DYNAMIC */}
            <div className="relative pt-32 pb-20 overflow-hidden">
                <div
                    className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 -z-10"
                    style={{ backgroundColor: university.color }}
                ></div>

                <div className="container mx-auto px-6 text-center">
                    <div className="inline-block p-2 bg-white rounded-full shadow-lg mb-6 animate-fade-in">
                        <img src={university.logo} alt={`Logo ${university.name}`} className="h-16 object-contain" />
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-6 animate-fade-in-up">
                        Tesis Exitosas en <span style={{ color: university.color }}>{university.shortName}</span>
                    </h1>

                    <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8 animate-slide-up">
                        {university.description} Conocemos a fondo los requisitos de la {university.name}.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <a href="https://wa.me/18296392033" target="_blank" rel="noopener noreferrer">
                            <Button variant="primary" size="lg" className="w-full md:w-auto" rightIcon={<span className="material-icons">whatsapp</span>}>
                                Cotizar mi Tesis {university.shortName}
                            </Button>
                        </a>
                        <Link to="/herramientas/auditor">
                            <Button variant="outline" size="lg" className="w-full md:w-auto">
                                Auditar Borrador Gratis
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* REGULATIONS GRID */}
            <section className="py-16 bg-white/50 dark:bg-black/20">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-12 text-center">Normativa {university.shortName}</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="p-8 text-center" hoverEffect>
                            <div className="material-icons text-4xl mb-4" style={{ color: university.color }}>gavel</div>
                            <h3 className="text-xl font-bold mb-2">Estilo Requerido</h3>
                            <p className="text-slate-500">{university.regulations.style}</p>
                        </Card>
                        <Card className="p-8 text-center" hoverEffect>
                            <div className="material-icons text-4xl mb-4" style={{ color: university.color }}>description</div>
                            <h3 className="text-xl font-bold mb-2">Extensión</h3>
                            <p className="text-slate-500">{university.regulations.minPages} - {university.regulations.maxPages} páginas</p>
                        </Card>
                        <Card className="p-8 text-center" hoverEffect>
                            <div className="material-icons text-4xl mb-4" style={{ color: university.color }}>school</div>
                            <h3 className="text-xl font-bold mb-2">Programas Top</h3>
                            <p className="text-slate-500">{university.programs.join(', ')}</p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* TIPS SECTION */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="w-full md:w-1/2">
                            <h2 className="text-3xl font-bold mb-6">
                                Consejos para sobrevivir en {university.shortName}
                            </h2>
                            <ul className="space-y-4">
                                {university.tips.map((tip, index) => (
                                    <li key={index} className="flex items-start gap-4">
                                        <div className="min-w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mt-1" style={{ backgroundColor: university.color }}>
                                            {index + 1}
                                        </div>
                                        <p className="text-lg text-slate-600 dark:text-slate-300">{tip}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-full md:w-1/2 bg-slate-100 dark:bg-slate-800 rounded-3xl p-8 border border-dashed border-gray-300 dark:border-gray-600 text-center">
                            <h3 className="text-xl font-bold mb-4">¿Necesitas ayuda con el tema?</h3>
                            <p className="mb-6 text-slate-500">
                                Nuestros asesores son egresados de {university.shortName} y conocen lo que exigen los jurados.
                            </p>
                            <Link to="/registro">
                                <Button variant="gradient" className="w-full">
                                    Agendar Asesoría Gratuita
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default UniversityTemplate;
