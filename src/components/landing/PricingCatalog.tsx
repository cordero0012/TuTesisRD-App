import React, { useState } from 'react';

// --- DATA STRUCTURES ---
type PricingPlan = {
    title: string;
    price: string;
    features: string[];
    isPremium?: boolean;
};

type ServiceCategory = {
    id: string;
    name: string;
    icon: string;
    plans: PricingPlan[];
    note?: string;
};

export const pricingCategories: ServiceCategory[] = [
    {
        id: 'grado',
        name: 'Tesis de Grado',
        icon: 'school',
        plans: [
            {
                title: 'Plan 1 - Corrección y Asesoría',
                price: 'RD$5,000 - 10,000',
                features: ['Correcciones de avances', 'Orientación académica', 'Apoyo metodológico']
            },
            {
                title: 'Plan 2 - Desarrollo Parcial',
                price: 'RD$10,000 - 15,000',
                features: ['Desarrollo colaborativo', 'Correcciones profundas', 'Fortalecimiento de capítulos']
            },
            {
                title: 'Plan 3 - Desarrollo Completo',
                price: 'RD$15,000 - 20,000',
                features: ['Desarrollo de proyecto completo', 'Revisión académica', 'Estructura lista para entrega']
            },
            {
                title: 'Plan 4 - Completo + Diapositivas',
                price: 'RD$20,000 - 23,000',
                features: ['Desarrollo integral', 'Revisión académica', 'Diapositivas de defensa incluidas'],
                isPremium: true
            },
            {
                title: 'Plan 5 - VIP Completo',
                price: 'RD$20,000 - 26,000',
                features: ['Desarrollo, Revisión, Diapositivas', 'Impresión del documento', 'Empastado listo para entrega'],
                isPremium: true
            },
            {
                title: 'Capítulo Individual',
                price: 'RD$5,000*',
                features: ['Desarrollo de un solo capítulo', 'Manejo de Citas y Fuentes (APA 7)', '*Costo varía en Marco Teórico o Resultados']
            }
        ]
    },
    {
        id: 'monografico',
        name: 'Monográficos',
        icon: 'menu_book',
        plans: [
            {
                title: 'Plan 1 - Corrección y Asesoría',
                price: 'RD$5,000 - 10,000',
                features: ['Revisión de monográfico', 'Correcciones estructuradas', 'Orientación de mejora']
            },
            {
                title: 'Plan 2 - Desarrollo Parcial',
                price: 'RD$10,000 - 15,000',
                features: ['El estudiante aporta parte del documento', 'Desarrollo de lo faltante', 'Correcciones generales']
            },
            {
                title: 'Plan 3 - Desarrollo Completo',
                price: 'RD$15,000 - 20,000',
                features: ['Desarrollo completo desde cero', 'Estructuración y revisión', 'Organización para entrega']
            },
            {
                title: 'Plan 4 - Completo + Diapositivas',
                price: 'RD$20,000 - 23,000',
                features: ['Monográfico completo', 'Revisión total', 'Presentación Visual de Defensa'],
                isPremium: true
            },
            {
                title: 'Plan 5 - VIP Completo',
                price: 'RD$20,000 - 26,000',
                features: ['Monográfico y Diapositivas', 'Impresión Física', 'Empastado Universitario'],
                isPremium: true
            },
            {
                title: 'Capítulo Individual',
                price: 'RD$5,000*',
                features: ['Soporte para un solo capítulo', 'Manejo de Citas y Fuentes', '*Costo varía en Marco Teórico o Resultados']
            }
        ]
    },
    {
        id: 'postgrado',
        name: 'Postgrado/Maestría',
        icon: 'workspace_premium',
        plans: [
            {
                title: 'Plan 1 - Especializada',
                price: 'RD$8,000 - 12,000',
                features: ['Revisión metodológica avanzada', 'Corrección formal', 'Fortalecimiento de contenido']
            },
            {
                title: 'Plan 2 - Desarrollo Parcial',
                price: 'RD$12,000 - 20,000',
                features: ['Desarrollo de capítulos faltantes', 'Fortalecimiento de secciones críticas', 'Asistencia analítica']
            },
            {
                title: 'Plan 3 - Desarrollo Completo',
                price: 'RD$20,000 - 25,000',
                features: ['Proyecto completo (Maestría)', 'Revisión técnica y especializada', 'Organización final rigurosa']
            },
            {
                title: 'Plan 4 - Desarrollo + Defensa',
                price: 'RD$23,000 - 28,000',
                features: ['Tesis de postgrado completa', 'Revisión especializada', 'Diapositivas para defensa de jurado'],
                isPremium: true
            },
            {
                title: 'Plan 5 - VIP Completo',
                price: 'RD$25,000 - 30,000',
                features: ['Tesis, Diapositivas y Asesoría', 'Impresión Oficial', 'Empastado de Lujo'],
                isPremium: true
            },
            {
                title: 'Capítulo Sustantivo',
                price: 'RD$7,000 - 8,000',
                features: ['Atención a capítulos críticos', 'Resultados o Discusión', 'Alineación de Marcos']
            }
        ]
    },
    {
        id: 'doctoral',
        name: 'Tesis Doctoral',
        icon: 'account_balance',
        plans: [
            {
                title: 'Plan 1 - Corrección Doctoral',
                price: 'RD$15,000 - 20,000',
                features: ['Revisión epistemológica rigurosa', 'Corrección de altísimo nivel', 'Orientación hiper-especializada']
            },
            {
                title: 'Plan 2 - Desarrollo Parcial',
                price: 'RD$20,000 - 30,000',
                features: ['Fortalecimiento de sustentos', 'Desarrollo de capítulos estratégicos', 'Manejo de variables complejas']
            },
            {
                title: 'Plan 3 - Desarrollo Doctoral',
                price: 'RD$30,000 - 45,000',
                features: ['Tesis doctoral estructurada', 'Revisión académica exhaustiva', 'Generación de aporte inédito']
            },
            {
                title: 'Plan 4 - Defensa Doctoral',
                price: 'RD$33,000 - 48,000',
                features: ['Tesis doctoral íntegra', 'Arquitectura de Defensa Superior', 'Diapositivas Gráficas de Alto Perfil'],
                isPremium: true
            },
            {
                title: 'Plan 5 - VIP Doctoral',
                price: 'RD$35,000 - 50,000',
                features: ['Proyecto Doctoral Absoluto', 'Diapositivas Avanzadas', 'Impresión y Empastado de Lujo Final'],
                isPremium: true
            },
            {
                title: 'Capítulo Estratégico',
                price: 'RD$10,000',
                features: ['Desarrollo profundo por sección', 'Análisis cuali-cuantitativo', 'Fundamentación Filosófica']
            }
        ]
    },
    {
        id: 'adicionales',
        name: 'Servicios de Apoyo',
        icon: 'extension',
        note: 'El costo final de impresión puede variar según cantidad de páginas, tipo de papel, color y número de copias.',
        plans: [
            {
                title: 'Diapositivas',
                price: 'RD$2,000 - 5,000',
                features: ['Diseño académico (2k-3k)', 'Diseño Premium/Profesional (4k-5k)', 'Estructura lista para exposición']
            },
            {
                title: 'Artículos Científicos',
                price: 'RD$8,000 - 12,000',
                features: ['Ajuste y Corrección (8k)', 'Desarrollo parcial (10k)', 'Desarrollo manuscrito total (12k)']
            },
            {
                title: 'Tareas Académicas',
                price: 'RD$200 - 300 / pág',
                features: ['Nivel Básico (200 X pág)', 'Intermedio (250 X pág)', 'Avanzado: Ensayos (300 X pág)'],
                isPremium: true
            },
            {
                title: 'Impresión y Empastado',
                price: 'RD$500 - 3,500',
                features: ['Impresión Básica (500+)', 'Impresión y Empastado Std (1.2k-2k)', 'Entrega Premium VIP (2k-3.5k)']
            }
        ]
    }
];

