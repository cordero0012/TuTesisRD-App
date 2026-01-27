import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { RegistrationFormData, RegisterMode } from '../../types/register';
import { RegisterSidebar } from '../../components/register/RegisterSidebar';
import { RegisterStep1 } from '../../components/register/RegisterStep1';
import { RegisterStep2 } from '../../components/register/RegisterStep2';
import { RegisterStep3 } from '../../components/register/RegisterStep3';
import { RegisterMonitor } from '../../components/register/RegisterMonitor';

interface RegisterWizardProps {
    initialMode?: RegisterMode;
}

const RegisterWizard: React.FC<RegisterWizardProps> = ({ initialMode }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [mode, setMode] = useState<RegisterMode>('register');
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form handling
    const [formData, setFormData] = useState<RegistrationFormData>({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        university: '',
        normative: 'Normas APA (7ma)',
        totalAmount: '',
        paidAmount: '',
        dueDate: '',
        career: '',
        type: 'Tesis de Grado',
        plan: 'asesoria'
    });

    // Notification state
    const [notification, setNotification] = useState<{ message: string, type: 'error' | 'success' } | null>(null);
    const [searchResult, setSearchResult] = useState<any>(null);

    const showNotification = (message: string, type: 'error' | 'success' = 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const submitRegistration = async () => {
        setIsSubmitting(true);
        try {
            // 1. Insert Student
            const { data: studentData, error: studentError } = await supabase
                .from('students')
                .insert([{
                    name: formData.name,
                    lastname: formData.lastname,
                    email: formData.email,
                    phone: formData.phone,
                    university: formData.university,
                    career: formData.career
                }])
                .select()
                .single();

            if (studentError) throw studentError;

            // 2. Insert Project
            const { data: projectData, error: projectError } = await supabase
                .from('projects')
                .insert([{
                    student_id: studentData.id,
                    type: formData.type,
                    description: `Plan: ${formData.plan}, Normative: ${formData.normative}`,
                    total_amount: parseFloat(formData.totalAmount) || 0,
                    paid_amount: parseFloat(formData.paidAmount) || 0,
                    due_date: formData.dueDate || null,
                    status: 'pending' // Default
                }])
                .select('tracking_code')
                .single();

            if (projectError) throw projectError;

            // Success
            navigate('/student/success', { state: { trackingCode: projectData.tracking_code } });

        } catch (error: any) {
            console.error('Registration Error:', error);
            showNotification(error.message || "Hubo un error al registrar el proyecto.", 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

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

    const handleSearch = async (trackingCode: string) => {
        if (!trackingCode.trim()) return;

        // Sanitize input
        const code = trackingCode.trim().toUpperCase();

        try {
            const { data, error } = await supabase
                .from('projects')
                .select(`
                    *,
                    students (
                        university,
                        career,
                        name,
                        lastname
                    )
                `)
                .eq('tracking_code', code)
                .single();

            if (error) throw error;

            if (data) {
                // Map DB response to UI format
                setSearchResult({
                    status: data.status === 'pending' ? 'Pendiente' :
                        data.status === 'assigned' ? 'Asignado' :
                            data.status === 'in_progress' ? 'En Progreso' : data.status,
                    university: data.students?.university || 'N/A',
                    type: data.type,
                    progress: data.paid_amount && data.total_amount
                        ? Math.round((data.paid_amount / data.total_amount) * 100)
                        : 0,
                    advisor: 'Por asignar', // We don't have advisors table yet
                    lastUpdate: new Date(data.created_at).toLocaleDateString()
                });
            } else {
                showNotification("No se encontró ningún proyecto con este código.", 'error');
                setSearchResult(null);
            }
        } catch (err: any) {
            console.error(err);
            showNotification("No se encontró ningún proyecto con este código.", 'error');
            setSearchResult(null);
        }
    };

    const nextStep = () => {
        // Validation Logic
        if (step === 1) {
            if (!formData.name || !formData.lastname || !formData.email || !formData.phone) {
                showNotification("Por favor completa todos los campos personales.");
                return;
            }
        }
        if (step === 2) {
            if (!formData.university || !formData.career || !formData.totalAmount) {
                showNotification("Por favor completa los detalles del proyecto.");
                return;
            }
        }
        setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    return (
        <div className="flex h-screen w-full font-display bg-background-light dark:bg-background-dark text-slate-800 dark:text-white transition-colors duration-200">
            {/* Custom Notification Toast */}
            {notification && (
                <div className="fixed top-20 right-4 z-[100] animate-fade-in-down">
                    <div className={`px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md border ${notification.type === 'error'
                        ? 'bg-red-500/90 text-white border-red-400'
                        : 'bg-green-500/90 text-white border-green-400'
                        }`}>
                        <div className={`p-1 rounded-full ${notification.type === 'error' ? 'bg-white/20' : 'bg-white/20'}`}>
                            <span className="material-symbols-outlined text-lg block">{notification.type === 'error' ? 'priority_high' : 'check'}</span>
                        </div>
                        <span className="font-bold text-sm shadow-sm">{notification.message}</span>
                    </div>
                </div>
            )}

            <RegisterSidebar mode={mode} step={step} />

            <main className="flex-1 overflow-y-auto w-full bg-white dark:bg-slate-900 md:bg-transparent transition-colors custom-scrollbar relative">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm sticky top-0 z-30">
                    <Link to="/" className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                        <span className="material-symbols-outlined text-brand-orange">school</span>
                        <span>TuTesis<span className="text-brand-orange">RD</span></span>
                    </Link>
                    {mode === 'register' && (
                        <div className="text-xs font-bold px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400">
                            Paso {step} de 3
                        </div>
                    )}
                </div>

                <div className="p-4 md:p-8 lg:p-16 max-w-2xl mx-auto">
                    {/* Mode Switcher */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-8 w-full md:w-fit mx-auto md:mx-0 shadow-inner">
                        <button
                            onClick={() => setMode('register')}
                            className={`flex-1 md:flex-none px-4 md:px-6 py-3 rounded-lg text-sm font-bold transition-all ${mode === 'register'
                                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                        >
                            Registrar
                        </button>
                        <button
                            onClick={() => setMode('monitor')}
                            className={`flex-1 md:flex-none px-4 md:px-6 py-3 rounded-lg text-sm font-bold transition-all ${mode === 'monitor'
                                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                        >
                            Monitorear
                        </button>
                    </div>

                    {mode === 'register' ? (
                        <>
                            {step === 1 && (
                                <RegisterStep1
                                    formData={formData}
                                    handleInputChange={handleInputChange}
                                    nextStep={nextStep}
                                />
                            )}

                            {step === 2 && (
                                <RegisterStep2
                                    formData={formData}
                                    handleInputChange={handleInputChange}
                                    setFormData={setFormData}
                                    nextStep={nextStep}
                                    prevStep={prevStep}
                                />
                            )}

                            {step === 3 && (
                                <RegisterStep3
                                    isSubmitting={isSubmitting}
                                    prevStep={prevStep}
                                    submitRegistration={submitRegistration}
                                />
                            )}
                        </>
                    ) : (
                        <RegisterMonitor onSearch={handleSearch} searchResult={searchResult} />
                    )}
                </div>
            </main>
        </div>
    );
};

export default RegisterWizard;