import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    Clock,
    FileText,
    Trash2,
    Edit3,
    CheckCircle,
    ExternalLink,
    RefreshCw,
    Loader,
    Columns,
    LayoutGrid,
} from "lucide-react";
import { KanbanBoard } from "@/components/admin/KanbanBoard";
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
import {
    fetchProjects,
    createProject,
    deleteProject,
    updateProjectStatus,
    AdminProject,
} from "@/services/admin/adminDataService";
import { supabase } from "@/supabaseClient";

// ---- Status helpers ----
const STATUS_MAP: Record<string, { label: string; cls: string }> = {
    pending:    { label: "Pendiente", cls: "bg-slate-500/10  text-slate-600  dark:text-slate-400  ring-1 ring-slate-500/20" },
    assigned:   { label: "Asignado",  cls: "bg-blue-500/10   text-blue-700   dark:text-blue-400   ring-1 ring-blue-500/20" },
    in_progress:{ label: "En curso",  cls: "bg-blue-500/10   text-blue-700   dark:text-blue-400   ring-1 ring-blue-500/20" },
    review:     { label: "Revisión",  cls: "bg-amber-500/10  text-amber-700  dark:text-amber-400  ring-1 ring-amber-500/20" },
    completed:  { label: "Entregado", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/20" },
};

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_MAP[status] || { label: status, cls: "badge-slate" };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${cfg.cls}`}>
            {cfg.label}
        </span>
    );
}

export function Projects() {
    const [projects, setProjects] = useState<AdminProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("Todos");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"kanban" | "grid">("kanban");
    const [newProject, setNewProject] = useState({ title: "", client: "", type: "Tesis", due_date: "" });

    const loadProjects = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchProjects();
            setProjects(data);
        } catch (err: any) {
            setError(err?.message || "Error al cargar proyectos");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadProjects(); }, [loadProjects]);

    // Real-time: auto-refresh when a new project is inserted from the public form
    useEffect(() => {
        const channel = supabase
            .channel("admin_projects_realtime")
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "projects" }, () => {
                loadProjects();
            })
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [loadProjects]);

    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            const statusCfg = STATUS_MAP[p.status];
            const statusLabel = statusCfg?.label || p.status;
            const clientName = p.students ? `${p.students.name} ${p.students.lastname}` : "";
            const matchesSearch =
                (p.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.tracking_code || "").toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "Todos" || statusLabel === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [projects, searchTerm, statusFilter]);

    const handleCreateProject = async () => {
        if (!newProject.title) return;
        try {
            setSaving(true);
            const created = await createProject({
                title: newProject.title,
                type: newProject.type,
                due_date: newProject.due_date || undefined,
            });
            setProjects(prev => [created, ...prev]);
            setNewProject({ title: "", client: "", type: "Tesis", due_date: "" });
            setIsDialogOpen(false);
        } catch (err: any) {
            alert(`Error al crear proyecto: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteProject = async (id: string) => {
        if (!confirm("¿Eliminar este proyecto? Esta acción no se puede deshacer.")) return;
        try {
            await deleteProject(id);
            setProjects(prev => prev.filter(p => p.id !== id));
        } catch (err: any) {
            alert(`Error al eliminar: ${err.message}`);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await updateProjectStatus(id, newStatus);
            setProjects(prev => prev.map(p => p.id === id ? {
                ...p,
                status: newStatus,
                progress_percent: newStatus === "completed" ? 100 : p.progress_percent
            } : p));
        } catch (err: any) {
            alert(`Error al actualizar estado: ${err.message}`);
        }
    };

    const handleDragEnd = async (result: any) => {
        if (!result.destination) return;
        
        const sourceStatus = result.source.droppableId;
        const destStatus = result.destination.droppableId;
        const projectId = result.draggableId;
        
        if (sourceStatus === destStatus) return;
        
        // Optimistic update
        setProjects(prev => prev.map(p => p.id === projectId ? {
            ...p,
            status: destStatus,
            progress_percent: destStatus === "completed" ? 100 : p.progress_percent
        } : p));
        
        // Server update
        try {
            await updateProjectStatus(projectId, destStatus);
        } catch (err: any) {
            // Revert on error
            loadProjects();
            alert(`Error al mover proyecto: ${err.message}`);
        }
    };

    const kanbanColumns = useMemo(() => [
        { id: 'pending', title: 'Pendientes', projects: filteredProjects.filter(p => p.status === 'pending') },
        { id: 'assigned', title: 'Asignados', projects: filteredProjects.filter(p => p.status === 'assigned') },
        { id: 'in_progress', title: 'En Curso', projects: filteredProjects.filter(p => p.status === 'in_progress') },
        { id: 'review', title: 'Revisión', projects: filteredProjects.filter(p => p.status === 'review') },
        { id: 'completed', title: 'Completados', projects: filteredProjects.filter(p => p.status === 'completed') }
    ], [filteredProjects]);

    return (
        <div className="space-y-6">
            {/* Header actions */}
            <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" className="rounded-xl h-9 hidden md:flex items-center gap-2" onClick={loadProjects}>
                        <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl h-9 text-sm font-semibold gap-2">
                                <Plus className="h-3.5 w-3.5" /> Nuevo Proyecto
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
                                    <label htmlFor="project-title" className="text-xs font-bold uppercase text-muted-foreground">Nombre del Proyecto</label>
                                    <Input
                                        id="project-title"
                                        placeholder="Ej: Análisis Cuantitativo UASD"
                                        className="rounded-xl"
                                        value={newProject.title}
                                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="project-type" className="text-xs font-bold uppercase text-muted-foreground">Tipo</label>
                                        <select
                                            id="project-type"
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
                                        <label htmlFor="project-due" className="text-xs font-bold uppercase text-muted-foreground">Fecha de Entrega</label>
                                        <Input
                                            id="project-due"
                                            type="date"
                                            className="rounded-xl"
                                            value={newProject.due_date}
                                            onChange={(e) => setNewProject({ ...newProject, due_date: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" className="rounded-xl" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                                <Button className="rounded-xl" onClick={handleCreateProject} disabled={saving}>
                                    {saving ? <><Loader className="mr-2 h-4 w-4 animate-spin" />Creando...</> : "Crear Proyecto"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/30 p-2 rounded-2xl backdrop-blur-sm border border-border/40">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre, cliente o código..."
                        className="pl-10 rounded-xl h-10 w-full bg-background/50 border-border/50 focus:border-primary/50 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-background/50 rounded-xl border border-border/50 p-1">
                        <Button 
                            variant="ghost" 
                            size="icon"
                            className={`h-8 w-8 rounded-lg ${viewMode === 'kanban' ? 'bg-primary/20 text-primary shadow-sm' : 'text-muted-foreground'}`}
                            onClick={() => setViewMode("kanban")}
                        >
                            <Columns className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon"
                            className={`h-8 w-8 rounded-lg ${viewMode === 'grid' ? 'bg-primary/20 text-primary shadow-sm' : 'text-muted-foreground'}`}
                            onClick={() => setViewMode("grid")}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded-xl h-10 px-4 border-border/50 bg-background/60 hover:bg-accent font-semibold gap-2 transition-all">
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
            </div>

            {/* Project Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-52 rounded-2xl bg-accent/30" />
                    ))}
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <p className="text-destructive font-semibold">{error}</p>
                    <Button onClick={loadProjects} variant="outline" className="rounded-2xl">Reintentar</Button>
                </div>
            ) : viewMode === "kanban" ? (
                <KanbanBoard 
                    columns={kanbanColumns} 
                    onDragEnd={handleDragEnd} 
                    onProjectClick={(id) => console.log('Abrir detalle proyecto', id)} 
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => {
                            const clientName = project.students
                                ? `${project.students.name} ${project.students.lastname}`
                                : "Sin cliente";
                            const statusCfg = STATUS_MAP[project.status] || STATUS_MAP["pending"];
                            const barColor = project.status === "completed" ? "bg-emerald-500"
                                : project.status === "review" ? "bg-amber-500"
                                : project.status === "pending" ? "bg-slate-500"
                                : "bg-primary";
                            return (
                                <Card key={project.id} className="rounded-2xl border-border/50 bg-card/60 backdrop-blur-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                                    <div className={`h-1.5 w-full ${barColor}`} />
                                    <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0 relative z-10">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <span className="text-xs font-black uppercase text-primary tracking-widest">{project.type || "Proyecto"}</span>
                                            </div>
                                            <CardTitle className="text-xl font-black leading-tight pt-2 text-foreground">
                                                {project.title || project.tracking_code}
                                            </CardTitle>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 hover:bg-accent ring-1 ring-border/20 shadow-sm bg-card/80 backdrop-blur-md">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-2xl min-w-[180px]">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleStatusUpdate(project.id, "review")}>
                                                    <Clock className="h-3.5 w-3.5" /> Enviar a revisión
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 cursor-pointer text-emerald-600 font-semibold" onClick={() => handleStatusUpdate(project.id, "completed")}>
                                                    <CheckCircle className="h-3.5 w-3.5" /> Marcar entregado
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="gap-2 cursor-pointer text-destructive" onClick={() => handleDeleteProject(project.id)}>
                                                    <Trash2 className="h-3.5 w-3.5" /> Eliminar proyecto
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardHeader>
                                    <CardContent className="pt-4 relative z-10">
                                        <div className="space-y-5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold border border-border/50">
                                                        {clientName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-foreground">{clientName}</p>
                                                        <p className="text-xs font-bold text-foreground/60 tracking-tight">Código: {project.tracking_code}</p>
                                                    </div>
                                                </div>
                                                <StatusBadge status={project.status} />
                                            </div>
                                            <div className="space-y-2.5">
                                                <div className="flex justify-between text-xs font-black">
                                                    <span className="text-foreground/70 uppercase tracking-tighter">Progreso del proyecto</span>
                                                    <span className="text-primary">{project.progress_percent}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-accent/50 rounded-full overflow-hidden shadow-inner">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${project.progress_percent === 100 ? "bg-emerald-500" : "bg-primary"}`}
                                                        style={{ width: `${project.progress_percent}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="pt-4 flex items-center justify-between border-t border-border/40">
                                                <div className="flex items-center gap-2 text-xs font-bold text-foreground/80">
                                                    <Clock className="h-4 w-4 text-primary" />
                                                    <span>Entrega: <span className="text-foreground font-black">
                                                        {project.due_date ? new Date(project.due_date).toLocaleDateString("es-DO") : "TBD"}
                                                    </span></span>
                                                </div>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="h-8 rounded-xl text-xs font-bold bg-accent/30 hover:bg-primary/20 hover:text-primary transition-all gap-1.5"
                                                >
                                                    Ver detalles <ExternalLink className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                    
                                    {/* Subdued ambient glow for card (Glassmorphism highlight) */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                                </Card>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-20 text-center space-y-4 bg-card/30 backdrop-blur-sm rounded-3xl border border-border/40">
                            <div className="mx-auto h-20 w-20 rounded-full bg-background flex items-center justify-center shadow-inner border border-border/50">
                                <Search className="h-10 w-10 text-muted-foreground opacity-40" />
                            </div>
                            <h3 className="text-xl font-bold">No se encontraron proyectos</h3>
                            <p className="text-muted-foreground text-sm max-w-md mx-auto">
                                Intenta ajustar los términos de búsqueda o los filtros para encontrar lo que buscas.
                            </p>
                            <Button
                                variant="outline"
                                className="font-bold rounded-xl border-border/50 bg-background/50 hover:bg-accent"
                                onClick={() => { setSearchTerm(""); setStatusFilter("Todos"); }}
                            >
                                Limpiar todos los filtros
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
