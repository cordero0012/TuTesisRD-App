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
        "image": "https://www.tutesisrd.online/logo.png",
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
            "streetAddress": "Higüey, La Altagracia",
            "addressLocality": "Higüey",
            "addressRegion": "La Altagracia",
            "postalCode": "23000",
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

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": "https://www.tutesisrd.online/",
        "name": "TuTesisRD",
        "description": "Asesoría de Tesis en República Dominicana",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.tutesisrd.online/?s={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "¿Qué niveles académicos abarcan sus asesorías de tesis?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Brindamos acompañamiento metodológico para tesis de grado, maestrías y doctorados. Nos adaptamos a las normativas de tu universidad."
                }
            },
            {
                "@type": "Question",
                "name": "¿Atienden de forma online o presencial?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ofrecemos atención presencial en nuestro centro ubicado en Higüey, y cobertura 100% online para estudiantes en todo el resto de la República Dominicana."
                }
            },
            {
                "@type": "Question",
                "name": "¿Cuál es su metodología de trabajo para las tesis?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Utilizamos un sistema de 4 pasos: 1. Diagnóstico integral de tu punto de partida. 2. Detección de brechas metodológicas y formato APA. 3. Diseño de un plan de acción por capítulos. 4. Acompañamiento continuo hasta la defensa final."
                }
            },
            {
                "@type": "Question",
                "name": "¿Realizan correcciones de formato APA 7?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí, somos expertos en la normativa APA 7ma edición y nos aseguramos de que tu documento cumpla con todos los estándares exigidos por tu universidad (márgenes, citas, referencias, jerarquía de títulos)."
                }
            }
        ]
    };

    return (
        <div className="font-sans text-gray-800 bg-background-light dark:bg-background-dark dark:text-gray-100 transition-colors duration-200">
            <SEO
                title="TuTesisRD | Asesoría de Tesis en República Dominicana"
                description="Asesoría de tesis en República Dominicana. Acompañamiento metodológico, corrección por capítulos y apoyo hasta la defensa. Atención online y presencial en Higüey."
                keywords={targetKeywords}
                schema={[organizationSchema, serviceSchema, websiteSchema, faqSchema]}
                ogImage="https://www.tutesisrd.online/og-image.png"
            />
            <Navbar />

            {/* Hero Section */}
            <section id="inicio" className="relative pt-24 pb-12 md:pt-32 md:pb-16 lg:pt-48 lg:pb-32 overflow-hidden bg-background-light dark:bg-background-dark">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-brand-orange/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-blue-500/10 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12 lg:gap-20">
                        <div className="w-full md:w-1/2 animate-fade-in-up text-center md:text-left order-1 md:order-1 mt-6 md:mt-0">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 shadow-sm mb-4 md:mb-8">
                                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-200">Disponible para nuevos proyectos</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-4 md:mb-6 leading-[1.15] md:leading-[1.1] tracking-tight">
                                Asesoría de tesis en<br className="hidden sm:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-500"> República Dominicana.</span>
                            </h1>

                            <p className="text-base sm:text-lg lg:text-xl text-slate-500 dark:text-slate-400 mb-6 md:mb-10 leading-relaxed max-w-lg mx-auto md:mx-0">
                                Acompañamiento metodológico, corrección por capítulos y apoyo real desde el anteproyecto hasta la defensa. Atención online y presencial en Higüey.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <a href="https://wa.me/message/YESJDSE3MZ3IM1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-brand-orange text-white font-bold py-3.5 md:py-4 px-8 rounded-full shadow-xl shadow-brand-orange/20 hover:shadow-2xl hover:shadow-brand-orange/30 hover:-translate-y-1 transition-all duration-300">
                                    <span className="material-icons mr-2" aria-hidden="true">fact_check</span> Solicitar diagnóstico
                                </a>
                                <a href="https://wa.me/message/YESJDSE3MZ3IM1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-white dark:bg-white/5 text-slate-700 dark:text-white font-bold py-3.5 md:py-4 px-8 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-300">
                                    <span className="material-icons mr-2 text-brand-orange" aria-hidden="true">chat</span> Hablar por WhatsApp
                                </a>
                            </div>

                            <div className="mt-8 text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-2">
                                <span className="material-icons text-brand-orange text-sm">verified</span>
                                Trabajamos con tesis de grado, maestría y doctorado.
                            </div>

                            <div className="mt-8 hidden md:inline-flex items-center gap-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-3 pr-6 rounded-full border border-white/50 dark:border-slate-700/50 shadow-sm">
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

                        <div className="w-full md:w-1/2 relative animate-fade-in group perspective-1000 order-2 md:order-2">
                            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-xl md:shadow-2xl border border-gray-100 dark:border-slate-800 relative z-20 mx-auto w-full max-w-md md:max-w-full">
                                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-2 text-center">Diagnóstico Rápido</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm text-center mb-6">Completa este breve formulario y evaluaremos exactamente en qué necesitas ayuda.</p>

                                <form className="space-y-4" onSubmit={(e) => {
                                    e.preventDefault();
                                    window.open('https://wa.me/message/YESJDSE3MZ3IM1', '_blank');
                                }}>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">¿En qué etapa estás?</label>
                                        <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all">
                                            <option>Tengo la idea inicial / Anteproyecto</option>
                                            <option>Desarrollando Marco Teórico</option>
                                            <option>Aplicando Metodología / Instrumentos</option>
                                            <option>Tesis terminada pero con correcciones de formato (APA)</option>
                                            <option>Tengo observaciones de mi asesor y no sé qué hacer</option>
                                            <option>Me preparo para la defensa</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nivel Académico</label>
                                        <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-brand-orange focus:border-transparent outline-none transition-all">
                                            <option>Grado / Licenciatura</option>
                                            <option>Maestría / Posgrado</option>
                                            <option>Doctorado</option>
                                        </select>
                                    </div>
                                    <button type="submit" className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl hover:-translate-y-1 transition-transform duration-300 shadow-lg mt-2 flex items-center justify-center gap-2">
                                        Enviar y recibir diagnóstico gratis <span className="material-icons text-sm" aria-hidden="true">arrow_forward</span>
                                    </button>
                                </form>
                            </div>

                            {/* Decorative Background for Form */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange to-yellow-400 rounded-[2rem] transform rotate-3 scale-105 opacity-20 blur-xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium Trust Proofs Section */}
            <section className="py-10 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 relative z-10 -mt-6">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 shadow-sm border border-slate-100 dark:border-slate-700/50 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700">
                        <div className="flex flex-col items-center text-center gap-3 pt-4 md:pt-0 max-w-xs mx-auto group cursor-default">
                            <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                <span className="material-icons text-2xl">location_on</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-2">Online y Presencial</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Atención en Higüey y todo el país.</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center text-center gap-3 pt-8 md:pt-0 max-w-xs mx-auto group cursor-default">
                            <div className="w-14 h-14 shrink-0 rounded-2xl bg-brand-orange/10 dark:bg-orange-900/30 text-brand-orange flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300">
                                <span className="material-icons text-2xl">school</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-2">Todos los Niveles</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Grado, Maestría y Doctorado.</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center text-center gap-3 pt-8 md:pt-0 max-w-xs mx-auto group cursor-default">
                            <div className="w-14 h-14 shrink-0 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                                <span className="material-icons text-2xl">rule</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-2">Revisión Guiada</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Según observaciones de tu asesor.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How We Work Section (Premium Redesign) */}
            <section className="py-20 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-slate-100 to-transparent dark:from-slate-900"></div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/3 text-center lg:text-left">
                            <span className="text-brand-orange font-black uppercase tracking-[0.2em] text-xs md:text-sm mb-3 md:mb-4 block">Nuestro Método</span>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                                ¿Cómo <br className="hidden lg:block" />trabajamos?
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                Un sistema estructurado de 4 pasos diseñado para minimizar errores, optimizar tu tiempo y garantizar la aprobación de tu investigación.
                            </p>
                            <a href="https://wa.me/message/YESJDSE3MZ3IM1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center font-bold text-brand-orange hover:text-orange-600 transition-colors group">
                                Iniciar Proceso <span className="material-icons ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </a>
                        </div>

                        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                            {[
                                {
                                    step: '01',
                                    title: 'Diagnóstico Integral',
                                    desc: 'Revisamos minuciosamente en qué etapa de la tesis te encuentras para establecer un punto de partida exacto.',
                                    icon: 'travel_explore',
                                    color: 'from-blue-500 to-cyan-400'
                                },
                                {
                                    step: '02',
                                    title: 'Detección de Brechas',
                                    desc: 'Identificamos debilidades metodológicas, errores de formato APA 7 y desviaciones de las normativas.',
                                    icon: 'radar',
                                    color: 'from-amber-500 to-orange-400'
                                },
                                {
                                    step: '03',
                                    title: 'Plan de Acción Táctico',
                                    desc: 'Diseñamos una hoja de ruta con entregables por capítulos, asegurando avance continuo y validado.',
                                    icon: 'architecture',
                                    color: 'from-brand-orange to-red-500'
                                },
                                {
                                    step: '04',
                                    title: 'Acompañamiento Continuo',
                                    desc: 'Te impulsamos en cada iteración y ensayo, garantizando que domines tu tema hasta la defensa.',
                                    icon: 'rocket_launch',
                                    color: 'from-emerald-500 to-teal-400'
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
                                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${item.color} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                                    <div className="flex justify-between items-start mb-4 md:mb-6">
                                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform`}>
                                            <span className="material-icons text-xl md:text-2xl">{item.icon}</span>
                                        </div>
                                        <span className="font-black text-3xl md:text-4xl text-slate-100 dark:text-slate-800 tracking-tighter">{item.step}</span>
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3">{item.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us (Premium Layout) */}
            <section className="py-20 md:py-32 bg-slate-900 relative overflow-hidden text-white">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-orange/40 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-1/2 h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24">
                        <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-brand-orange font-bold uppercase tracking-[0.2em] text-xs mb-6 backdrop-blur-sm border border-white/5">Nuestra Trayectoria</span>
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 leading-[1.1]">
                            ¿Por qué elegir <span className="text-brand-orange relative whitespace-nowrap">TuTesisRD?</span>
                        </h2>
                        <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-light">
                            Más de 7 años transformando el estrés de las universidades dominicanas en éxito profesional. Nuestra metodología garantiza resultados con aval científico.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {[
                            { icon: 'history_edu', title: '+7', subtitle: 'Años', desc: 'Experiencia Académica', color: 'from-blue-600 to-cyan-500' },
                            { icon: 'groups', title: '300+', subtitle: 'Tesis', desc: 'Asesoradas y Aprobadas', color: 'from-amber-500 to-orange-500' },
                            { icon: 'verified', title: '100%', subtitle: 'Éxito', desc: 'Tasa de Aprobación', color: 'from-emerald-500 to-teal-500' },
                            { icon: 'language', title: 'Nacional', subtitle: 'Cobertura', desc: 'Atención en toda RD', color: 'from-purple-600 to-indigo-500' }
                        ].map((stat, idx) => (
                            <div key={idx} className="group relative bg-white/5 backdrop-blur-sm p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden text-center sm:text-left">
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity rounded-full -mr-10 -mt-10`}></div>

                                <span className={`material-icons text-4xl mb-6 bg-gradient-to-br ${stat.color} text-transparent bg-clip-text`}>{stat.icon}</span>

                                <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-1 sm:gap-2 mb-2 justify-center sm:justify-start">
                                    <h4 className="text-4xl md:text-5xl font-black tracking-tighter">{stat.title}</h4>
                                    <span className="text-base md:text-xl font-bold text-slate-400">{stat.subtitle}</span>
                                </div>
                                <p className="text-slate-400 font-medium text-sm md:text-base">
                                    {stat.desc}
                                </p>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {[
                            {
                                icon: 'school',
                                title: 'Tesis de Grado',
                                desc: 'Asesoría desde el anteproyecto hasta la entrega final de tu licenciatura.',
                                details: 'Acompañamiento en la selección del tema, diseño metodológico y redacción de todo el documento.',
                                color: 'text-blue-600',
                                bg: 'bg-blue-50 dark:bg-blue-900/10'
                            },
                            {
                                icon: 'account_balance',
                                title: 'Tesis de Maestría',
                                desc: 'Elevamos el nivel de exigencia metodológica y teórica de tu posgrado.',
                                details: 'Enfoque en aportar nuevo conocimiento, rigor académico y estructuración compleja.',
                                color: 'text-indigo-600',
                                bg: 'bg-indigo-50 dark:bg-indigo-900/10'
                            },
                            {
                                icon: 'workspace_premium',
                                title: 'Tesis Doctoral',
                                desc: 'El más alto nivel académico, con investigación original y profunda.',
                                details: 'Acompañamiento a largo plazo, publicaciones vinculadas y preparación intensiva para el jurado.',
                                color: 'text-purple-600',
                                bg: 'bg-purple-50 dark:bg-purple-900/10'
                            },
                            {
                                icon: 'fact_check',
                                title: 'Corrección APA 7',
                                desc: 'Ajuste perfecto de citas, referencias y formato al estándar requerido.',
                                details: 'Revisión exhaustiva de márgenes, tablas, figuras, y estructuración de la bibliografía.',
                                color: 'text-emerald-600',
                                bg: 'bg-emerald-50 dark:bg-emerald-900/10'
                            },
                            {
                                icon: 'menu_book',
                                title: 'Marco Teórico',
                                desc: 'Construcción sólida de antecedentes y bases conceptuales.',
                                details: 'Búsqueda de literatura actualizada, síntesis teórica y correcta citación para evitar plagio.',
                                color: 'text-amber-600',
                                bg: 'bg-amber-50 dark:bg-amber-900/10'
                            },
                            {
                                icon: 'science',
                                title: 'Metodología',
                                desc: 'Diseño del tipo, enfoque, población, muestra e instrumentos.',
                                details: 'Garantizamos que el camino elegido responda exactamente a tus objetivos de investigación.',
                                color: 'text-teal-600',
                                bg: 'bg-teal-50 dark:bg-teal-900/10'
                            },
                            {
                                icon: 'analytics',
                                title: 'Resultados y Defensa',
                                desc: 'Análisis de datos, discusión, conclusiones y preparación para sustentar.',
                                details: 'Tabulación, gráficos, interpretación de hallazgos y ensayos simulados para tu presentación final.',
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

            {/* Objections / FAQ Section */}
            <section className="py-12 md:py-20 bg-slate-50 dark:bg-slate-900/50">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                    <div className="text-center mb-10 md:mb-16">
                        <span className="text-brand-orange font-black uppercase tracking-[0.2em] text-xs md:text-sm mb-3 md:mb-4 block">Preguntas Frecuentes</span>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 md:mb-6 leading-tight">
                            Resolvemos tus dudas
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Todo lo que necesitas saber antes de empezar a trabajar con nosotros.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: '¿Corrigen según las observaciones del asesor?',
                                a: 'Sí. Diseñamos un plan de trabajo basado estrictamente en las correcciones y sugerencias que te haya hecho tu asesor o el jurado revisor para garantizar la aprobación.'
                            },
                            {
                                q: '¿Trabajan por capítulos?',
                                a: 'Sí, adaptamos nuestra asesoría a tus necesidades reales. Si solo necesitas ayuda con el marco metodológico o el análisis de resultados, trabajamos en esa fase específica.'
                            },
                            {
                                q: '¿Atienden presencial en Higüey?',
                                a: '¡Totalmente! Contamos con atención presencial en Higüey para reunirnos contigo si así lo prefieres, además de nuestra atención online para todo el país.'
                            },
                            {
                                q: '¿Pueden revisar una tesis ya avanzada?',
                                a: 'Claro que sí. Podemos realizar una auditoría de lo que tienes estructurado y ajustarlo a los requerimientos de tu universidad para poder avanzar.'
                            },
                            {
                                q: '¿Pueden ayudarme con APA 7 y formato institucional?',
                                a: 'Hacemos una revisión exhaustiva de forma, garantizando que tu documento cumpla el 100% de las normativas APA 7ma edición y los reglamentos internos de tu facultad.'
                            }
                        ].map((faq, idx) => (
                            <details key={idx} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden open:ring-2 open:ring-brand-orange/50 transition-all">
                                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-900 dark:text-white text-lg hover:text-brand-orange transition-colors">
                                    {faq.q}
                                    <span className="material-icons text-brand-orange group-open:rotate-180 transition-transform">expand_more</span>
                                </summary>
                                <div className="px-6 pb-6 text-slate-600 dark:text-slate-400">
                                    <p>{faq.a}</p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof & Universities Section */}
            <section className="py-16 bg-white dark:bg-black border-y border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="container mx-auto px-6">
                    <p className="text-center text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-10">
                        Estudiantes exitosos de estas universidades confían en nosotros
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder text tags for universities (Consider replacing with actual logos later) */}
                        <div className="text-2xl font-black text-slate-800 dark:text-slate-200">UASD</div>
                        <div className="text-2xl font-black text-slate-800 dark:text-slate-200">UAPA</div>
                        <div className="text-2xl font-black text-slate-800 dark:text-slate-200">PUCMM</div>
                        <div className="text-2xl font-black text-slate-800 dark:text-slate-200">UTESA</div>
                        <div className="text-2xl font-black text-slate-800 dark:text-slate-200">UNPHU</div>
                    </div>
                </div>
            </section>
            <section className="py-16 bg-brand-orange/5 dark:bg-black/20">
                <div className="container mx-auto px-6">
                    <div className="bg-white dark:bg-background-dark rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col lg:flex-row">
                            <div className="lg:w-2/5 bg-gray-200 dark:bg-gray-800 relative min-h-[300px] lg:min-h-full flex items-end justify-center overflow-hidden">
                                <img
                                    src="/miguel-cordero.webp"
                                    alt="Miguel Ángel Cordero Trinidad"
                                    loading="lazy"
                                    width="600"
                                    height="800"
                                    className="absolute inset-0 w-full h-full object-cover object-top"
                                />
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
            <section className="py-12 md:py-20 bg-brand-orange relative overflow-hidden">
                <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">¡Únete a los cientos de estudiantes satisfechos!</h2>
                    <p className="text-white text-base md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto font-medium">Han alcanzado el éxito académico con nuestra ayuda. ¿Qué esperas para ser el próximo?</p>
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

            {/* Floating WhatsApp Button */}
            <a href="https://wa.me/message/YESJDSE3MZ3IM1"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center animate-bounce-slow"
                aria-label="Hablar por WhatsApp">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.161.453-.834.864-1.173.968-.339.103-.943.208-2.673-.497-2.071-.845-3.418-2.957-3.52-3.093-.103-.136-.84-.114-.84-2.227 0-1.114.582-1.666.786-1.892.204-.226.444-.282.593-.282.148 0 .296.004.428.01.132.007.31-.052.485.37.175.42.596 1.45.648 1.554.052.103.087.224.013.374-.074.15-.112.243-.223.355-.112.112-.236.252-.338.347-.113.104-.236.218-.112.43.123.212.548.908 1.18 1.474.815.733 1.511.96 1.716 1.064.204.104.323.088.441-.048.118-.135.509-.596.645-.8.136-.205.27-.171.464-.098.194.074 1.226.578 1.436.683.21.104.348.156.398.244.052.088.052.511-.109.964z" />
                </svg>
            </a>
        </div>
    );
};

export default LandingPage;