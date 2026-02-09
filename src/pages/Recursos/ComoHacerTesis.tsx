import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/SEO';

const ComoHacerTesis: React.FC = () => {
    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "Cómo Hacer una Tesis Universitara Paso a Paso",
        "description": "Guía detallada de 7 pasos para elaborar una tesis de grado o maestría, desde la elección del tema hasta la defensa final, según estándares académicos.",
        "step": [
            {
                "@type": "HowToStep",
                "name": "Elección y Delimitación del Tema",
                "text": "Selecciona un tema que te apasione y sea viable. Delimítalo en tiempo y espacio para que sea manejable."
            },
            {
                "@type": "HowToStep",
                "name": "Elaboración del Anteproyecto",
                "text": "Redacta el protocolo de investigación incluyendo planteamiento del problema, objetivos, justificación y cronograma."
            },
            {
                "@type": "HowToStep",
                "name": "Construcción del Marco Teórico",
                "text": "Recopila y analiza antecedentes y bases teóricas que sustenten tu investigación."
            },
            {
                "@type": "HowToStep",
                "name": "Diseño Metodológico",
                "text": "Define si tu enfoque será cuantitativo, cualitativo o mixto, y selecciona tus instrumentos de recolección de datos."
            },
            {
                "@type": "HowToStep",
                "name": "Trabajo de Campo y Análisis",
                "text": "Aplica los instrumentos, recolecta la información y procesa los datos obtenidos."
            },
            {
                "@type": "HowToStep",
                "name": "Redacción Final",
                "text": "Estructura el documento final siguiendo las normas APA 7 y los lineamientos de tu universidad."
            },
            {
                "@type": "HowToStep",
                "name": "Defensa de Tesis",
                "text": "Prepara una presentación concisa y defiende tus hallazgos ante el jurado evaluador."
            }
        ],
        "totalTime": "P6M",
        "supply": [
            {
                "@type": "HowToSupply",
                "name": "Computadora"
            },
            {
                "@type": "HowToSupply",
                "name": "Acceso a Bibliotecas"
            },
            {
                "@type": "HowToSupply",
                "name": "Asesor de Tesis"
            }
        ]
    };

    return (
        <div className="font-sans text-gray-800 bg-background-light dark:bg-background-dark dark:text-gray-100 transition-colors duration-200">
            <SEO
                title="Cómo Hacer una Tesis Paso a Paso: Guía Completa 2026"
                description="Aprende los 7 pasos esenciales para elaborar tu tesis de grado o postgrado. Metodología práctica y consejos para aprobar sin estrés."
                keywords={['cómo hacer una tesis', 'pasos para hacer una tesis', 'elaboración de tesis', 'anteproyecto de tesis', 'guía tesis uasd']}
                schema={howToSchema}
                type="article"
                publishedTime="2026-02-09"
                author="TuTesisRD Académico"
            />
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-12">
                <article className="prose lg:prose-xl dark:prose-invert mx-auto">
                    <header className="mb-8 text-center">
                        <span className="text-brand-orange font-semibold tracking-wide uppercase text-sm">Guía Práctica</span>
                        <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-gray-900 dark:text-white">Cómo Hacer una Tesis</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            La hoja de ruta definitiva para estudiantes que buscan estructura y claridad.
                        </p>
                    </header>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-10 border-l-4 border-blue-500">
                        <p className="font-medium text-lg">
                            Elaborar una tesis puede parecer abrumador, pero si divides el proceso en etapas manejables, se convierte en una meta alcanzable. A continuación, desglosamos el proceso en <strong>7 pasos fundamentales</strong> validados por metodólogos expertos (Facultad de Ciencias de la Salud UASD, 2020).
                        </p>
                    </div>

                    <div className="space-y-12">
                        {/* Paso 1 */}
                        <section className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700">
                            <div className="absolute -left-3 top-0 bg-brand-orange text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                            <h2 className="text-2xl font-bold mb-3 mt-0">Elección y Delimitación del Tema</h2>
                            <p>
                                El error más común es elegir temas demasiado amplios. Un buen tema debe ser:
                            </p>
                            <ul className="list-disc pl-5 mt-2">
                                <li><strong>Viable:</strong> ¿Tienes acceso a la información?</li>
                                <li><strong>Específico:</strong> Delimitado en tiempo y espacio.</li>
                                <li><strong>Relevante:</strong> ¿Aporta algo nuevo o resuelve un problema?</li>
                            </ul>
                        </section>

                        {/* Paso 2 */}
                        <section className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700">
                            <div className="absolute -left-3 top-0 bg-brand-orange text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                            <h2 className="text-2xl font-bold mb-3 mt-0">El Anteproyecto (Protocolo)</h2>
                            <p>
                                Es el "plano" de tu investigación. Debe incluir el planteamiento del problema, los objetivos (general y específicos), la justificación y un cronograma de trabajo. Sin un anteproyecto aprobado, no debes iniciar la redacción final.
                            </p>
                        </section>

                        {/* Paso 3 */}
                        <section className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700">
                            <div className="absolute -left-3 top-0 bg-brand-orange text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                            <h2 className="text-2xl font-bold mb-3 mt-0">Marco Teórico</h2>
                            <p>
                                Investiga qué se ha escrito antes sobre tu tema. Utiliza bases de datos académicas confiables (Google Académico, Scielo, Redalyc) y organiza la información de lo general a lo específico. Recuerda citar todo en <strong>APA 7</strong> para evitar el plagio.
                            </p>
                        </section>

                        {/* Paso 4 */}
                        <section className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700">
                            <div className="absolute -left-3 top-0 bg-brand-orange text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">4</div>
                            <h2 className="text-2xl font-bold mb-3 mt-0">Diseño Metodológico</h2>
                            <p>
                                Define el "cómo". ¿Será una investigación cuantitativa (encuestas, estadísticas) o cualitativa (entrevistas, análisis de discurso)? Describe tus instrumentos y valida su confiabilidad antes de aplicarlos.
                            </p>
                        </section>

                        {/* Paso 5 */}
                        <section className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700">
                            <div className="absolute -left-3 top-0 bg-brand-orange text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">5</div>
                            <h2 className="text-2xl font-bold mb-3 mt-0">Trabajo de Campo y Resultados</h2>
                            <p>
                                Ejecuta tu investigación. Recolecta los datos, tabúlalos y preséntalos de forma objetiva (sin interpretarlos aún). Utiliza gráficos y tablas formato APA para visualizar la información clave.
                            </p>
                        </section>

                        {/* Paso 6 */}
                        <section className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700">
                            <div className="absolute -left-3 top-0 bg-brand-orange text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">6</div>
                            <h2 className="text-2xl font-bold mb-3 mt-0">Discusión y Conclusiones</h2>
                            <p>
                                Contrasta tus resultados con tu marco teórico. ¿Se cumplieron los objetivos? ¿Se validó la hipótesis? Redacta conclusiones contundentes derivadas directamente de tus hallazgos.
                            </p>
                        </section>

                        {/* Paso 7 */}
                        <section className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700">
                            <div className="absolute -left-3 top-0 bg-brand-orange text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">7</div>
                            <h2 className="text-2xl font-bold mb-3 mt-0">Revisión y Defensa Final</h2>
                            <p>
                                Revisa la coherencia gramatical, el formato y las referencias. Prepara una presentación sintética para la defensa, enfocándote en la metodología y los aportes de tu investigación.
                            </p>
                        </section>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg mt-12">
                        <h3 className="text-lg font-bold mb-2">Consejo de Experto</h3>
                        <p className="italic text-gray-700 dark:text-gray-300">
                            "La tesis perfecta no existe, la tesis terminada sí. Avanza paso a paso y apóyate en tu asesor o en servicios profesionales cuando te sientas estancado."
                        </p>
                    </div>

                </article>

                <div className="bg-brand-orange/10 rounded-2xl p-8 mt-16 text-center border border-brand-orange/20">
                    <h2 className="text-2xl font-bold mb-4 text-brand-orange">¿Te sientes estancado en alguno de estos pasos?</h2>
                    <p className="mb-6 max-w-2xl mx-auto dark:text-gray-200">
                        Nuestra herramienta de <strong>Auditoría con IA</strong> puede revisar tu avance actual y decirte exactamente qué mejorar. O solicita una asesoría personalizada.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link to="/register" className="bg-brand-orange hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg">
                            Solicitar Asesoría
                        </Link>
                        <Link to="/tools/ai-audit" className="bg-white dark:bg-gray-800 text-brand-orange font-bold py-3 px-8 rounded-full border border-brand-orange hover:bg-orange-50 dark:hover:bg-gray-700 transition-all">
                            Probar Auditoría IA
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ComoHacerTesis;
