import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer id="contacto" className="bg-gray-900 text-gray-400 py-16">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <span className="text-2xl font-bold text-white block mb-4 flex items-center">
                            <span className="material-icons mr-2 text-brand-orange">school</span>Tu Tesis RD
                        </span>
                        <p className="text-sm mb-6">Tu aliado académico número uno en República Dominicana. Calidad, confianza y resultados garantizados.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">Contacto</h4>
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
                        <h4 className="text-white font-bold text-lg mb-6">Enlaces Rápidos</h4>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:text-brand-orange transition">Inicio</Link></li>
                            <li><Link to="/servicios" className="hover:text-brand-orange transition">Servicios</Link></li>
                            <li><Link to="/nosotros" className="hover:text-brand-orange transition">Nosotros</Link></li>
                            <li><Link to="/blog" className="hover:text-brand-orange transition">Blog</Link></li>
                            <li><Link to="/student/register" className="hover:text-brand-orange transition text-brand-orange font-medium">Registrar Proyecto</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
