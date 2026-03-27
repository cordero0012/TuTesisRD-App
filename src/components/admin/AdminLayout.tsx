import React, { useEffect, useState, useRef, Suspense } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Search, Bell, CheckCheck } from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { supabase } from "@/supabaseClient";

interface NotifItem {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  is_read?: boolean;
}

// Map routes to page titles
const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/admin": { title: "Dashboard", subtitle: "Vista unificada de operaciones" },
  "/admin/proyectos": { title: "Proyectos", subtitle: "Gestión y seguimiento de tesis" },
  "/admin/clientes": { title: "Clientes", subtitle: "Directorio de estudiantes" },
  "/admin/agenda": { title: "Agenda", subtitle: "Calendario y citas" },
  "/admin/universidades": { title: "Universidades", subtitle: "Instituciones registradas" },
  "/admin/finanzas": { title: "Finanzas", subtitle: "Ingresos y pagos" },
  "/admin/equipo": { title: "Equipo", subtitle: "Miembros y roles" },
  "/admin/settings": { title: "Configuración", subtitle: "Ajustes del sistema" },
};

function PageHeader({ path, teamMember }: { path: string; teamMember: any }) {
  const page = PAGE_TITLES[path] ?? { title: "Portal admin", subtitle: "" };
  const userInitial = teamMember?.name ? teamMember.name.charAt(0).toUpperCase() : "A";
  const userName = teamMember?.name || "Administrador";

  const [notifs, setNotifs] = useState<NotifItem[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifs.filter(n => !n.is_read).length;

  useEffect(() => {
    // Fetch last 10 activity_log entries as notifications
    supabase
      .from("activity_log")
      .select("id, title, message, type, created_at")
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) setNotifs(data as NotifItem[]);
      });
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
    setShowNotifs(false);
  };

  const TYPE_DOT: Record<string, string> = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    info: "bg-blue-500",
  };

  return (
    <header className="flex items-center justify-between gap-4 mb-7">
      {/* Page title */}
      <div className="min-w-0">
        <h1 className="text-xl font-bold text-foreground tracking-tight truncate">
          {page.title}
        </h1>
        {page.subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{page.subtitle}</p>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar..."
            className="h-9 w-52 rounded-full border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.4)] focus:border-[hsl(var(--primary)/0.5)] transition-all"
          />
        </div>

        {/* Notifications */}
        <div ref={bellRef} className="relative">
          <button
            aria-label="Notificaciones"
            onClick={() => setShowNotifs(v => !v)}
            className="relative h-9 w-9 flex items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-11 z-50 w-80 rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <span className="text-sm font-bold">Notificaciones</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    <CheckCheck className="h-3.5 w-3.5" /> Marcar leídas
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifs.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">Sin notificaciones</div>
                ) : (
                  notifs.map(n => (
                    <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-border/30 hover:bg-accent/40 transition-colors ${!n.is_read ? "bg-accent/20" : ""}`}>
                      <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${TYPE_DOT[n.type] ?? "bg-muted-foreground"}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{n.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">{new Date(n.created_at).toLocaleDateString("es-DO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div
          className="h-9 w-9 rounded-full bg-[hsl(var(--primary)/0.15)] border border-[hsl(var(--primary)/0.25)] flex items-center justify-center text-sm font-bold text-[hsl(var(--primary))] cursor-default select-none"
          title={userName}
        >
          {userInitial}
        </div>
      </div>
    </header>
  );
}

export function AdminLayout() {
  const [theme, setTheme] = useState<"light" | "dark" | "gray">("dark");
  const { isCollaborator, teamMember } = useAdminAuth();
  const location = useLocation();

  const restrictedPaths = ["/admin/finanzas", "/admin/equipo", "/admin/settings"];
  if (isCollaborator && restrictedPaths.some((p) => location.pathname.startsWith(p))) {
    return <Navigate to="/admin/proyectos" replace />;
  }

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "gray");
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[256px_1fr]">
        <Sidebar theme={theme} setTheme={setTheme} />

        <main className="bg-background px-5 py-6 md:px-8 lg:px-10 transition-colors duration-200 flex flex-col min-w-0">
          <PageHeader path={location.pathname} teamMember={teamMember} />

          <div className="flex-1 min-w-0">
            <Suspense
              fallback={
                <div className="flex h-64 items-center justify-center">
                  <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-border border-t-[hsl(var(--primary))]" />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
