import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SEO from '../components/SEO';

const LandingPage: React.FC = () => {
    const [expandedService, setExpandedService] = React.useState<number | null>(null);

    const toggleService = (index: number) => {
        setExpandedService(expandedService === index ? null : index);
    };
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "@id": "https://www.tutesisrd.online/#organization",
        "name": "TuTesisRD",
        "alternateName": "Tu Tesis RD",
        "url": "https://www.tutesisrd.online",
        "logo": {
            "@type": "ImageObject",
            "url": "https://www.tutesisrd.online/logo.png",
            "width": "600",
            "height": "60"
        },
        "description": "Asesoría experta en tesis de grado, tesis doctoral y anteproyectos en República Dominicana. Más de 7 años ayudando a estudiantes universitarios a graduarse con éxito.",
        "telephone": "+18294435985",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Santo Domingo",
            "addressRegion": "Distrito Nacional",
            "addressCountry": "DO"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "18.4861",
            "longitude": "-69.9312"
        },
        "areaServed": {
            "@type": "Country",
            "name": "República Dominicana"
        },
        "sameAs": [
            "https://wa.me/message/YESJDSE3MZ3IM1"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+18294435985",
            "contactType": "Customer Service",
            "areaServed": "DO",
            "availableLanguage": "Spanish"
        }
    };

    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Asesoría de Tesis Universitarias",
        "provider": { "@id": "https://www.tutesisrd.online/#organization" },
        "areaServed": "DO",
        "description": "Servicio de asesoría completa para tesis de grado, tesis doctoral, maestría y anteproyectos académicos en República Dominicana.",
        "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "priceSpecification": {
                "@type": "UnitPriceSpecification",
                "priceCurrency": "DOP"
            }
        }
    };

    // Target keywords from Google Trends
    const targetKeywords = [
        'tesis',
        'tesis de grado',
        'tesis doctoral',
        'anteproyecto de tesis',
        'cómo hacer una tesis',
        'asesoría tesis República Dominicana',
        'tesis ejemplo',
        'qué es tesis',
        'tesis RD'
    ];

    return (
        <div className="font-sans text-gray-800 bg-background-light dark:bg-background-dark dark:text-gray-100 transition-colors duration-200">
            <SEO
                title="Inicio"
                description="Asesoría de Tesis de Grado, Tesis Doctoral y Anteproyectos en RD. Expertos en metodología de investigación. +7 años ayudando estudiantes. ¡Aprueba sin estrés!"
                keywords={targetKeywords}
                schema={[organizationSchema, serviceSchema]}
                ogImage="https://www.tutesisrd.online/og-image.png"
            />
            <Navbar />

            {/* Hero Section */}
            <section id="inicio" className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden bg-background-light dark:bg-background-dark">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-brand-orange/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-blue-500/10 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                        <div className="md:w-1/2 animate-fade-in-up text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 shadow-sm mb-6 md:mb-8">
                                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-200">Disponible para nuevos proyectos</span>
                            </div>

                            <h1 className="text-4xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
                                Tu Tesis Aprobada,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-500">Sin Estrés.</span>
                            </h1>

                            <p className="text-lg lg:text-xl text-slate-500 dark:text-slate-400 mb-8 md:mb-10 leading-relaxed max-w-lg mx-auto md:mx-0">
                                Expertos en redacción académica y metodología. Te acompañamos desde el anteproyecto hasta la defensa final.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <a href="https://wa.me/message/YESJDSE3MZ3IM1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-brand-orange text-white font-bold py-4 px-8 rounded-full shadow-xl shadow-brand-orange/20 hover:shadow-2xl hover:shadow-brand-orange/30 hover:-translate-y-1 transition-all duration-300">
                                    <span className="material-icons mr-2" aria-hidden="true">chat</span> Contactar Asesor
                                </a>
                                <Link to="/servicios" className="inline-flex items-center justify-center bg-white dark:bg-white/5 text-slate-700 dark:text-white font-bold py-4 px-8 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300">
                                    Ver Servicios
                                </Link>
                            </div>

                            <div className="mt-12 hidden md:inline-flex items-center gap-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-3 pr-6 rounded-full border border-white/50 dark:border-slate-700/50 shadow-sm">
                                <div className="flex -space-x-3">
                                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Estudiante satisfecha" className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover" />
                                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Estudiante satisfecho" className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 object-cover" />
                                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-brand-orange flex items-center justify-center text-xs text-white font-bold">+300</div>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white leading-tight">Estudiantes</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Graduados exitosamente</p>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-1/2 relative animate-fade-in group perspective-1000 mt-8 md:mt-0">
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange to-yellow-400 rounded-[2rem] transform rotate-3 scale-105 opacity-20 blur-2xl group-hover:rotate-6 transition-transform duration-500"></div>
                            <img
                                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Estudiante celebrando graduación con éxito"
                                className="relative rounded-[2rem] shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02] border border-white/20"
                            />

                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow border border-gray-100 dark:border-gray-700">
                                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600">
                                    <span className="material-icons" aria-hidden="true">check_circle</span>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Resultado</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">100% Aprobado</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us (Redesigned) */}
            <section className="py-12 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-slate-200/50 dark:bg-slate-800/30 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-brand-orange/5 rounded-full blur-3xl translate-y-1/3 translate-x-1/3"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="text-brand-orange font-black uppercase tracking-[0.2em] text-sm mb-4 block">Nuestra Trayectoria</span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                            ¿Por qué elegir <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-500">TuTesisRD?</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            Más de 7 años transformando el estrés académico en éxito profesional. Nuestra metodología garantiza resultados aprobados.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: 'history_edu', title: '+7 Años', desc: 'Experiencia Académica', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                            { icon: 'groups', title: '300+', desc: 'Tesis Asesoradas', color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
                            { icon: 'verified', title: '100%', desc: 'Tasa de Aprobación', color: 'text-green-500', bg: 'bg-green-500/10' },
                            { icon: 'language', title: 'Nacional', desc: 'Cobertura Nacional', color: 'text-purple-500', bg: 'bg-purple-500/10' }
                        ].map((stat, idx) => (
                            <div key={idx} className="group bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-brand-orange/30 dark:hover:border-brand-orange/30 transition-all duration-300 hover:-translate-y-1">
                                <div className="relative z-10 text-center">
                                    <div className={`w-16 h-16 mx-auto ${stat.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <span className={`material-icons text-3xl ${stat.color}`} aria-hidden="true">{stat.icon}</span>
                                    </div>
                                    <h4 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                                        {stat.title}
                                    </h4>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                                        {stat.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Services (Redesigned) */}
            <section id="servicios" className="py-12 bg-white dark:bg-black relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-brand-orange font-black uppercase tracking-[0.2em] text-sm mb-4 block">Soluciones Integrales</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                            Nuestros Servicios <span className="text-slate-400 dark:text-slate-600">Premium</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                            Diseñamos un ecosistema de servicios para cubrir cada etapa de tu investigación, desde la idea inicial hasta la sustentación.
                        </p>
                        <div className="flex justify-center">
                            <a href="https://wa.me/message/YESJDSE3MZ3IM1" className="group flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-slate-900 rounded-full font-bold transition-all hover:-translate-y-1 shadow-lg shadow-slate-200/50 dark:shadow-none">
                                <span className="uppercase tracking-wider text-sm">Ver Planes</span>
                                <span className="material-icons group-hover:translate-x-1 transition-transform text-sm">arrow_forward</span>
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {[
                            {
                                icon: 'school',
                                title: 'Asesoría de Tesis',
                                desc: 'Acompañamiento 1 a 1 metodología y contenido.',
                                details: 'Sesiones personalizadas con expertos para definir tu tema, objetivos y estructura. Revisión capitular continua.',
                                color: 'text-blue-600',
                                bg: 'bg-blue-50 dark:bg-blue-900/10'
                            },
                            {
                                icon: 'fact_check',
                                title: 'Corrección de Estilo',
                                desc: 'Normas APA, ortografía y redacción académica.',
                                details: 'Eliminación de errores gramaticales, sintácticos y ortográficos. Ajuste riguroso a normas APA 7ma edición.',
                                color: 'text-emerald-600',
                                bg: 'bg-emerald-50 dark:bg-emerald-900/10'
                            },
                            {
                                icon: 'analytics',
                                title: 'Análisis Estadístico',
                                desc: 'Procesamiento de datos (SPSS, Excel) y resultados.',
                                details: 'Análisis descriptivo e inferencial. Creación de tablas y gráficos interpretados listos para tu informe.',
                                color: 'text-violet-600',
                                bg: 'bg-violet-50 dark:bg-violet-900/10'
                            },
                            {
                                icon: 'menu_book',
                                title: 'Investigación',
                                desc: 'Marco teórico y búsqueda bibliográfica.',
                                details: 'Búsqueda de fuentes de alto impacto (Scopus, WoS) para fundamentar tu marco teórico y estado del arte.',
                                color: 'text-brand-orange',
                                bg: 'bg-orange-50 dark:bg-orange-900/10'
                            }
                        ].map((service, idx) => (
                            <div
                                key={idx}
                                className={`group relative p-6 rounded-[2rem] bg-white dark:bg-slate-900 border transition-all duration-300 hover:-translate-y-1 cursor-pointer
                                    ${expandedService === idx
                                        ? 'border-brand-orange shadow-xl shadow-brand-orange/10 ring-1 ring-brand-orange/20'
                                        : 'border-slate-100 dark:border-slate-800 hover:border-brand-orange/30 dark:hover:border-brand-orange/30 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none'
                                    }`}
                                onClick={() => toggleService(idx)}
                            >
                                <div className="flex flex-col h-full justify-between">
                                    <div>
                                        <div className={`w-14 h-14 ${service.bg} ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                            <span className="material-icons text-3xl" aria-hidden="true">{service.icon}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-orange transition-colors">{service.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                            {service.desc}
                                        </p>

                                        {/* Expanded Content with Animation */}
                                        <div className={`grid transition-all duration-300 ease-in-out ${expandedService === idx ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                                            <div className="overflow-hidden">
                                                <p className="text-sm text-slate-500 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3">
                                                    {service.details}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-orange transition-colors">
                                        <span className="uppercase tracking-wider text-xs">
                                            {expandedService === idx ? 'Menos detalles' : 'Más detalles'}
                                        </span>
                                        <span className={`material-icons text-sm ml-2 transition-transform duration-300 ${expandedService === idx ? '-rotate-90' : 'group-hover:translate-x-1'}`}>
                                            {expandedService === idx ? 'expand_less' : 'arrow_forward'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Premium Included Banner */}
                    <div className="mt-16 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-black rounded-[2.5rem] p-8 md:p-12 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                            <div className="md:w-1/3">
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Todo Incluido <span className="text-brand-orange">Premium</span></h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Al contratar cualquiera de nuestros servicios, obtienes beneficios exclusivos que garantizan tu tranquilidad.
                                </p>
                            </div>
                            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                                {[
                                    { icon: 'verified_user', title: 'Anti-Plagio', text: 'Reporte Turnitin Gratis' },
                                    { icon: 'support_agent', title: 'Soporte 24/7', text: 'WhatsApp Directo' },
                                    { icon: 'event_available', title: 'Garantía', text: 'Cumplimiento de Plazos' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 items-start p-4 rounded-2xl hover:bg-white dark:hover:bg-white/5 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center shrink-0">
                                            <span className="material-icons text-sm">{item.icon}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tools Section (Existing) */}
            <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/20 rounded-full blur-[120px] -mr-64 -mt-64"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <span className="text-brand-orange font-black uppercase tracking-[0.2em] text-sm mb-4 block">Herramientas Gratuitas</span>
                            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                                Auditoría de Tesis con <span className="text-brand-orange">IA</span> Pro
                            </h2>
                            <p className="text-lg text-slate-400 mb-10 leading-relaxed">
                                Sube tu borrador y deja que nuestra inteligencia académica analice la coherencia de tu investigación, el cumplimiento de normas APA y la estructura lógica en segundos.
                            </p>

                            <ul className="space-y-6 mb-12">
                                <li className="flex items-start gap-4">
                                    <div className="bg-brand-orange/20 p-2 rounded-lg text-brand-orange">
                                        <span className="material-icons">fact_check</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Validación de Coherencia</h4>
                                        <p className="text-sm text-slate-400">Verificamos si tu problema, objetivos y metodología están alineados.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="bg-brand-orange/20 p-2 rounded-lg text-brand-orange">
                                        <span className="material-icons">format_paint</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Revisión de Formato</h4>
                                        <p className="text-sm text-slate-400">Detectamos errores comunes en portadas, índices y bibliografía.</p>
                                    </div>
                                </li>
                            </ul>

                            <Link to="/herramientas/auditor" className="inline-flex items-center bg-brand-orange text-white font-black py-4 px-10 rounded-full shadow-glow-orange hover:shadow-glow-orange-lg hover:scale-105 transition-all">
                                Probar Auditor Gratis <span className="material-icons ml-2">rocket_launch</span>
                            </Link>
                        </div>

                        <div className="lg:w-1/2 relative">
                            <div className="bg-gradient-to-br from-slate-800 to-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative">
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">Auditoría en proceso...</div>
                                </div>
                                <div className="space-y-6">
                                    <div className="h-4 bg-slate-800 rounded-full w-3/4 animate-pulse"></div>
                                    <div className="h-4 bg-slate-800 rounded-full w-1/2 animate-pulse delay-75"></div>
                                    <div className="p-6 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl">
                                        <div className="flex items-center gap-3 text-brand-orange mb-2">
                                            <span className="material-icons text-sm">warning</span>
                                            <span className="font-bold text-sm tracking-wide uppercase">Hallazgo APA 7</span>
                                        </div>
                                        <p className="text-sm text-slate-300">Se detectó que el objetivo general no contiene el 'Para qué' de la investigación.</p>
                                    </div>
                                    <div className="h-4 bg-slate-800 rounded-full w-2/3 animate-pulse delay-150"></div>
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-6 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 animate-bounce-slow">
                                    <div className="text-center">
                                        <div className="text-3xl font-black text-brand-orange">94%</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest border-t border-slate-100 dark:border-slate-700 mt-1 pt-1 opacity-60">Puntaje Académico</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-16 bg-brand-orange/5 dark:bg-black/20">
                <div className="container mx-auto px-6">
                    <div className="bg-white dark:bg-background-dark rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col lg:flex-row">
                            <div className="lg:w-2/5 bg-gray-100 dark:bg-gray-800 relative min-h-[300px] lg:min-h-full">
                                <img src="/miguel-cordero.jpg" alt="Miguel Ángel Cordero Trinidad" className="absolute inset-0 w-full h-full object-cover object-top" />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 text-white lg:hidden">
                                    <h3 className="text-2xl font-bold">Miguel Ángel Cordero</h3>
                                    <p className="text-brand-orange font-medium">CEO & Especialista Académico</p>
                                </div>
                            </div>
                            <div className="lg:w-3/5 p-8 md:p-12">
                                <span className="inline-block py-1 px-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-brand-orange text-sm font-bold mb-4">Sobre el Especialista</span>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Pasión por la Educación y la Investigación</h2>
                                <div className="prose prose-gray dark:prose-invert text-gray-600 dark:text-gray-300 mb-8">
                                    <p className="mb-4 text-justify">
                                        Miguel Ángel Cordero Trinidad es un educador y asesor académico con más de cinco años de
                                        experiencia en el diseño, desarrollo y acompañamiento de investigaciones científicas en
                                        República Dominicana.
                                    </p>
                                    <p className="mb-4 text-justify">
                                        Graduado <strong>Summa Cum Laude</strong> en Educación Primaria por la UCE, combina su
                                        perfil con formación avanzada en competencias digitales, innovación educativa e IA
                                        aplicada.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <div className="flex-1 text-center sm:text-left">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Contacto Directo</p>
                                        <p className="text-gray-900 dark:text-white font-medium">Higüey, La Altagracia</p>
                                    </div>
                                    <a href="https://wa.me/message/YESJDSE3MZ3IM1" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-6 py-3 bg-brand-orange text-white rounded-lg font-bold hover:bg-orange-600 transition shadow-md flex items-center justify-center">
                                        <span className="material-icons mr-2 text-sm" aria-hidden="true">chat</span> Hablar con Miguel
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-brand-orange relative overflow-hidden">
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">¡Únete a los cientos de estudiantes satisfechos!</h2>
                    <p className="text-white text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">Han alcanzado el éxito académico con nuestra ayuda. ¿Qué esperas para ser el próximo?</p>
                    <a href="https://wa.me/message/YESJDSE3MZ3IM1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-white text-brand-orange font-bold py-5 px-12 rounded-full shadow-xl hover:bg-gray-100 transition duration-300 transform hover:scale-105 group">
                        <span className="material-icons mr-3 text-2xl group-hover:rotate-12 transition-transform" aria-hidden="true">chat</span> <span className="text-lg">Hablar con un Asesor</span>
                    </a>
                </div>
            </section>

            {/* Registration CTA Section */}
            <section className="py-16 bg-white dark:bg-background-dark border-t border-slate-100 dark:border-slate-800">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-6">¿Prefieres gestionar todo en línea?</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                        Puedes registrar tu proyecto directamente en nuestra plataforma y enviarnos tus archivos para una revisión inicial.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/registro" className="w-full sm:w-auto px-10 py-4 bg-brand-orange text-white rounded-full font-bold text-lg hover:shadow-xl hover:shadow-brand-orange/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                            Registrar Proyecto <span className="material-icons" aria-hidden="true">arrow_forward</span>
                        </Link>

                        <Link to="/monitoreo" className="w-full sm:w-auto px-10 py-4 bg-transparent text-brand-orange border-2 border-brand-orange rounded-full font-bold text-lg hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                            <span className="material-icons" aria-hidden="true">search</span> Monitorear
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;