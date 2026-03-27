import React, { useMemo, useState, useEffect } from "react";
import { motion } from "motion/react";
import {
    FolderKanban,
    TrendingUp,
    CheckCircle2,
    AlertTriangle,
    ArrowUpRight,
    Clock,
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

// ─── Status config with semantic colors ────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
    pending:    { label: "Pendiente",    cls: "bg-slate-500/10  text-slate-600  dark:text-slate-400  ring-1 ring-inset ring-slate-500/25" },
    assigned:   { label: "Asignado",    cls: "bg-violet-500/10 text-violet-700 dark:text-violet-400 ring-1 ring-inset ring-violet-500/25" },
    in_progress:{ label: "En curso",    cls: "bg-blue-500/10   text-blue-700   dark:text-blue-400   ring-1 ring-inset ring-blue-500/25" },
    review:     { label: "En revisión", cls: "bg-amber-500/10  text-amber-700  dark:text-amber-400  ring-1 ring-inset ring-amber-500/25" },
    completed:  { label: "Listo",       cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/25" },
};

// ─── KPI card config with semantic colors ──────────────────────────────────────
const KPI_CONFIG = [
    {
        key: "activeProjects",
        title: "Proyectos activos",
        hint: "en curso actualmente",
        icon: FolderKanban,
        color: "blue",
        iconCls: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
        valueCls: "text-foreground",
    },
    {
        key: "monthlyRevenue",
        title: "Ingresos del mes",
        hint: "pagos recibidos",
        icon: TrendingUp,
        color: "emerald",
        iconCls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
        valueCls: "text-foreground",
    },
    {
        key: "completionRate",
        title: "Tasa de finalización",
        hint: "rendimiento operativo",
        icon: CheckCircle2,
        color: "violet",
        iconCls: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
        valueCls: "text-foreground",
    },
    {
        key: "overdueProjects",
        title: "Alertas críticas",
        hint: "proyectos vencidos",
        icon: AlertTriangle,
        color: "rose",
        iconCls: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
        valueCls: "text-foreground",
    },
] as const;

const ACTIVITY_DOT: Record<string, string> = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    info:    "bg-blue-500",
    danger:  "bg-rose-500",
};

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status] ?? {
        label: status,
        cls: "bg-slate-500/15 text-slate-400 ring-1 ring-inset ring-slate-500/20",
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${cfg.cls}`}>
            {cfg.label}
        </span>
    );
}

function formatCurrency(amount: number): string {
    return `RD$${amount.toLocaleString("es-DO")}`;
}

function formatKpiValue(key: string, kpis: DashboardKPIs): string {
    if (key === "activeProjects") return kpis.activeProjects.toString();
    if (key === "monthlyRevenue") return formatCurrency(kpis.monthlyRevenue);
    if (key === "completionRate") return `${kpis.completionRate}%`;
    if (key === "overdueProjects") return kpis.overdueProjects.toString();
    return "—";
}

// ─── Custom tooltip for chart ──────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-border bg-card px-3 py-2.5 shadow-lg text-sm">
            <p className="font-semibold text-foreground/70 mb-1">{label}</p>
            <p className="font-bold text-[hsl(var(--primary))]">
                {formatCurrency(payload[0].value)}
            </p>
        </div>
    );
}

export function Dashboard() {
    const [projects, setProjects]     = useState<AdminProject[]>([]);
    const [kpis, setKpis]             = useState<DashboardKPIs | null>(null);
    const [financeData, setFinanceData] = useState<FinanceMonthData[]>([]);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState<string | null>(null);

    const [statusFilter, setStatusFilter] = useState("Todos");
    const [searchTerm, setSearchTerm]     = useState("");

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

    const filteredProjects = useMemo(() => {
        return projects.filter((p) => {
            const cfg = STATUS_CONFIG[p.status];
            const label = cfg?.label ?? p.status;
            const matchesStatus = statusFilter === "Todos" || label === statusFilter;
            const clientName = p.students
                ? `${p.students.name} ${p.students.lastname}`
                : "Admin";
            const matchesSearch =
                searchTerm === "" ||
                (p.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                clientName.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [projects, statusFilter, searchTerm]);

    const isOverdue = (due?: string) => {
        if (!due) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(due) < today;
    };

    const handleProgressChange = async (projectId: string, newStatus: string) => {
        await updateProjectStatus(projectId, newStatus);
        setProjects((prev) => prev.map((p) => p.id === projectId ? { ...p, status: newStatus } : p));
    };

    if (loading) {
        return (
            <div className="space-y-5 animate-pulse">
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-28 rounded-2xl bg-card/60" />
                    ))}
                </div>
                <div className="h-64 rounded-2xl bg-card/60" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <p className="text-destructive font-semibold text-sm">{error}</p>
                <Button onClick={loadData} variant="outline" size="sm" className="rounded-xl">
                    Reintentar
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ── KPI Cards ─────────────────────────────────────────────── */}
            <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {KPI_CONFIG.map((cfg, index) => {
                    const Icon = cfg.icon;
                    const value = kpis ? formatKpiValue(cfg.key, kpis) : "—";
                    const isAlert = cfg.key === "overdueProjects" && kpis && kpis.overdueProjects > 0;
                    return (
                        <motion.div
                            key={cfg.key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.25 }}
                        >
                            <Card className={`rounded-2xl border-border bg-card shadow-none transition-colors ${isAlert ? "border-rose-500/25" : ""}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${cfg.iconCls}`}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        {isAlert && (
                                            <span className="text-[10px] font-semibold uppercase tracking-wide text-rose-400 bg-rose-500/10 rounded-full px-2 py-0.5">
                                                Urgente
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                        {cfg.title}
                                    </p>
                                    <p className={`mt-1 text-2xl font-black tracking-tight ${cfg.valueCls}`}>
                                        {value}
                                    </p>
                                    <p className="mt-1 text-[11px] text-muted-foreground/70">{cfg.hint}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </section>

            {/* ── Finance Chart + Activity ───────────────────────────────── */}
            <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[1.6fr_1fr]">
                {/* Finance chart */}
                <Card className="rounded-2xl border-border bg-card shadow-none">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-semibold text-foreground">
                                Rendimiento financiero
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">Ingresos por mes</p>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground/50" />
                    </CardHeader>
                    <CardContent className="h-[260px]">
                        {financeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={financeData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="grad-ingresos" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F29727" stopOpacity={0.25} />
                                            <stop offset="95%" stopColor="#F29727" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="hsl(var(--border))"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="month"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                                    />
                                    <Tooltip content={<ChartTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="ingresos"
                                        stroke="#F29727"
                                        fill="url(#grad-ingresos)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                                Sin datos financieros aún.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Activity feed */}
                <Card className="rounded-2xl border-border bg-card shadow-none">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-semibold text-foreground">
                                Actividad reciente
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground/50" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {activities.length > 0 ? (
                            activities.slice(0, 6).map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-3 rounded-xl bg-accent/30 border border-border/50 px-3 py-2.5"
                                >
                                    <span
                                        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${ACTIVITY_DOT[item.type] ?? "bg-slate-400"}`}
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-foreground leading-tight truncate">
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                            {item.message}
                                        </p>
                                    </div>
                                    <span className="text-[11px] font-medium text-muted-foreground/60 whitespace-nowrap self-start mt-0.5">
                                        {formatRelativeTime(item.created_at)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-10">
                                Sin actividad reciente.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ── Projects Table ─────────────────────────────────────────── */}
            <Card className="rounded-2xl border-border bg-card shadow-none">
                <CardHeader className="border-b border-border/50 pb-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-sm font-semibold text-foreground">
                                Proyectos prioritarios
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {filteredProjects.length} resultado{filteredProjects.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Input
                                placeholder="Buscar proyecto..."
                                className="w-44 rounded-xl h-8 text-xs"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-36 rounded-xl h-8 text-xs">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Todos">Todos</SelectItem>
                                    {Object.values(STATUS_CONFIG).map((s) => (
                                        <SelectItem key={s.label} value={s.label}>
                                            {s.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border/50">
                                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Proyecto</th>
                                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Cliente</th>
                                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Avance</th>
                                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Fecha límite</th>
                                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProjects.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                                            No se encontraron proyectos.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProjects.map((row) => {
                                        const clientName = row.students
                                            ? `${row.students.name} ${row.students.lastname}`
                                            : "Sin cliente";
                                        const overdue = isOverdue(row.due_date);
                                        const progress = row.progress_percent ?? 0;
                                        // Progress bar color by value
                                        const barColor =
                                            progress >= 80
                                                ? "bg-emerald-500"
                                                : progress >= 40
                                                ? "bg-blue-500"
                                                : "bg-amber-500";
                                        return (
                                            <tr
                                                key={row.id}
                                                className="border-b border-border/40 last:border-0 hover:bg-accent/25 transition-colors"
                                            >
                                                <td className="px-5 py-3.5">
                                                    <p className="text-sm font-semibold text-foreground leading-tight">
                                                        {row.title || row.tracking_code}
                                                    </p>
                                                    <p className="text-[11px] text-muted-foreground/60 font-mono mt-0.5">
                                                        {row.tracking_code}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3.5 text-sm text-foreground/80 font-medium">
                                                    {clientName}
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                                                            <div
                                                                className={`h-full rounded-full transition-all ${barColor}`}
                                                                style={{ width: `${progress}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                                                            {progress}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className={`px-4 py-3.5 text-sm font-medium ${overdue ? "text-rose-400" : "text-muted-foreground"}`}>
                                                    {row.due_date
                                                        ? new Date(row.due_date).toLocaleDateString("es-DO", {
                                                              day: "2-digit",
                                                              month: "short",
                                                              year: "numeric",
                                                          })
                                                        : "—"}
                                                    {overdue && (
                                                        <span className="ml-1 text-[10px] font-semibold text-rose-400/70">
                                                            vencido
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <StatusBadge status={row.status} />
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
