import React from 'react';

interface RegisterStep3Props {
    isSubmitting: boolean;
    prevStep: () => void;
    submitRegistration: () => void;
}

export const RegisterStep3: React.FC<RegisterStep3Props> = ({ isSubmitting, prevStep, submitRegistration }) => {
    return (
        <div className="animate-fade-in-right">
            <h2 className="text-2xl md:text-3xl font-black mb-2 text-slate-900 dark:text-white">Sube tus Archivos</h2>
            <p className="text-slate-500 mb-8">Si tienes documentos previos, súbelos aquí. (Opcional)</p>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl flex items-start gap-4 mb-8">
                <span className="material-icons text-blue-500 text-3xl shrink-0">info</span>
                <div>
                    <h3 className="font-bold text-blue-800 dark:text-blue-200 mb-1">Archivos y Documentos</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        La carga de archivos (anteproyectos, lineamientos, etc.) se gestionará directamente con tu asesor asignado. Puedes enviar estos documentos por WhatsApp o correo electrónico una vez finalices el registro.
                    </p>
                </div>
            </div>

            <div className="mt-10 flex flex-col-reverse md:flex-row justify-between gap-4">
                <button onClick={prevStep} className="w-full md:w-auto py-3 text-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium transition-colors"> Atrás</button>
                <button
                    onClick={submitRegistration}
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-4 bg-[#10b981] text-white rounded-xl font-bold hover:shadow-lg hover:bg-[#059669] transition-all transform hover:-translate-y-1 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>Processing <span className="material-icons animate-spin">sync</span></>
                    ) : (
                        <>Finalizar Registro <span className="material-icons">check_circle</span></>
                    )}
                </button>
            </div>
        </div>
    );
};
