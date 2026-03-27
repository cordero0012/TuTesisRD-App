import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProject } from '../contexts/ProjectContext';
import { usePersistence } from '../contexts/PersistenceContext';
import { fetchStudentActiveProject, StudentProjectDetails } from '../services/student/studentService';

const StudentPortal: React.FC = () => {
    const { status } = usePersistence();
    const { session } = useProject();
    const user = session?.user;
    
    // User display details
    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Estudiante';
    const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${displayName}&background=random`;

    // Real Data State
    const [activeProject, setActiveProject] = useState<StudentProjectDetails | null>(null);
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number } | null>(null);

    useEffect(() => {
        if (!user?.id) return;
        fetchStudentActiveProject(user.id).then(project => {
            if (project) {
                setActiveProject(project);
                if (project.due_date) {
                    calculateTimeLeft(project.due_date);
                }
            }
        });
    }, [user?.id]);

    const calculateTimeLeft = (dueDateStr: string) => {
        const due = new Date(dueDateStr).getTime();
        const now = new Date().getTime();
        const distance = due - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            setTimeLeft({ days, hours });
        } else {
            setTimeLeft({ days: 0, hours: 0 }); // Overdue or today
        }
    };

    // Calculate progress timeline node states
    const getTimelineNodes = (progress: number) => {
        return [
            { label: 'Tema', threshold: 10 },
            { label: 'Propuesta', threshold: 30 },
            { label: 'Cap. 1-2', threshold: 60 },
            { label: 'Entrega Final', threshold: 100 },
        ].map((node, index, arr) => {
            const isCompleted = progress >= node.threshold;
            const isCurrent = progress < node.threshold && (index === 0 || progress >= arr[index - 1].threshold);
            return { ...node, isCompleted, isCurrent };
        });
    };

    const timelineNodes = getTimelineNodes(activeProject?.progress_percent || 0);

    return (
        <div className="flex h-screen w-full font-display bg-background-light dark:bg-background-dark text-slate-800 dark:text-white overflow-hidden transition-colors duration-200">
            <aside className="hidden md:flex w-72 flex-col bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 h-full p-6 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => window.location.href = '/'}>
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                        <span className="material-symbols-outlined">school</span>
                    </div>
                    <h1 className="text-xl font-bold">TuTesisRD</h1>
                </div>
                <nav className="flex flex-col gap-2">
                    <Link to="/portal" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium">
                        <span className="material-symbols-outlined">dashboard</span>Dashboard
                    </Link>
                    <Link to="/portal/historial" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">history</span>Historial de Análisis
                    </Link>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><span className="material-symbols-outlined">calendar_month</span>Calendario</a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><span className="material-symbols-outlined">chat</span>Asesoría IA</a>
                </nav>
            </aside>
            <main className="flex-1 flex flex-col h-full overflow-y-auto p-4 lg:p-8">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold animate-fade-in">¡Hola, <span className="text-primary">{displayName}!</span> 👋</h2>
                    <div className="flex items-center gap-3 md:gap-4">
                        {status === 'saving' && (
                            <div className="flex items-center gap-2 text-xs font-bold text-brand-orange bg-brand-orange/10 px-3 py-1.5 rounded-full animate-pulse">
                                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                                <span className="hidden sm:inline">Guardando...</span>
                            </div>
                        )}
                        {status === 'saved' && (
                            <div className="flex items-center gap-2 text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                <span className="hidden sm:inline">Sincronizado</span>
                            </div>
                        )}
                        <div className="bg-white dark:bg-slate-700 p-2 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer"><span className="material-symbols-outlined">notifications</span></div>
                        <div className="size-10 rounded-full bg-cover ring-2 ring-white dark:ring-slate-700 shadow-md bg-center" style={{ backgroundImage: `url('${avatarUrl}')` }}></div>
                    </div>
                </header>
                
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-slide-up">
                    <div className="xl:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-primary">timeline</span>Línea de Tiempo del Proyecto</h3>
                            
                            {activeProject ? (
                                <div className="mb-8">
                                    <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">{activeProject.title}</h4>
                                    <p className="text-sm text-slate-500">Avance reportado: {activeProject.progress_percent}% | Estado: {activeProject.status}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 mb-8">No hemos encontrado tu proyecto en nuestros registros administrativos. Contacta a un asesor si necesitas ayuda.</p>
                            )}

                            <div className="flex justify-between items-center relative px-2 mt-4">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-700 -z-10 rounded-full"></div>
                                {timelineNodes.map((node, i) => (
                                    <div key={i} className={`flex flex-col items-center gap-2 group ${node.isCompleted || node.isCurrent ? 'cursor-pointer' : 'opacity-50 pointer-events-none'}`}>
                                        {node.isCompleted ? (
                                            <div className="size-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/30 transform group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined">check</span>
                                            </div>
                                        ) : node.isCurrent ? (
                                            <div className="size-16 rounded-full bg-white dark:bg-surface-dark border-4 border-primary text-primary flex items-center justify-center shadow-lg shadow-primary/20 animate-pulse">
                                                <span className="material-symbols-outlined text-2xl">edit_document</span>
                                            </div>
                                        ) : (
                                            <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                                <span className="material-symbols-outlined">lock</span>
                                            </div>
                                        )}
                                        <span className={`text-xs font-bold ${node.isCurrent ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`}>
                                            {node.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <Link to="/editor" className="bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-sm border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center h-48 cursor-pointer hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
                            <span className="material-symbols-outlined text-4xl text-primary mb-2 group-hover:scale-110 transition-transform">edit_document</span>
                            <p className="font-bold text-slate-700 dark:text-slate-300">Ir al Editor de Tesis</p>
                            <p className="text-xs text-slate-500 mt-2">Continuar escribiendo</p>
                        </Link>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary blur-3xl opacity-30 rounded-full group-hover:opacity-40 transition-opacity"></div>
                            <h3 className="text-xl font-bold mb-1">Próxima Entrega</h3>
                            {activeProject && timeLeft ? (
                                <>
                                    <p className="text-slate-400 text-sm mb-6">
                                        Fecha límite: {new Date(activeProject.due_date!).toLocaleDateString('es-DO')}
                                    </p>
                                    <div className="flex justify-between text-center gap-2">
                                        <div className="bg-white/10 p-3 rounded-xl flex-1 backdrop-blur-sm">
                                            <span className="text-3xl font-mono font-bold text-primary-300">
                                                {timeLeft.days.toString().padStart(2, '0')}
                                            </span>
                                            <br />
                                            <span className="text-[10px] tracking-wider opacity-70">DÍAS</span>
                                        </div>
                                        <div className="bg-white/10 p-3 rounded-xl flex-1 backdrop-blur-sm">
                                            <span className="text-3xl font-mono font-bold text-primary-300">
                                                {timeLeft.hours.toString().padStart(2, '0')}
                                            </span>
                                            <br />
                                            <span className="text-[10px] tracking-wider opacity-70">HORAS</span>
                                        </div>
                                    </div>
                                </>
                            ) : activeProject && activeProject.due_date === null ? (
                                <p className="text-slate-400 text-sm mb-6 mt-4 opacity-80">No hay fecha de entrega pautada.</p>
                            ) : (
                                <p className="text-slate-400 text-sm mb-6 mt-4 opacity-80">Buscando información del proyecto administrativo...</p>
                            )}
                        </div>
                        
                        <div className="bg-primary/10 rounded-3xl p-6 border border-primary/20">
                            <h4 className="font-bold text-primary mb-2">Consejo del Día</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                "Recuerda revisar las normas APA 7ma edición para tus citas bibliográficas. La IA puede ayudarte a formatearlas."
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentPortal;