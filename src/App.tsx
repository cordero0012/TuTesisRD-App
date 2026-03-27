import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import AnalyticsTracker from './components/AnalyticsTracker';
// import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { PersistenceProvider } from './contexts/PersistenceContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log("[ProtectedRoute] Checking auth and role...");
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                setSession(currentSession);

                if (currentSession) {
                    const rootEmails = ['admin@tutesisrd.com', 'miguelcordero0012@gmail.com'];
                    if (currentSession.user.email && rootEmails.includes(currentSession.user.email)) {
                        console.log("[ProtectedRoute] Granted ROOT access via email bypass");
                        setIsAdmin(true);
                    } else {
                        const { data: teamMember, error } = await supabase
                            .from('team_members')
                            .select('id, is_active')
                            .eq('auth_user_id', currentSession.user.id)
                            .single();

                        if (error) {
                            console.warn("[ProtectedRoute] Role check failed or no member found:", error.message);
                            setIsAdmin(false);
                        } else {
                            console.log("[ProtectedRoute] Member found:", teamMember);
                            setIsAdmin(!!teamMember && teamMember.is_active);
                        }
                    }
                } else {
                    console.log("[ProtectedRoute] No session found");
                    setIsAdmin(false);
                }
            } catch (err) {
                console.error("[ProtectedRoute] Critical auth check error:", err);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log(`[ProtectedRoute] Auth event: ${_event}`);
            if (session) {
                checkAuth();
            } else {
                setSession(null);
                setIsAdmin(false);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!session || !isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
};

// Lazy Load Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Universities = lazy(() => import('./pages/Universities'));
const Blog = lazy(() => import('./pages/Blog'));
const StudentPortal = lazy(() => import('./pages/StudentPortal'));
// const AdminKanban = lazy(() => import('./pages/AdminKanban'));
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

// Admin Panel Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { Login as AdminLogin } from './pages/admin/Login';
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.Dashboard })));
const AdminProjects = lazy(() => import('./pages/admin/Projects').then(m => ({ default: m.Projects })));
const AdminFinances = lazy(() => import('./pages/admin/Finances').then(m => ({ default: m.Finances })));
const AdminAgenda = lazy(() => import('./pages/admin/Agenda').then(m => ({ default: m.Agenda })));
const AdminTeam = lazy(() => import('./pages/admin/Team').then(m => ({ default: m.Team })));
const AdminClients = lazy(() => import('./pages/admin/Clients').then(m => ({ default: m.Clients })));
const AdminUniversities = lazy(() => import('./pages/admin/Universities').then(m => ({ default: m.Universities })));
const AdminSettings = lazy(() => import('./pages/admin/Settings').then(m => ({ default: m.Settings })));

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
            // User request: Default to light mode as primary layout
            return false;
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

    return (
        /* Cache Buster: v4 */
        <BrowserRouter>
            <PersistenceProvider>
                <AnalyticsTracker />
                <div className="min-h-screen bg-background-light dark:bg-background-dark">
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

                        {/* Redirect Legacy or Missing Pages */}
                        <Route path="/blog-monografico" element={<Navigate to="/blog" replace />} />

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

                        {/* Admin Panel - 1:1 Bento Executive Audit */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin" element={
                            <ProtectedRoute>
                                <AdminLayout />
                            </ProtectedRoute>
                        }>
                            <Route index element={<AdminDashboard />} />
                            <Route path="proyectos" element={<AdminProjects />} />
                            <Route path="finanzas" element={<AdminFinances />} />
                            <Route path="agenda" element={<AdminAgenda />} />
                            <Route path="equipo" element={<AdminTeam />} />
                            <Route path="clientes" element={<AdminClients />} />
                            <Route path="universidades" element={<AdminUniversities />} />
                            <Route path="settings" element={<AdminSettings />} />
                        </Route>
                    </Routes>
                    </Suspense>
                    {/* <AIChat /> */}
                </div>
            </PersistenceProvider>
        </BrowserRouter>
    );
};

export default App;