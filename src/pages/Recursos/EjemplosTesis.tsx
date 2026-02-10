import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/SEO';
// Icons replaced with Material Icons

const EjemplosTesis: React.FC = () => {
    const repositories = [
        { name: 'Repositorio UASD', url: 'https://repositoriovip.uasd.edu.do/', description: 'Universidad Autónoma de Santo Domingo (Investigación y Postgrado)' },
        { name: 'Repositorio PUCMM', url: 'https://repositorioinvestigare.pucmm.edu.do/', description: 'Pontificia Universidad Católica Madre y Maestra' },
        { name: 'Repositorio INTEC', url: 'https://repositoriobiblioteca.intec.edu.do/', description: 'Instituto Tecnológico de Santo Domingo' },
        { name: 'CRIS INTEC', url: 'https://cris.intec.edu.do/', description: 'Perfil de investigadores y publicaciones INTEC' },
        { name: 'Repositorio UNAPEC', url: 'https://repositorio.unapec.edu.do/', description: 'Universidad APEC' },
        { name: 'Repositorio UNPHU', url: 'https://repositorio.unphu.edu.do/', description: 'Universidad Nacional Pedro Henríquez Ureña' },
        { name: 'Repositorio UNIBE', url: 'https://repositorio.unibe.edu.do/', description: 'Universidad Iberoamericana' },
        { name: 'Repositorio UAPA', url: 'https://rai.uapa.edu.do/', description: 'Universidad Abierta para Adultos' },
        { name: 'IDEICE - INERED', url: 'https://portal.ideice.gob.do/inered/', description: 'Instituto Dominicano de Evaluación e Investigación de la Calidad Educativa' },
        { name: 'Repositorio MEPyD', url: 'https://mepyd.gob.do/repositorio-digital/', description: 'Ministerio de Economía, Planificación y Desarrollo' },
        { name: 'Biblioteca Digital BNPHU', url: 'https://bd.bnphu.gob.do/home', description: 'Biblioteca Nacional Pedro Henríquez Ureña' },
    ];

    const structures = [
        {
            title: "Estructura Clásica (APA 7)",
            items: [
                "Portada",
                "Dedicatoria y Agradecimientos (Opcional)",
                "Resumen (Abstract)",
                "Índice General",
                "Capítulo I: Introducción (Planteamiento, Objetivos, Justificación)",
                "Capítulo II: Marco Teórico",
                "Capítulo III: Metodología",
                "Capítulo IV: Resultados y Discusión",
                "Conclusiones y Recomendaciones",
                "Referencias Bibliográficas",
                "Anexos"
            ]
        },
        {
            title: "Estructura de Anteproyecto",
            items: [
                "Título Tentativo",
                "Planteamiento del Problema",
                "Preguntas de Investigación",
                "Objetivos (General y Específicos)",
                "Justificación y Viabilidad",
                "Marco Teórico Preliminar",
                "Metodología Propuesta",
                "Cronograma de Actividades",
                "Referencias Preliminares"
            ]
        }
    ];

    return (
        <div className="font-sans text-gray-800 bg-background-light dark:bg-background-dark dark:text-gray-100 transition-colors duration-200">
            <SEO
                title="Ejemplos de Tesis y Repositorios Académicos RD (2026)"
                description="Accede a los mejores ejemplos de tesis de grado y maestría en República Dominicana. Enlaces a repositorios de UASD, PUCMM, INTEC y más."
                keywords={['ejemplos de tesis', 'repositorio tesis uasd', 'tesis pucmm', 'estructuras de tesis', 'modelos de tesis']}
                type="article"
                publishedTime="2026-02-09"
                author="TuTesisRD Académico"
            />
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-12">
                <header className="mb-12 text-center">
                    <span className="text-brand-orange font-semibold tracking-wide uppercase text-sm">Biblioteca Digital</span>
                    <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-gray-900 dark:text-white">Ejemplos de Tesis</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        La mejor forma de aprender es viendo ejemplos reales. Explora los repositorios oficiales de las principales universidades dominicanas.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-12 mb-16">
                    {/* Sección Repositorios */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="material-icons text-brand-orange">menu_book</span>
                            Repositorios Oficiales
                        </h2>
                        <div className="grid gap-4">
                            {repositories.map((repo, idx) => (
                                <a
                                    key={idx}
                                    href={repo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all group"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-lg group-hover:text-brand-orange transition-colors">{repo.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{repo.description}</p>
                                        </div>
                                        <span className="material-icons text-gray-400 group-hover:text-brand-orange">open_in_new</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>

                    {/* Sección Estructuras */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="material-icons text-brand-orange">description</span>
                            Estructuras Comunes
                        </h2>
                        <div className="space-y-6">
                            {structures.map((struct, idx) => (
                                <div key={idx} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
                                        {struct.title}
                                    </h3>
                                    <ul className="space-y-2">
                                        {struct.items.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                <span className="min-w-[6px] h-[6px] rounded-full bg-brand-orange mt-2"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Banner de Descarga de Plantilla (Call to Action) */}
                <div className="bg-gradient-to-r from-brand-blue to-blue-600 rounded-2xl p-8 md:p-12 text-white text-center shadow-xl">
                    <h2 className="text-3xl font-bold mb-4">¿Necesitas una plantilla lista para usar?</h2>
                    <p className="mb-8 text-blue-100 text-lg max-w-2xl mx-auto">
                        Ahorra horas de formato con nuestra plantilla Word configurada con todas las normas APA 7ma edición.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="bg-white text-brand-blue font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-lg">
                            <span className="material-icons">download</span>
                            Descargar Plantilla APA 7
                        </button>
                        <Link to="/recursos/como-hacer-tesis" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition-all">
                            Ver Guía de Redacción
                        </Link>
                    </div>
                    <p className="text-xs text-blue-200 mt-4">
                        *Plantilla genérica válida para la mayoría de universidades. Revisa siempre los requisitos específicos de tu institución.
                    </p>
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default EjemplosTesis;
