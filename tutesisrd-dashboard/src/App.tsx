import React, { useEffect } from "react";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  FolderKanban,
  Wallet,
  Users,
  Bell,
  Search,
  Plus,
  ArrowUpRight,
  Clock3,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Filter,
  Moon,
  Sun,
  Monitor,
  Sparkles,
  Palette,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const financeData = [
  { month: "Oct", ingresos: 22000, gastos: 12000 },
  { month: "Nov", ingresos: 34000, gastos: 18000 },
  { month: "Dic", ingresos: 28000, gastos: 14000 },
  { month: "Ene", ingresos: 41000, gastos: 22000 },
  { month: "Feb", ingresos: 38000, gastos: 21000 },
  { month: "Mar", ingresos: 52000, gastos: 24000 },
];

const pipelineData = [
  { name: "Activos", total: 12 },
  { name: "En revisión", total: 5 },
  { name: "Entregados", total: 8 },
  { name: "Retrasados", total: 2 },
];

const activities = [
  {
    title: "Capítulo metodológico aprobado",
    detail: "Proyecto: Tesis doctoral de educación",
    time: "Hace 18 min",
    type: "success",
  },
  {
    title: "Pendiente de pago",
    detail: "Cliente: Asesoría TFM UAPA",
    time: "Hace 1 h",
    type: "warning",
  },
  {
    title: "Nuevo proyecto captado",
    detail: "Investigación documental - maestría",
    time: "Hace 3 h",
    type: "info",
  },
  {
    title: "Entrega vencida detectada",
    detail: "Proyecto de psicología educativa",
    time: "Hace 5 h",
    type: "danger",
  },
];

const projectRows = [
  {
    name: "Tesis doctoral - Convivencia escolar",
    owner: "Miguel",
    progress: 82,
    due: "08 Mar",
    status: "En revisión",
  },
  {
    name: "TFM - Deterioro cognitivo",
    owner: "Equipo",
    progress: 64,
    due: "11 Mar",
    status: "En curso",
  },
  {
    name: "Artículo científico derivado",
    owner: "Redacción",
    progress: 91,
    due: "03 Mar",
    status: "Listo",
  },
  {
    name: "Instrumento Google Forms",
    owner: "Soporte",
    progress: 38,
    due: "15 Mar",
    status: "Pendiente",
  },
];

const parseDate = (dateStr: string) => {
  const currentYear = 2026;
  const months: Record<string, number> = {
    "Ene": 0, "Feb": 1, "Mar": 2, "Abr": 3, "May": 4, "Jun": 5,
    "Jul": 6, "Ago": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dic": 11
  };
  const [day, monthStr] = dateStr.split(" ");
  const month = months[monthStr];
  return new Date(currentYear, month, parseInt(day));
};

const kpis = [
  {
    title: "Proyectos activos",
    value: "12",
    hint: "+3 esta semana",
    icon: FolderKanban,
  },
  {
    title: "Ingresos del mes",
    value: "RD$52,000",
    hint: "+21% vs. mes anterior",
    icon: Wallet,
  },
  {
    title: "Tasa de finalización",
    value: "86%",
    hint: "rendimiento operativo",
    icon: CheckCircle2,
  },
  {
    title: "Alertas críticas",
    value: "2",
    hint: "requieren atención hoy",
    icon: AlertTriangle,
  },
];

