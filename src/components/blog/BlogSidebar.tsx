import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const BlogSidebar: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 bg-brand-orange text-white fixed w-full z-50 shadow-md">
                <Link to="/" className="text-xl font-black uppercase tracking-tight">TuTesisRD</Link>
                <button
                    onClick={toggleMobileMenu}
                    className="p-2 focus:outline-none"
                    aria-label="Toggle menu"
                >
                    <span className="material-icons">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                </button>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-slate-900 bg-opacity-95 z-40 pt-20 px-6 flex flex-col items-center space-y-6 text-white text-lg font-bold">
                    <Link to="/" onClick={toggleMobileMenu} className="hover:text-brand-orange">Inicio</Link>
                    <Link to="/blog" onClick={toggleMobileMenu} className="hover:text-brand-orange">Blog</Link>
                    <Link to="/recursos" onClick={toggleMobileMenu} className="hover:text-brand-orange">Recursos</Link>
                    <Link to="/registro" onClick={toggleMobileMenu} className="bg-brand-orange px-6 py-2 rounded-full">Empezar Tesis</Link>
                </div>
            )}

            {/* Desktop Sidebar - DevBlog Style */}
            <aside className="hidden md:flex flex-col w-72 h-screen fixed left-0 top-0 bg-brand-orange text-white text-center shadow-2xl z-50 overflow-y-auto font-sans">
                <div className="flex-1 px-6 py-8 flex flex-col items-center">

                    {/* 1. Header & Profile */}
                    <div className="mb-6 w-full">
                        <Link to="/" className="block mb-6 hover:opacity-90 transition-opacity">
                            <h1 className="text-2xl font-black mb-6 tracking-tight">TuTesisRD Blog</h1>
                            <div className="w-32 h-32 mx-auto bg-white rounded-full p-1 shadow-lg mb-4 flex items-center justify-center overflow-hidden border-4 border-white/20">
                                {/* Placeholder for Logo/Profile */}
                                <span className="material-icons text-6xl text-brand-orange">school</span>
                            </div>
                        </Link>

                        <div className="text-sm font-medium opacity-90 leading-relaxed max-w-xs mx-auto mb-6">
                            <p>
                                Hola, somos TuTesisRD. Expertos en asesoría de tesis. Te ayudamos a graduarte más rápido.
                            </p>
                            <Link to="/about" className="underline hover:text-white mt-1 inline-block">Más sobre nosotros &rarr;</Link>
                        </div>

                        {/* Social Icons Row */}
                        <div className="flex justify-center space-x-3 mb-8">
                            {['facebook', 'smart_display', 'article', 'public'].map((icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 flex items-center justify-center bg-white/20 rounded-full hover:bg-white hover:text-brand-orange transition-all duration-300">
                                    <span className="material-icons text-sm">{icon}</span>
                                </a>
                            ))}
                        </div>

                        <hr className="border-white/20 w-3/4 mx-auto mb-8" />
                    </div>


                    {/* 2. Navigation List */}
                    <nav className="w-full mb-8 flex-1">
                        <ul className="flex flex-col space-y-1 text-left w-full pl-8">
                            <li>
                                <Link
                                    to="/"
                                    className={`flex items-center py-2 transition-colors font-bold ${isActive('/') ? 'text-white' : 'text-white/70 hover:text-white'}`}
                                >
                                    <span className="material-icons text-sm mr-3 w-5 text-center">home</span>
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blog"
                                    className={`flex items-center py-2 transition-colors font-bold ${location.pathname.startsWith('/blog') ? 'text-white' : 'text-white/70 hover:text-white'}`}
                                >
                                    <span className="material-icons text-sm mr-3 w-5 text-center">article</span>
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/recursos"
                                    className={`flex items-center py-2 transition-colors font-bold ${isActive('/recursos') ? 'text-white' : 'text-white/70 hover:text-white'}`}
                                >
                                    <span className="material-icons text-sm mr-3 w-5 text-center">folder_special</span>
                                    Recursos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    className={`flex items-center py-2 transition-colors font-bold ${isActive('/about') ? 'text-white' : 'text-white/70 hover:text-white'}`}
                                >
                                    <span className="material-icons text-sm mr-3 w-5 text-center">person</span>
                                    Sobre Nosotros
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* 3. CTA Button */}
                    <div className="mt-auto w-full px-2">
                        <Link
                            to="/registro"
                            className="block w-full bg-slate-800 text-white font-black py-3 rounded-lg shadow-lg hover:bg-slate-900 hover:shadow-xl hover:-translate-y-1 transition-all transform tracking-wide text-sm uppercase"
                        >
                            Empezar Tesis
                        </Link>
                    </div>

                </div>
            </aside>
        </>
    );
};

export default BlogSidebar;
