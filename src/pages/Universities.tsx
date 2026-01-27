import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Universities: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-800 dark:text-white">
            <Navbar />

            <section className="pt-32 pb-20 bg-white dark:bg-background-dark transition-colors duration-200">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">Nuestra Experiencia Universitaria</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto text-lg">
                        En Tu Tesis RD, entendemos que cada universidad tiene su propia identidad, normativa y rigor académico.
                        Hemos trabajado exitosamente con estudiantes de las principales instituciones de educación superior del país.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
                        {['UASD', 'PUCMM', 'O&M', 'UAPA', 'UNIBE', 'UNPHU', 'UTESA', 'INTEC', 'UNAPEC', 'UCNE', 'UCATECI', 'UFHEC'].map((uni) => (
                            <div key={uni} className="flex flex-col items-center justify-center p-8 border border-slate-100 dark:border-slate-800 rounded-2xl hover:shadow-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 group cursor-pointer">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 text-slate-400 group-hover:text-brand-orange group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 transition-colors">
                                    <span className="material-icons text-3xl">account_balance</span>
                                </div>
                                <span className="text-xl font-bold text-slate-700 dark:text-slate-300 group-hover:text-brand-orange transition-colors">{uni}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-brand-orange text-white rounded-3xl p-8 md:p-12 shadow-xl mx-auto max-w-4xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-4">¿Tu universidad no está en la lista?</h3>
                            <p className="mb-8 text-white/90">
                                No te preocupes. Nuestra metodología es adaptable a cualquier normativa institucional (APA, Vancouver, ISO, etc.).
                                Analizamos el manual de tesis de tu universidad para garantizar el cumplimiento del 100% de los requisitos de forma.
                            </p>
                            <a href="https://wa.me/message/YESJDSE3MZ3IM1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-white text-brand-orange font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                                Consultar Disponibilidad
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Universities;
