import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SEO from '../components/SEO';
import PricingCatalog from '../components/landing/PricingCatalog';

const Services: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-800 dark:text-white">
            <SEO
                title="Servicios"
                description="Ofrecemos asesoría de tesis, corrección de estilo, análisis estadístico y revisión anti-plagio con Turnitin."
            />
            <Navbar />

            <section className="pt-24 pb-10 bg-background-light dark:bg-surface-dark relative transition-colors duration-200">
                <div className="container mx-auto px-6 relative z-10">
                    {/* Interactive Real Pricing Catalog */}
                    <div className="-mx-6">
                        <PricingCatalog />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Services;
