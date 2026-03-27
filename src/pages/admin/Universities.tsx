import React, { useState, useMemo } from "react";
import {
    GraduationCap,
    Search,
    BookOpen,
    FileCheck,
    Layout,
    Settings,
    Plus,
    MoreHorizontal,
    ExternalLink,
    ChevronRight,
    CheckCircle,
    XCircle,
    Clock,
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

const INITIAL_UNIVERSITIES: any[] = [];

export function Universities() {
    const [universities, setUniversities] = useState(INITIAL_UNIVERSITIES);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newUni, setNewUni] = useState({ name: "", acronym: "", style: "Normas APA 7ma Ed." });

    const filteredUniversities = useMemo(() => {
        return universities.filter(uni => {
            return uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                uni.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
                uni.style.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [universities, searchTerm]);

    const handleAddUniversity = () => {
        if (!newUni.name || !newUni.acronym) return;

        const uni = {
            id: universities.length > 0 ? Math.max(...universities.map(u => u.id)) + 1 : 1,
            ...newUni,
            templateStatus: "Revisión Requerida",
            lastUpdate: "Recién añadido",
            activeProjects: 0
        };

        setUniversities([...universities, uni]);
        setNewUni({ name: "", acronym: "", style: "Normas APA 7ma Ed." });
        setIsDialogOpen(false);
    };

    const handleDeleteUniversity = (id: number) => {
        setUniversities(universities.filter(u => u.id !== id));
    };

    const handleStatusUpdate = (id: number, newStatus: string) => {
        setUniversities(universities.map(u =>
            u.id === id ? { ...u, templateStatus: newStatus, lastUpdate: "Recién actualizado" } : u
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-wrap text-foreground">Gestión Universitaria</h1>
                    <p className="mt-2 text-base font-medium text-foreground/80">
                        Repositorio de plantillas institucionales y normativas académicas por universidad.
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-2xl gap-2 font-bold shadow-lg shadow-primary/20 cursor-pointer">
                            <Plus className="mr-2 h-4 w-4" /> Agregar Institución
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Añadir Institución Educativa</DialogTitle>
                            <DialogDescription>
                                Agrega una nueva universidad al compendio de normativas y plantillas.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Nombre de la Institución</label>
                                <Input
                                    placeholder="Ej: Universidad Nacional Pedro Henríquez Ureña"
                                    className="rounded-xl"
                                    value={newUni.name}
                                    onChange={(e) => setNewUni({ ...newUni, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Acrónimo</label>
                                    <Input
                                        placeholder="UNPHU"
                                        className="rounded-xl"
                                        value={newUni.acronym}
                                        onChange={(e) => setNewUni({ ...newUni, acronym: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Normativa / Estilo</label>
                                    <select
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring h-10"
                                        value={newUni.style}
                                        onChange={(e) => setNewUni({ ...newUni, style: e.target.value })}
                                    >
                                        <option>Normas APA 7ma Ed.</option>
                                        <option>Normas Vancouver</option>
                                        <option>Normas Chicago</option>
                                        <option>Normas IEEE</option>
                                        <option>Plantilla Institucional</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" className="rounded-xl cursor-pointer" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button className="rounded-xl cursor-pointer" onClick={handleAddUniversity}>Guardar Institución</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="relative max-w-2xl">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Buscar universidad, acrónimo o normativa de estilo..."
                    className="pl-10 rounded-2xl h-11 bg-card shadow-sm border-border"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredUniversities.length > 0 ? (
                    filteredUniversities.map((uni) => (
                        <Card key={uni.id} className="rounded-3xl border-border bg-card hover:bg-accent/10 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                            <CardHeader className="pb-2 relative pt-6 px-6">
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm border border-border hover:bg-background cursor-pointer">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-2xl min-w-[200px] shadow-xl">
                                            <DropdownMenuLabel>Estado de la Plantilla</DropdownMenuLabel>
                                            <DropdownMenuItem className="gap-2 cursor-pointer font-medium" onClick={() => handleStatusUpdate(uni.id, "Actualizado")}>
                                                <CheckCircle className="h-4 w-4 text-emerald-500" /> Marcar Actualizado
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2 cursor-pointer font-medium" onClick={() => handleStatusUpdate(uni.id, "Revisión Requerida")}>
                                                <Clock className="h-4 w-4 text-amber-500" /> Requiere Revisión
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2 cursor-pointer font-medium" onClick={() => handleStatusUpdate(uni.id, "Desactualizado")}>
                                                <XCircle className="h-4 w-4 text-rose-500" /> Marcar Desactualizado
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="gap-2 cursor-pointer font-medium">
                                                <Edit3 className="h-4 w-4" /> Editar institución
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="gap-2 cursor-pointer font-medium text-destructive" onClick={() => handleDeleteUniversity(uni.id)}>
                                                <Trash2 className="h-4 w-4" /> Remover institución
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shadow-inner group-hover:bg-primary group-hover:text-white group-hover:scale-105 transition-all duration-500 ring-4 ring-background">
                                        {uni.acronym.substring(0, 2)}
                                    </div>
                                    <div className={`mt-2 text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ring-1 transition-colors ${uni.templateStatus === 'Actualizado' ? 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20' :
                                            uni.templateStatus === 'Revisión Requerida' ? 'bg-amber-500/10 text-amber-600 ring-amber-500/20' :
                                                'bg-rose-500/10 text-rose-600 ring-rose-500/20'
                                        }`}>
                                    {uni.templateStatus}
                                    </div>
                                </div>
                                <CardTitle className="text-xl font-black mt-2 leading-tight pr-8 text-foreground">{uni.name}</CardTitle>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs font-black text-primary uppercase tracking-widest">{uni.style}</span>
                                    <span className="text-foreground/60 text-[11px] font-bold">• Acrónimo: {uni.acronym}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 px-6 pb-6 pt-2">
                                <div className="flex items-center justify-between text-xs text-muted-foreground bg-accent/30 p-3 rounded-xl border border-border/50">
                                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                                        <BookOpen className="h-3.5 w-3.5 text-primary" />
                                        <span>{uni.activeProjects} Proyectos</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 font-medium">
                                        <Settings className="h-3.5 w-3.5" />
                                        <span>v2.1.0 • {uni.lastUpdate}</span>
                                    </div>
                                </div>

                                <div className="pt-2 flex gap-2">
                                    <Button variant="outline" className="flex-1 rounded-xl h-9 text-xs font-bold gap-2 cursor-pointer hover:bg-primary/5 hover:text-primary transition-colors border-border">
                                        <FileCheck className="h-3.5 w-3.5" /> Ver Plantilla
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl bg-accent/50 hover:bg-primary hover:text-white cursor-pointer transition-colors shadow-sm">
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-16 text-center space-y-4 border-2 border-dashed border-border rounded-3xl bg-accent/5">
                        <div className="mx-auto h-20 w-20 rounded-full bg-accent/50 flex items-center justify-center">
                            <Search className="h-10 w-10 text-muted-foreground opacity-20" />
                        </div>
                        <h3 className="text-xl font-bold">No se encontraron instituciones</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">
                            Intenta ajustar los términos de búsqueda o agrega una nueva universidad a la base de datos.
                        </p>
                        <Button
                            variant="link"
                            className="text-primary font-bold cursor-pointer"
                            onClick={() => setSearchTerm("")}
                        >
                            Limpiar búsqueda
                        </Button>
                    </div>
                )}
            </div>

            <Card className="rounded-3xl border-border border-dashed bg-gradient-to-br from-primary/5 to-transparent p-8 text-center transition-all hover:border-primary/30 hover:shadow-sm">
                <div className="max-w-md mx-auto space-y-4">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-inner ring-4 ring-background">
                        <Layout className="h-8 w-8 text-primary opacity-80" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground">¿Falta alguna institución?</h3>
                    <p className="text-sm text-muted-foreground">Solicita al equipo de soporte la creación de una nueva plantilla basada en manuales institucionales actualizados.</p>
                    <Button variant="outline" className="rounded-2xl gap-2 font-bold cursor-pointer hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all">
                        Contactar Soporte Académico <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </Card>
        </div>
    );
}
