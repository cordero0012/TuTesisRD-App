import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { CONTACT, buildWhatsAppUrl } from '../../config';

const Footer: React.FC = () => {
    const contactUrl = buildWhatsAppUrl('Hola, quiero orientación sobre mi tesis.');

    return (
        <footer id="contacto" className="bg-tutesis-black text-tutesis-white/70">
            <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 md:py-20 lg:px-10">
                <div className="grid gap-14 border-b border-tutesis-white/20 pb-14 md:grid-cols-2 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <Link to="/" aria-label="Tu Tesis RD — Inicio" className="relative inline-flex h-20 w-48 items-center overflow-hidden rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange">
                            <img
                                src="/logos/Logo-TuTesis-Blanco.png"
                                alt=""
                                width="1000"
                                height="1000"
                                className="absolute left-1/2 top-1/2 w-60 max-w-none -translate-x-1/2 -translate-y-1/2"
                            />
                            <span className="sr-only">Tu Tesis RD — Inicio</span>
                        </Link>
                        <p className="mt-6 max-w-md text-base leading-7 text-tutesis-white/70">
                            Acompañamiento metodológico y orientación clara para que puedas comprender, organizar y defender tu investigación.
                        </p>
                        <a
                            href={contactUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-md bg-tutesis-orange px-5 text-sm font-extrabold text-tutesis-black transition-colors hover:bg-tutesis-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange focus-visible:ring-offset-4 focus-visible:ring-offset-tutesis-black"
                        >
                            Solicitar diagnóstico gratuito
                            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                        </a>
                    </div>

                    <div className="lg:col-span-3">
                        <h2 className="text-xs font-extrabold uppercase tracking-[0.18em] text-tutesis-white">Contacto</h2>
                        <ul className="mt-6 space-y-5 text-sm leading-6">
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-1 h-4 w-4 shrink-0 text-brand-orange" aria-hidden="true" />
                                <span>Higüey, La Altagracia<br /><span className="text-tutesis-white/50">Atención en línea en todo RD</span></span>
                            </li>
                            <li>
                                <a href={`mailto:${CONTACT.EMAIL}`} className="flex min-h-11 items-center gap-3 transition-colors hover:text-tutesis-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange">
                                    <Mail className="h-4 w-4 shrink-0 text-brand-orange" aria-hidden="true" /> {CONTACT.EMAIL}
                                </a>
                            </li>
                            <li>
                                <a href={contactUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 transition-colors hover:text-tutesis-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange">
                                    <MessageCircle className="h-4 w-4 shrink-0 text-brand-orange" aria-hidden="true" /> WhatsApp: +1 (829) 751-3267
                                </a>
                            </li>
                            <li>
                                <a href={`tel:${CONTACT.PHONE}`} className="flex min-h-11 items-center gap-3 transition-colors hover:text-tutesis-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange">
                                    <Phone className="h-4 w-4 shrink-0 text-brand-orange" aria-hidden="true" /> Llamadas: +1 (809) 455-7280
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h2 className="text-xs font-extrabold uppercase tracking-[0.18em] text-tutesis-white">Explorar</h2>
                        <ul className="mt-6 space-y-2 text-sm">
                            <li><Link to="/servicios" className="flex min-h-11 items-center transition-colors hover:text-brand-orange">Servicios</Link></li>
                            <li><Link to="/universidades" className="flex min-h-11 items-center transition-colors hover:text-brand-orange">Universidades</Link></li>
                            <li><Link to="/herramientas" className="flex min-h-11 items-center transition-colors hover:text-brand-orange">Herramientas</Link></li>
                            <li><Link to="/blog" className="flex min-h-11 items-center transition-colors hover:text-brand-orange">Blog</Link></li>
                            <li><Link to="/nosotros" className="flex min-h-11 items-center transition-colors hover:text-brand-orange">Nosotros</Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h2 className="text-xs font-extrabold uppercase tracking-[0.18em] text-tutesis-white">Recursos</h2>
                        <ul className="mt-6 space-y-2 text-sm">
                            <li><Link to="/recursos/que-es-tesis" className="flex min-h-11 items-center transition-colors hover:text-brand-orange">Qué es una tesis</Link></li>
                            <li><Link to="/recursos/como-hacer-tesis" className="flex min-h-11 items-center transition-colors hover:text-brand-orange">Guía paso a paso</Link></li>
                            <li><Link to="/recursos/ejemplos-tesis" className="flex min-h-11 items-center transition-colors hover:text-brand-orange">Ejemplos y repositorios</Link></li>
                            <li><Link to="/registro" className="flex min-h-11 items-center font-bold text-tutesis-orange transition-colors hover:text-tutesis-white">Registrar proyecto</Link></li>
                        </ul>
                    </div>
                </div>

                <p className="border-b border-tutesis-white/15 py-6 text-xs leading-6 text-tutesis-white/45">
                    El acompañamiento ofrecido es orientativo y formativo. No sustituye las decisiones del asesor, jurado o universidad, ni garantiza resultados académicos específicos.
                </p>

                <div className="flex flex-col gap-6 pt-8 text-xs text-tutesis-white/50 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                        <span>© {new Date().getFullYear()} TuTesisRD.</span>
                        <Link to="/politica-de-privacidad" className="inline-flex min-h-11 items-center hover:text-brand-orange">Privacidad</Link>
                        <Link to="/terminos-y-condiciones" className="inline-flex min-h-11 items-center hover:text-brand-orange">Términos</Link>
                        <Link to="/eliminacion-de-datos" className="inline-flex min-h-11 items-center hover:text-brand-orange">Eliminación de datos</Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href={CONTACT.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-md border border-tutesis-white/20 transition-colors hover:border-tutesis-orange hover:text-tutesis-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange" aria-label="Instagram de TuTesisRD">
                            <span className="sr-only">Instagram de TuTesisRD</span>
                            <Instagram className="h-4 w-4" aria-hidden="true" />
                        </a>
                        <a href={CONTACT.FACEBOOK} target="_blank" rel="noopener noreferrer" className="flex h-11 w-11 items-center justify-center rounded-md border border-tutesis-white/20 transition-colors hover:border-tutesis-orange hover:text-tutesis-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tutesis-orange" aria-label="Facebook de TuTesisRD">
                            <span className="sr-only">Facebook de TuTesisRD</span>
                            <Facebook className="h-4 w-4" aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
