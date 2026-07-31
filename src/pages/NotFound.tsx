import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
        { to: '/servicios', icon: 'design_services', label: 'Servicios', hint: 'Qué hacemos y cómo te acompañamos' },
        { to: '/universidades', icon: 'school', label: 'Universidades', hint: 'Asesoría por universidad de RD' },
        { to: '/blog', icon: 'menu_book', label: 'Blog', hint: 'Guías de tesis, APA y metodología' },
        { to: '/herramientas/matriz', icon: 'fact_check', label: 'Matriz de Consistencia', hint: 'Analiza tu tesis gratis' }
    ];

    return (
        <>
            <SEO
                title="Página no encontrada"
                description="La página que buscas no existe o cambió de dirección. Explora nuestros servicios de asesoría de tesis en República Dominicana."
            />
            <Navbar />
            <main className="min-h-[70vh] bg-background-light dark:bg-background-dark px-4 py-16 md:py-24">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-7xl md:text-8xl font-black text-brand-orange leading-none">404</p>
                    <h1 className="mt-4 text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                        Esta página no existe
                    </h1>
                    <p className="mt-3 text-slate-500 dark:text-slate-400">
                        No encontramos <span className="font-mono text-sm text-slate-600 dark:text-slate-300">{location.pathname}</span>.
                        Puede que el enlace esté roto o que la página haya cambiado de dirección.
                    </p>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2 text-left">
                        {shortcuts.map(item => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-brand-orange hover:shadow-lg transition-all"
                            >
                                <span className="material-symbols-outlined text-brand-orange">{item.icon}</span>
                                <span>
                                    <span className="block font-bold text-slate-900 dark:text-white">{item.label}</span>
                                    <span className="block text-sm text-slate-500 dark:text-slate-400">{item.hint}</span>
                                </span>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to="/"
                            className="px-6 py-3 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
                        >
                            Volver al inicio
                        </Link>
                        <a
                            href={buildWhatsAppUrl('Hola, llegué a un enlace roto en la web y necesito ayuda con mi tesis.')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 rounded-xl font-bold bg-[#25D366] text-white hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
                        >
                            <i className="fab fa-whatsapp text-lg"></i> Hablar con un asesor
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default NotFound;
