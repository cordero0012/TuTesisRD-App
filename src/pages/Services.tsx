import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SEO from '../components/SEO';
import PricingCatalog from '../components/landing/PricingCatalog';

const Services: React.FC = () => {
    return (
        <div className="min-h-screen bg-tutesis-white dark:bg-tutesis-black font-sans text-tutesis-black dark:text-tutesis-white transition-colors duration-200">
            <SEO
                title="Servicios y Precios de Asesoría Académica | Tu Tesis RD"
                description="Conoce nuestro catálogo transparente de servicios para tesis de grado, monográficos, maestrías y doctorados en República Dominicana."
            />
            <Navbar />

            <main className="pt-28 pb-10">
                {/* Hero Editorial Compacto */}
                <section className="border-b border-tutesis-white/20 bg-tutesis-black py-12 text-tutesis-white md:py-16">
                    <div className="mx-auto max-w-[1280px] px-5 sm:px-8 text-center lg:px-10 max-w-4xl">
                        <span className="inline-block rounded-full bg-tutesis-orange/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-tutesis-orange mb-4">
                            Inversión Transparente
                        </span>
                        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black mb-6 tracking-tight text-tutesis-white">
                            Del caos académico a una <span className="text-tutesis-orange">ruta clara</span>
                        </h1>
                        <p className="text-base md:text-xl text-tutesis-white/75 leading-relaxed max-w-3xl mx-auto mb-6">
                            Precios estructurados por nivel de acompañamiento. Sabes exactamente qué incluye cada plan antes de empezar tu tesis, monográfico o proyecto de posgrado.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-xs md:text-sm text-tutesis-white/70 font-semibold">
                            <span className="flex items-center gap-1.5"><span className="material-icons text-tutesis-orange text-base">check_circle</span> Rangos claros de inversión</span>
                            <span className="flex items-center gap-1.5"><span className="material-icons text-tutesis-orange text-base">check_circle</span> Ajustado a tu normativa universitaria</span>
                            <span className="flex items-center gap-1.5"><span className="material-icons text-tutesis-orange text-base">check_circle</span> Alcance adaptado a tu etapa actual</span>
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
