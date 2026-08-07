import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, FileCheck2, GraduationCap, Home, Layers, MessageCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SEO from '../components/SEO';
import { buildWhatsAppUrl } from '../config';

/**
 * Catch-all route.
 *
 * Without this, any unknown path rendered an empty document: the Vercel rewrite
 * serves index.html for every URL, so React Router matched nothing and returned
 * null. That produced soft 404s (HTTP 200 with no content) for search engines
 * and a dead end for users.
 */
const NotFound: React.FC = () => {
    const location = useLocation();

    const shortcuts = [
        { to: '/servicios', icon: Layers, label: 'Servicios', hint: 'Qué hacemos y cómo te acompañamos' },
        { to: '/universidades', icon: GraduationCap, label: 'Universidades', hint: 'Asesoría por universidad de RD' },
        { to: '/blog', icon: BookOpen, label: 'Blog', hint: 'Guías de tesis, APA y metodología' },
        { to: '/herramientas/matriz', icon: FileCheck2, label: 'Matriz de Consistencia', hint: 'Analiza tu tesis gratis' }
    ];

    const contactUrl = buildWhatsAppUrl('Hola, llegué a un enlace no encontrado en la web y necesito orientación sobre mi tesis.');

    return (
        <div className="min-h-screen bg-tutesis-white dark:bg-tutesis-black font-sans text-tutesis-black dark:text-tutesis-white transition-colors duration-200">
            <SEO
                title="Página no encontrada"
                description="La página que buscas no existe o cambió de dirección. Explora nuestros servicios de asesoría de tesis en República Dominicana."
            />
            <Navbar />
            <main className="min-h-[70vh] px-5 sm:px-8 pt-28 pb-16 md:pt-36 md:pb-24">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-7xl md:text-9xl font-black text-tutesis-orange leading-none font-display">404</p>
                    <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-black text-tutesis-black dark:text-tutesis-white font-display">
                        Esta página no existe
                    </h1>
                    <p className="mt-3 text-sm md:text-base text-tutesis-black/70 dark:text-tutesis-white/70">
                        No encontramos <span className="font-mono text-xs md:text-sm bg-tutesis-gold/20 dark:bg-tutesis-gold/15 px-2 py-0.5 rounded text-tutesis-black dark:text-tutesis-white">{location.pathname}</span>.
                        Puede que el enlace esté desactualizado o haya cambiado de dirección.
                    </p>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2 text-left">
                        {shortcuts.map(item => {
                            const IconComponent = item.icon;
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className="flex items-start gap-4 p-5 rounded-xl bg-tutesis-white dark:bg-tutesis-black/80 border border-tutesis-black/15 dark:border-tutesis-white/20 hover:border-tutesis-orange dark:hover:border-tutesis-orange hover:shadow-md transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-tutesis-gold/15 flex items-center justify-center shrink-0 text-tutesis-orange group-hover:scale-105 transition-transform">
                                        <IconComponent className="h-5 w-5" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <span className="block font-bold font-display text-tutesis-black dark:text-tutesis-white group-hover:text-tutesis-orange transition-colors">{item.label}</span>
                                        <span className="block text-xs text-tutesis-black/60 dark:text-tutesis-white/60">{item.hint}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to="/"
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-tutesis-black dark:bg-tutesis-white text-tutesis-white dark:text-tutesis-black px-6 py-3 text-sm font-extrabold hover:bg-tutesis-orange dark:hover:bg-tutesis-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange"
                        >
                            <Home className="h-4 w-4" aria-hidden="true" />
                            <span>Volver al inicio</span>
                        </Link>
                        <a
                            href={contactUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-tutesis-orange text-tutesis-black px-6 py-3 text-sm font-extrabold shadow-md hover:bg-tutesis-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange"
                        >
                            <MessageCircle className="h-4 w-4" aria-hidden="true" />
                            <span>Hablar con un asesor</span>
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default NotFound;
