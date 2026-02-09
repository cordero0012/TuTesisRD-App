import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/SEO';

const QueEsTesis: React.FC = () => {
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "¿Qué es una Tesis? Definición, Tipos y Características",
        "description": "Descubre qué es una tesis académica, sus características principales y los diferentes tipos que existen (licenciatura, maestría, doctoral). Guía basada en normas APA 7 y estándares de la UASD.",
        "author": {
            "@type": "Organization",
            "name": "TuTesisRD"
        },
        "publisher": {
            "@type": "Organization",
            "name": "TuTesisRD",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.tutesisrd.online/logo.png"
            }
        },
        "datePublished": "2026-02-09",
        "dateModified": "2026-02-09"
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "¿Cuál es la diferencia entre tesis de grado y tesis doctoral?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "La tesis de grado (licenciatura) busca demostrar destrezas investigativas y aplicar conocimientos, mientras que la tesis doctoral exige un aporte original y significativo al conocimiento universal de la disciplina, proponiendo nuevas teorías."
                }
            },
            {
                "@type": "Question",
                "name": "¿Qué formato debo usar para mi tesis en RD?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "La mayoría de universidades en República Dominicana, como la UASD, utilizan las normas APA 7ª edición. Esto incluye papel tamaño carta, márgenes de 2.54 cm, fuente Times New Roman 12 o similar, e interlineado doble."
                }
            }
        ]
    };

    return (
        <div className="font-sans text-gray-800 bg-background-light dark:bg-background-dark dark:text-gray-100 transition-colors duration-200">
            <SEO
                title="¿Qué es una Tesis? Guía Completa y Definición Académica 2026"
                description="Aprende qué es una tesis, sus tipos (grado, maestría, doctoral) y características esenciales según normas académicas internacionales y de la UASD."
                keywords={['qué es tesis', 'definición de tesis', 'tipos de tesis', 'tesis de grado', 'tesis doctoral', 'tesis uasd', 'normas apa 7 tesis']}
                schema={[articleSchema, faqSchema]}
                type="article"
                publishedTime="2026-02-09"
                author="TuTesisRD Académico"
            />
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-12">
                <article className="prose lg:prose-xl dark:prose-invert mx-auto">
                    <header className="mb-8 text-center">
                        <span className="text-brand-orange font-semibold tracking-wide uppercase text-sm">Recursos Académicos</span>
                        <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-gray-900 dark:text-white">¿Qué es una Tesis?</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Definición, tipos y características fundamentales para estudiantes universitarios.
                        </p>
                    </header>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-10 border-l-4 border-brand-orange">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white mt-0">Definición Académica</h2>
                        <p className="mb-4">
                            La <strong>tesis académica</strong> se define como un trabajo de investigación monográfico, original e inédito, presentado para obtener un grado académico. Su propósito fundamental es demostrar que el estudiante posee la capacidad para aplicar métodos científicos rigurosos en la solución de un problema de conocimiento o práctico (UNAM, 2020).
                        </p>
                        <p>
                            No se trata simplemente de una recopilación de datos, sino de un texto <strong>argumentativo</strong> donde se defiende una postura o hipótesis sustentada en evidencia verificable (Hamilton College, s.f.).
                        </p>
                    </div>

                    <h2 className="text-3xl font-bold mt-12 mb-6">Características Esenciales</h2>
                    <ul className="list-disc pl-6 space-y-3 mb-10">
                        <li><strong>Originalidad:</strong> Debe aportar un enfoque novedoso o nuevos datos sobre un tema existente.</li>
                        <li><strong>Rigor Metodológico:</strong> Sus conclusiones deben derivarse de la aplicación estricta de métodos de investigación (cuantitativos, cualitativos o mixtos).</li>
                        <li><strong>Estructura Formal:</strong> Debe seguir normas de presentación específicas (como APA 7) que garanticen su claridad y uniformidad.</li>
                    </ul>

                    <h2 className="text-3xl font-bold mt-12 mb-6">Tipos de Tesis</h2>

                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold text-brand-orange mb-2">Tesis de Licenciatura (Grado)</h3>
                            <p className="text-sm">
                                Se enfoca en la exploración de un tema o la aplicación práctica de conocimientos. Prioriza la demostración de destrezas investigativas sobre la originalidad profunda.
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-bold text-brand-orange mb-2">Tesis de Maestría</h3>
                            <p className="text-sm">
                                Exige mayor profundidad y análisis crítico. Generalmente busca comprobar o reafirmar teorías existentes mediante investigación aplicada.
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm md:col-span-2">
                            <h3 className="text-xl font-bold text-brand-orange mb-2">Tesis Doctoral</h3>
                            <p className="text-sm">
                                Representa el nivel más alto. Debe realizar una <strong>contribución original y significativa</strong> al conocimiento universal de la disciplina, proponiendo nuevas teorías o modelos (UNAM, 2020).
                            </p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold mt-12 mb-6">Estructura Básica (Normativa APA 7)</h2>
                    <p className="mb-4">
                        En República Dominicana, instituciones como la <strong>UASD</strong> utilizan predominantemente las normas APA (7ª edición). Una tesis estándar debe incluir:
                    </p>
                    <ol className="list-decimal pl-6 space-y-2 mb-8">
                        <li><strong>Portada:</strong> Título, autor y afiliación institucional.</li>
                        <li><strong>Resumen (Abstract):</strong> Síntesis de 150-250 palabras del estudio.</li>
                        <li><strong>Cuerpo del Trabajo:</strong>
                            <ul className="list-disc pl-6 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                <li><strong>Introducción:</strong> Planteamiento del problema.</li>
                                <li><strong>Método:</strong> Procedimientos y participantes.</li>
                                <li><strong>Resultados:</strong> Hallazgos objetivos.</li>
                                <li><strong>Discusión:</strong> Interpretación de resultados.</li>
                            </ul>
                        </li>
                        <li><strong>Referencias:</strong> Lista bibliográfica citada.</li>
                    </ol>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-12">
                        <h3 className="text-lg font-bold mb-4">Referencias Consultadas</h3>
                        <ul className="text-sm text-gray-500 space-y-2">
                            <li>American Psychological Association. (2020). <em>Publication manual of the American Psychological Association</em> (7th ed.).</li>
                            <li>Facultad de Ciencias de la Salud UASD. (2020). <em>Manual de Elaboración de Tesis</em>. Universidad Autónoma de Santo Domingo.</li>
                            <li>Universidad Nacional Autónoma de México. (2020). <em>¿Qué es una tesis?</em>. Dirección General de Bibliotecas.</li>
                        </ul>
                    </div>
                </article>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 mt-16 text-center">
                    <h2 className="text-2xl font-bold mb-4">¿Necesitas ayuda con tu Anteproyecto o Tesis?</h2>
                    <p className="mb-6 max-w-2xl mx-auto">
                        En TuTesisRD te asesoramos desde la elección del tema hasta la defensa final, asegurando el cumplimiento de normas APA y requisitos de tu universidad.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link to="/register" className="bg-brand-orange hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg transform hover:-translate-y-1">
                            Comenzar Asesoría
                        </Link>
                        <Link to="/recursos/como-hacer-tesis" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 font-bold py-3 px-8 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                            Ver Guía Paso a Paso
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default QueEsTesis;
