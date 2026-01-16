import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface RegisterWizardProps {
    initialMode?: 'register' | 'monitor';
}

const RegisterWizard: React.FC<RegisterWizardProps> = ({ initialMode }) => {
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
        type: 'Tesis de Grado',
        plan: 'asesoria'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (initialMode) {
            setMode(initialMode);
        } else if (params.get('mode') === 'monitor') {
            setMode('monitor');
        }
    }, [location, initialMode]);

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

    const nextStep = () => {
        // Validation Logic
        if (step === 1) {
            if (!formData.name || !formData.lastname || !formData.email || !formData.phone) {
                alert("Por favor completa todos los campos personales para continuar.");
                return;
            }
        }
        if (step === 2) {
            if (!formData.university || !formData.career || !formData.amount) {
                alert("Por favor completa los detalles del proyecto para continuar.");
                return;
            }
        }
        setStep(prev => prev + 1);
    };
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
                                    <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">Detalles del Servicio</h2>
                                    <p className="text-slate-500 mb-8">Selecciona el nivel y la modalidad de trabajo acordada.</p>

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
                                                <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Carrera / Programa</label>
                                                <input
                                                    type="text"
                                                    name="career"
                                                    value={formData.career}
                                                    onChange={handleInputChange}
                                                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
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
                                                        <span className={`font-bold text-sm leading-tight ${formData.type === item.label ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>{item.label}</span>
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

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                                            <div>
                                                <label className="font-bold text-sm block mb-2 text-slate-700 dark:text-slate-300">Monto Acordado (DOP)</label>
                                                <input
                                                    type="number"
                                                    name="amount"
                                                    value={formData.amount}
                                                    onChange={handleInputChange}
                                                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 flex justify-between">
                                        <button onClick={prevStep} className="px-6 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium transition-colors"> Atrás</button>
                                        <button onClick={nextStep} className="px-8 py-3 bg-brand-orange text-white rounded-xl font-bold hover:shadow-lg hover:bg-orange-600 transition-all transform hover:-translate-y-1">Siguiente: Archivos</button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="animate-fade-in-right">
                                    <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">Sube tus Archivos</h2>
                                    <p className="text-slate-500 mb-8">Si tienes documentos previos, súbelos aquí. (Opcional)</p>

                                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                                        <div className="space-y-3">
                                            <h3 className="font-bold text-slate-700 dark:text-white flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-xs flex items-center justify-center">1</span> Anteproyecto</h3>
                                            <div className="h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-white dark:hover:bg-slate-800 hover:border-brand-orange dark:hover:border-brand-orange transition-all group">
                                                <span className="material-icons text-4xl text-slate-400 group-hover:text-brand-orange mb-2 transition-colors">cloud_upload</span>
                                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-brand-orange">Subir PDF</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="font-bold text-slate-700 dark:text-white flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-xs flex items-center justify-center">2</span> Normativa</h3>
                                            <div className="h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-white dark:hover:bg-slate-800 hover:border-brand-orange dark:hover:border-brand-orange transition-all group">
                                                <span className="material-icons text-4xl text-slate-400 group-hover:text-brand-orange mb-2 transition-colors">description</span>
                                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-brand-orange">Subir PDF</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="font-bold text-slate-700 dark:text-white flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-xs flex items-center justify-center">3</span> Otros</h3>
                                            <div className="h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-white dark:hover:bg-slate-800 hover:border-brand-orange dark:hover:border-brand-orange transition-all group">
                                                <span className="material-icons text-4xl text-slate-400 group-hover:text-brand-orange mb-2 transition-colors">folder_zip</span>
                                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-brand-orange">Subir Archivo</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl items-start gap-3 flex mb-8">
                                        <span className="material-icons text-blue-500">info</span>
                                        <p className="text-sm text-blue-700 dark:text-blue-300">Si no tienes los archivos a mano, puedes continuar y enviarlos luego por WhatsApp a tu asesor asignado.</p>
                                    </div>

                                    <div className="mt-12 flex justify-between">
                                        <button onClick={prevStep} className="px-6 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium transition-colors"> Atrás</button>
                                        <Link to="/student/success" className="px-8 py-3 bg-[#10b981] text-white rounded-xl font-bold hover:shadow-lg hover:bg-[#059669] transition-all transform hover:-translate-y-1 flex items-center gap-2">
                                            Finalizar Registro <span className="material-icons">check_circle</span>
                                        </Link>
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