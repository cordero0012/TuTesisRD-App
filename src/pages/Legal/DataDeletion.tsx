import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/SEO';

const DataDeletion: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-800 dark:text-white">
            <SEO
                title="Instrucciones para la Eliminación de Datos - TuTesisRD"
                description="Instrucciones sobre cómo solicitar la eliminación de sus datos personales de TuTesisRD según las políticas de privacidad y de Facebook/Meta."
            />
            <Navbar />

            <section className="pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="bg-white dark:bg-background-dark p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b pb-4 dark:border-gray-800">
                            Instrucciones para la Eliminación de Datos
                        </h1>
                        
                        <div className="prose prose-gray dark:prose-invert max-w-none">
                            <p className="text-sm text-gray-500 mb-8">Última actualización: {new Date().toLocaleDateString()}</p>
                            
                            <p>Según el Reglamento General de Protección de Datos (RGPD) y las políticas y condiciones de desarrolladores de Facebook (Meta), usted tiene el derecho a solicitar la eliminación de todos sus datos personales u otra información que tengamos sobre usted.</p>
                            
                            <p>Si desea eliminar de forma permanente su actividad y sus datos asociados con <strong>TuTesisRD</strong>, puede hacerlo siguiendo las siguientes instrucciones:</p>

                            <h3>Si interactuó mediante nuestra aplicación en Facebook o Meta:</h3>
                            <ol>
                                <li>Ingrese a su cuenta de Facebook y haga clic en la opción "Configuración y Privacidad".</li>
                                <li>Vaya al apartado de "Configuración".</li>
                                <li>Busque y seleccione la pestaña de "Aplicaciones y sitios web", donde podrá ver todas sus actividades.</li>
                                <li>Localice la aplicación de "TuTesisRD" o las conexiones relacionadas con nuestro servicio.</li>
                                <li>Haga clic en el botón "Eliminar".</li>
                                <li>Marque las casillas requeridas según sus preferencias y finalmente confirme haciendo clic en el botón de confirmación.</li>
                            </ol>

                            <h3>Eliminación de datos almacenados en nuestros servidores:</h3>
                            <p>Si se registró en nuestra plataforma, agendó una cita o tiene un expediente con nosotros, y desea que la totalidad de su historial, progreso y datos de usuario sean borrados permanentemente:</p>
                            <ul>
                                <li><strong>Opción 1:</strong> Envíe un correo electrónico a <strong>ttesisrd@gmail.com</strong> detallando su solicitud, con el asunto: <em>"Solicitud de Eliminación de Datos - [Su Nombre]"</em>.</li>
                                <li><strong>Opción 2:</strong> Escríbanos directamente a nuestra línea de atención vía <a href="https://wa.me/message/YESJDSE3MZ3IM1" target="_blank" rel="noreferrer">WhatsApp</a> indicando que requiere la baja de sus datos del sistema.</li>
                            </ul>
                            
                            <p>Una vez procesada su solicitud, procederemos a borrar la información alojada en nuestras bases de datos en un plazo no mayor a 14 días laborables. Recibirá una confirmación vía correo electrónico o WhatsApp una vez que el proceso haya concluido exitosamente.</p>
                            
                            <p><em>Nota: Es posible que, por requerimientos legales y contables de la República Dominicana, algunos datos referidos a comprobantes de pago deban conservarse por períodos obligatorios dictaminados por la ley.</em></p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default DataDeletion;
