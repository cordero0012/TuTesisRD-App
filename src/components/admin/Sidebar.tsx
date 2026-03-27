import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { supabase } from "@/supabaseClient";
import {
  LayoutDashboard,
  FolderKanban,
  Wallet,
  Users,
  Calendar,
  Sparkles,
  Search,
  Monitor,
  Sun,
  Moon,
  Plus,
  Bell,
  Settings,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";

interface SidebarItemProps {
  key?: React.Key;
  icon: any;
  label: string;
  to: string;
  active?: boolean;
}

function SidebarItem({ icon: Icon, label, to, active = false }: SidebarItemProps) {
  return (
    <Link to={to} className="block w-full">
      <button
        className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-bold transition-all ${active
            ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </button>
    </Link>
  );
}

export function Sidebar({ theme, setTheme }: { theme: string; setTheme: (t: "light" | "dark" | "gray") => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollaborator, teamMember } = useAdminAuth();

  const allMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/admin" },
    { icon: FolderKanban, label: "Proyectos", to: "/admin/proyectos" },
    { icon: Wallet, label: "Finanzas", to: "/admin/finanzas", restricted: true },
    { icon: Users, label: "Equipo", to: "/admin/equipo", restricted: true },
    { icon: Users, label: "Clientes", to: "/admin/clientes" },
    { icon: Calendar, label: "Agenda", to: "/admin/agenda" },
    { icon: GraduationCap, label: "Universidades", to: "/admin/universidades" },
    { icon: Settings, label: "Configuración", to: "/admin/settings", restricted: true },
  ];

  const menuItems = allMenuItems.filter(item => !(isCollaborator && item.restricted));

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <aside className="border-r border-border bg-card px-5 py-6 h-screen flex flex-col sticky top-0">
      <div className="mb-8 px-2 flex items-center">
        <Link to="/" className="block">
          <img src="/logos/Logo-TuTesis-Color.png" alt="TuTesisRD" className="h-12 w-auto" />
        </Link>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            active={location.pathname === item.to || (item.to === "/admin" && location.pathname === "/")}
          />
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <Card className="rounded-3xl border-border bg-accent/50 shadow-none">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-base font-bold text-foreground">Sistema</p>
              <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Activo
              </div>
            </div>
            <p className="text-sm font-medium leading-5 text-foreground/80">
              Estado operativo estable.
            </p>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-1">
          <Button
            size="icon"
            variant={theme === "light" ? "secondary" : "ghost"}
            className="h-8 w-8 rounded-xl flex-1"
            onClick={() => setTheme("light")}
          >
            <Sun className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={theme === "gray" ? "secondary" : "ghost"}
            className="h-8 w-8 rounded-xl flex-1"
            onClick={() => setTheme("gray")}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={theme === "dark" ? "secondary" : "ghost"}
            className="h-8 w-8 rounded-xl flex-1"
            onClick={() => setTheme("dark")}
          >
            <Moon className="h-4 w-4" />
          </Button>
        </div>

        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start rounded-2xl text-muted-foreground hover:text-foreground">
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}
