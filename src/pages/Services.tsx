import React from 'react';
import { CircleCheck } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SEO from '../components/SEO';
import PricingCatalog from '../components/landing/PricingCatalog';

const Services: React.FC = () => {
    return (
        <div className="min-h-screen bg-tutesis-white dark:bg-tutesis-black font-sans text-tutesis-black dark:text-tutesis-white transition-colors duration-200">
            <SEO />
            <Navbar />

            <main className="pt-28 pb-10">
                {/* Hero Editorial Compacto */}
                <section className="border-b border-tutesis-white/20 bg-tutesis-black py-10 text-tutesis-white md:py-16">
                    <div className="mx-auto max-w-[1280px] px-5 sm:px-8 text-center lg:px-10 max-w-4xl">
                        <span className="mb-3 inline-block rounded-full bg-tutesis-orange px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-tutesis-black md:mb-4">
                            Inversión Transparente
                        </span>
                        <h1 className="mb-4 font-display text-3xl font-black tracking-tight text-tutesis-white sm:text-4xl md:mb-6 md:text-5xl">
                            Del caos académico a una <span className="text-tutesis-orange">ruta clara</span>
                        </h1>
                        <p className="mx-auto mb-5 max-w-3xl text-base leading-relaxed text-tutesis-white/75 md:mb-6 md:text-xl">
                            Precios estructurados por nivel de acompañamiento. Sabes exactamente qué incluye cada plan antes de empezar tu tesis, monográfico o proyecto de posgrado.
                        </p>
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-tutesis-white/70 md:gap-y-3 md:text-sm">
                            <span className="flex items-center gap-2"><CircleCheck className="h-4 w-4 shrink-0 text-tutesis-orange" aria-hidden="true" /> Rangos claros de inversión</span>
                            <span className="flex items-center gap-2"><CircleCheck className="h-4 w-4 shrink-0 text-tutesis-orange" aria-hidden="true" /> Ajustado a tu normativa universitaria</span>
                            <span className="flex items-center gap-2"><CircleCheck className="h-4 w-4 shrink-0 text-tutesis-orange" aria-hidden="true" /> Alcance adaptado a tu etapa actual</span>
                        </div>
                    </div>
                </section>

                <PricingCatalog />
            </main>

            <Footer />
        </div>
    );
};

export default Services;
