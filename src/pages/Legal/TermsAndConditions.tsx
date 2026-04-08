import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/SEO';

const TermsAndConditions: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-800 dark:text-white">
            <SEO
                title="Términos y Condiciones - TuTesisRD"
                description="Términos y condiciones de uso de los servicios de TuTesisRD."
            />
            <Navbar />

            <section className="pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="bg-white dark:bg-background-dark p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b pb-4 dark:border-gray-800">
                            Términos y Condiciones
                        </h1>
                        
                        <div className="prose prose-gray dark:prose-invert max-w-none">
                            <p className="text-sm text-gray-500 mb-8">Última actualización: {new Date().toLocaleDateString()}</p>
                            
                            <h3>1. Aceptación de los Términos</h3>
                            <p>Al acceder y utilizar el sitio web de TuTesisRD y nuestros servicios de asesoría académica, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestros servicios.</p>

                            <h3>2. Descripción del Servicio</h3>
                            <p>TuTesisRD ofrece servicios de asesoría, revisión, auditoría y acompañamiento en proyectos de investigación académica (tesis, monográficos, proyectos de grado, etc.) basados en las normas APA y los requisitos específicos de las universidades dominicanas.</p>

                            <h3>3. Propiedad Intelectual e Integridad Académica</h3>
                            <p>TuTesisRD proporciona servicios de asesoría y tutoría. <strong>No redactamos, vendemos ni entregamos trabajos académicos terminados para ser presentados como propios por los estudiantes.</strong> Nuestro objetivo es brindar herramientas, correcciones de estilo y retroalimentación para que el estudiante mejore su investigación. Todo trabajo final es responsabilidad exclusiva del estudiante.</p>

                            <h3>4. Pagos y Reembolsos</h3>
                            <ul>
                                <li>Los servicios se cotizan de acuerdo a las necesidades específicas de cada proyecto.</li>
                                <li>Los pagos se realizarán en las cuotas acordadas al inicio del proyecto.</li>
                                <li>Debido a la naturaleza personalizada del servicio, no se realizarán reembolsos por servicios ya prestados o en proceso, salvo en circunstancias excepcionales evaluadas por la administración.</li>
                            </ul>

                            <h3>5. Confidencialidad</h3>
                            <p>Toda la información, datos e ideas compartidas por el estudiante relacionadas con su investigación se mantendrán bajo estricta confidencialidad y no serán compartidas con terceros bajo ninguna circunstancia, salvo autorización explícita del autor.</p>

                            <h3>6. Limitación de Responsabilidad</h3>
                            <p>Si bien garantizamos un servicio de alta calidad y un acompañamiento exhaustivo para asegurar el cumplimiento de las normativas universitarias, TuTesisRD no se hace responsable por las calificaciones finales emitidas por los jurados o las universidades correspondientes, ya que la defensa y sustentación dependen exclusivamente del estudiante.</p>

                            <h3>7. Modificaciones de los Términos</h3>
                            <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web. El uso continuado del servicio constituirá su aceptación de dichas modificaciones.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default TermsAndConditions;
