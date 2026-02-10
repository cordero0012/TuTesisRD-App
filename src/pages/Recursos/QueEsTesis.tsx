import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/SEO';
import FAQSection from '../../components/common/FAQSection';

const QueEsTesis: React.FC = () => {
    const faqData = [
        {
            question: "¿Cuál es la diferencia entre tesis y monografía?",
            answer: "La principal diferencia radica en el nivel de originalidad y profundidad. Una <strong>monografía</strong> es un estudio descriptivo o compilatorio sobre un tema específico, mientras que una <strong>tesis</strong> exige un aporte original al conocimiento, planteando una hipótesis y validándola mediante una metodología rigurosa (Hernández Sampieri et al., 2014)."
        },
        {
            question: "¿Qué es una tesis de grado?",
            answer: "Es un trabajo de investigación que se presenta como requisito final para obtener un título de licenciatura o ingeniería. Su objetivo es demostrar que el estudiante domina los métodos de investigación y los conocimientos de su carrera. Suele tener un enfoque más práctico o aplicativo."
        },
        {
            question: "¿Qué es una tesis doctoral?",
            answer: "Es un trabajo de investigación original e inédito que realiza un aspirante a doctor. Debe constituir un aporte significativo y novedoso al campo de estudio. A diferencia de la tesis de grado, exige un mayor nivel de abstracción teórica y rigor metodológico."
        }
    ];

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };

    return (
        <div className="font-sans text-gray-800 bg-background-light dark:bg-background-dark dark:text-gray-100 transition-colors duration-200">
            <SEO
                title="Qué es una Tesis: Definición, Tipos y Características (2026)"
                description="Descubre qué es una tesis, sus características principales y la diferencia entre tesis de grado y doctoral. Explicación académica con referencias APA 7."
                keywords={['qué es una tesis', 'definición de tesis', 'tipos de tesis', 'tesis de grado', 'tesis doctoral', 'características de una tesis']}
                schema={faqSchema}
                type="article"
                publishedTime="2026-02-09"
                author="TuTesisRD Académico"
            />
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-12">
                <article className="prose lg:prose-xl dark:prose-invert mx-auto">
                    <header className="mb-8 text-center">
                        <span className="text-brand-orange font-semibold tracking-wide uppercase text-sm">Fundamentos Académicos</span>
                        <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-gray-900 dark:text-white">¿Qué es una Tesis?</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Entendiendo el requisito académico más importante de tu carrera.
                        </p>
                    </header>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-10 border-l-4 border-brand-orange">
                        <p className="font-medium text-lg leading-relaxed">
                            Una tesis es un trabajo de investigación original que presenta un autor para obtener un grado académico. Se caracteriza por aportar <strong>conocimiento nuevo</strong> o una <strong>solución innovadora</strong> a un problema específico, sustentada en una metodología rigurosa y un marco teórico sólido (Eco, 2001).
                        </p>
                    </div>

                    <section className="mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Características Principales</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                                <h3 className="text-xl font-bold mb-3 text-brand-orange">Originalidad</h3>
                                <p className="text-sm">No se trata de copiar lo que otros han dicho, sino de proponer una nueva perspectiva, datos inéditos o una aplicación novedosa.</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                                <h3 className="text-xl font-bold mb-3 text-brand-orange">Rigor Metodológico</h3>
                                <p className="text-sm">Debe seguir un método científico (cuantitativo, cualitativo o mixto) que garantice la validez y fiabilidad de los resultados.</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                                <h3 className="text-xl font-bold mb-3 text-brand-orange">Objetividad</h3>
                                <p className="text-sm">Se basa en hechos y evidencias, no en opiniones personales o creencias sin fundamento.</p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Tipos de Tesis</h2>

                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold mb-2">Tesis de Grado (Licenciatura/Ingeniería)</h3>
                                    <p>
                                        Su propósito principal es demostrar que estás capacitado para ejercer la profesión. Generalmente, se enfoca en aplicar conocimientos adquiridos para resolver un problema práctico o analizar una situación específica.
                                    </p>
                                </div>
                            </div>

                            <hr className="border-gray-200 dark:border-gray-700" />

                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold mb-2">Tesis de Maestría</h3>
                                    <p>
                                        Busca profundizar en un área específica del conocimiento. Exige un mayor dominio teórico y analítico. Puede ser de investigación (académica) o profesionalizante (aplicación práctica avanzada).
                                    </p>
                                </div>
                            </div>

                            <hr className="border-gray-200 dark:border-gray-700" />

                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold mb-2">Tesis Doctoral</h3>
                                    <p>
                                        Es el nivel más alto. Exige crear conocimiento nuevo que expanda las fronteras de la disciplina. Es un trabajo extenso y profundo que defiende una postura original ante la comunidad científica.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <FAQSection questions={faqData} title="Preguntas Frecuentes sobre Tesis" />

                    <div className="bg-brand-orange/5 rounded-2xl p-8 mt-12 text-center">
                        <h2 className="text-2xl font-bold mb-4">¿Listo para empezar tu tesis?</h2>
                        <p className="mb-6">
                            Ahora que sabes qué es, el siguiente paso es conocer el proceso para elaborarla.
                        </p>
                        <Link to="/recursos/como-hacer-tesis" className="inline-block bg-brand-orange hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md">
                            Ver Guía Paso a Paso
                        </Link>
                    </div>

                    <div className="mt-12 text-sm text-gray-500 dark:text-gray-400 border-t pt-4">
                        <h4 className="font-bold mb-2">Referencias</h4>
                        <ul className="list-none space-y-1">
                            <li>Eco, U. (2001). <em>Cómo se hace una tesis</em>. Gedisa.</li>
                            <li>Hernández Sampieri, R., Fernández Collado, C., & Baptista Lucio, P. (2014). <em>Metodología de la investigación</em> (6a. ed.). McGraw-Hill.</li>
                        </ul>
                    </div>

                </article>
            </main>
            <Footer />
        </div>
    );
};

export default QueEsTesis;
