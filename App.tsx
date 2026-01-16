import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudentPortal from './pages/StudentPortal';
import AdminKanban from './pages/AdminKanban';
import RegisterWizard from './pages/Register/RegisterWizard';
import AcademicDetails from './pages/Register/AcademicDetails';
import UploadDocuments from './pages/Register/UploadDocuments';
import SuccessScreen from './pages/Register/SuccessScreen';
import AIChat from './components/AIChat';

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

const NavigationMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const screens = [
        { path: "/", label: "Home" },
        { path: "/student/portal", label: "Portal" },
        { path: "/student/register", label: "Registro" },
        { path: "/student/details", label: "Detalles" },
        { path: "/student/upload", label: "Docs" },
        { path: "/student/success", label: "Éxito" },
        { path: "/admin/dashboard", label: "Admin" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-[10000] h-14 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 flex items-center shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide w-full">
                <span className="text-xs font-bold text-slate-400 uppercase mr-2 shrink-0 tracking-wider">Nav:</span>
                {screens.map((screen) => (
                    <button
                        key={screen.path}
                        onClick={() => navigate(screen.path)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${location.pathname === screen.path
                            ? 'bg-primary text-white shadow-md shadow-primary/30'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                    >
                        {screen.label}
                    </button>
                ))}
            </div>
        </nav>
    );
};

const App = () => {
    return (
        <HashRouter>
            <div className="min-h-screen bg-background-light dark:bg-background-dark">
                {/* <NavigationMenu /> */}
                <DarkModeToggle />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/registro" element={<RegisterWizard initialMode="register" />} />
                    <Route path="/monitoreo" element={<RegisterWizard initialMode="monitor" />} />
                    <Route path="/student/portal" element={<StudentPortal />} />
                    <Route path="/student/register" element={<RegisterWizard />} /> {/* Legacy/Fallback */}
                    <Route path="/student/details" element={<AcademicDetails />} />
                    <Route path="/student/upload" element={<UploadDocuments />} />
                    <Route path="/student/success" element={<SuccessScreen />} />
                    {/* <Route path="/admin/dashboard" element={<AdminKanban />} /> */}
                </Routes>
                {/* <AIChat /> */}
            </div>
        </HashRouter>
    );
};

export default App;