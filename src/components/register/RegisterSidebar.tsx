import React from 'react';
import { Link } from 'react-router-dom';
import { RegisterMode } from '../../types/register';

interface RegisterSidebarProps {
    mode: RegisterMode;
    step: number;
}

export const RegisterSidebar: React.FC<RegisterSidebarProps> = ({ mode, step }) => {
    return (
        <aside className="hidden md:flex w-80 lg:w-96 flex-col bg-blue-900 relative overflow-hidden shrink-0 z-20 shadow-2xl p-8 justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-900"></div>
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="relative z-10">
                <Link to="/" className="flex items-center gap-3 text-white mb-12 hover:opacity-80 transition-opacity">
                    <span className="material-symbols-outlined text-2xl">school</span>
                    <span className="font-bold text-xl">TuTesisRD</span>
                </Link>

                {mode === 'register' ? (
                    <div className="space-y-6">
                        {/* Step 1 Indicator */}
                        <div className={`flex gap-4 items-center relative step-connector transition-all duration-300 ${step === 1 ? 'text-white font-bold opacity-100 scale-105' : 'text-white/50'}`}>
                            <div className={`size-10 rounded-full flex items-center justify-center font-bold transition-all ${step === 1 ? 'bg-white text-blue-900 shadow-lg' : 'border border-white/30'}`}>
                                {step > 1 ? <span className="material-symbols-outlined">check</span> : '1'}
                            </div>
                            <span className="text-lg">Datos Personales</span>
                        </div>

                        {/* Step 2 Indicator */}
                        <div className={`flex gap-4 items-center relative step-connector transition-all duration-300 ${step === 2 ? 'text-white font-bold opacity-100 scale-105' : 'text-white/50'}`}>
                            <div className={`size-10 rounded-full flex items-center justify-center font-bold transition-all ${step === 2 ? 'bg-white text-blue-900 shadow-lg' : 'border border-white/30'}`}>
                                {step > 2 ? <span className="material-symbols-outlined">check</span> : '2'}
                            </div>
                            <span className="text-lg">Detalles Proyecto</span>
                        </div>

                        {/* Step 3 Indicator */}
                        <div className={`flex gap-4 items-center relative transition-all duration-300 ${step === 3 ? 'text-white font-bold opacity-100 scale-105' : 'text-white/50'}`}>
                            <div className={`size-10 rounded-full flex items-center justify-center font-bold transition-all ${step === 3 ? 'bg-white text-blue-900 shadow-lg' : 'border border-white/30'}`}>
                                3
                            </div>
                            <span className="text-lg">Finalizar</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-white">
                        <h3 className="text-xl font-bold mb-4">Centro de Monitoreo</h3>
                        <p className="opacity-80">Rastrea el progreso de tu tesis en tiempo real con tu código único.</p>
                        <div className="mt-8 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="material-symbols-outlined">secure</span>
                                <span className="font-bold">Seguro y Privado</span>
                            </div>
                            <p className="text-xs opacity-70">Solo tú tienes acceso a esta información mediante tu código de rastreo.</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="text-white/60 text-sm relative z-10">© 2023 TuTesisRD</div>
        </aside>
    );
};
