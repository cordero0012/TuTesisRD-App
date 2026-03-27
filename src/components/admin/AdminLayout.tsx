import React, { useEffect, useState, Suspense } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Search, Plus, Bell } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export function AdminLayout() {
    const [theme, setTheme] = useState<"light" | "dark" | "gray">("dark");
    const { isCollaborator, teamMember } = useAdminAuth();
    const location = useLocation();

    // Evitar acceso a rutas restringidas para colaboradores
    const restrictedPaths = ["/admin/finanzas", "/admin/equipo", "/admin/settings"];
    if (isCollaborator && restrictedPaths.some(path => location.pathname.startsWith(path))) {
        return <Navigate to="/admin/proyectos" replace />;
    }

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark", "gray");
        root.classList.add(theme);
    }, [theme]);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
                <Sidebar theme={theme} setTheme={setTheme} />

                <main className="bg-background px-5 py-5 md:px-8 lg:px-10 transition-colors duration-300 flex flex-col">
                    <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="relative w-full xl:w-96">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                className="rounded-2xl pl-10 h-11"
                                placeholder="Buscar en el portal..."
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <Button size="icon" variant="outline" className="rounded-2xl h-11 w-11">
                                <Bell className="h-4 w-4" />
                            </Button>
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                {teamMember?.name ? teamMember.name.charAt(0).toUpperCase() : "A"}
                            </div>
                        </div>
                    </header>

                    <div className="flex-1">
                        <Suspense fallback={
                            <div className="flex h-64 items-center justify-center">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-500" />
                            </div>
                        }>
                            <Outlet />
                        </Suspense>
                    </div>
                </main>
            </div>
        </div>
    );
}
