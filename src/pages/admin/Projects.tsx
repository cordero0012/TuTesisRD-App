import React, { useState, useMemo } from "react";
import {
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    Clock,
    User,
    CheckCircle2,
    AlertCircle,
    FileText,
    Trash2,
    Edit3,
    CheckCircle,
    ExternalLink
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
import { Separator } from "@/components/ui/Separator";

const INITIAL_PROJECTS = [
    { id: 1, name: "Tesis Doctoral - Educación", client: "Juan Pérez", status: "En curso", deadLine: "20 Mar 2026", progress: 65, type: "Tesis" },
    { id: 2, name: "TFM - Inteligencia Artificial", client: "María García", status: "Revisión", deadLine: "15 Mar 2026", progress: 90, type: "TFM" },
    { id: 3, name: "Monográfico - Derecho Civil", client: "Carlos Ruiz", status: "Pendiente", deadLine: "25 Mar 2026", progress: 10, type: "Monográfico" },
    { id: 4, name: "Doctorado - Psicología", client: "Ana Beltrén", status: "Entregado", deadLine: "05 Mar 2026", progress: 100, type: "Tesis" },
    { id: 5, name: "Plan de Negocios - Startup", client: "Roberto Gómez", status: "En curso", deadLine: "30 Mar 2026", progress: 40, type: "Consultoría" },
];

export function Projects() {
    const [projects, setProjects] = useState(INITIAL_PROJECTS);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("Todos");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newProject, setNewProject] = useState({ name: "", client: "", type: "Tesis", deadLine: "" });

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.client.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "Todos" || project.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [projects, searchTerm, statusFilter]);

    const handleCreateProject = () => {
        if (!newProject.name || !newProject.client) return;

        const project = {
            id: projects.length + 1,
            ...newProject,
            status: "Pendiente",
            progress: 0,
            deadLine: newProject.deadLine || "TBD"
        };

        setProjects([project, ...projects]);
        setNewProject({ name: "", client: "", type: "Tesis", deadLine: "" });
        setIsDialogOpen(false);
    };

    const handleDeleteProject = (id: number) => {
        setProjects(projects.filter(p => p.id !== id));
    };

    const handleStatusUpdate = (id: number, newStatus: string) => {
        setProjects(projects.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    status: newStatus,
                    progress: newStatus === "Entregado" ? 100 : p.progress
                };
            }
            return p;
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground text-wrap">Gestión de Proyectos</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Administra y supervisa el progreso de todas las investigaciones activas.
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-2xl gap-2 font-bold shadow-lg shadow-primary/20">
                            <Plus className="h-4 w-4" /> Nuevo Proyecto
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
                            <DialogDescription>
                                Completa la información básica para iniciar la gestión del proyecto.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Nombre del Proyecto</label>
                                <Input
                                    placeholder="Ej: Análisis Cuantitativo UASD"
                                    className="rounded-xl"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Nombre del Cliente</label>
                                <Input
                                    placeholder="Nombre completo"
                                    className="rounded-xl"
                                    value={newProject.client}
                                    onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Tipo</label>
                                    <select
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        value={newProject.type}
                                        onChange={(e) => setNewProject({ ...newProject, type: e.target.value })}
                                    >
                                        <option>Tesis</option>
                                        <option>TFM</option>
                                        <option>Monográfico</option>
                                        <option>Consultoría</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Fecha de Entrega</label>
                                    <Input
                                        type="date"
                                        className="rounded-xl"
                                        value={newProject.deadLine}
                                        onChange={(e) => setNewProject({ ...newProject, deadLine: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" className="rounded-xl" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button className="rounded-xl" onClick={handleCreateProject}>Crear Proyecto</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre o cliente..."
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
                        <DropdownMenuLabel>Estado del Proyecto</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setStatusFilter("Todos")} className="cursor-pointer">Todos los estados</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("En curso")} className="cursor-pointer">En curso</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Revisión")} className="cursor-pointer">En revisión</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Pendiente")} className="cursor-pointer">Pendientes</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("Entregado")} className="cursor-pointer">Entregados</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                        <Card key={project.id} className="rounded-3xl border-border bg-card hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 group overflow-hidden">
                            <div className={`h-1.5 w-full ${project.status === 'Entregado' ? 'bg-emerald-500' :
                                    project.status === 'Revisión' ? 'bg-amber-500' :
                                        project.status === 'Pendiente' ? 'bg-slate-500' :
                                            'bg-primary'
                                }`} />
                            <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <FileText className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{project.type}</span>
                                    </div>
                                    <CardTitle className="text-lg font-bold leading-tight pt-2">{project.name}</CardTitle>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 hover:bg-accent">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-2xl min-w-[180px]">
                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleStatusUpdate(project.id, "Revisión")}>
                                            <Clock className="h-3.5 w-3.5" /> Enviar a revisión
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="gap-2 cursor-pointer text-emerald-600 font-semibold" onClick={() => handleStatusUpdate(project.id, "Entregado")}>
                                            <CheckCircle className="h-3.5 w-3.5" /> Marcar entregado
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="gap-2 cursor-pointer">
                                            <Edit3 className="h-3.5 w-3.5" /> Editar detalles
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="gap-2 cursor-pointer text-destructive" onClick={() => handleDeleteProject(project.id)}>
                                            <Trash2 className="h-3.5 w-3.5" /> Eliminar proyecto
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold border border-border">
                                                {project.client.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-foreground">{project.client}</p>
                                                <p className="text-[10px] text-muted-foreground">Asignado a: Admin</p>
                                            </div>
                                        </div>
                                        <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ring-1 ${project.status === 'Entregado' ? 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20' :
                                                project.status === 'Revisión' ? 'bg-amber-500/10 text-amber-600 ring-amber-500/20' :
                                                    project.status === 'Pendiente' ? 'bg-slate-500/10 text-slate-600 ring-slate-500/20' :
                                                        'bg-primary/10 text-primary ring-primary/20'
                                            }`}>
                                            {project.status}
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        <div className="flex justify-between text-[11px] font-bold">
                                            <span className="text-muted-foreground uppercase tracking-tight">Progreso del proyecto</span>
                                            <span className="text-primary">{project.progress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-accent/50 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${project.progress === 100 ? 'bg-emerald-500' : 'bg-primary'
                                                    }`}
                                                style={{ width: `${project.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-3 flex items-center justify-between border-t border-border/40">
                                        <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
                                            <Clock className="h-3.5 w-3.5 text-primary opacity-70" />
                                            <span>Deadline: <span className="text-foreground">{project.deadLine}</span></span>
                                        </div>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="h-8 rounded-xl text-xs font-bold bg-accent/50 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all gap-1.5"
                                        >
                                            Ver detalles <ExternalLink className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center space-y-4">
                        <div className="mx-auto h-20 w-20 rounded-full bg-accent/50 flex items-center justify-center">
                            <Search className="h-10 w-10 text-muted-foreground opacity-20" />
                        </div>
                        <h3 className="text-xl font-bold">No se encontraron proyectos</h3>
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
