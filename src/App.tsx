import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useAnalytics } from './hooks/useAnalytics';

// Lazy Load Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Universities = lazy(() => import('./pages/Universities'));
const Blog = lazy(() => import('./pages/Blog'));
const StudentPortal = lazy(() => import('./pages/StudentPortal'));
const AdminKanban = lazy(() => import('./pages/AdminKanban'));
const RegisterWizard = lazy(() => import('./pages/Register/RegisterWizard'));
const SuccessScreen = lazy(() => import('./pages/Register/SuccessScreen'));
const AIChat = lazy(() => import('./components/AIChat'));
const DesignSystem = lazy(() => import('./pages/DesignSystem'));
const DocumentAudit = lazy(() => import('./pages/AiAudit').then(module => ({ default: module.AiAudit })));
const UniversityTemplate = lazy(() => import('./pages/Universities/UniversityTemplate'));
const UniversityDirectory = lazy(() => import('./pages/Universities/UniversityDirectory'));
const BlogPostTemplate = lazy(() => import('./pages/BlogPostTemplate'));
const ConsistencyMatrix = lazy(() => import('./pages/ConsistencyMatrix'));
const AuditPage = lazy(() => import('./pages/AuditPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));

// SEO Resources
const QueEsTesis = lazy(() => import('./pages/Recursos/QueEsTesis'));
const ComoHacerTesis = lazy(() => import('./pages/Recursos/ComoHacerTesis'));
const EjemplosTesis = lazy(() => import('./pages/Recursos/EjemplosTesis'));

// Loading Fallback Component
const LoadingSpinner = () => (
    <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-500"></div>
    </div>
);

const DarkModeToggle = () => {
    // Initialize state from localStorage or system preference
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme === 'dark';
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="fixed bottom-4 right-20 z-[9999] bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
            title="Toggle Dark Mode"
        >
            <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
        </button>
    );
};

const App = () => {
    useEffect(() => {
        console.log("TuTesisRD App Loaded v1.17 - Gemini Service Restored");
    }, []);

    useAnalytics();

    return (
        /* Cache Buster: v4 */
        <HashRouter>
            <div className="min-h-screen bg-background-light dark:bg-background-dark">
                <DarkModeToggle />
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />

                        {/* Public Content Pages */}
                        <Route path="/nosotros" element={<About />} />
                        <Route path="/servicios" element={<Services />} />
                        <Route path="/universidades" element={<UniversityDirectory />} />
                        <Route path="/tesis/:universityId" element={<UniversityTemplate />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:postId" element={<BlogPostTemplate />} />

                        {/* App Flow */}
                        <Route path="/registro" element={<RegisterWizard initialMode="register" />} />
                        <Route path="/monitoreo" element={<RegisterWizard initialMode="monitor" />} />
                        <Route path="/portal" element={<StudentPortal />} />
                        <Route path="/portal/historial" element={<HistoryPage />} />
                        <Route path="/exito" element={<SuccessScreen />} />

                        {/* SEO Educational Resources */}
                        <Route path="/recursos/que-es-tesis" element={<QueEsTesis />} />
                        <Route path="/recursos/como-hacer-tesis" element={<ComoHacerTesis />} />
                        <Route path="/recursos/ejemplos-tesis" element={<EjemplosTesis />} />

                        <Route path="/design" element={<DesignSystem />} />

                        {/* Tools */}
                        <Route path="/herramientas" element={<AuditPage />} />
                        <Route path="/herramientas/auditor" element={<DocumentAudit />} />
                        <Route path="/herramientas/matriz" element={<ConsistencyMatrix />} />

                        {/* <Route path="/admin/dashboard" element={<AdminKanban />} /> */}
                    </Routes>
                </Suspense>
                {/* <AIChat /> */}
            </div>
        </HashRouter>
    );
};

export default App;