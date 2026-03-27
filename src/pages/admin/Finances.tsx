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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Centro Financiero</h1>
                    <p className="mt-2 text-base font-medium text-foreground/80">
                        Control de ingresos, egresos y proyecciones de rentabilidad.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-2xl hidden md:flex">
                        <Download className="mr-2 h-4 w-4" /> Exportar
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-2xl font-bold shadow-lg shadow-primary/20 cursor-pointer">
                                <Plus className="mr-2 h-4 w-4" /> Nuevo Movimiento
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
                    <Card key={stat.title} className="rounded-3xl border-border bg-card shadow-sm overflow-hidden relative group hover:shadow-md transition-shadow">
                        <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.06]">
                            <stat.icon className={`h-32 w-32 ${stat.color}`} />
                        </div>
                        <CardContent className="p-6 relative z-10">
                            <div className="flex justify-between items-start">
                                <div className={`p-2 rounded-xl mb-4 ${stat.color.replace('text-', 'bg-').replace('-500', '-500/10')}`}>
                                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-sm font-black text-foreground/70 uppercase tracking-widest">{stat.title}</p>
                            <h3 className={`text-3xl sm:text-4xl font-black mt-2 tracking-tighter ${stat.title === 'Balance Neto' ? 'text-primary' : 'text-foreground'}`}>{stat.value}</h3>
                            <div className={`flex items-center gap-1.5 mt-3 text-[11px] font-black uppercase ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {stat.trend.startsWith('+') ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                                {stat.trend} <span className="text-muted-foreground font-semibold ml-1">vs mes anterior</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Card className="xl:col-span-2 rounded-3xl border-border bg-card shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-6 mb-4">
                        <div>
                            <CardTitle className="text-lg font-bold">Flujo de Caja Mensual</CardTitle>
                            <CardDescription className="font-medium">Comparativa de ingresos y gastos operativos</CardDescription>
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

                <Card className="rounded-3xl border-border bg-card shadow-sm">
                    <CardHeader className="border-b border-border/50 pb-6 mb-4">
                        <CardTitle className="text-lg font-bold">Ingresos por Categoría</CardTitle>
                        <CardDescription className="font-medium">Distribución de ventas por servicio</CardDescription>
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
            <Card className="rounded-3xl border-border bg-card shadow-sm overflow-hidden">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/50 pb-6 px-6 pt-6 gap-4">
                    <div>
                        <CardTitle className="text-lg font-bold">Historial de Transacciones</CardTitle>
                        <CardDescription className="font-medium">Registro detallado de ingresos y gastos recientes</CardDescription>
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
                                <tr className="bg-accent/20 text-xs uppercase tracking-widest text-muted-foreground font-black border-b border-border/50">
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4">Concepto</th>
                                    <th className="px-6 py-4">Tipo</th>
                                    <th className="px-6 py-4">Monto</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
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
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ring-1 ${tx.type === 'Ingreso' ? 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20' : 'bg-rose-500/10 text-rose-600 ring-rose-500/20'
                                                    }`}>
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
                                                <div className={`inline-flex items-center gap-1.5 text-xs font-bold ${tx.status === 'Pagado' ? 'text-emerald-500' : 'text-amber-500'
                                                    }`}>
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

