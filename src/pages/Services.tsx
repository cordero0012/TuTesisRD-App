import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SEO from '../components/SEO';
import PricingCatalog from '../components/landing/PricingCatalog';

const Services: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-800 dark:text-white transition-colors duration-200">
            <SEO
                title="Servicios y Precios de Asesoría Académica | Tu Tesis RD"
                description="Conoce nuestro catálogo transparente de servicios para tesis de grado, monográficos, maestrías y doctorados en República Dominicana."
            />
            <Navbar />

            <main className="pt-28 pb-10">
                {/* Hero Editorial Compacto */}
                <section className="bg-slate-900 text-white py-12 md:py-16">
                    <div className="container mx-auto px-6 text-center max-w-4xl">
                        <span className="inline-block py-1 px-3 rounded-full bg-brand-orange/20 text-brand-orange font-bold uppercase tracking-widest text-xs mb-4">
                            Inversión Transparente
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 tracking-tight">
                            Del caos académico a una <span className="text-brand-orange">ruta clara</span>
                        </h1>
                        <p className="text-base md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-6">
                            Precios estructurados por nivel de acompañamiento. Sabes exactamente qué incluye cada plan antes de empezar tu tesis, monográfico o proyecto de posgrado.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-xs md:text-sm text-slate-400 font-medium">
                            <span className="flex items-center gap-1.5"><span className="material-icons text-brand-orange text-base">check_circle</span> Precios fijos sin sorpresas</span>
                            <span className="flex items-center gap-1.5"><span className="material-icons text-brand-orange text-base">check_circle</span> Ajustado a tu normativa universitaria</span>
                            <span className="flex items-center gap-1.5"><span className="material-icons text-brand-orange text-base">check_circle</span> Pagos por etapas</span>
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
