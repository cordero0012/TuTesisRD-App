import React from "react";
import { Link, useLocation } from "react-router-dom";
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
        className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${active
            ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </button>
    </Link>
  );
}

export function Sidebar({ theme, setTheme }: { theme: string; setTheme: (t: "light" | "dark" | "gray") => void }) {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/admin" },
    { icon: FolderKanban, label: "Proyectos", to: "/admin/proyectos" },
    { icon: Wallet, label: "Finanzas", to: "/admin/finanzas" },
    { icon: Users, label: "Equipo", to: "/admin/equipo" },
    { icon: Users, label: "Clientes", to: "/admin/clientes" },
    { icon: Calendar, label: "Agenda", to: "/admin/agenda" },
    { icon: GraduationCap, label: "Universidades", to: "/admin/universidades" },
    { icon: Settings, label: "Configuración", to: "/admin/settings" },
  ];

  return (
    <aside className="border-r border-border bg-card px-5 py-6 h-screen flex flex-col sticky top-0">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-lg font-bold tracking-tight text-foreground">TuTesisRD</p>
          <p className="text-xs font-medium text-muted-foreground">Admin Portal 2.0</p>
        </div>
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
              <p className="text-sm font-semibold text-foreground">Sistema</p>
              <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Activo
              </div>
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
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

        <Button variant="ghost" className="w-full justify-start rounded-2xl text-muted-foreground hover:text-foreground">
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}
