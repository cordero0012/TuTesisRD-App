import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/SEO';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-800 dark:text-white">
            <SEO
                title="Política de Privacidad - TuTesisRD"
                description="Política de privacidad y protección de datos personales de TuTesisRD."
            />
            <Navbar />

            <section className="pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="bg-white dark:bg-background-dark p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b pb-4 dark:border-gray-800">
                            Política de Privacidad
                        </h1>
                        
                        <div className="prose prose-gray dark:prose-invert max-w-none">
                            <p className="text-sm text-gray-500 mb-8">Última actualización: {new Date().toLocaleDateString()}</p>
                            
                            <h3>1. Información que Recopilamos</h3>
                            <p>En TuTesisRD, recopilamos información personal que usted nos proporciona voluntariamente al registrarse, solicitar nuestros servicios o comunicarse con nosotros. Esta información puede incluir su nombre, dirección de correo electrónico, número de teléfono, institución académica e información relacionada con su proyecto de tesis.</p>

                            <h3>2. Uso de la Información</h3>
                            <p>Utilizamos la información recopilada exclusivamente para:</p>
                            <ul>
                                <li>Proveer los servicios de asesoría académica contratados.</li>
                                <li>Comunicarnos con usted respecto al estado de su proyecto.</li>
                                <li>Mejorar nuestros servicios y la experiencia del usuario en nuestra plataforma.</li>
                                <li>Cumplir con obligaciones legales y regulatorias.</li>
                            </ul>

                            <h3>3. Protección de Datos</h3>
                            <p>Implementamos medidas de seguridad técnicas e institucionales para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción. Su información académica y datos de investigación son tratados con estricta confidencialidad.</p>

                            <h3>4. Compartir Información</h3>
                            <p>No vendemos, intercambiamos ni transferimos de ningún modo su información personal de identificación a terceros, excepto a proveedores de servicios de confianza que nos asisten en la operación de nuestro sitio web o en la prestación de nuestros servicios, siempre y cuando dichas partes acuerden mantener esta información confidencial.</p>

                            <h3>5. Derechos del Usuario</h3>
                            <p>Usted tiene derecho a acceder, rectificar o eliminar su información personal en cualquier momento. Para ejercer estos derechos, o si tiene alguna pregunta sobre nuestra política de privacidad, por favor contáctenos a través de nuestro correo electrónico a ttesisrd@gmail.com.</p>

                            <h3>6. Píxeles y Seguimiento</h3>
                            <p>Utilizamos herramientas como el Píxel de Meta y Google Analytics para comprender cómo interactúan los usuarios con nuestro sitio web y para ofrecer publicidad relevante. Puede optar por no participar en el seguimiento ajustando las preferencias de su navegador o a través de las configuraciones de su cuenta en las respectivas plataformas publicitarias.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
