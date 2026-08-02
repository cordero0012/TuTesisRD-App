import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, MessageCircle, X } from 'lucide-react';
import { buildWhatsAppUrl } from '../../config';

const NAV_ITEMS = [
    { to: '/', label: 'Inicio', section: 'inicio' },
    { to: '/#servicios', label: 'Servicios', section: 'servicios' },
    { to: '/#metodo', label: 'Cómo funciona', section: 'metodo' },
    { to: '/#defensa', label: 'Defensa', section: 'defensa' },
    { to: '/#preguntas', label: 'Preguntas', section: 'preguntas' },
    { to: '/blog', label: 'Blog' }
];

const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('inicio');
    const location = useLocation();
    const contactUrl = buildWhatsAppUrl('Hola, quiero orientación sobre mi tesis.');

    React.useEffect(() => {
        const updateScrolledState = () => setIsScrolled(window.scrollY > 40);
        updateScrolledState();
        window.addEventListener('scroll', updateScrolledState, { passive: true });
        return () => window.removeEventListener('scroll', updateScrolledState);
    }, []);

    React.useEffect(() => {
        if (location.pathname !== '/' || typeof IntersectionObserver === 'undefined') return;

        const sections = ['inicio', 'servicios', 'metodo', 'defensa', 'preguntas']
            .map((id) => document.getElementById(id))
            .filter((section): section is HTMLElement => Boolean(section));
        const observer = new IntersectionObserver((entries) => {
            const visible = entries.find((entry) => entry.isIntersecting);
            if (visible) setActiveSection(visible.target.id);
        }, { rootMargin: '-22% 0px -68% 0px', threshold: 0 });

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, [location.pathname]);

    React.useEffect(() => {
        if (!location.hash) return;
        const target = document.getElementById(location.hash.slice(1));
        if (target && typeof target.scrollIntoView === 'function') {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [location.hash]);

    const isActive = (path: string, section?: string) => {
        if (location.pathname === '/' && section) return activeSection === section;
        return location.pathname === path;
    };
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className={`fixed inset-x-0 top-0 z-50 backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300 dark:border-tutesis-white/20 dark:bg-tutesis-black/95 ${isScrolled ? 'border-b border-tutesis-black/15 bg-tutesis-white/95 shadow-[0_8px_30px_rgba(14,14,15,0.06)]' : 'border-b border-transparent bg-tutesis-white/80'}`}>
            <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-5 sm:px-8 lg:px-10">
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="group relative inline-flex h-14 w-36 shrink-0 items-center overflow-hidden rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-4"
                    aria-label="Tu Tesis RD — Inicio"
                >
                    <img
                        src="/logos/Logo-TuTesis-Color.png"
                        alt=""
                        width="1000"
                        height="1000"
                        className="absolute left-1/2 top-1/2 w-44 max-w-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 group-hover:scale-[1.03]"
                    />
                    <span className="sr-only">Tu Tesis RD — Inicio</span>
                </Link>

                <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`relative flex min-h-11 items-center px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange ${isActive(item.to, item.section) ? 'text-tutesis-black after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:bg-tutesis-orange dark:text-tutesis-white' : 'text-tutesis-black/65 hover:text-tutesis-black dark:text-tutesis-white/70 dark:hover:text-tutesis-white'}`}
                            aria-current={isActive(item.to, item.section) ? 'page' : undefined}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden items-center gap-2 lg:flex">
                    <Link
                        to="/registro"
                        className="inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-sm font-bold text-tutesis-black transition-colors hover:bg-tutesis-gold/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange dark:text-tutesis-white"
                    >
                        Portal <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <a
                        href={contactUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-2 rounded-md bg-tutesis-black px-4 text-sm font-bold text-tutesis-white transition-colors hover:bg-tutesis-orange hover:text-tutesis-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange focus-visible:ring-offset-4"
                    >
                        <MessageCircle className="h-4 w-4" aria-hidden="true" /> Escríbenos por WhatsApp
                    </a>
                </div>

                <button
                    type="button"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-tutesis-black/25 text-tutesis-black transition-colors hover:border-tutesis-orange hover:bg-tutesis-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange dark:border-tutesis-white/30 dark:text-tutesis-white lg:hidden"
                    onClick={() => setIsMobileMenuOpen((open) => !open)}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-navigation"
                    aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                >
                    {isMobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
                </button>
            </div>

            <div
                id="mobile-navigation"
                className={`border-t border-tutesis-black/15 bg-tutesis-white dark:border-tutesis-white/20 dark:bg-tutesis-black lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
            >
                <nav className="mx-auto max-h-[calc(100vh-5rem)] max-w-[1280px] overflow-y-auto px-5 py-5 sm:px-8" aria-label="Navegación móvil">
                    {NAV_ITEMS.map((item, index) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            onClick={closeMenu}
                            className={`flex min-h-14 items-center justify-between border-b border-tutesis-black/15 py-3 text-lg font-semibold dark:border-tutesis-white/20 ${isActive(item.to, item.section) ? 'text-tutesis-black dark:text-tutesis-white' : 'text-tutesis-black/75 dark:text-tutesis-white/75'}`}
                            aria-current={isActive(item.to, item.section) ? 'page' : undefined}
                        >
                            <span><span className="mr-3 text-xs font-bold text-tutesis-orange">0{index + 1}</span>{item.label}</span>
                            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                    ))}

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <Link
                            to="/registro"
                            onClick={closeMenu}
                            className="inline-flex min-h-12 items-center justify-center rounded-md border border-tutesis-black px-5 text-sm font-bold text-tutesis-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange dark:border-tutesis-white dark:text-tutesis-white"
                        >
                            Entrar al portal
                        </Link>
                        <a
                            href={contactUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={closeMenu}
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-tutesis-black px-5 text-sm font-bold text-tutesis-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange"
                        >
                            <MessageCircle className="h-4 w-4" aria-hidden="true" /> Escríbenos por WhatsApp
                        </a>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
