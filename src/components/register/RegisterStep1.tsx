import React from 'react';
import { RegistrationFormData } from '../../types/register';
import { Link } from 'react-router-dom';

interface RegisterStep1Props {
    formData: RegistrationFormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    nextStep: () => void;
}

export const RegisterStep1: React.FC<RegisterStep1Props> = ({ formData, handleInputChange, nextStep }) => {
    return (
        <div className="animate-fade-in-right">
            <h2 className="text-2xl md:text-3xl font-black mb-2 text-slate-900 dark:text-white">Empecemos con tus datos</h2>
            <p className="text-slate-500 mb-8">Esta información nos permite contactarte directamente.</p>

            <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5">
                    <div>
                        <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Nombre</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                            placeholder="Tu nombre"
                        />
                    </div>
                    <div>
                        <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Apellido</label>
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleInputChange}
                            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                            placeholder="Tu apellido"
                        />
                    </div>
                </div>
                <div>
                    <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Correo Electrónico</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                        placeholder="ejemplo@correo.com"
                    />
                </div>
                <div>
                    <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Teléfono / WhatsApp</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                        placeholder="(809) 000-0000"
                    />
                </div>
            </div>
            <div className="mt-10 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
                <Link to="/" className="w-full md:w-auto py-3 text-center text-slate-500 hover:text-slate-800 font-medium">Cancelar</Link>
                <button onClick={nextStep} className="w-full md:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:bg-primary-dark transition-all transform hover:-translate-y-1 flex justify-center items-center">
                    Continuar <span className="material-icons text-sm ml-1">arrow_forward</span>
                </button>
            </div>
        </div>
    );
};
