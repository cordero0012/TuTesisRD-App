import React from 'react';
import { RegistrationFormData } from '../../types/register';

interface RegisterStep2Props {
    formData: RegistrationFormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    setFormData: React.Dispatch<React.SetStateAction<RegistrationFormData>>;
    nextStep: () => void;
    prevStep: () => void;
}

export const RegisterStep2: React.FC<RegisterStep2Props> = ({ formData, handleInputChange, setFormData, nextStep, prevStep }) => {
    return (
        <div className="animate-fade-in-right">
            <h2 className="text-2xl md:text-3xl font-black mb-2 text-slate-900 dark:text-white">Detalles del Servicio</h2>
            <p className="text-slate-500 mb-8">Selecciona el nivel y la modalidad de trabajo acordada.</p>

            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5">
                    <div>
                        <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Universidad</label>
                        <input
                            type="text"
                            name="university"
                            value={formData.university}
                            onChange={handleInputChange}
                            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                            placeholder="Ej. UASD"
                        />
                    </div>
                    <div>
                        <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Carrera / Programa</label>
                        <input
                            type="text"
                            name="career"
                            value={formData.career}
                            onChange={handleInputChange}
                            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                            placeholder="Ej. Derecho / Maestría en..."
                        />
                    </div>
                </div>

                {/* Nivel Académico / Tipo de Trabajo */}
                <div>
                    <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Tipo de Proyecto</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                            { label: 'Tesis de Grado', icon: 'school' },
                            { label: 'Monográfico', icon: 'article' },
                            { label: 'Postgrado/Doctoral', icon: 'psychology' },
                            { label: 'Tarea', icon: 'assignment' },
                            { label: 'Artículo Científico', icon: 'science' },
                            { label: 'Presentación', icon: 'co_present' }
                        ].map((item) => (
                            <div
                                key={item.label}
                                onClick={() => setFormData(prev => ({ ...prev, type: item.label }))}
                                className={`p-3 border-2 rounded-xl cursor-pointer relative shadow-sm transition-all text-center flex flex-col items-center justify-center gap-2 ${formData.type === item.label ? 'border-primary bg-blue-50 dark:bg-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary'}`}
                            >
                                {formData.type === item.label && <div className="absolute top-2 right-2 text-primary"><span className="material-symbols-outlined text-base">check_circle</span></div>}
                                <span className="material-icons text-2xl text-slate-400">{item.icon}</span>
                                <span className={`font-bold text-xs sm:text-sm leading-tight ${formData.type === item.label ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modalidad de Servicio */}
                <div>
                    <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Modalidad de Servicio</label>
                    <div className="space-y-3">
                        {[
                            { id: 'asesoria', title: 'Solo Asesoría', desc: 'Correcciones y guía metodológica.' },
                            { id: 'parcial', title: 'Desarrollo Colaborativo', desc: 'Usted investiga, nosotros redactamos (50/50).' },
                            { id: 'completo', title: 'Desarrollo Integral', desc: 'Elaboración completa desde cero.' }
                        ].map((mod) => (
                            <div
                                key={mod.id}
                                onClick={() => setFormData(prev => ({ ...prev, plan: mod.id }))}
                                className={`p-4 border-2 rounded-xl cursor-pointer flex items-center gap-4 transition-all ${formData.plan === mod.id ? 'border-brand-orange bg-orange-50 dark:bg-orange-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
                            >
                                <div className={`size-6 rounded-full border-2 flex items-center justify-center shrink-0 ${formData.plan === mod.id ? 'border-brand-orange' : 'border-slate-300'}`}>
                                    {formData.plan === mod.id && <div className="size-3 rounded-full bg-brand-orange" />}
                                </div>
                                <div>
                                    <div className={`font-bold ${formData.plan === mod.id ? 'text-brand-orange' : 'text-slate-800 dark:text-white'}`}>{mod.title}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{mod.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                    <div>
                        <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Normativa</label>
                        <select
                            name="normative"
                            value={formData.normative}
                            onChange={handleInputChange}
                            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                        >
                            <option>Normas APA (7ma)</option>
                            <option>Normas ISO</option>
                            <option>IEEE</option>
                            <option>Vancouver</option>
                        </select>
                    </div>
                </div>

                {/* Financial Details Section */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 space-y-6">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <span className="material-icons text-green-500">payments</span> Detalles Financieros
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2">
                            <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Fecha Pautada de Entrega</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                            />
                        </div>
                        <div>
                            <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Monto Total Acordado (DOP)</label>
                            <input
                                type="number"
                                name="totalAmount"
                                value={formData.totalAmount}
                                onChange={handleInputChange}
                                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Monto Abonado (DOP)</label>
                            <input
                                type="number"
                                name="paidAmount"
                                value={formData.paidAmount}
                                onChange={handleInputChange}
                                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Calculations */}
                    {formData.totalAmount && (
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 animate-fade-in">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-500">Monto Restante</span>
                                <span className="text-xl font-black text-slate-800 dark:text-white">
                                    RD$ {((parseFloat(formData.totalAmount) || 0) - (parseFloat(formData.paidAmount) || 0)).toLocaleString()}
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
                                <div
                                    className="bg-brand-orange h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, Math.max(0, ((parseFloat(formData.paidAmount) || 0) / (parseFloat(formData.totalAmount) || 1)) * 100))}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-end mt-1">
                                <span className="text-xs font-bold text-brand-orange">
                                    {Math.min(100, Math.max(0, ((parseFloat(formData.paidAmount) || 0) / (parseFloat(formData.totalAmount) || 1)) * 100)).toFixed(1)}% Abonado
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-10 flex justify-between gap-4">
                <button onClick={prevStep} className="px-6 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium transition-colors"> Atrás</button>
                <button onClick={nextStep} className="flex-1 md:flex-none px-8 py-3 bg-brand-orange text-white rounded-xl font-bold hover:shadow-lg hover:bg-orange-600 transition-all transform hover:-translate-y-1">Siguiente</button>
            </div>
        </div>
    );
};
