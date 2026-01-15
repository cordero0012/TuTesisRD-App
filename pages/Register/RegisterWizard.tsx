import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const RegisterWizard: React.FC = () => {
    const location = useLocation();
    const [mode, setMode] = useState<'register' | 'monitor'>('register');
    const [step, setStep] = useState(1);

    // Form handling
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        university: '',
        normative: 'Normas APA (7ma)',
        amount: '',
        career: '',
        type: 'Tesis de Grado'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('mode') === 'monitor') {
            setMode('monitor');
        }
    }, [location]);

    const [trackingCode, setTrackingCode] = useState('');
    const [searchResult, setSearchResult] = useState<any>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock search logic
        if (trackingCode.trim().length > 3) {
            setSearchResult({
                status: 'En Revision',
                university: 'UASD',
                type: 'Tesis de Grado',
                progress: 15,
                advisor: 'Pendiente',
                lastUpdate: 'Hace 2 horas'
            });
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <div className="flex h-screen w-full font-display bg-background-light dark:bg-background-dark text-slate-800 dark:text-white transition-colors duration-200">
            {/* Sidebar */}
            <aside className="hidden md:flex w-80 lg:w-96 flex-col bg-blue-900 relative overflow-hidden shrink-0 z-20 shadow-2xl p-8 justify-between">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-900"></div>
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-white mb-12">
                        <span className="material-symbols-outlined text-2xl">school</span>
                        <span className="font-bold text-xl">TuTesisRD</span>
                    </div>

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

            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-16 animate-fade-in custom-scrollbar">
                <div className="max-w-2xl mx-auto">
                    {/* Mode Switcher */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-10 w-fit mx-auto md:mx-0">
                        <button
                            onClick={() => setMode('register')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'register'
                                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                        >
                            Registrar Proyecto
                        </button>
                        <button
                            onClick={() => setMode('monitor')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'monitor'
                                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                        >
                            Monitorear Proyecto
                        </button>
                    </div>

                    {mode === 'register' ? (
                        <>
                            {step === 1 && (
                                <div className="animate-fade-in-right">
                                    <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">Empecemos con tus datos</h2>
                                    <p className="text-slate-500 mb-8">Esta información nos permite contactarte directamente.</p>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Nombre</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
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
                                                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
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
                                                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
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
                                                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                                                placeholder="(809) 000-0000"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-12 flex justify-between items-center">
                                        <Link to="/" className="text-slate-500 hover:text-slate-800 font-medium">Cancelar</Link>
                                        <button onClick={nextStep} className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:bg-primary-dark transition-all transform hover:-translate-y-1">
                                            Continuar <span className="material-icons text-sm ml-1">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="animate-fade-in-right">
                                    <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">Detalles Académicos</h2>
                                    <p className="text-slate-500 mb-8">Cuéntanos sobre los requisitos de tu universidad.</p>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Universidad</label>
                                                <input
                                                    type="text"
                                                    name="university"
                                                    value={formData.university}
                                                    onChange={handleInputChange}
                                                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                                                    placeholder="Ej. UASD"
                                                />
                                            </div>
                                            <div>
                                                <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Normativa</label>
                                                <select
                                                    name="normative"
                                                    value={formData.normative}
                                                    onChange={handleInputChange}
                                                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                                                >
                                                    <option>Normas APA (7ma)</option>
                                                    <option>Normas ISO</option>
                                                    <option>IEEE</option>
                                                    <option>Vancouver</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Monto Abonado (DOP)</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                                    <input
                                                        type="number"
                                                        name="amount"
                                                        value={formData.amount}
                                                        onChange={handleInputChange}
                                                        className="w-full p-4 pl-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">Acordado previamente con el asesor.</p>
                                            </div>
                                            <div>
                                                <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Carrera</label>
                                                <input
                                                    type="text"
                                                    name="career"
                                                    value={formData.career}
                                                    onChange={handleInputChange}
                                                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                                                    placeholder="Ej. Derecho"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Tipo de Trabajo</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div
                                                    onClick={() => setFormData(prev => ({ ...prev, type: 'Tesis de Grado' }))}
                                                    className={`p-4 border-2 rounded-xl cursor-pointer relative shadow-sm transition-all ${formData.type === 'Tesis de Grado' ? 'border-primary bg-blue-50 dark:bg-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary'}`}
                                                >
                                                    {formData.type === 'Tesis de Grado' && <div className="absolute top-3 right-3 text-primary"><span className="material-symbols-outlined text-lg">check_circle</span></div>}
                                                    <div className={`font-bold mb-1 ${formData.type === 'Tesis de Grado' ? 'text-primary' : 'text-slate-800 dark:text-white'}`}>Tesis de Grado</div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">Investigación original y profunda.</p>
                                                </div>
                                                <div
                                                    onClick={() => setFormData(prev => ({ ...prev, type: 'Monográfico' }))}
                                                    className={`p-4 border-2 rounded-xl cursor-pointer relative shadow-sm transition-all ${formData.type === 'Monográfico' ? 'border-primary bg-blue-50 dark:bg-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary'}`}
                                                >
                                                    {formData.type === 'Monográfico' && <div className="absolute top-3 right-3 text-primary"><span className="material-symbols-outlined text-lg">check_circle</span></div>}
                                                    <div className={`font-bold mb-1 ${formData.type === 'Monográfico' ? 'text-primary' : 'text-slate-800 dark:text-white'}`}>Monográfico</div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">Estudio descriptivo.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-12 flex justify-between">
                                        <button onClick={prevStep} className="px-6 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium transition-colors"> Atrás</button>
                                        <Link to="/student/details" className="px-8 py-3 bg-brand-orange text-white rounded-xl font-bold hover:shadow-lg hover:bg-orange-600 transition-all transform hover:-translate-y-1">Siguiente: Archivos</Link>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        // MONITOR VIEW (Unchanged)
                        <div className="animate-fade-in-up">
                            <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">Rastrea tu Proyecto</h2>
                            <p className="text-slate-500 mb-8">Ingresa el código proporcionado al momento del registro.</p>

                            <form onSubmit={handleSearch} className="mb-10">
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        value={trackingCode}
                                        onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                                        className="flex-1 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none uppercase tracking-widest font-bold placeholder:normal-case placeholder:tracking-normal"
                                        placeholder="Ej. TRX-8492"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-brand-orange text-white px-8 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
                                    >
                                        Buscar
                                    </button>
                                </div>
                            </form>

                            {searchResult && (
                                <div className="bg-white dark:bg-[#1a2230] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl animate-fade-in">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold mb-2">
                                                {searchResult.status}
                                            </span>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tesis: {searchResult.university}</h3>
                                            <p className="text-sm text-slate-500">{searchResult.type}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-slate-400">Última actualización</div>
                                            <div className="font-medium text-slate-700 dark:text-slate-300">{searchResult.lastUpdate}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="font-bold text-slate-700 dark:text-slate-300">Progreso General</span>
                                                <span className="text-brand-orange font-bold">{searchResult.progress}%</span>
                                            </div>
                                            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-brand-orange rounded-full" style={{ width: `${searchResult.progress}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                                <div className="text-xs text-slate-400 mb-1">Asesor Asignado</div>
                                                <div className="font-bold text-slate-800 dark:text-white">{searchResult.advisor}</div>
                                            </div>
                                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                                <div className="text-xs text-slate-400 mb-1">Próxima Entrega</div>
                                                <div className="font-bold text-slate-800 dark:text-white">Capítulo 1</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default RegisterWizard;