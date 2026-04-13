import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { supabase } from "@/supabaseClient";
import {
  LayoutDashboard,
  FolderKanban,
  TrendingUp,
  Users2,
  UserCheck,
  CalendarDays,
  GraduationCap,
  SlidersHorizontal,
  Sun,
  Moon,
  Monitor,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NavItem {
  icon: React.ElementType;
  label: string;
  to: string;
  restricted?: boolean;
}

const NAV_MAIN: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/admin" },
  { icon: FolderKanban, label: "Proyectos", to: "/admin/proyectos" },
  { icon: UserCheck, label: "Clientes", to: "/admin/clientes" },
  { icon: CalendarDays, label: "Agenda", to: "/admin/agenda" },
  { icon: GraduationCap, label: "Universidades", to: "/admin/universidades" },
];

const NAV_ADMIN: NavItem[] = [
  { icon: TrendingUp, label: "Finanzas", to: "/admin/finanzas", restricted: true },
  { icon: Users2, label: "Equipo", to: "/admin/equipo", restricted: true },
  { icon: SlidersHorizontal, label: "Configuración", to: "/admin/settings", restricted: true },
];

function NavSection({
  title,
  items,
  currentPath,
}: {
  title: string;
  items: NavItem[];
  currentPath: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-0.5">
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 select-none">
        {title}
      </p>
      {items.map((item) => {
        const isActive =
          currentPath === item.to ||
          (item.to === "/admin" && currentPath === "/admin");
        const Icon = item.icon;
        return (
          <Link key={item.to} to={item.to} className="block">
            <span
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 cursor-pointer
                ${
                  isActive
                    ? "bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))] border-l-2 border-[hsl(var(--primary))]"
                    : "text-muted-foreground border-l-2 border-transparent hover:text-foreground hover:bg-accent/60"
                }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  isActive ? "text-[hsl(var(--primary))]" : "text-muted-foreground/70 group-hover:text-foreground"
                }`}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {isActive && (
                <ChevronRight className="h-3 w-3 opacity-60 shrink-0" />
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function Sidebar({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: (t: "light" | "dark" | "gray") => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollaborator, teamMember } = useAdminAuth();

  const mainItems = NAV_MAIN;
  const adminItems = isCollaborator
    ? []
    : NAV_ADMIN;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const userInitial = teamMember?.name
    ? teamMember.name.charAt(0).toUpperCase()
    : "A";
  const userName = teamMember?.name || "Administrador";

  return (
    <aside className="w-[256px] shrink-0 h-[100dvh] sticky top-0 border-r border-border/40 bg-card/60 backdrop-blur-2xl transition-all duration-300 z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_24px_-12px_rgba(0,0,0,0.5)] flex flex-col hidden lg:flex">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-border/60">
        <Link to="/" className="block">
          <img
            src="/logos/Logo-TuTesis-Color.png"
            alt="TuTesisRD"
            className="h-10 w-auto"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-none">
        <NavSection
          title="Menú principal"
          items={mainItems}
          currentPath={location.pathname}
        />
        {!isCollaborator && (
          <NavSection
            title="Administración"
            items={adminItems}
            currentPath={location.pathname}
          />
        )}
      </nav>

      {/* Bottom controls */}
      <div className="px-3 pb-5 pt-3 border-t border-border/60 space-y-3">
        {/* System status */}
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/8 border border-emerald-500/15 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-xs font-medium text-emerald-400/90">Sistema operativo</span>
        </div>

        {/* Theme toggle */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-background/60 p-1">
          {(
            [
              { value: "light", Icon: Sun, label: "Claro" },
              { value: "gray", Icon: Monitor, label: "Gris" },
              { value: "dark", Icon: Moon, label: "Oscuro" },
            ] as const
          ).map(({ value, Icon, label }) => (
            <button
              key={value}
              aria-label={label}
              onClick={() => setTheme(value)}
              className={`flex flex-1 items-center justify-center rounded-lg p-1.5 transition-all duration-150 cursor-pointer
                ${
                  theme === value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>

        {/* User + logout */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 shrink-0 rounded-full bg-[hsl(var(--primary)/0.18)] flex items-center justify-center text-sm font-bold text-[hsl(var(--primary))]">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
            <p className="text-[10px] text-muted-foreground truncate">
              {isCollaborator ? "Colaborador" : "Administrador"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
