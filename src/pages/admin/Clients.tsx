import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
    Users,
    Search,
    UserPlus,
    MessageSquare,
    History,
    MoreHorizontal,
    GraduationCap,
    ShieldAlert,
    Download,
    Filter,
    CheckCircle,
    Clock,
    XCircle,
    Edit3,
    Trash2,
    Loader,
    RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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
import {
    fetchStudents,
    createStudent,
    deleteStudent,
    AdminStudent,
    getStudentDisplayStatus,
    formatRelativeTime,
} from "@/services/admin/adminDataService";

export function Clients() {
    const [students, setStudents] = useState<AdminStudent[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("Todos");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newClient, setNewClient] = useState({ name: "", lastname: "", email: "", university: "UASD" });

    const loadStudents = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchStudents();
            setStudents(data);
        } catch (err: any) {
            setError(err?.message || "Error al cargar los clientes");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadStudents(); }, [loadStudents]);

    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const fullName = `${s.name} ${s.lastname}`;
            const matchesSearch =
                fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (s.university || "").toLowerCase().includes(searchTerm.toLowerCase());
            const status = getStudentDisplayStatus(s.projects);
            const matchesStatus = statusFilter === "Todos" || status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [students, searchTerm, statusFilter]);

    const handleCreateClient = async () => {
        if (!newClient.name || !newClient.email || !newClient.lastname) return;
        try {
            setSaving(true);
            const created = await createStudent(newClient);
            setStudents(prev => [created, ...prev]);
            setNewClient({ name: "", lastname: "", email: "", university: "UASD" });
            setIsDialogOpen(false);
        } catch (err: any) {
            alert(`Error al crear cliente: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClient = async (id: string) => {
        if (!confirm("¿Eliminar este cliente? Esta acción no se puede deshacer.")) return;
        try {
            await deleteStudent(id);
            setStudents(prev => prev.filter(s => s.id !== id));
        } catch (err: any) {
            alert(`Error al eliminar: ${err.message}`);
        }
    };

    const statusBadgeClass = (status: string) => {
        if (status === "Activo") return "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20";
        if (status === "Pendiente Pago") return "bg-amber-500/10 text-amber-600 ring-amber-500/20";
        return "bg-slate-500/10 text-slate-600 ring-slate-500/20";
    };

    const statusDotClass = (status: string) => {
        if (status === "Activo") return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]";
        if (status === "Pendiente Pago") return "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]";
        return "bg-slate-500";
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Directorio de Clientes</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Gestión centralizada de estudiantes, investigadores y tesistas.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-2xl hidden md:flex items-center" onClick={loadStudents}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Actualizar
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-2xl font-bold shadow-lg shadow-primary/20 cursor-pointer">
                                <UserPlus className="mr-2 h-4 w-4" /> Nuevo Cliente
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Registrar Nuevo Cliente</DialogTitle>
                                <DialogDescription>
                                    Crea un nuevo perfil de investigador en el sistema.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="client-name" className="text-xs font-bold uppercase text-muted-foreground">Nombre</label>
                                        <Input
                                            id="client-name"
                                            placeholder="Ej: Laura"
                                            className="rounded-xl"
                                            value={newClient.name}
                                            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="client-lastname" className="text-xs font-bold uppercase text-muted-foreground">Apellido</label>
                                        <Input
                                            id="client-lastname"
                                            placeholder="Ej: Castro"
                                            className="rounded-xl"
                                            value={newClient.lastname}
                                            onChange={(e) => setNewClient({ ...newClient, lastname: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="client-email" className="text-xs font-bold uppercase text-muted-foreground">Correo de Contacto</label>
                                    <Input
                                        id="client-email"
                                        placeholder="laura@ejemplo.com"
                                        type="email"
                                        className="rounded-xl"
                                        value={newClient.email}
                                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="client-university" className="text-xs font-bold uppercase text-muted-foreground">Universidad</label>
                                    <select
                                        id="client-university"
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        value={newClient.university}
                                        onChange={(e) => setNewClient({ ...newClient, university: e.target.value })}
                                    >
                                        <option>UASD</option>
                                        <option>PUCMM</option>
                                        <option>UNIBE</option>
                                        <option>INTEC</option>
                                        <option>UNPHU</option>
                                        <option>APEC</option>
                                        <option>UAPA</option>
                                        <option>Otra</option>
                                    </select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" className="rounded-xl cursor-pointer" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                                <Button className="rounded-xl cursor-pointer" onClick={handleCreateClient} disabled={saving}>
                                    {saving ? <><Loader className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : "Registrar Cliente"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre, correo o universidad..."
                        className="pl-10 rounded-2xl h-11 bg-card shadow-sm border-border"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="rounded-2xl h-11 px-6 border-border hover:bg-accent hover:text-accent-foreground font-semibold gap-2 transition-all cursor-pointer">
                            <Filter className="h-4 w-4" /> {statusFilter === "Todos" ? "Filtros" : statusFilter}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl">
                        <DropdownMenuLabel>Estado del Cliente</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setStatusFilter("Todos")} className="cursor-pointer">Todos los estados</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Activo")} className="cursor-pointer">Activo</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Pendiente Pago")} className="cursor-pointer">Pendiente Pago</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Finalizado")} className="cursor-pointer">Finalizado</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Sin proyectos")} className="cursor-pointer">Sin proyectos</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Table */}
            <Card className="rounded-3xl border-border bg-card overflow-hidden shadow-sm">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-accent/30 text-xs uppercase tracking-wider text-muted-foreground font-semibold border-b border-border/50">
                                    <th className="px-6 py-4">Cliente</th>
                                    <th className="px-6 py-4">Universidad</th>
                                    <th className="px-6 py-4">Proyectos</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4">Registro</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {loading ? (
                                    [...Array(4)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            {[...Array(6)].map((_, j) => (
                                                <td key={j} className="px-6 py-4">
                                                    <div className="h-4 bg-accent/50 rounded-full w-3/4" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : error ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-destructive">
                                            {error}
                                            <Button variant="link" className="ml-2" onClick={loadStudents}>Reintentar</Button>
                                        </td>
                                    </tr>
                                ) : filteredStudents.length > 0 ? (
                                    filteredStudents.map((s) => {
                                        const status = getStudentDisplayStatus(s.projects);
                                        const initials = `${s.name[0]}${s.lastname[0]}`.toUpperCase();
                                        return (
                                            <tr key={s.id} className="hover:bg-accent/20 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shadow-sm ring-1 ring-primary/20">
                                                            {initials}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-foreground">{s.name} {s.lastname}</span>
                                                            <span className="text-xs text-muted-foreground">{s.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 bg-accent rounded-md border border-border">
                                                            <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                                                        </div>
                                                        <span className="text-sm font-medium">{s.university || "—"}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-sm font-bold">{(s.projects || []).length}</span>
                                                        <span className="text-xs text-muted-foreground">Investigaciones</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase ring-1 ${statusBadgeClass(status)}`}>
                                                        <div className={`h-1.5 w-1.5 rounded-full ${statusDotClass(status)}`} />
                                                        {status}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                        <History className="h-3.5 w-3.5 opacity-70" />
                                                        <span>{formatRelativeTime(s.created_at)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary border border-transparent transition-all cursor-pointer">
                                                            <MessageSquare className="h-4 w-4" />
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-accent border border-transparent transition-all cursor-pointer">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-2xl min-w-[180px]">
                                                                <DropdownMenuLabel>Acciones de Cliente</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="gap-2 cursor-pointer text-destructive" onClick={() => handleDeleteClient(s.id)}>
                                                                    <Trash2 className="h-3.5 w-3.5" /> Eliminar cliente
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="h-16 w-16 rounded-full bg-accent/50 flex items-center justify-center">
                                                    <Search className="h-8 w-8 opacity-20" />
                                                </div>
                                                <p className="font-semibold text-foreground">No se encontraron clientes</p>
                                                <p className="text-xs">No hay resultados para los filtros actuales.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Bottom widgets */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card className="rounded-3xl border-border bg-gradient-to-br from-primary/5 to-transparent border-primary/20 shadow-sm">
                    <CardContent className="p-6 flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-amber-500/10 flex items-center justify-center ring-1 ring-amber-500/20">
                            <ShieldAlert className="h-8 w-8 text-amber-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-foreground">Resumen de Cartera</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {students.filter(s => getStudentDisplayStatus(s.projects) === "Pendiente Pago").length} clientes con pagos pendientes.
                            </p>
                            <Button variant="link" className="p-0 h-auto text-amber-600 font-bold mt-2 hover:text-amber-700 cursor-pointer">
                                Ver detalles →
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border-border bg-card shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-bold">Total de Clientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-primary">{students.length}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {students.filter(s => getStudentDisplayStatus(s.projects) === "Activo").length} activos · {students.filter(s => getStudentDisplayStatus(s.projects) === "Finalizado").length} finalizados
                        </p>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
