import React from 'react';

const StudentPortal: React.FC = () => {
    return (
        <div className="flex h-screen w-full font-display bg-background-light dark:bg-background-dark text-slate-800 dark:text-white overflow-hidden transition-colors duration-200">
            <aside className="hidden md:flex w-72 flex-col bg-surface-light dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 h-full p-6 transition-colors duration-200">
                    <div className="flex items-center gap-3 mb-8">
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                        <span className="material-symbols-outlined">school</span>
                    </div>
                    <h1 className="text-xl font-bold">TuTesisRD</h1>
                </div>
                <nav className="flex flex-col gap-2">
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium"><span className="material-symbols-outlined">dashboard</span>Dashboard</a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><span className="material-symbols-outlined">folder_open</span>Mis Archivos</a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><span className="material-symbols-outlined">calendar_month</span>Calendario</a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><span className="material-symbols-outlined">chat</span>Asesoría IA</a>
                </nav>
            </aside>
            <main className="flex-1 flex flex-col h-full overflow-y-auto p-8">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold animate-fade-in">¡Hola, <span className="text-primary">Carlos!</span> 👋</h2>
                    <div className="flex items-center gap-4">
                        <div className="bg-white dark:bg-slate-700 p-2 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer"><span className="material-symbols-outlined">notifications</span></div>
                        <div className="size-10 rounded-full bg-cover ring-2 ring-white dark:ring-slate-700 shadow-md" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAVUvIDS3tSZCfS538VxO8VQkD0THkmMPL5yOaZ9q92zMPh1MSxRkbealDVwtxYU-l5ylCUPqB9DGPLW5TOggcHAHdPKmgqR_N3Uv_76hg55A4atJVjpSvxvNi6Hegi03YOcO57qozAl7nGWhyE4HbHVSqQp6W7IMsLe9SqVFP9OzQnhJUmITy_ccdecOB4eSQMEccckgX2zbzXAJr8kHsH6XeeP1YpOJeMx_JTQ_Zrfi_hzR8bW2FZsm46OUzTeLru-2DLDuZIfmAQ')"}}></div>
                    </div>
                </header>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-slide-up">
                    <div className="xl:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><span className="material-symbols-outlined text-primary">timeline</span>Línea de Tiempo</h3>
                            <div className="flex justify-between items-center relative px-2">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-700 -z-10 rounded-full"></div>
                                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                                    <div className="size-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/30 transform group-hover:scale-110 transition-transform"><span className="material-symbols-outlined">check</span></div>
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Tema</span>
                                </div>
                                    <div className="flex flex-col items-center gap-2 group cursor-pointer">
                                    <div className="size-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/30 transform group-hover:scale-110 transition-transform"><span className="material-symbols-outlined">check</span></div>
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Propuesta</span>
                                </div>
                                    <div className="flex flex-col items-center gap-2">
                                    <div className="size-16 rounded-full bg-white dark:bg-surface-dark border-4 border-primary text-primary flex items-center justify-center shadow-lg shadow-primary/20 animate-pulse"><span className="material-symbols-outlined text-2xl">edit_document</span></div>
                                    <span className="text-xs font-bold text-primary">Cap. 2</span>
                                </div>
                                    <div className="flex flex-col items-center gap-2 opacity-50">
                                    <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500"><span className="material-symbols-outlined">lock</span></div>
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Cap. 3</span>
                                </div>
                            </div>
                        </div>
                            <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-sm border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center h-48 cursor-pointer hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
                            <span className="material-symbols-outlined text-4xl text-primary mb-2 group-hover:scale-110 transition-transform">cloud_upload</span>
                            <p className="font-bold text-slate-700 dark:text-slate-300">Subir Avance</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary blur-3xl opacity-30 rounded-full group-hover:opacity-40 transition-opacity"></div>
                                <h3 className="text-xl font-bold mb-1">Próxima Entrega</h3>
                                <p className="text-slate-400 text-sm mb-6">Capítulo 2: Marco Teórico</p>
                                <div className="flex justify-between text-center gap-2">
                                <div className="bg-white/10 p-3 rounded-xl flex-1 backdrop-blur-sm"><span className="text-3xl font-mono font-bold text-primary-300">03</span><br/><span className="text-[10px] tracking-wider opacity-70">DÍAS</span></div>
                                <div className="bg-white/10 p-3 rounded-xl flex-1 backdrop-blur-sm"><span className="text-3xl font-mono font-bold text-primary-300">14</span><br/><span className="text-[10px] tracking-wider opacity-70">HORAS</span></div>
                                </div>
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