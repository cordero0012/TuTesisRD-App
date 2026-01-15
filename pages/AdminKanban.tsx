import React from 'react';

const AdminKanban: React.FC = () => {
    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-50 font-display transition-colors duration-200">
            <aside className="hidden w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark lg:flex z-20">
                <div className="flex h-full flex-col justify-between p-4">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3 px-2 py-2">
                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 shadow-sm ring-2 ring-slate-100 dark:ring-slate-700" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAOBmuOhuQuvqf9JX_YyMvbqzmvtrbCT_VLJ5NIvjbVAUP-QuLc0xnyCeAtzMZJ0SEM-DLPmxYoVnW26Sl29gza91Mwy8XNfMtLnbodqlOHVBsbpfRKidZU7lXU1d59QaRTypaENIiql8dgNLKmtWQZaaaJvYqWJZUJJXFckz_jlAXAJeKNjUfMzOnBnMGar3g8E7hpowUrx_PcWHUsEAynTnEiTTeRgUH2gElV89j9xjbcrRj5qGFzNMyTJy4vNXyFd-RT7hziuno8")'}}></div>
                            <div className="flex flex-col">
                                <h1 className="text-slate-900 dark:text-white text-base font-bold leading-normal">TuTesisRD</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">Consola de Admin</p>
                            </div>
                        </div>
                        <nav className="flex flex-col gap-1">
                            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group" href="#">
                                <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">dashboard</span>
                                <span className="text-sm font-medium">Panel</span>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400" href="#">
                                <span className="material-symbols-outlined text-primary dark:text-blue-400" style={{fontVariationSettings: "'FILL' 1"}}>view_kanban</span>
                                <span className="text-sm font-medium">Proyectos</span>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group" href="#">
                                <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">group</span>
                                <span className="text-sm font-medium">Colaboradores</span>
                            </a>
                            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group" href="#">
                                <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">settings</span>
                                <span className="text-sm font-medium">Configuración</span>
                            </a>
                        </nav>
                    </div>
                </div>
            </aside>
            <main className="flex flex-1 flex-col overflow-y-hidden bg-background-light dark:bg-background-dark relative">
                <header className="flex-none px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-surface-light dark:bg-surface-dark z-10 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-slate-900 dark:text-white text-2xl font-black">Gestión de Proyectos</h1>
                            <p className="text-slate-500 text-sm">Vista Kanban - Ciclo 2024-1</p>
                        </div>
                        <div className="flex items-center gap-4">
                             <div className="relative">
                                <span className="material-symbols-outlined text-slate-500">notifications</span>
                                <span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full"></span>
                             </div>
                             <div className="size-10 rounded-full bg-slate-200 bg-cover ring-2 ring-white dark:ring-slate-700" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAUqNAOhpHf_P8Imv7UqFDoEYZV6LAv4Grm8Ky0DbltnrAsneHTAr5ulqXJxJeDGMWAzY3_pMMGAci4TmihXW0yCZ4iao1EUXIq4HfOhcR2nvZinJNHLYoigxyIYpVfsngICCIlTAhTI7LEFfdWtsPJwNnDryNu948qepLjlqnkSMZKUIqLT_c14xhY7a0ri8RwrKGfblT7F9QPPCgzl3Eo8n6YXx-yRRnDRHMJskUMZANiPf5EngWGqjEWc6RXwDjtaT-DhFB_yhUa')"}}></div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">
                            <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                            32 Activos
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-bold">
                             <span className="material-symbols-outlined text-sm">warning</span>
                             5 En Revisión
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-x-auto overflow-y-hidden kanban-scroll p-6 bg-background-light dark:bg-background-dark">
                        <div className="inline-flex h-full gap-6 min-w-full pb-2 animate-fade-in">
                        
                        {/* Column 1 */}
                        <div className="flex flex-col w-80 flex-shrink-0">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm tracking-wide">INICIACIÓN</h3>
                                <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full text-xs font-bold">2</span>
                            </div>
                            <div className="flex flex-col gap-3 h-full overflow-y-auto kanban-scroll pr-2">
                                <div className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded">TESIS</span>
                                        <span className="material-symbols-outlined text-slate-300 text-sm">more_horiz</span>
                                    </div>
                                    <h4 className="font-semibold text-sm mb-1 dark:text-white group-hover:text-primary transition-colors">IA en Diagnóstico Médico</h4>
                                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">Implementación de redes neuronales para detección temprana.</p>
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                            <div className="flex items-center gap-2">
                                                <div className="size-6 rounded-full bg-cover ring-1 ring-white" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDVtySVE68KPpcu9mrLmLImSBQPrwdqAK5vhKJ8M_XpiwmBjuczqTOg1Ujwf-1cgzc7FQ0hr_BeV1lQ0ecr6hlrg0xzheJmZX1x10M1yKtjhYi6xwBsZOHlLvX6-bF_2DTyzMXulJ5vWZekPVm0NA9-ULEPDwdwmFJ9TGcmghLRNdi3DTRxWKL-q2UaUYfOmPCPK9YY75kfZJO6fEiWUsP4DUZjRwtDyH3S0pp5js0jloWBVDoI-odZiFgl1l8xdhWJY-JjvqyRVl19')"}}></div>
                                                <span className="text-xs text-slate-400">J. Doe</span>
                                            </div>
                                            <span className="text-[10px] text-slate-400">Hace 2d</span>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-red-500">
                                     <h4 className="font-semibold text-sm mb-1 dark:text-white">Sistema de Riego IoT</h4>
                                     <p className="text-xs text-slate-500 mb-2">Estudiante: Maria L.</p>
                                     <div className="flex gap-1 mt-2">
                                         <span className="bg-red-50 text-red-500 text-[10px] px-1 rounded">Retrasado</span>
                                     </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="flex flex-col w-80 flex-shrink-0">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm tracking-wide">PLANIFICACIÓN</h3>
                                <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full text-xs font-bold">3</span>
                            </div>
                            <div className="flex flex-col gap-3 h-full overflow-y-auto kanban-scroll pr-2">
                                <div className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer">
                                    <h4 className="font-semibold text-sm dark:text-white">Agricultura Urbana</h4>
                                    <p className="text-xs text-slate-500 mb-2">Estudiante: E. Musk</p>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                                        <div className="bg-yellow-400 h-1.5 rounded-full w-1/3"></div>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer">
                                    <h4 className="font-semibold text-sm dark:text-white">Blockchain en Logística</h4>
                                    <p className="text-xs text-slate-500 mb-2">Estudiante: S. Nakamoto</p>
                                </div>
                            </div>
                        </div>

                         {/* Column 3 */}
                         <div className="flex flex-col w-80 flex-shrink-0">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm tracking-wide">EJECUCIÓN</h3>
                                <span className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full text-xs font-bold">1</span>
                            </div>
                             <div className="flex flex-col gap-3 h-full overflow-y-auto kanban-scroll pr-2">
                                <div className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded">MONOGRÁFICO</span>
                                    </div>
                                    <h4 className="font-semibold text-sm dark:text-white">Análisis de Datos Sísmicos</h4>
                                    <p className="text-xs text-slate-500 mb-2">Estudiante: C. Richter</p>
                                     <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                                        <div className="bg-green-500 h-1.5 rounded-full w-3/4"></div>
                                    </div>
                                </div>
                             </div>
                        </div>

                        </div>
                </div>
            </main>
        </div>
    );
};

export default AdminKanban;