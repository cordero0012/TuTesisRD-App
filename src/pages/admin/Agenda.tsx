import React, { useState, useMemo } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    Bell,
    CheckCircle2,
    CalendarCheck,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    Edit3,
    Trash2,
    CalendarIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Calendar as CalendarComponent } from "@/components/ui/Calendar";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
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

// Helper to create dates relative to today for initial state
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const INITIAL_EVENTS: any[] = [];

export function Agenda() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [events, setEvents] = useState(INITIAL_EVENTS);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: "", time: "", duration: "1h", type: "Asesoría" });

    // Filter events based on selected date on the calendar
    const filteredEvents = useMemo(() => {
        if (!date) return events; // Show all if no date selected
        return events.filter(event => isSameDay(event.date, date)).sort((a, b) => {
            // Simple string sort for time (assumes consistent format like 09:00 AM)
            return a.time.localeCompare(b.time);
        });
    }, [events, date]);

    const handleCreateEvent = () => {
        if (!newEvent.title || !newEvent.time || !date) return;

        const event = {
            id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
            ...newEvent,
            status: "Confirmado",
            date: date // Assign to currently selected date
        };

        setEvents([...events, event]);
        setNewEvent({ title: "", time: "", duration: "1h", type: "Asesoría" });
        setIsDialogOpen(false);
    };

    const handleDeleteEvent = (id: number) => {
        setEvents(events.filter(e => e.id !== id));
    };

    const handleStatusUpdate = (id: number, newStatus: string) => {
        setEvents(events.map(e => e.id === id ? { ...e, status: newStatus } : e));
    };

    const nextDay = () => {
        if (date) {
            const next = new Date(date);
            next.setDate(next.getDate() + 1);
            setDate(next);
        }
    };

    const prevDay = () => {
        if (date) {
            const prev = new Date(date);
            prev.setDate(prev.getDate() - 1);
            setDate(prev);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Agenda Operativa</h1>
                    <p className="mt-2 text-base font-medium text-foreground/80">
                        Planificación de asesorías, entregas y hitos de investigación.
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-2xl gap-2 font-bold shadow-lg shadow-primary/20 cursor-pointer">
                            <Plus className="mr-2 h-4 w-4" /> Nuevo Evento
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Programar Evento</DialogTitle>
                            <DialogDescription>
                                Agenda una nueva sesión o entrega para <span className="font-bold text-foreground">{format(date || new Date(), "d 'de' MMMM", { locale: es })}</span>.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Título del Evento</label>
                                <Input
                                    placeholder="Ej: Revisión de Capítulo 1"
                                    className="rounded-xl"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Hora</label>
                                    <Input
                                        type="time"
                                        className="rounded-xl w-full"
                                        value={newEvent.time}
                                        onChange={(e) => {
                                            // Convert standard time input (HH:mm) to 12h AM/PM for UI consistency
                                            let timeStr = e.target.value;
                                            if (timeStr) {
                                                const [h, m] = timeStr.split(':');
                                                let hour = parseInt(h);
                                                const ampm = hour >= 12 ? 'PM' : 'AM';
                                                hour = hour % 12 || 12;
                                                timeStr = `${hour.toString().padStart(2, '0')}:${m} ${ampm}`;
                                            }
                                            setNewEvent({ ...newEvent, time: timeStr || e.target.value })
                                        }
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-muted-foreground">Duración</label>
                                    <select
                                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring h-10"
                                        value={newEvent.duration}
                                        onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                                    >
                                        <option>30min</option>
                                        <option>1h</option>
                                        <option>1.5h</option>
                                        <option>2h</option>
                                        <option>Todo el día</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Tipo de Evento</label>
                                <select
                                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring h-10"
                                    value={newEvent.type}
                                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                                >
                                    <option>Asesoría</option>
                                    <option>Entrega</option>
                                    <option>Taller</option>
                                    <option>Interno</option>
                                    <option>Reunión de Cliente</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" className="rounded-xl cursor-pointer" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button className="rounded-xl cursor-pointer" onClick={handleCreateEvent}>Guardar Evento</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <Card className="xl:col-span-4 rounded-3xl border-border bg-card shadow-sm p-2">
                    <CardContent className="p-4">
                        <CalendarComponent
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-2xl border-none w-full flex align-center justify-center p-0"
                            classNames={{
                                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-bold shadow-md shadow-primary/30",
                                cell: "text-center text-sm p-0 md:p-1 relative [&:has([aria-selected])]:bg-transparent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-full transition-all hover:bg-accent ring-1 ring-transparent hover:ring-border",
                                nav_button: "h-8 w-8 bg-accent rounded-full p-0 hover:opacity-100 transition-all shadow-sm border border-border",

                            }}
                        />
                        <div className="mt-6 space-y-4 pt-4 border-t border-border/50">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-2">Recordatorios</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-primary/5 border border-primary/10 transition-all hover:bg-primary/10 cursor-pointer">
                                    <Bell className="h-4 w-4 text-primary" />
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-foreground">Llamar a Cliente UASD</p>
                                        <p className="text-[10px] font-medium text-muted-foreground">Pendiente desde ayer</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-accent/30 border border-border cursor-pointer hover:bg-accent/50 transition-all">
                                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-muted-foreground line-through">Subir documentos INTEC</p>
                                        <p className="text-[10px] font-medium text-muted-foreground opacity-60">Completado hoy 08:00 AM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="xl:col-span-8 rounded-3xl border-border bg-card shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-6 mb-4">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-black">Programación</CardTitle>
                            <CardDescription className="text-sm font-black text-primary uppercase tracking-tighter">
                                {date ? format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es }) : "Selecciona una fecha"}
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl cursor-pointer hover:bg-accent transition-colors" onClick={prevDay}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl cursor-pointer hover:bg-accent transition-colors" onClick={nextDay}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((event) => (
                                <div key={event.id} className="group relative flex items-start gap-4 p-4 rounded-2xl border border-border bg-accent/10 hover:bg-accent/40 hover:shadow-sm transition-all duration-300">
                                    <div className="flex flex-col items-center justify-center min-w-[90px] py-1 border-r border-border/50 pr-4">
                                        <span className="text-base font-black text-foreground tracking-tighter">{event.time}</span>
                                        <span className="text-[11px] text-muted-foreground uppercase font-black mt-0.5">{event.duration}</span>
                                    </div>
                                    <div className="flex-1 pl-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className={`font-black text-lg transition-colors ${event.status === 'Completado' ? 'text-muted-foreground line-through opacity-60' : 'text-foreground'}`}>
                                                {event.title}
                                            </h4>
                                            <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg ring-1 transition-all ${event.status === 'Confirmado' ? 'bg-primary/10 text-primary ring-primary/20' :
                                                    event.status === 'Completado' ? 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20' :
                                                        event.status === 'Reprogramado' ? 'bg-slate-500/10 text-slate-600 ring-slate-500/20' :
                                                            'bg-amber-500/10 text-amber-600 ring-amber-500/20'
                                                }`}>
                                                {event.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-5 mt-4">
                                            <div className="flex items-center gap-1.5 text-xs font-black text-foreground/60 uppercase tracking-tight">
                                                <CalendarCheck className="h-4 w-4 text-primary" />
                                                <span>{event.type}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-black text-foreground/60 uppercase tracking-tight">
                                                <Clock className="h-4 w-4 text-primary" />
                                                <span>{event.type === 'Entrega' ? 'Remoto' : 'Híbrido'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg cursor-pointer hover:bg-background shadow-sm border border-transparent hover:border-border">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-2xl min-w-[200px] shadow-xl">
                                                <DropdownMenuLabel>Gestionar Evento</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="gap-2 cursor-pointer font-medium" onClick={() => handleStatusUpdate(event.id, "Completado")}>
                                                    <CheckCircle className="h-4 w-4 text-emerald-500" /> Marcar Completado
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 cursor-pointer font-medium" onClick={() => handleStatusUpdate(event.id, "Confirmado")}>
                                                    <CheckCircle2 className="h-4 w-4 text-primary" /> Marcar Confirmado
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 cursor-pointer font-medium" onClick={() => handleStatusUpdate(event.id, "Reprogramado")}>
                                                    <Clock className="h-4 w-4 text-slate-500" /> Reprogramar
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="gap-2 cursor-pointer font-medium">
                                                    <Edit3 className="h-4 w-4" /> Editar detalles
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2 cursor-pointer font-medium text-destructive" onClick={() => handleDeleteEvent(event.id)}>
                                                    <Trash2 className="h-4 w-4" /> Eliminar evento
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl bg-accent/5">
                                <div className="h-16 w-16 rounded-full bg-accent/50 flex flex-col items-center justify-center mb-4 text-muted-foreground">
                                    <CalendarIcon className="h-8 w-8 stroke-1" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground">Agenda despejada</h3>
                                <p className="text-sm text-muted-foreground mt-1 mb-4">No hay eventos programados para esta fecha.</p>
                                <Button variant="outline" className="rounded-xl font-bold cursor-pointer" onClick={() => setIsDialogOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" /> Agendar ahora
                                </Button>
                            </div>
                        )}

                        {filteredEvents.length > 0 && (
                            <Button
                                variant="outline"
                                className="w-full border-dashed border-border rounded-2xl py-8 h-auto flex flex-col gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer group mt-4"
                                onClick={() => setIsDialogOpen(true)}
                            >
                                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <span className="text-sm font-bold text-muted-foreground tracking-tight group-hover:text-primary transition-colors">Agregar evento al final del día</span>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

