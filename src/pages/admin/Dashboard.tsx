import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
    FolderKanban,
    Wallet,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    ArrowUpRight,
    Clock3,
    Calendar as CalendarIcon,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import { Calendar as CalendarComponent } from "@/components/ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
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

function ActivityDot({ type }: { type: string }) {
    const map: Record<string, string> = {
        success: "bg-emerald-500",
        warning: "bg-amber-500",
        info: "bg-blue-500",
        danger: "bg-rose-500",
    };
    return <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${map[type] || "bg-gray-400"}`} />;
}

export function Dashboard() {
    const [statusFilter, setStatusFilter] = useState("Todos");
    const [ownerFilter, setOwnerFilter] = useState("Todos");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [projects, setProjects] = useState(projectRows);

    const uniqueOwners = useMemo(() => {
        const owners = new Set(projects.map(p => p.owner));
        return ["Todos", ...Array.from(owners)];
    }, [projects]);

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

    const handleProgressChange = (index: number, newProgress: string) => {
        const value = parseInt(newProgress);
        if (!isNaN(value) && value >= 0 && value <= 100) {
            const updatedProjects = [...projects];
            updatedProjects[index].progress = value;
            setProjects(updatedProjects);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard ejecutivo</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Vista unificada de operaciones, productividad y flujos de TuTesisRD.
                </p>
            </div>

            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {kpis.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="rounded-3xl border-border bg-card/50 backdrop-blur-xl shadow-sm">
                                <CardContent className="p-5">
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="rounded-2xl bg-primary/10 p-3 ring-1 ring-primary/20">
                                            <Icon className="h-5 w-5 text-primary" />
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

            <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.5fr_1fr]">
                <Card className="rounded-3xl border-border bg-card shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-base font-semibold text-foreground">Rendimiento financiero</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={financeData}>
                                <defs>
                                    <linearGradient id="ingresos" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{
                                        background: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: 12,
                                    }}
                                />
                                <Area type="monotone" dataKey="ingresos" stroke="hsl(var(--primary))" fill="url(#ingresos)" strokeWidth={2.5} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-border bg-card shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold text-foreground">Actividad reciente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {activities.map((item) => (
                            <div key={item.title} className="flex gap-3 rounded-2xl border border-border bg-accent/30 p-3">
                                <ActivityDot type={item.type} />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                                </div>
                                <div className="text-xs font-medium text-muted-foreground">
                                    {item.time}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Card className="rounded-3xl border-border bg-card shadow-sm">
                <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-border/50 pb-6 mb-4">
                    <div>
                        <CardTitle className="text-base font-semibold text-foreground">Proyectos prioritarios</CardTitle>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
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
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
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
                                                <div className="h-2 w-20 overflow-hidden rounded-full bg-secondary">
                                                    <div className="h-full rounded-full bg-primary" style={{ width: `${row.progress}%` }} />
                                                </div>
                                                <span className="text-xs font-medium text-muted-foreground">{row.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="py-4 pr-4 text-sm text-muted-foreground">{row.due}</td>
                                        <td className="py-4">
                                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/20">
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
