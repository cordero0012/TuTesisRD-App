import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer id="contacto" className="bg-gray-900 text-gray-400 py-16">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
                    <div>
                        <span className="text-2xl font-bold text-white block mb-4 flex items-center">
                            <span className="material-icons mr-2 text-brand-orange">school</span>Tu Tesis RD
                        </span>
                        <p className="text-sm mb-6">Tu aliado académico número uno en República Dominicana. Calidad, confianza y resultados garantizados.</p>
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-lg mb-6">Contacto</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <span className="material-icons mt-1 mr-3 text-brand-orange text-sm">location_on</span>
                                <span>Higüey, La Altagracia, Rep. Dom.<br /><span className="text-xs text-gray-500">(Servicio a todo el país)</span></span>
                            </li>
                            <li className="flex items-center">
                                <span className="material-icons mr-3 text-brand-orange text-sm">email</span>
                                <a href="mailto:ttesisrd@gmail.com" className="hover:text-white transition">ttesisrd@gmail.com</a>
                            </li>
                            <li className="flex items-center">
                                <span className="material-icons mr-3 text-brand-orange text-sm">chat</span>
                                <a href="https://wa.me/message/YESJDSE3MZ3IM1" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Chat WhatsApp</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-lg mb-6">Recursos</h2>
                        <ul className="space-y-2">
                            <li><Link to="/recursos/que-es-tesis" className="hover:text-brand-orange transition">¿Qué es una Tesis?</Link></li>
                            <li><Link to="/recursos/como-hacer-tesis" className="hover:text-brand-orange transition">Guía Paso a Paso</Link></li>
                            <li><Link to="/recursos/ejemplos-tesis" className="hover:text-brand-orange transition">Ejemplos y Plantillas</Link></li>
                            <li><Link to="/herramientas/auditor" className="hover:text-brand-orange transition">Auditoría IA (Gratis)</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-lg mb-6">Enlaces Rápidos</h2>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:text-brand-orange transition">Inicio</Link></li>
                            <li><Link to="/servicios" className="hover:text-brand-orange transition">Servicios</Link></li>
                            <li><Link to="/nosotros" className="hover:text-brand-orange transition">Nosotros</Link></li>
                            <li><Link to="/blog" className="hover:text-brand-orange transition">Blog</Link></li>
                            <li><Link to="/registro" className="hover:text-brand-orange transition text-brand-orange font-medium">Registrar Proyecto</Link></li>
                            <li><Link to="/admin" className="text-gray-600 dark:text-gray-800 hover:text-gray-500 transition text-[10px] mt-4 block opacity-20 hover:opacity-100">Acceso Administrativo</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-2 text-sm">
                        <span className="text-gray-400">© {new Date().getFullYear()} TuTesisRD. Todos los derechos reservados.</span>
                        <div className="flex items-center gap-4 mt-2 md:mt-0 md:ml-4 text-xs text-gray-500">
                            <Link to="/politica-de-privacidad" className="hover:text-brand-orange transition">Política de Privacidad</Link>
                            <span className="hidden md:inline">|</span>
                            <Link to="/terminos-y-condiciones" className="hover:text-brand-orange transition">Términos y Condiciones</Link>
                            <span className="hidden md:inline">|</span>
                            <Link to="/eliminacion-de-datos" className="hover:text-brand-orange transition">Eliminación de Datos</Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="https://instagram.com/tutesisrd" target="_blank" rel="noopener noreferrer" className="hover:text-white transition" aria-label="Instagram de TuTesisRD">
                            <span className="sr-only">Instagram</span><i className="fab fa-instagram text-xl" aria-hidden="true"></i>
                        </a>
                        <a href="https://facebook.com/tutesisrd" target="_blank" rel="noopener noreferrer" className="hover:text-white transition" aria-label="Facebook de TuTesisRD">
                            <span className="sr-only">Facebook</span><i className="fab fa-facebook text-xl" aria-hidden="true"></i>
                        </a>
                        <a href="javascript:void(0)" className="hover:text-white transition cursor-not-allowed opacity-50" aria-label="LinkedIn" aria-disabled="true">
                            <span className="sr-only">LinkedIn (próximamente)</span><i className="fab fa-linkedin text-xl" aria-hidden="true"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
