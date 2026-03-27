import React, { useState, useMemo } from "react";
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    Download,
    DollarSign,
    CreditCard,
    PieChart as PieChartIcon,
    Search,
    Calendar,
    Plus,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    Clock,
    Edit3,
    Trash2,
    FileText,
    ArrowDownRight,
    ArrowUpLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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
    Cell,
    PieChart,
    Pie
} from "recharts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";

const chartData: any[] = [];
const catData: any[] = [];

const COLORS = ["hsl(var(--primary))", "hsl(var(--primary) / 0.6)", "hsl(var(--primary) / 0.3)"];

const INITIAL_TRANSACTIONS: any[] = [];

export function Finances() {
    const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newTransaction, setNewTransaction] = useState({ concept: "", amount: "", type: "Ingreso", category: "Tesis", date: new Date().toISOString().split('T')[0] });

    // Calculate dynamic KPIs based on transactions state
    const kpiData = useMemo(() => {
        const ingresos = transactions.filter(t => t.type === 'Ingreso' && t.status === 'Pagado').reduce((acc, t) => acc + t.amount, 0);
        const gastos = transactions.filter(t => t.type === 'Gasto' && t.status === 'Pagado').reduce((acc, t) => acc + t.amount, 0);
        const pendientes = transactions.filter(t => t.type === 'Ingreso' && t.status === 'Pendiente').reduce((acc, t) => acc + t.amount, 0);
        const balance = ingresos - gastos;

        return {
            ingresos,
            gastos,
            balance,
            pendientes
        };
    }, [transactions]);

    const formattedStats = [
        { title: "Ingresos Totales", value: `RD$${kpiData.ingresos.toLocaleString()}`, trend: "+12.5%", icon: TrendingUp, color: "text-emerald-500" },
        { title: "Gastos Operativos", value: `RD$${kpiData.gastos.toLocaleString()}`, trend: "-3.2%", icon: TrendingDown, color: "text-rose-500" },
        { title: "Balance Neto", value: `RD$${kpiData.balance.toLocaleString()}`, trend: "+15.8%", icon: Wallet, color: "text-primary" },
        { title: "Pendiente Cobro", value: `RD$${kpiData.pendientes.toLocaleString()}`, trend: "+5.0%", icon: CreditCard, color: "text-amber-500" },
    ];

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t =>
            t.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, searchTerm]);

    const handleCreateTransaction = () => {
        if (!newTransaction.concept || !newTransaction.amount) return;

        const transaction = {
            id: transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1,
            concept: newTransaction.concept,
            amount: parseFloat(newTransaction.amount),
            type: newTransaction.type,
            category: newTransaction.type === 'Ingreso' ? `Ingreso - ${newTransaction.category}` : newTransaction.category,
            date: newTransaction.date,
            status: "Pagado" // Defaulting to paid for immediate KPI reflection
        };

        setTransactions([transaction, ...transactions]);
        setNewTransaction({ concept: "", amount: "", type: "Ingreso", category: "Tesis", date: new Date().toISOString().split('T')[0] });
        setIsDialogOpen(false);
    };

    const handleDeleteTransaction = (id: number) => {
        setTransactions(transactions.filter(t => t.id !== id));
    };

    const handleStatusUpdate = (id: number, newStatus: string) => {
        setTransactions(transactions.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" className="rounded-xl h-9 text-sm hidden md:flex items-center gap-2">
                        <Download className="h-3.5 w-3.5" /> Exportar
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl h-9 text-sm font-semibold gap-2 cursor-pointer">
                                <Plus className="h-3.5 w-3.5" /> Nuevo Movimiento
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Registrar Transacción</DialogTitle>
                                <DialogDescription>
                                    Añade un nuevo ingreso o gasto operativo a la contabilidad.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Tipo de Movimiento</label>
                                        <div className="flex rounded-xl bg-accent p-1">
                                            <button
                                                className={`flex-1 text-xs font-bold py-1.5 rounded-lg transition-colors ${newTransaction.type === 'Ingreso' ? 'bg-background shadow-sm text-emerald-600' : 'text-muted-foreground hover:text-foreground'}`}
                                                onClick={() => setNewTransaction({ ...newTransaction, type: 'Ingreso' })}
                                            >
                                                Ingreso
                                            </button>
                                            <button
                                                className={`flex-1 text-xs font-bold py-1.5 rounded-lg transition-colors ${newTransaction.type === 'Gasto' ? 'bg-background shadow-sm text-rose-600' : 'text-muted-foreground hover:text-foreground'}`}
                                                onClick={() => setNewTransaction({ ...newTransaction, type: 'Gasto' })}
                                            >
                                                Gasto
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Fecha</label>
                                        <Input
                                            type="date"
                                            className="rounded-xl h-9"
                                            value={newTransaction.date}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Concepto</label>
                                    <Input
                                        placeholder="Ej: Pago de cuota de mantenimiento"
                                        className="rounded-xl"
                                        value={newTransaction.concept}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, concept: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Categoría</label>
                                        <select
                                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring h-10"
                                            value={newTransaction.category}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                                        >
                                            {newTransaction.type === 'Ingreso' ? (
                                                <>
                                                    <option>Tesis</option>
                                                    <option>TFM</option>
                                                    <option>Consultoría</option>
                                                    <option>Otros Ingresos</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option>Honorarios</option>
                                                    <option>Suscripciones</option>
                                                    <option>Infraestructura</option>
                                                    <option>Marketing</option>
                                                    <option>Otros Gastos</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Monto (RD$)</label>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            className="rounded-xl"
                                            value={newTransaction.amount}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" className="rounded-xl cursor-pointer" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                                <Button className="rounded-xl cursor-pointer" onClick={handleCreateTransaction}>Registrar Transacción</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {formattedStats.map((stat) => (
                    <Card key={stat.title} className="rounded-2xl border-border bg-card shadow-none">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ${stat.color.replace('text-', 'bg-').replace('-500', '-500/10')}`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{stat.title}</p>
                            <p className="mt-1 text-2xl font-black tracking-tight text-foreground">{stat.value}</p>
                            <div className={`flex items-center gap-1 mt-2 text-[11px] font-semibold ${stat.trend.startsWith('+') ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                                {stat.trend.startsWith('+') ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {stat.trend} <span className="text-muted-foreground font-normal ml-1">vs mes anterior</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Card className="xl:col-span-2 rounded-2xl border-border bg-card shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4 mb-0">
                        <div>
                            <CardTitle className="text-sm font-semibold">Flujo de Caja Mensual</CardTitle>
                            <CardDescription className="text-xs mt-0.5">Comparativa de ingresos y gastos operativos</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="rounded-xl font-bold text-primary hover:bg-primary/10 transition-colors cursor-pointer">
                            Más Detalles <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} fontWeight={600} fill="hsl(var(--muted-foreground))" />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} fontWeight={600} fill="hsl(var(--muted-foreground))" />
                                <Tooltip
                                    cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    contentStyle={{ borderRadius: '16px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                    itemStyle={{ fontWeight: 600 }}
                                />
                                <Area type="monotone" dataKey="ingresos" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorIngresos)" activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--primary))" }} />
                                <Area type="monotone" dataKey="gastos" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} activeDot={{ r: 4, strokeWidth: 0, fill: "hsl(var(--muted-foreground))" }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-border bg-card shadow-sm">
                    <CardHeader className="border-b border-border/50 pb-4 mb-0">
                        <CardTitle className="text-sm font-semibold">Ingresos por Categoría</CardTitle>
                        <CardDescription className="text-xs mt-0.5">Distribución de ventas por servicio</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center">
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={catData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={85}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {catData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full space-y-3 mt-6">
                            {catData.map((item, idx) => (
                                <div key={item.name} className="flex items-center justify-between text-sm p-2 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="h-4 w-4 rounded-full shadow-sm" style={{ backgroundColor: COLORS[idx] }} />
                                        <span className="font-semibold text-muted-foreground">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-foreground">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Historial de Transacciones */}
            <Card className="rounded-2xl border-border bg-card shadow-sm overflow-hidden">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/50 pb-4 px-5 pt-5 gap-3">
                    <div>
                        <CardTitle className="text-sm font-semibold">Historial de Transacciones</CardTitle>
                        <CardDescription className="text-xs mt-0.5">Registro detallado de ingresos y gastos recientes</CardDescription>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar concepto o categoría..."
                            className="pl-10 rounded-2xl h-10 bg-accent/30 shadow-sm border-border"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border/50">
                                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Fecha</th>
                                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Concepto</th>
                                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Tipo</th>
                                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Monto</th>
                                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Estado</th>
                                    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-accent/10 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {tx.date}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-[250px]">
                                                <p className="text-base font-black text-foreground truncate">{tx.concept}</p>
                                                <p className="text-xs font-bold text-foreground/60 mt-1 uppercase tracking-tight">{tx.category}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase ring-1 ${tx.type === 'Ingreso' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-500/20' : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 ring-rose-500/20'}`}>
                                                    {tx.type === 'Ingreso' ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpLeft className="h-3 w-3" />}
                                                    {tx.type}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-black ${tx.type === 'Ingreso' ? (tx.status === 'Pendiente' ? 'text-amber-500' : 'text-foreground') : 'text-foreground'}`}>
                                                    {tx.type === 'Ingreso' ? '+' : '-'}RD${tx.amount.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${tx.status === 'Pagado' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                                                    {tx.status === 'Pagado' ? <CheckCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                                                    {tx.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
                                                        <FileText className="h-4 w-4" />
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-accent transition-all cursor-pointer">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-2xl min-w-[200px] shadow-xl">
                                                            <DropdownMenuLabel>Gestionar Transacción</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            {tx.type === 'Ingreso' && tx.status === 'Pendiente' && (
                                                                <DropdownMenuItem className="gap-2 cursor-pointer font-medium text-emerald-600" onClick={() => handleStatusUpdate(tx.id, "Pagado")}>
                                                                    <CheckCircle className="h-4 w-4" /> Marcar como Pagado
                                                                </DropdownMenuItem>
                                                            )}
                                                            {tx.status === 'Pagado' && (
                                                                <DropdownMenuItem className="gap-2 cursor-pointer font-medium" onClick={() => handleStatusUpdate(tx.id, "Pendiente")}>
                                                                    <Clock className="h-4 w-4 text-amber-500" /> Marcar como Pendiente
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="gap-2 cursor-pointer font-medium">
                                                                <Edit3 className="h-4 w-4" /> Editar concepto
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 cursor-pointer font-medium text-destructive" onClick={() => handleDeleteTransaction(tx.id)}>
                                                                <Trash2 className="h-4 w-4" /> Eliminar registro
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="h-16 w-16 rounded-full bg-accent/50 flex items-center justify-center">
                                                    <Search className="h-8 w-8 opacity-20" />
                                                </div>
                                                <p className="font-semibold text-foreground">No se encontraron movimientos</p>
                                                <p className="text-xs">No hay resultados para la búsqueda actual.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

