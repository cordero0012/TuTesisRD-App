import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/SEO';
import FAQSection from '../../components/common/FAQSection';

const ComoHacerTesis: React.FC = () => {
    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "Cómo Hacer una Tesis Universitaria: Guía Metodológica",
        "description": "Guía académica paso a paso para elaborar una tesis de grado o maestría, desde el anteproyecto hasta la defensa, basada en metodología de investigación estándar.",
        "step": [
            {
                "@type": "HowToStep",
                "name": "Fase 1: El Anteproyecto",
                "text": "Definición del tema, planteamiento del problema, objetivos y justificación. Es la hoja de ruta aprobada por la universidad."
            },
            {
                "@type": "HowToStep",
                "name": "Fase 2: Construcción del Marco Teórico",
                "text": "Revisión exhaustiva de literatura para sustentar la investigación con teorías y antecedentes válidos."
            },
            {
                "@type": "HowToStep",
                "name": "Fase 3: Diseño y Ejecución Metodológica",
                "text": "Selección del enfoque (cuanti/cuali), diseño de instrumentos, recolección y análisis de datos."
            },
            {
                "@type": "HowToStep",
                "name": "Fase 4: Redacción y Defensa",
                "text": "Escritura del informe final bajo normas APA 7 y presentación oral ante el jurado."
            }
        ]
    };

    const faqData = [
        {
            question: "¿Qué pasa si mi tema es rechazado?",
            answer: "Es común. Generalmente se debe a falta de delimitación o viabilidad. Revisa si el tema es demasiado amplio o si no tienes acceso a los datos necesarios. Ajusta el enfoque con tu asesor."
        },
        {
            question: "¿Cuánto tiempo toma hacer una tesis?",
            answer: "Varía según el nivel y la dedicación. Una tesis de grado suele tomar entre 4 y 6 meses; una de maestría, de 6 a 12 meses. La clave es la constancia diaria."
        },
        {
            question: "¿Es obligatorio usar APA 7?",
            answer: "La mayoría de universidades dominicanas (UASD, PUCMM, UNIBE) exigen APA 7 para ciencias sociales y humanidades. Ingeniería puede requerir IEEE. Verifica siempre el manual de tu institución."
        }
    ];

    return (
        <div className="font-sans text-gray-800 bg-background-light dark:bg-background-dark dark:text-gray-100 transition-colors duration-200">
            <SEO
                schema={howToSchema}
                author="TuTesisRD Académico"
            />
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-12">
                <article className="prose lg:prose-xl dark:prose-invert mx-auto">
                    <header className="mb-8 text-center">
                        <span className="text-brand-orange font-semibold tracking-wide uppercase text-sm">Metodología Paso a Paso</span>
                        <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-gray-900 dark:text-white">Cómo Hacer una Tesis</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Una guía estructurada basada en estándares académicos internacionales.
                        </p>
                    </header>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 mb-10">
                        <p className="text-sm md:text-base">
                            <strong>Nota:</strong> Esta guía sigue la lógica general de investigación descrita por autores como Hernández Sampieri (2014) y Bernal (2010). Sin embargo, siempre debes consultar el reglamento específico de tu universidad.
                        </p>
                    </div>

                    <div className="space-y-16">
                        {/* FASE 1: EL ANTEPROYECTO */}
                        <section>
                            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-2">Fase 1: El Anteproyecto (La Planificación)</h2>
                            <p>
                                Antes de escribir la tesis, debes planificarla. El anteproyecto es el documento que "vende" tu idea a la universidad para su aprobación.
                            </p>
                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                                    <h3 className="text-xl font-bold mb-2 text-brand-orange">1. Selección y Delimitación</h3>
                                    <p className="text-sm">
                                        No busques "descubrir el hilo negro". Busca un problema específico en un lugar y tiempo determinados.
                                        <br /><em>Ejemplo incorrecto:</em> "El marketing digital".
                                        <br /><em>Ejemplo delimitado:</em> "Impacto del marketing digital en las ventas de PYMES de Santo Domingo, 2024-2025".
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                                    <h3 className="text-xl font-bold mb-2 text-brand-orange">2. Planteamiento del Problema</h3>
                                    <p className="text-sm">
                                        Describe la situación actual (síntomas), las causas posibles y las consecuencias si no se resuelve. Termina con la <strong>Sistematización del Problema</strong> (preguntas de investigación).
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* FASE 2: MARCO TEÓRICO */}
                        <section>
                            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-2">Fase 2: Fundamentación Teórica</h2>
                            <p>
                                Una tesis sin teoría es solo una opinión. En esta fase debes demostrar que conoces lo que otros han investigado sobre tu tema.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li><strong>Antecedentes:</strong> Investiga tesis previas (nacionales e internacionales) similares a la tuya. Revisa <Link to="/recursos/ejemplos-tesis" className="text-brand-orange hover:underline">nuestros ejemplos de repositorios</Link>.</li>
                                <li><strong>Bases Teóricas:</strong> Define los conceptos clave y las teorías que sustentan tu estudio citando autores reconocidos en APA 7.</li>
                            </ul>
                        </section>

                        {/* FASE 3: METODOLOGÍA */}
                        <section>
                            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-2">Fase 3: Diseño Metodológico</h2>
                            <p>
                                Es la "receta" de tu investigación. Debe ser tan detallada que otro investigador pueda replicar tu estudio.
                            </p>
                            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg mt-4">
                                <h3 className="font-bold mb-2">Decisiones Clave:</h3>
                                <ul className="space-y-2 text-sm">
                                    <li><strong>Enfoque:</strong> ¿Cuantitativo (números), Cualitativo (cualidades) o Mixto?</li>
                                    <li><strong>Alcance:</strong> ¿Exploratorio, Descriptivo, Correlacional o Explicativo?</li>
                                    <li><strong>Población y Muestra:</strong> ¿A quiénes vas a estudiar y cómo los seleccionarás?</li>
                                </ul>
                            </div>
                        </section>

                        {/* FASE 4: RESULTADOS Y DEFENSA */}
                        <section>
                            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-2">Fase 4: Resultados y Defensa</h2>
                            <p>
                                Una vez aplicados los instrumentos, procesa los datos y preséntalos objetivamente.
                            </p>
                            <div className="mt-6">
                                <h3 className="text-xl font-bold mb-3">Consejos para la Defensa Oral</h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                                        <span className="text-3xl mb-2 block">⏱️</span>
                                        <h4 className="font-bold">Respeta el Tiempo</h4>
                                        <p className="text-xs mt-1">Suele ser de 15 a 20 minutos. Ensaya para no excederte.</p>
                                    </div>
                                    <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                                        <span className="text-3xl mb-2 block">🎯</span>
                                        <h4 className="font-bold">Enfócate en Hallazgos</h4>
                                        <p className="text-xs mt-1">No leas el marco teórico. Ve directo a la metodología y resultados.</p>
                                    </div>
                                    <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                                        <span className="text-3xl mb-2 block">👔</span>
                                        <h4 className="font-bold">Imagen Profesional</h4>
                                        <p className="text-xs mt-1">Tu vestimenta y lenguaje corporal comunican seguridad.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <FAQSection questions={faqData} className="mt-12" />

                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-8 mt-16 text-center shadow-xl">
                        <h2 className="text-2xl font-bold mb-4">¿Te sientes perdido con el formato APA?</h2>
                        <p className="mb-6 opacity-90">
                            No pierdas puntos por errores de forma. Nuestra IA puede revisar tus citas y referencias automáticamente.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link to="/tools/ai-audit" className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg transform hover:-translate-y-1">
                                Auditar mi Tesis con IA
                            </Link>
                        </div>
                    </div>

                </article>
            </main>
            <Footer />
        </div>
    );
};

export default ComoHacerTesis;
