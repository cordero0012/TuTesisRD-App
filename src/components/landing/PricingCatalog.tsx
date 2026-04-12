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

const pricingCategories: ServiceCategory[] = [
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

const PricingCatalog: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>(pricingCategories[0].id);

    const activeData = pricingCategories.find(c => c.id === activeCategory);

    const generateWhatsAppLink = (planTitle: string, categoryName: string) => {
        const phone = "18297513267";
        const message = `Hola TuTesisRD, me interesa consultar y obtener una cotización formal para el "${planTitle}" en la categoría de "${categoryName}". ¿Podemos hablar al respecto?`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    };

    return (
        <section className="pt-6 md:pt-10 pb-12 md:pb-24 bg-background-light dark:bg-background-dark relative overflow-hidden transition-colors duration-300">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center max-w-4xl mx-auto mb-10 md:mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-brand-orange/10 dark:bg-brand-orange/20 text-brand-orange font-bold uppercase tracking-[0.2em] text-xs md:text-sm mb-3 md:mb-4">Inversión Transparente</span>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 md:mb-6 tracking-tight">
                        Catálogo de <span className="text-brand-orange">Servicios</span>
                    </h2>
                    <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed px-2 md:px-0">
                        Soluciones académicas transparentes. Elige el nivel de acompañamiento que mejor se adapte a tus necesidades.
                    </p>
                </div>

                {/* Categories Tabs Navigator */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12 md:mb-20">
                    {pricingCategories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`flex items-center gap-2 px-5 py-3 md:px-6 md:py-4 rounded-xl font-bold transition-all duration-300 ${activeCategory === category.id
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-105 transform'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                                }`}
                        >
                            <span className="material-icons text-xl md:text-2xl">{category.icon}</span>
                            <span className="text-sm md:text-base whitespace-nowrap">{category.name}</span>
                        </button>
                    ))}
                </div>

                {/* Pricing Grid Body */}
                <div className="animate-fade-in-up">
                    {activeData && (
                        <>
                            {activeData.note && (
                                <div className="max-w-3xl mx-auto mb-8 md:mb-12 p-4 bg-orange-50 dark:bg-orange-900/10 border border-brand-orange/20 rounded-2xl flex items-start gap-3">
                                    <span className="material-icons text-brand-orange shrink-0">info</span>
                                    <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-medium">{activeData.note}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-10">
                                {activeData.plans.map((plan, idx) => (
                                    <div
                                        key={idx}
                                        className={`bg-white dark:bg-surface-dark rounded-3xl p-6 md:p-8 flex flex-col hover:shadow-2xl transition-all h-full ${plan.isPremium
                                            ? 'border-2 border-brand-orange shadow-glow relative transform md:scale-105 z-10'
                                            : 'border border-slate-100 dark:border-slate-800 relative z-0'
                                            }`}
                                    >
                                        {/* Premium Badge */}
                                        {plan.isPremium && (
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full whitespace-nowrap shadow-md">
                                                Más Popular
                                            </div>
                                        )}

                                        <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{plan.title}</h3>
                                        <div className="flex items-baseline gap-1 mb-8">
                                            <span className="text-3xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                                        </div>

                                        <ul className="space-y-4 mb-8 flex-grow">
                                            {plan.features.map((feature, fIdx) => (
                                                <li key={fIdx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                    <span className="material-icons text-green-500 text-lg shrink-0">check_circle</span>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                            <a
                                                href={generateWhatsAppLink(plan.title, activeData.name)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`w-full flex justify-center py-4 rounded-xl font-bold transition-all ${plan.isPremium
                                                    ? 'bg-brand-orange text-white shadow-lg hover:bg-orange-600'
                                                    : 'border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white'
                                                    }`}
                                            >
                                                Cotizar Plan
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PricingCatalog;
