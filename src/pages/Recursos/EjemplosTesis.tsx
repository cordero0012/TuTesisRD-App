import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/SEO';

const EjemplosTesis: React.FC = () => {
    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Ejemplos de Tesis y Plantillas Académicas RD",
        "description": "Repositorio de ejemplos de tesis aprobadas de universidades dominicanas (UASD, PUCMM, INTEC) y plantillas descargables formato APA 7.",
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "url": "https://www.tutesisrd.online/recursos/ejemplos-tesis#uasd",
                    "name": "Tesis UASD"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "url": "https://www.tutesisrd.online/recursos/ejemplos-tesis#pucmm",
                    "name": "Tesis PUCMM"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "url": "https://www.tutesisrd.online/recursos/ejemplos-tesis#plantillas",
                    "name": "Plantillas APA 7 Descargables"
                }
            ]
        }
    };

    return (
        <div className="font-sans text-gray-800 bg-background-light dark:bg-background-dark dark:text-gray-100 transition-colors duration-200">
            <SEO
                title="Ejemplos de Tesis Aprobadas y Plantillas APA 7 (2026)"
                description="Accede a cientos de ejemplos reales de tesis de grados y postgrados en República Dominicana. Descarga plantillas editables para tu anteproyecto."
                keywords={['ejemplos de tesis', 'tesis aprobadas uasd', 'tesis pucmm', 'tesis intec', 'plantilla tesis apa 7', 'modelo de anteproyecto']}
                schema={collectionSchema}
                type="article"
                publishedTime="2026-02-09"
                author="TuTesisRD Académico"
            />
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-12">
                <header className="mb-12 text-center">
                    <span className="text-brand-orange font-semibold tracking-wide uppercase text-sm">Biblioteca de Recursos</span>
                    <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4 text-gray-900 dark:text-white">Ejemplos de Tesis y Plantillas</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        La mejor forma de aprender es viendo. Explora repositorios oficiales de las principales universidades y descarga nuestras plantillas premium.
                    </p>
                </header>

                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <span className="bg-blue-100 text-blue-600 p-2 rounded-lg text-2xl">🏛️</span>
                        Repositorios Universitarios Oficiales
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* UASD */}
                        <a href="http://repositorio.uasd.edu.do/xmlui/" target="_blank" rel="noopener noreferrer" className="block group">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-b-4 border-blue-600 hover:shadow-xl transition-all transform hover:-translate-y-1">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600">UASD - Repositorio</h3>
                                <p className="text-sm text-gray-500 mb-4">Universidad Autónoma de Santo Domingo</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Acceso a tesis de grado, maestría y doctorado de todas las facultades.
                                </p>
                                <span className="inline-block mt-4 text-blue-600 text-sm font-semibold group-hover:underline">Ver repositorio →</span>
                            </div>
                        </a>

                        {/* PUCMM */}
                        <a href="https://investigare.pucmm.edu.do/" target="_blank" rel="noopener noreferrer" className="block group">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-b-4 border-yellow-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-600">PUCMM - Investigare</h3>
                                <p className="text-sm text-gray-500 mb-4">Pontificia Universidad Católica Madre y Maestra</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Plataforma institucional con producción científica y tesis de postgrado.
                                </p>
                                <span className="inline-block mt-4 text-yellow-600 text-sm font-semibold group-hover:underline">Ver repositorio →</span>
                            </div>
                        </a>

                        {/* INTEC */}
                        <a href="https://repositorio.intec.edu.do/" target="_blank" rel="noopener noreferrer" className="block group">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-b-4 border-red-500 hover:shadow-xl transition-all transform hover:-translate-y-1">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-red-600">INTEC - Repositorio</h3>
                                <p className="text-sm text-gray-500 mb-4">Instituto Tecnológico de Santo Domingo</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Colección de proyectos finales, tesis y artículos científicos.
                                </p>
                                <span className="inline-block mt-4 text-red-600 text-sm font-semibold group-hover:underline">Ver repositorio →</span>
                            </div>
                        </a>
                        {/* UNIBE */}
                        <a href="https://repositorio.unibe.edu.do/" target="_blank" rel="noopener noreferrer" className="block group">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-b-4 border-blue-900 hover:shadow-xl transition-all transform hover:-translate-y-1">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-800">UNIBE - RI</h3>
                                <p className="text-sm text-gray-500 mb-4">Universidad Iberoamericana</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Recursos académicos y tesis de las escuelas de derecho, negocios y salud.
                                </p>
                                <span className="inline-block mt-4 text-blue-800 text-sm font-semibold group-hover:underline">Ver repositorio →</span>
                            </div>
                        </a>
                        {/* APEC */}
                        <a href="https://repositorio.unapec.edu.do/" target="_blank" rel="noopener noreferrer" className="block group">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-b-4 border-indigo-600 hover:shadow-xl transition-all transform hover:-translate-y-1">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600">UNAPEC</h3>
                                <p className="text-sm text-gray-500 mb-4">Universidad APEC</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Tesis y trabajos de grado enfocados en negocios, tecnología y artes.
                                </p>
                                <span className="inline-block mt-4 text-indigo-600 text-sm font-semibold group-hover:underline">Ver repositorio →</span>
                            </div>
                        </a>
                        {/* UNPHU */}
                        <a href="https://repositorio.unphu.edu.do/" target="_blank" rel="noopener noreferrer" className="block group">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-b-4 border-green-600 hover:shadow-xl transition-all transform hover:-translate-y-1">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-green-600">UNPHU</h3>
                                <p className="text-sm text-gray-500 mb-4">Universidad Pedro Henríquez Ureña</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Biblioteca digital de tesis de arquitectura, medicina y otras áreas.
                                </p>
                                <span className="inline-block mt-4 text-green-600 text-sm font-semibold group-hover:underline">Ver repositorio →</span>
                            </div>
                        </a>
                    </div>
                </section>

                <section id="plantillas" className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 lg:p-12 mb-16">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <span className="bg-brand-orange text-white p-2 rounded-lg text-2xl">📝</span>
                        Plantillas Premium (Gratis)
                    </h2>
                    <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
                        Hemos preparado documentos base con el formato APA 7 ya configurado (márgenes, fuentes, estilos) para que solo tengas que llenar con tu contenido.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Link to="/register?template=anteproyecto" className="flex items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700">
                            <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
                                <span className="material-symbols-outlined text-3xl">article</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Estructura de Anteproyecto</h3>
                                <p className="text-sm text-gray-500">Formato .docx con objetivos y justificación.</p>
                            </div>
                            <span className="ml-auto text-blue-600 font-bold">Descargar ↓</span>
                        </Link>

                        <Link to="/register?template=tesis-final" className="flex items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700">
                            <div className="bg-green-100 text-green-600 p-4 rounded-full">
                                <span className="material-symbols-outlined text-3xl">book</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Plantilla Tesis Final APA 7</h3>
                                <p className="text-sm text-gray-500">Incluye índice automático y estilos predefinidos.</p>
                            </div>
                            <span className="ml-auto text-green-600 font-bold">Descargar ↓</span>
                        </Link>
                    </div>
                </section>

                <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-10 text-center shadow-2xl">
                    <h2 className="text-3xl font-bold mb-4">¿No encuentras un ejemplo similar a tu tema?</h2>
                    <p className="mb-8 text-lg text-gray-300 max-w-2xl mx-auto">
                        Nuestra Inteligencia Artificial puede analizar tu idea y generar una estructura de tesis personalizada basada en miles de ejemplos académicos exitosos.
                    </p>
                    <Link to="/register" className="bg-brand-orange hover:bg-orange-600 text-white text-lg font-bold py-4 px-10 rounded-full transition-all shadow-lg transform hover:scale-105">
                        Generar Estructura con IA
                    </Link>
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default EjemplosTesis;
