import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Services from './pages/Services';
import Universities from './pages/Universities';
import Blog from './pages/Blog';
import StudentPortal from './pages/StudentPortal';
import AdminKanban from './pages/AdminKanban';
import RegisterWizard from './pages/Register/RegisterWizard';
import SuccessScreen from './pages/Register/SuccessScreen';
import AIChat from './components/AIChat';
import DesignSystem from './pages/DesignSystem';
import { AiAudit as DocumentAudit } from './pages/AiAudit';
import UniversityTemplate from './pages/Universities/UniversityTemplate';
import UniversityDirectory from './pages/Universities/UniversityDirectory';
import BlogPostTemplate from './pages/BlogPostTemplate';
import ConsistencyMatrix from './pages/ConsistencyMatrix';
import AuditPage from './pages/AuditPage';

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
        console.log("TuTesisRD App Loaded v1.9 - Segmented Architecture (350k Chars)");
    }, []);

    return (
        /* Cache Buster: v4 */
        <HashRouter>
            <div className="min-h-screen bg-background-light dark:bg-background-dark">
                <DarkModeToggle />
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
                    <Route path="/exito" element={<SuccessScreen />} />
                    <Route path="/design" element={<DesignSystem />} />

                    {/* Tools */}
                    <Route path="/herramientas" element={<AuditPage />} />
                    <Route path="/herramientas/auditor" element={<DocumentAudit />} />
                    <Route path="/herramientas/matriz" element={<ConsistencyMatrix />} />

                    {/* <Route path="/admin/dashboard" element={<AdminKanban />} /> */}
                </Routes>
                {/* <AIChat /> */}
            </div>
        </HashRouter>
    );
};

export default App;