import { buildWhatsAppUrl } from '../../config';

const PricingCatalog: React.FC = () => {
    const getPlanWhatsAppUrl = (planTitle: string, categoryName: string) => {
        const message = `Hola TuTesisRD, me interesa consultar y obtener una cotización formal para el "${planTitle}" en la categoría de "${categoryName}". ¿Podemos hablar al respecto?`;
        return buildWhatsAppUrl(message);
    };

    const diagnosticUrl = buildWhatsAppUrl('Hola TuTesisRD, no sé cuál plan elegir para mi trabajo de grado. Deseo solicitar un diagnóstico gratuito.');

    return (
        <section className="pt-6 md:pt-10 pb-12 md:pb-24 bg-tutesis-white dark:bg-tutesis-black text-tutesis-black dark:text-tutesis-white relative overflow-hidden transition-colors duration-300">
            <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10 relative z-10">
                <div className="text-center max-w-4xl mx-auto mb-8 md:mb-12">
                    <span className="inline-block py-1 px-3 rounded-full bg-tutesis-orange/15 text-tutesis-orange font-bold uppercase tracking-[0.2em] text-xs md:text-sm mb-3">
                        Inversión Transparente
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-tutesis-black dark:text-tutesis-white mb-4 tracking-tight font-display">
                        Catálogo de <span className="text-tutesis-orange">Servicios</span>
                    </h2>
                    <p className="text-base md:text-xl text-tutesis-black/70 dark:text-tutesis-white/70 leading-relaxed">
                        Soluciones académicas transparentes. Elige el nivel de acompañamiento que mejor se adapte a tus necesidades.
                    </p>
                </div>

                {/* Categories Index Navigator (Real href Anchors - Single Row Scroller on Mobile) */}
                <nav aria-label="Categorías de servicios" className="sticky top-20 z-20 bg-tutesis-white/95 dark:bg-tutesis-black/95 backdrop-blur-md py-3 mb-10 border-b border-tutesis-black/15 dark:border-tutesis-white/20">
                    <div className="flex flex-nowrap overflow-x-auto gap-2 md:gap-3 py-1 px-1 no-scrollbar justify-start md:justify-center">
                        {pricingCategories.map((category) => (
                            <a
                                key={category.id}
                                href={`#${category.id}`}
                                className="inline-flex shrink-0 items-center gap-2 px-4 py-2.5 rounded-md font-bold text-xs md:text-sm transition-colors border border-tutesis-black/20 dark:border-tutesis-white/25 bg-tutesis-white dark:bg-tutesis-black text-tutesis-black dark:text-tutesis-white hover:bg-tutesis-orange hover:text-tutesis-black dark:hover:bg-tutesis-orange dark:hover:text-tutesis-black"
                            >
                                <span className="material-icons text-base">{category.icon}</span>
                                <span>{category.name}</span>
                            </a>
                        ))}
                    </div>
                </nav>

                {/* All 5 Categories Mounted Simultaneously in DOM */}
                <div className="space-y-16 md:space-y-24">
                    {pricingCategories.map((category) => (
                        <div
                            key={category.id}
                            id={category.id}
                            data-testid={`category-${category.id}`}
                            className="scroll-mt-28"
                        >
                            <div className="flex items-center gap-3 mb-6 md:mb-8 pb-3 border-b border-tutesis-black/20 dark:border-tutesis-white/20">
                                <span className="material-icons text-tutesis-orange text-2xl md:text-3xl">{category.icon}</span>
                                <h3 className="text-xl md:text-3xl font-extrabold text-tutesis-black dark:text-tutesis-white tracking-tight font-display">{category.name}</h3>
                            </div>

                            {category.note && (
                                <div className="max-w-4xl mb-8 p-4 bg-tutesis-gold/15 border border-tutesis-orange/30 rounded-md flex items-start gap-3">
                                    <span className="material-icons text-tutesis-orange shrink-0">info</span>
                                    <p className="text-xs md:text-sm text-tutesis-black/80 dark:text-tutesis-white/80 font-medium">{category.note}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {category.plans.map((plan, idx) => (
                                    <div
                                        key={idx}
                                        className={`rounded-md p-6 md:p-8 flex flex-col transition-all h-full relative ${plan.isPremium
                                            ? 'border-2 border-tutesis-orange bg-tutesis-gold/10 dark:bg-tutesis-gold/15'
                                            : 'border border-tutesis-black/15 dark:border-tutesis-white/20 bg-tutesis-white dark:bg-tutesis-black'
                                            }`}
                                    >
                                        {/* Neutral Badge */}
                                        {plan.isPremium && (
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-tutesis-orange text-tutesis-black text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full whitespace-nowrap shadow-sm">
                                                Incluye extras
                                            </div>
                                        )}

                                        <h4 className="text-xl font-bold mb-2 text-tutesis-black dark:text-tutesis-white font-display">{plan.title}</h4>
                                        <div className="flex items-baseline gap-1 mb-8">
                                            <span className="text-2xl md:text-3xl font-black text-tutesis-black dark:text-tutesis-white">{plan.price}</span>
                                        </div>

                                        <ul className="space-y-4 mb-8 flex-grow">
                                            {plan.features.map((feature, fIdx) => (
                                                <li key={fIdx} className="flex items-start gap-3 text-sm text-tutesis-black/75 dark:text-tutesis-white/75 leading-relaxed">
                                                    <span className="material-icons text-tutesis-orange text-lg shrink-0">check_circle</span>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="pt-4 border-t border-tutesis-black/15 dark:border-tutesis-white/20">
                                            <a
                                                href={getPlanWhatsAppUrl(plan.title, category.name)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`w-full flex justify-center py-3.5 rounded-md font-extrabold transition-colors text-center text-sm ${plan.isPremium
                                                    ? 'bg-tutesis-orange text-tutesis-black hover:bg-tutesis-gold'
                                                    : 'border-2 border-tutesis-black text-tutesis-black dark:border-tutesis-white dark:text-tutesis-white hover:bg-tutesis-orange hover:text-tutesis-black hover:border-tutesis-orange dark:hover:bg-tutesis-orange dark:hover:text-tutesis-black dark:hover:border-tutesis-orange'
                                                    }`}
                                            >
                                                Cotizar este plan
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Final Diagnostic CTA */}
                <div className="mt-16 md:mt-24 text-center bg-tutesis-black text-tutesis-white rounded-md p-8 md:p-12 border border-tutesis-white/20 relative overflow-hidden">
                    <h3 className="text-2xl md:text-4xl font-extrabold mb-4 font-display text-tutesis-white">¿Dudas sobre cuál plan se adapta a tu etapa?</h3>
                    <p className="text-tutesis-white/75 max-w-2xl mx-auto mb-8 text-base md:text-lg leading-relaxed">
                        Revisamos la etapa exacta de tu trabajo de grado y te recomendamos el acompañamiento justo sin compromisos.
                    </p>
                    <a
                        href={diagnosticUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-tutesis-orange text-tutesis-black hover:bg-tutesis-gold font-extrabold text-base md:text-lg px-8 py-4 rounded-md shadow-md transition-colors"
                    >
                        <span className="material-icons">chat</span>
                        <span>No sé cuál elegir: solicitar diagnóstico</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default PricingCatalog;
