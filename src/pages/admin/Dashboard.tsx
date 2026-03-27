import React, { useMemo, useState, useEffect } from "react";
import { motion } from "motion/react";
import {
    FolderKanban,
    Wallet,
    CheckCircle2,
    AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
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
} from "recharts";
import {
    fetchProjects,
    fetchDashboardKPIs,
    fetchFinanceChartData,
    fetchRecentActivity,
    updateProjectStatus,
    DashboardKPIs,
    FinanceMonthData,
    ActivityItem,
    AdminProject,
    formatRelativeTime,
} from "@/services/admin/adminDataService";

// ---- Status label mapping (DB values → Spanish display) ----
const STATUS_LABELS: Record<string, string> = {
    pending: "Pendiente",
    assigned: "Asignado",
    in_progress: "En curso",
    review: "En revisión",
    completed: "Listo",
};

const ACTIVITY_TYPE_MAP: Record<string, string> = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
    danger: "bg-rose-500",
};

function ActivityDot({ type }: { type: string }) {
    return <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${ACTIVITY_TYPE_MAP[type] || "bg-gray-400"}`} />;
}

function formatCurrency(amount: number): string {
    return `RD$${amount.toLocaleString("es-DO")}`;
}

export function Dashboard() {
    // ---- State ----
    const [projects, setProjects] = useState<AdminProject[]>([]);
    const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
    const [financeData, setFinanceData] = useState<FinanceMonthData[]>([]);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [statusFilter, setStatusFilter] = useState("Todos");
    const [ownerFilter, setOwnerFilter] = useState("Todos");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [searchTerm, setSearchTerm] = useState("");

    // ---- Fetch all data ----
    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [projectsData, kpisData, financeChartData, activityData] = await Promise.all([
                fetchProjects(),
                fetchDashboardKPIs(),
                fetchFinanceChartData(),
                fetchRecentActivity(),
            ]);
            setProjects(projectsData);
            setKpis(kpisData);
            setFinanceData(financeChartData);
            setActivities(activityData);
        } catch (err: any) {
            setError(err?.message || "Error al cargar los datos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    // ---- Unique owners for filter ----
    const uniqueOwners = useMemo(() => {
        const owners = new Set(projects.map(p => p.students?.name || "Admin"));
        return ["Todos", ...Array.from(owners)];
    }, [projects]);

    // ---- Filtered projects ----
    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            const label = STATUS_LABELS[p.status] || p.status;
            const matchesStatus = statusFilter === "Todos" || label === statusFilter;
            const clientName = p.students ? `${p.students.name} ${p.students.lastname}` : "Admin";
            const matchesOwner = ownerFilter === "Todos" || clientName === ownerFilter;
            const matchesSearch = searchTerm === "" ||
                (p.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                clientName.toLowerCase().includes(searchTerm.toLowerCase());
            let matchesDate = true;
            if (dateRange?.from && p.due_date) {
                const d = new Date(p.due_date);
                if (dateRange.to) {
                    matchesDate = d >= dateRange.from && d <= dateRange.to;
                } else {
                    matchesDate = d >= dateRange.from;
                }
            }
            return matchesStatus && matchesOwner && matchesSearch && matchesDate;
        });
    }, [projects, statusFilter, ownerFilter, searchTerm, dateRange]);

    const isOverdue = (due?: string) => {
        if (!due) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(due) < today;
    };

    // ---- Handle progress update ----
    const handleProgressChange = async (projectId: string, newStatus: string) => {
        await updateProjectStatus(projectId, newStatus);
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
    };

    // ---- KPI Cards ----
    const kpiCards = kpis ? [
        { title: "Proyectos activos", value: kpis.activeProjects.toString(), hint: "proyectos en curso", icon: FolderKanban },
        { title: "Ingresos del mes", value: formatCurrency(kpis.monthlyRevenue), hint: "pagos recibidos", icon: Wallet },
        { title: "Tasa de finalización", value: `${kpis.completionRate}%`, hint: "rendimiento operativo", icon: CheckCircle2 },
        { title: "Alertas críticas", value: kpis.overdueProjects.toString(), hint: "proyectos vencidos", icon: AlertTriangle },
    ] : [];

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 rounded-3xl bg-accent/30" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <p className="text-destructive font-semibold">{error}</p>
                <Button onClick={loadData} variant="outline" className="rounded-2xl">Reintentar</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Dashboard ejecutivo</h1>
                <p className="mt-2 text-base font-medium text-foreground/80">
                    Vista unificada de operaciones, productividad y flujos de TuTesisRD.
                </p>
            </div>

            {/* KPI Cards */}
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {kpiCards.map((item, index) => {
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
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-foreground/80 uppercase tracking-wider">{item.title}</p>
                                    <p className="mt-2 text-4xl font-black tracking-tight text-foreground">{item.value}</p>
                                    <p className="mt-2 text-sm font-semibold text-muted-foreground">{item.hint}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </section>

            {/* Finance Chart + Activity Feed */}
            <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.5fr_1fr]">
                <Card className="rounded-3xl border-border bg-card shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-lg font-bold text-foreground">Rendimiento financiero</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {financeData.length > 0 ? (
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
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
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
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                                No hay datos financieros aún.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border-border bg-card shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-foreground">Actividad reciente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {activities.length > 0 ? activities.map((item) => (
                            <div key={item.id} className="flex gap-3 rounded-2xl border border-border bg-accent/30 p-3">
                                <ActivityDot type={item.type} />
                                <div className="min-w-0 flex-1">
                                    <p className="text-base font-bold text-foreground">{item.title}</p>
                                    <p className="mt-1 text-sm font-medium text-foreground/80">{item.message}</p>
                                </div>
                                <div className="text-sm font-bold text-muted-foreground whitespace-nowrap">
                                    {formatRelativeTime(item.created_at)}
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-muted-foreground text-center py-8">Sin actividad reciente.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Projects Table */}
            <Card className="rounded-3xl border-border bg-card shadow-sm">
                <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-border/50 pb-6 mb-4">
                    <div>
                        <CardTitle className="text-xl font-bold text-foreground">Proyectos prioritarios</CardTitle>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Input
                            placeholder="Buscar..."
                            className="w-[160px] rounded-2xl h-9"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
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
                                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                                    <th className="pb-3 pr-4 font-bold">Proyecto</th>
                                    <th className="pb-3 pr-4 font-bold">Cliente</th>
                                    <th className="pb-3 pr-4 font-bold">Avance</th>
                                    <th className="pb-3 pr-4 font-bold">Fecha límite</th>
                                    <th className="pb-3 font-bold">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProjects.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                                            No se encontraron proyectos.
                                        </td>
                                    </tr>
                                ) : filteredProjects.map((row) => {
                                    const clientName = row.students
                                        ? `${row.students.name} ${row.students.lastname}`
                                        : "Sin cliente";
                                    const overdue = isOverdue(row.due_date);
                                    return (
                                        <tr key={row.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                                            <td className="py-4 pr-4 text-base font-bold text-foreground">{row.title || row.tracking_code}</td>
                                            <td className="py-4 pr-4 text-sm font-semibold text-foreground/80">{clientName}</td>
                                            <td className="py-4 pr-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-20 overflow-hidden rounded-full bg-secondary">
                                                        <div className="h-full rounded-full bg-primary" style={{ width: `${row.progress_percent}%` }} />
                                                    </div>
                                                    <span className="text-sm font-bold text-foreground/80">{row.progress_percent}%</span>
                                                </div>
                                            </td>
                                            <td className={`py-4 pr-4 text-sm font-bold ${overdue ? "text-rose-500" : "text-foreground/80"}`}>
                                                {row.due_date ? new Date(row.due_date).toLocaleDateString("es-DO") : "—"}
                                            </td>
                                            <td className="py-4">
                                                <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase text-primary ring-1 ring-primary/20">
                                                    {STATUS_LABELS[row.status] || row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
