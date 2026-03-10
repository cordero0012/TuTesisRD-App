import React, { useState, useMemo } from "react";
import {
    Users,
    Mail,
    Phone,
    Star,
    ShieldCheck,
    MoreVertical,
    Linkedin,
    Clock,
    Briefcase,
    UserPlus,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Edit3,
    Trash2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
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

const INITIAL_TEAM = [
    { id: 1, name: "Miguel Sánchez", role: "Director Académico", email: "miguel@tutesisrd.com", status: "Activo", avatar: "M", rating: 4.9, activeProjects: 8 },
    { id: 2, name: "Elena Ramos", role: "Soporte Metodológico", email: "elena@tutesisrd.com", status: "En pausa", avatar: "E", rating: 4.8, activeProjects: 3 },
    { id: 3, name: "Carlos Díaz", role: "Redactor Científico", email: "carlos@tutesisrd.com", status: "Activo", avatar: "C", rating: 4.7, activeProjects: 5 },
    { id: 4, name: "Laura Mendez", role: "Especialista Formato", email: "laura@tutesisrd.com", status: "Activo", avatar: "L", rating: 4.9, activeProjects: 6 },
    { id: 5, name: "Roberto Peña", role: "Asesor Estadístico", email: "roberto@tutesisrd.com", status: "Fuera de línea", avatar: "R", rating: 4.6, activeProjects: 0 },
];

export function Team() {
    const [team, setTeam] = useState(INITIAL_TEAM);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("Todos");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newMember, setNewMember] = useState({ name: "", email: "", role: "Redactor Científico" });

    const filteredTeam = useMemo(() => {
        return team.filter(member => {
            const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.role.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "Todos" || member.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [team, searchTerm, statusFilter]);

    const handleInviteMember = () => {
        if (!newMember.name || !newMember.email) return;

        const member = {
            id: team.length + 1,
            ...newMember,
            status: "Activo",
            avatar: newMember.name.charAt(0).toUpperCase(),
            rating: 5.0,
            activeProjects: 0
        };

        setTeam([member, ...team]);
        setNewMember({ name: "", email: "", role: "Redactor Científico" });
        setIsDialogOpen(false);
    };

    const handleDeleteMember = (id: number) => {
        setTeam(team.filter(m => m.id !== id));
    };

    const handleStatusUpdate = (id: number, newStatus: string) => {
        setTeam(team.map(m => m.id === id ? { ...m, status: newStatus } : m));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Equipo de Trabajo</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Gestión de asesores, redactores y personal administrativo.
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-2xl gap-2 font-bold shadow-lg shadow-primary/20">
                            <UserPlus className="mr-2 h-4 w-4" /> Invitar Miembro
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Invitar al Equipo</DialogTitle>
                            <DialogDescription>
                                Agrega un nuevo colaborador. Se enviará una invitación por correo.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Nombre Completo</label>
                                <Input
                                    placeholder="Ej: Ana María Lora"
                                    className="rounded-xl"
                                    value={newMember.name}
                                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Correo Corporativo</label>
                                <Input
                                    placeholder="ana@tutesisrd.com"
                                    type="email"
                                    className="rounded-xl"
                                    value={newMember.email}
                                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Rol Asignado</label>
                                <select
                                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    value={newMember.role}
                                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                                >
                                    <option>Director Académico</option>
                                    <option>Soporte Metodológico</option>
                                    <option>Redactor Científico</option>
                                    <option>Especialista Formato</option>
                                    <option>Asesor Estadístico</option>
                                    <option>Administrativo</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" className="rounded-xl" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button className="rounded-xl" onClick={handleInviteMember}>Enviar Invitación</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre, correo o rol..."
                        className="pl-10 rounded-2xl h-11 bg-card shadow-sm border-border"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="rounded-2xl h-11 px-6 border-border hover:bg-accent hover:text-accent-foreground font-semibold gap-2 transition-all">
                            <Filter className="h-4 w-4" /> {statusFilter === "Todos" ? "Filtros" : statusFilter}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl">
                        <DropdownMenuLabel>Estado del Miembro</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setStatusFilter("Todos")} className="cursor-pointer">Todos los estados</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Activo")} className="cursor-pointer">Activo</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("En pausa")} className="cursor-pointer">En pausa</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Fuera de línea")} className="cursor-pointer">Fuera de línea</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTeam.length > 0 ? (
                    filteredTeam.map((member) => (
                        <Card key={member.id} className="rounded-3xl border-border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 group">
                            <CardContent className="p-0">
                                <div className="h-20 bg-primary/10 w-full relative">
                                    <div className="absolute -bottom-6 left-6">
                                        <div className="h-16 w-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold border-4 border-card ring-1 ring-border/50 shadow-sm">
                                            {member.avatar}
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 flex gap-1">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-card/50 backdrop-blur-md hover:bg-card">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-2xl min-w-[180px]">
                                                <DropdownMenuLabel>Gestión</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleStatusUpdate(member.id, "Activo")}>
                                                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Marcar Activo
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleStatusUpdate(member.id, "En pausa")}>
                                                    <Clock className="h-3.5 w-3.5 text-amber-500" /> Poner en pausa
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleStatusUpdate(member.id, "Fuera de línea")}>
                                                    <XCircle className="h-3.5 w-3.5 text-slate-500" /> Fuera de línea
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                                    <Edit3 className="h-3.5 w-3.5" /> Editar perfil
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 cursor-pointer text-destructive" onClick={() => handleDeleteMember(member.id)}>
                                                    <Trash2 className="h-3.5 w-3.5" /> Remover miembro
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                <div className="pt-8 px-6 pb-6 space-y-5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg text-foreground">{member.name}</h3>
                                            <p className="text-xs font-semibold text-primary uppercase tracking-wider">{member.role}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-accent/50 px-2 py-1 rounded-lg border border-border">
                                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                            <span className="text-sm font-bold text-foreground">{member.rating}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground p-2 rounded-xl bg-accent/30">
                                            <div className="bg-card p-1.5 rounded-md shadow-sm border border-border">
                                                <Mail className="h-3.5 w-3.5" />
                                            </div>
                                            <span className="truncate">{member.email}</span>
                                        </div>
                                        <div className="flex items-center justify-between px-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <div className={`h-2.5 w-2.5 rounded-full ${member.status === 'Activo' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] ring-2 ring-emerald-500/20' :
                                                    member.status === 'En pausa' ? 'bg-amber-500 ring-2 ring-amber-500/20' : 'bg-slate-400 ring-2 ring-slate-400/20'
                                                    }`} />
                                                <span className="font-semibold text-foreground text-xs">{member.status}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                                                <Briefcase className="h-3.5 w-3.5 text-primary" />
                                                <span>{member.activeProjects} proyectos</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-3 border-t border-border/50">
                                        <Button variant="outline" size="sm" className="flex-1 rounded-xl h-9 text-xs font-bold border-border hover:bg-accent transition-all">
                                            Ver Perfil
                                        </Button>
                                        <Button variant="secondary" size="sm" className="flex-1 rounded-xl h-9 text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-all">
                                            Asignar Proyecto
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center space-y-4">
                        <div className="mx-auto h-20 w-20 rounded-full bg-accent/50 flex items-center justify-center">
                            <Users className="h-10 w-10 text-muted-foreground opacity-20" />
                        </div>
                        <h3 className="text-xl font-bold">No se encontraron miembros</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">
                            Intenta ajustar los términos de búsqueda o los filtros para encontrar lo que buscas.
                        </p>
                        <Button
                            variant="link"
                            className="text-primary font-bold"
                            onClick={() => { setSearchTerm(""); setStatusFilter("Todos"); }}
                        >
                            Limpiar todos los filtros
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
