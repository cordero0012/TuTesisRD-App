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
    <div className="space-y-1">
      <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-widest text-white/30 select-none">
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
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-300 cursor-pointer
                ${
                  isActive
                    ? "bg-[hsl(33,88%,55%)] text-[#0D0D0D] shadow-lg"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                  isActive ? "text-[#0D0D0D] scale-110" : "text-white/50 group-hover:text-white"
                }`}
              />
              <span className="flex-1 truncate tracking-tight">{item.label}</span>
              {isActive && (
                <ChevronRight className="h-4 w-4 opacity-70 shrink-0" />
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
    <aside className="w-[256px] shrink-0 h-[100dvh] sticky top-0 bg-[#0D0D0D] text-white transition-all duration-300 z-20 shadow-2xl flex flex-col hidden lg:flex">
      {/* Logo */}
      <div className="px-5 pt-8 pb-6 border-b border-white/5">
        <Link to="/" className="block">
          <img
            src="/logos/Logo-TuTesis-Blanco.png"
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
      <div className="px-4 pb-6 pt-4 border-t border-white/5 space-y-4">
        {/* System status */}
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400/90">En línea</span>
        </div>

        {/* Theme toggle */}
        <div className="flex items-center gap-1 rounded-xl border border-white/5 bg-white/5 p-1">
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
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-white/40 hover:text-white"
                }`}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>

        {/* User + logout */}
        <div className="flex items-center gap-3 mt-2">
          <div className="h-9 w-9 shrink-0 rounded-full bg-[hsl(33,88%,55%)] flex items-center justify-center text-sm font-black text-[#0D0D0D] shadow-md border border-[hsl(33,88%,55%)]/50">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{userName}</p>
            <p className="text-[10px] text-white/50 truncate uppercase tracking-widest mt-0.5">
              {isCollaborator ? "Colaborador" : "Admin"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            className="h-8 w-8 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-rose-500 hover:shadow-xl transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
