import React, { useState, useMemo } from "react";
import {
    Users,
    Search,
    UserPlus,
    MessageSquare,
    Mail,
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
    Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
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

const INITIAL_CLIENTS = [
    { id: 1, name: "Ana Isabel Martínez", university: "UASD", projectCount: 2, status: "Activo", email: "ana.m@email.com", lastContact: "Hoy, 10:30 AM" },
    { id: 2, name: "José Manuel Polanco", university: "PUCMM", projectCount: 1, status: "Pendiente Pago", email: "jose.p@email.com", lastContact: "Ayer" },
    { id: 3, name: "Katherine Sosa", university: "UNIBE", projectCount: 3, status: "Activo", email: "kathy.s@email.com", lastContact: "Hace 2 días" },
    { id: 4, name: "Ricardo Tavarez", university: "INTEC", projectCount: 1, status: "Finalizado", email: "rtav@email.com", lastContact: "Hace 1 semana" },
    { id: 5, name: "Lisbeth Pérez", university: "UAPA", projectCount: 2, status: "Activo", email: "lperez@email.com", lastContact: "Hoy, 09:15 AM" },
];

export function Clients() {
    const [clients, setClients] = useState(INITIAL_CLIENTS);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("Todos");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newClient, setNewClient] = useState({ name: "", email: "", university: "UASD" });

    const filteredClients = useMemo(() => {
        return clients.filter(client => {
            const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.university.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "Todos" || client.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [clients, searchTerm, statusFilter]);

    const handleCreateClient = () => {
        if (!newClient.name || !newClient.email) return;

        const client = {
            id: clients.length + 1,
            ...newClient,
            projectCount: 0,
            status: "Pendiente Pago",
            lastContact: "Recién añadido"
        };

        setClients([client, ...clients]);
        setNewClient({ name: "", email: "", university: "UASD" });
        setIsDialogOpen(false);
    };

    const handleDeleteClient = (id: number) => {
        setClients(clients.filter(c => c.id !== id));
    };

    const handleStatusUpdate = (id: number, newStatus: string) => {
        setClients(clients.map(c => c.id === id ? { ...c, status: newStatus } : c));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Directorio de Clientes</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Gestión centralizada de estudiantes, investigadores y tesistas.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-2xl hidden md:flex items-center">
                        <Download className="mr-2 h-4 w-4" /> Exportar
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
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Nombre Completo</label>
                                    <Input
                                        placeholder="Ej: Laura Castro"
                                        className="rounded-xl"
                                        value={newClient.name}
                                        onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Correo de Contacto</label>
                                    <Input
                                        placeholder="laura@ejemplo.com"
                                        type="email"
                                        className="rounded-xl"
                                        value={newClient.email}
                                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Universidad</label>
                                    <select
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
                                <Button className="rounded-xl cursor-pointer" onClick={handleCreateClient}>Registrar Cliente</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

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
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

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
                                    <th className="px-6 py-4">Último Contacto</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {filteredClients.length > 0 ? (
                                    filteredClients.map((client) => (
                                        <tr key={client.id} className="hover:bg-accent/20 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shadow-sm ring-1 ring-primary/20">
                                                        {client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-foreground">{client.name}</span>
                                                        <span className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">{client.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-accent rounded-md border border-border">
                                                        <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-sm font-medium">{client.university}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-bold">{client.projectCount}</span>
                                                    <span className="text-xs text-muted-foreground">Investigaciones</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase ring-1 ${client.status === 'Activo' ? 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20' :
                                                        client.status === 'Pendiente Pago' ? 'bg-amber-500/10 text-amber-600 ring-amber-500/20' :
                                                            'bg-slate-500/10 text-slate-600 ring-slate-500/20'
                                                    }`}>
                                                    <div className={`h-1.5 w-1.5 rounded-full ${client.status === 'Activo' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                                            client.status === 'Pendiente Pago' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                                                                'bg-slate-500'
                                                        }`} />
                                                    {client.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                    <History className="h-3.5 w-3.5 opacity-70" />
                                                    <span>{client.lastContact}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary/20 border border-transparent transition-all cursor-pointer">
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
                                                            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleStatusUpdate(client.id, "Activo")}>
                                                                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Marcar Activo
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleStatusUpdate(client.id, "Pendiente Pago")}>
                                                                <Clock className="h-3.5 w-3.5 text-amber-500" /> Pendiente Pago
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleStatusUpdate(client.id, "Finalizado")}>
                                                                <XCircle className="h-3.5 w-3.5 text-slate-500" /> Finalizar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="gap-2 cursor-pointer">
                                                                <Edit3 className="h-3.5 w-3.5" /> Editar perfil
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 cursor-pointer text-destructive" onClick={() => handleDeleteClient(client.id)}>
                                                                <Trash2 className="h-3.5 w-3.5" /> Eliminar cliente
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

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card className="rounded-3xl border-border bg-gradient-to-br from-primary/5 to-transparent border-primary/20 shadow-sm transition-all hover:shadow-md hover:border-primary/40">
                    <CardContent className="p-6 flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-amber-500/10 flex items-center justify-center ring-1 ring-amber-500/20">
                            <ShieldAlert className="h-8 w-8 text-amber-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-foreground">Reporte de Auditoría</h3>
                            <p className="text-sm text-muted-foreground mt-1">Existen 3 clientes con pagos próximos a vencer en semana actual.</p>
                            <Button variant="link" className="p-0 h-auto text-amber-600 font-bold mt-2 hover:text-amber-700 cursor-pointer">Revisar Alertas →</Button>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-3xl border-border bg-card shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-bold">Crecimiento de Cartera</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-2 h-20">
                            <div className="w-full bg-primary/10 rounded-t-lg h-[40%] transition-all hover:bg-primary/20 cursor-pointer"></div>
                            <div className="w-full bg-primary/20 rounded-t-lg h-[60%] transition-all hover:bg-primary/30 cursor-pointer"></div>
                            <div className="w-full bg-primary/40 rounded-t-lg h-[80%] transition-all hover:bg-primary/50 cursor-pointer"></div>
                            <div className="w-full bg-primary/60 rounded-t-lg h-[70%] transition-all hover:bg-primary/70 cursor-pointer"></div>
                            <div className="w-full bg-primary rounded-t-lg h-[100%] transition-all hover:bg-primary/90 cursor-pointer relative group">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    +12
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-center mt-3 font-semibold text-muted-foreground uppercase tracking-widest">Nuevos clientes (5 meses)</p>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
