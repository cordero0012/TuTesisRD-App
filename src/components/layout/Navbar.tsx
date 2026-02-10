import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Helper to determine if link is active
    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="fixed w-full top-0 z-50 transition-all duration-300 bg-white/70 dark:bg-background-dark/70 backdrop-blur-xl border-b border-gray-100/50 dark:border-white/5 shadow-sm">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center group">
                    <span className="material-icons mr-2 text-brand-orange group-hover:rotate-12 transition-transform duration-300" aria-hidden="true">school</span>
                    TuTesis<span className="text-brand-orange">RD</span>
                </Link>
                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <span className="material-icons text-2xl text-slate-800 dark:text-white">menu</span>
                </button>
                {/* Desktop Nav */}
                <nav className="hidden md:flex space-x-1 items-center font-medium text-sm">
                    <Link to="/" className={`px-4 py-2 rounded-full transition-all duration-300 ${isActive('/') ? 'text-brand-orange bg-orange-50 dark:bg-gray-800' : 'text-slate-600 dark:text-slate-300 hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-gray-800'}`}>Inicio</Link>
                    <Link to="/nosotros" className={`px-4 py-2 rounded-full transition-all duration-300 ${isActive('/nosotros') ? 'text-brand-orange bg-orange-50 dark:bg-gray-800' : 'text-slate-600 dark:text-slate-300 hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-gray-800'}`}>Nosotros</Link>
                    <Link to="/servicios" className={`px-4 py-2 rounded-full transition-all duration-300 ${isActive('/servicios') ? 'text-brand-orange bg-orange-50 dark:bg-gray-800' : 'text-slate-600 dark:text-slate-300 hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-gray-800'}`}>Servicios</Link>

                    {/* Recursos Dropdown */}
                    <div className="relative group">
                        <button className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1 ${location.pathname.includes('/recursos') ? 'text-brand-orange bg-orange-50 dark:bg-gray-800' : 'text-slate-600 dark:text-slate-300 hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-gray-800'}`}>
                            Recursos <span className="material-icons text-sm">expand_more</span>
                        </button>
                        <div className="absolute top-full left-0 w-56 bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-2">
                            <Link to="/recursos/que-es-tesis" className="block px-4 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 text-slate-700 dark:text-slate-300 text-sm">Qué es una Tesis</Link>
                            <Link to="/recursos/como-hacer-tesis" className="block px-4 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 text-slate-700 dark:text-slate-300 text-sm">Cómo Hacer una Tesis</Link>
                            <Link to="/recursos/ejemplos-tesis" className="block px-4 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 text-slate-700 dark:text-slate-300 text-sm">Ejemplos y Repositorios</Link>
                        </div>
                    </div>

                    <Link to="/herramientas" className={`px-4 py-2 rounded-full transition-all duration-300 ${isActive('/herramientas') ? 'text-brand-orange bg-orange-50 dark:bg-gray-800' : 'text-slate-600 dark:text-slate-300 hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-gray-800'}`}>Herramientas</Link>
                    <Link to="/universidades" className={`px-4 py-2 rounded-full transition-all duration-300 ${isActive('/universidades') ? 'text-brand-orange bg-orange-50 dark:bg-gray-800' : 'text-slate-600 dark:text-slate-300 hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-gray-800'}`}>Universidades</Link>
                    <Link to="/blog" className={`px-4 py-2 rounded-full transition-all duration-300 ${isActive('/blog') ? 'text-brand-orange bg-orange-50 dark:bg-gray-800' : 'text-slate-600 dark:text-slate-300 hover:text-brand-orange hover:bg-orange-50 dark:hover:bg-gray-800'}`}>Blog</Link>
                    <a href="https://wa.me/message/YESJDSE3MZ3IM1" target="_blank" rel="noopener noreferrer" className="ml-4 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 font-bold">
                        <i className="fab fa-whatsapp text-lg"></i> Contactar
                    </a>
                </nav>
            </div>
            {/* Mobile Nav */}
            <div className={`md:hidden bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 absolute w-full ${isMobileMenuOpen ? 'block' : 'hidden'} h-screen overflow-y-auto pb-20`}>
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left py-4 px-8 font-medium text-slate-800 dark:text-slate-200 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">Inicio</Link>
                <Link to="/nosotros" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left py-4 px-8 font-medium text-slate-800 dark:text-slate-200 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">Nosotros</Link>
                <Link to="/servicios" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left py-4 px-8 font-medium text-slate-800 dark:text-slate-200 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">Servicios</Link>

                <div className="bg-gray-50/50 dark:bg-gray-900/50">
                    <span className="block w-full text-left py-3 px-8 text-xs font-bold text-gray-400 uppercase tracking-wider">Recursos</span>
                    <Link to="/recursos/que-es-tesis" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left py-3 px-10 font-medium text-slate-700 dark:text-slate-300 hover:text-brand-orange">Qué es una Tesis</Link>
                    <Link to="/recursos/como-hacer-tesis" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left py-3 px-10 font-medium text-slate-700 dark:text-slate-300 hover:text-brand-orange">Cómo Hacer una Tesis</Link>
                    <Link to="/recursos/ejemplos-tesis" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left py-3 px-10 font-medium text-slate-700 dark:text-slate-300 hover:text-brand-orange">Ejemplos y Repositorios</Link>
                </div>

                <Link to="/herramientas" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left py-4 px-8 font-medium text-slate-800 dark:text-slate-200 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">Herramientas</Link>
                <Link to="/universidades" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left py-4 px-8 font-medium text-slate-800 dark:text-slate-200 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">Universidades</Link>
                <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left py-4 px-8 font-medium text-slate-800 dark:text-slate-200 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">Blog</Link>
                <a href="https://wa.me/message/YESJDSE3MZ3IM1" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="block py-4 px-8 text-brand-orange font-bold bg-orange-50/50 dark:bg-orange-900/10">
                    <i className="fab fa-whatsapp mr-2"></i> Contactar por WhatsApp
                </a>
            </div>
        </header>
    );
};

export default Navbar;
