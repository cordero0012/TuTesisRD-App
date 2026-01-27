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

            <div className="grid grid-cols-1 gap-4 mb-8">
                <div className="space-y-3">
                    <h3 className="font-bold text-slate-700 dark:text-white flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-xs flex items-center justify-center">1</span> Anteproyecto</h3>
                    <div className="h-32 border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-white dark:hover:bg-slate-800 hover:border-brand-orange dark:hover:border-brand-orange transition-all group">
                        <span className="material-icons text-3xl text-slate-400 group-hover:text-brand-orange mb-1 transition-colors">cloud_upload</span>
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-brand-orange">Subir PDF</span>
                    </div>
                </div>
                {/* More compact upload for mobile */}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl items-start gap-3 flex mb-8">
                <span className="material-icons text-blue-500 shrink-0">info</span>
                <p className="text-sm text-blue-700 dark:text-blue-300">Si no tienes los archivos a mano, puedes continuar y enviarlos luego por WhatsApp a tu asesor asignado.</p>
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