function SidebarItem({ icon: Icon, label, active = false }: { icon: any; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
        active
          ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function ActivityDot({ type }: { type: string }) {
  const map: Record<string, string> = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
    danger: "bg-rose-500",
  };
  return <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${map[type] || "bg-gray-400"}`} />;
}

export default function TuTesisRDDashboardRedesign() {
  const [statusFilter, setStatusFilter] = React.useState("Todos");
  const [ownerFilter, setOwnerFilter] = React.useState("Todos");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [theme, setTheme] = React.useState<"light" | "dark" | "gray">("dark");
  const [projects, setProjects] = React.useState(projectRows);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "gray");
    root.classList.add(theme);
  }, [theme]);

  // Extract unique owners for the filter dropdown
  const uniqueOwners = React.useMemo(() => {
    const owners = new Set(projects.map(p => p.owner));
    return ["Todos", ...Array.from(owners)];
  }, [projects]);

  const handleProgressChange = (index: number, newProgress: string) => {
    const value = parseInt(newProgress);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      const updatedProjects = [...projects];
      updatedProjects[index].progress = value;
      setProjects(updatedProjects);
    }
  };

  const filteredProjects = projects.map((project, index) => ({ ...project, originalIndex: index })).filter((project) => {
    const matchesStatus = statusFilter === "Todos" || project.status === statusFilter;
    const matchesOwner = ownerFilter === "Todos" || project.owner === ownerFilter;
    
    let matchesDate = true;
    if (dateRange?.from) {
      const projectDate = parseDate(project.due);
      if (dateRange.to) {
        matchesDate = projectDate >= dateRange.from && projectDate <= dateRange.to;
      } else {
        matchesDate = projectDate >= dateRange.from;
      }
    }

    return matchesStatus && matchesOwner && matchesDate;
  });

  const isOverdue = (dateStr: string) => {
    const date = parseDate(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-border bg-card px-5 py-6">
          {/* ... (keep existing sidebar content) */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight text-foreground">TuTesisRD</p>
              <p className="text-xs font-medium text-muted-foreground">Admin Portal 2.0</p>
            </div>
          </div>

          <div className="space-y-2">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
            <SidebarItem icon={FolderKanban} label="Proyectos" />
            <SidebarItem icon={Wallet} label="Finanzas" />
            <SidebarItem icon={Users} label="Equipo" />
            <SidebarItem icon={Calendar} label="Agenda" />
          </div>

          <Card className="mt-8 rounded-3xl border-border bg-accent/50 shadow-none">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Sistema</p>
                <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Activo
                </div>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                Estado operativo estable, sin incidentes mayores. Última sincronización: 09:42 AM.
              </p>
              <Button className="mt-4 w-full rounded-2xl" variant="default">
                Ver estado
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8">
            <Button variant="ghost" className="w-full justify-start rounded-2xl text-muted-foreground hover:text-foreground">
              Cerrar sesión
            </Button>
          </div>
        </aside>

        <main className="bg-background px-5 py-5 md:px-8 lg:px-10 transition-colors duration-300">
          {/* ... (keep existing main content header and sections) */}
          <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard ejecutivo</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Vista unificada de operaciones, productividad, flujo financiero y alertas de TuTesisRD.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="rounded-2xl pl-10"
                  placeholder="Buscar proyectos..."
                />
              </div>
              
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-1">
                <Button
                  size="icon"
                  variant={theme === "light" ? "secondary" : "ghost"}
                  className="h-8 w-8 rounded-xl"
                  onClick={() => setTheme("light")}
                  title="Tema Blanco"
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant={theme === "gray" ? "secondary" : "ghost"}
                  className="h-8 w-8 rounded-xl"
                  onClick={() => setTheme("gray")}
                  title="Tema Gris"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant={theme === "dark" ? "secondary" : "ghost"}
                  className="h-8 w-8 rounded-xl"
                  onClick={() => setTheme("dark")}
                  title="Tema Oscuro"
                >
                  <Moon className="h-4 w-4" />
                </Button>
              </div>

              <Button className="rounded-2xl">
                <Plus className="mr-2 h-4 w-4" /> Nuevo proyecto
              </Button>
              <Button size="icon" variant="outline" className="rounded-2xl">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kpis.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Card className="rounded-3xl border-border bg-card/50 backdrop-blur-xl shadow-sm">
                    <CardContent className="p-5">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="rounded-2xl bg-primary/10 p-3 ring-1 ring-primary/20">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          <TrendingUp className="h-3 w-3" /> estable
                        </div>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                      <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{item.value}</p>
                      <p className="mt-2 text-xs font-medium text-muted-foreground">{item.hint}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </section>

          <section className="mt-6 grid grid-cols-1 gap-6 2xl:grid-cols-[1.5fr_1fr]">
            <Card className="rounded-3xl border-border bg-card shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base font-semibold text-foreground">Rendimiento financiero</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Ingresos vs. gastos en los últimos 6 meses
                  </CardDescription>
                </div>
                <Button variant="ghost" className="rounded-2xl text-muted-foreground hover:text-foreground">
                  Ver detalle <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="h-[330px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financeData}>
                    <defs>
                      <linearGradient id="ingresos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 12,
                        color: "hsl(var(--foreground))",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Area type="monotone" dataKey="ingresos" stroke="hsl(var(--primary))" fill="url(#ingresos)" strokeWidth={2.5} />
                    <Area type="monotone" dataKey="gastos" stroke="hsl(var(--muted-foreground))" fillOpacity={0} strokeWidth={2} strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">Actividad reciente</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Eventos operativos y señales de seguimiento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activities.map((item) => (
                  <div key={item.title} className="flex gap-3 rounded-2xl border border-border bg-accent/30 p-3 transition-colors hover:bg-accent/50">
                    <ActivityDot type={item.type} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" /> {item.time}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.95fr]">
            <Card className="rounded-3xl border-border bg-card shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-foreground">Pipeline de proyectos</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Estado consolidado del portafolio actual
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[290px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: "hsl(var(--accent))", opacity: 0.4 }}
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 12,
                        color: "hsl(var(--foreground))",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar dataKey="total" radius={[8, 8, 0, 0]} fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">Acciones rápidas</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Flujo de trabajo prioritario para hoy
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {[
                  "Registrar nuevo cliente",
                  "Crear factura",
                  "Abrir tablero de entregas",
                  "Revisar pagos pendientes",
                  "Asignar tarea al equipo",
                  "Exportar reporte semanal",
                ].map((action) => (
                  <button
                    key={action}
                    className="flex items-center justify-between rounded-2xl border border-border bg-accent/30 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-accent hover:shadow-sm"
                  >
                    <span>{action}</span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="mt-6">
            <Card className="rounded-3xl border-border bg-card shadow-sm">
              <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-foreground">Proyectos prioritarios</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Seguimiento operacional con indicadores de avance y vencimiento
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-[240px] justify-start text-left font-normal rounded-2xl ${!dateRange && "text-muted-foreground"}`}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y", { locale: es })} -{" "}
                              {format(dateRange.to, "LLL dd, y", { locale: es })}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y", { locale: es })
                          )
                        ) : (
                          <span>Filtrar por fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>

                  <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                    <SelectTrigger className="w-[140px] rounded-2xl">
                      <SelectValue placeholder="Responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueOwners.map((owner) => (
                        <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] rounded-2xl">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos</SelectItem>
                      <SelectItem value="En revisión">En revisión</SelectItem>
                      <SelectItem value="En curso">En curso</SelectItem>
                      <SelectItem value="Listo">Listo</SelectItem>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="rounded-2xl">
                    Exportar resumen
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left">
                    <thead>
                      <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="pb-3 pr-4 font-semibold">Proyecto</th>
                        <th className="pb-3 pr-4 font-semibold">Responsable</th>
                        <th className="pb-3 pr-4 font-semibold">Avance</th>
                        <th className="pb-3 pr-4 font-semibold">Fecha límite</th>
                        <th className="pb-3 font-semibold">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((row) => (
                        <tr key={row.name} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                          <td className="py-4 pr-4 text-sm font-medium text-foreground">{row.name}</td>
                          <td className="py-4 pr-4 text-sm text-muted-foreground">{row.owner}</td>
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="h-2.5 w-24 overflow-hidden rounded-full bg-secondary">
                                <div className="h-full rounded-full bg-primary" style={{ width: `${row.progress}%` }} />
                              </div>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                className="h-8 w-16 text-xs"
                                value={row.progress}
                                onChange={(e) => handleProgressChange(row.originalIndex, e.target.value)}
                              />
                              <span className="text-xs font-medium text-muted-foreground">%</span>
                            </div>
                          </td>
                          <td className="py-4 pr-4 text-sm text-muted-foreground">{row.due}</td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/20">
                                {row.status}
                              </span>
                              {row.status === "Listo" && isOverdue(row.due) && (
                                <AlertCircle className="h-4 w-4 text-amber-500" title="Proyecto listo pero vencido" />
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
