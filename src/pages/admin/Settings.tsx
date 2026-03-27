import React, { useState, useEffect } from "react";
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Shield,
    Palette,
    Layout,
    Database,
    Globe,
    LogOut,
    ChevronRight,
    Sparkles,
    CheckCircle2,
    Loader2,
    UserPlus,
    X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";
import { supabase } from "@/supabaseClient";
import { adminService, TeamMember } from "@/services/admin/adminService";

export function Settings() {
    const [activeTab, setActiveTab] = useState("General");
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isNewColabOpen, setIsNewColabOpen] = useState(false);
    const [newColab, setNewColab] = useState({ name: "", email: "", role: "collaborator" as TeamMember["role"] });
    const [isCreatingColab, setIsCreatingColab] = useState(false);
    const [colabError, setColabError] = useState<string | null>(null);

    useEffect(() => {
        adminService.getTeamMembers().then(setTeamMembers).catch(console.error);
    }, []);

    const handleCreateColab = async () => {
        if (!newColab.name || !newColab.email) return;
        setIsCreatingColab(true);
        setColabError(null);
        try {
            // 1. Invite via Supabase Auth (sends magic-link email)
            const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(newColab.email);
            // If inviteUserByEmail is not available client-side, we skip it and just create the record
            // The collaborator can sign up and will be matched by auth_user_id once they log in

            // 2. Create team_members record (auth_user_id will be linked later on first login)
            const created = await adminService.createTeamMember({
                name: newColab.name,
                email: newColab.email,
                role: newColab.role,
                is_active: true,
                is_super_admin: false,
                notification_preferences: {
                    new_projects: true,
                    project_milestones: true,
                    financial_summaries: false,
                    system_alerts: true
                }
            } as any);
            setTeamMembers(prev => [created, ...prev]);
            setNewColab({ name: "", email: "", role: "collaborator" });
            setIsNewColabOpen(false);
        } catch (err: any) {
            setColabError(err?.message || "Error al crear el colaborador.");
        } finally {
            setIsCreatingColab(false);
        }
    };

    // Form States
    const [profileData, setProfileData] = useState({
        name: "Miguel Sánchez",
        email: "miguel@tutesisrd.com",
        role: "Administrador Master",
        language: "Español (RD)",
        theme: "Sistema (Auto)"
    });

    const [toggles, setToggles] = useState({
        pushOn: true,
        emailOn: true,
        dailyBackup: true,
        aiEnabled: true,
        twoFactor: false
    });

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1200);
    };

    const navItems = [
        { id: "General", icon: User, label: "Perfil General" },
        { id: "Operaciones", icon: Layout, label: "Preferencias" },
        { id: "Notificaciones", icon: Bell, label: "Mis Notificaciones" },
        { id: "Seguridad", icon: Shield, label: "Seguridad y Acceso" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-end gap-3">
                    {showSuccess && (
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl text-sm font-semibold">
                            <CheckCircle2 className="h-4 w-4" /> Cambios guardados
                        </div>
                    )}
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="rounded-xl h-9 text-sm font-semibold px-5 min-w-[130px] cursor-pointer"
                    >
                        {isSaving ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
                        ) : (
                            "Guardar Cambios"
                        )}
                    </Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Menú de Navegación Lateral */}
                <div className="xl:col-span-1 space-y-6">
                    <Card className="rounded-2xl border-border bg-card shadow-sm p-2">
                        <nav className="flex flex-col space-y-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer border-l-2 ${activeTab === item.id
                                            ? "bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] border-[hsl(var(--primary))]"
                                            : "text-muted-foreground hover:bg-accent/60 hover:text-foreground border-transparent"
                                        }`}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </Card>

                    <Card className="rounded-2xl border-border bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-sm p-6 relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 bg-primary/20 p-6 rounded-full group-hover:scale-110 transition-transform duration-500 blur-xl"></div>
                        <Sparkles className="absolute top-4 right-4 h-8 w-8 text-primary opacity-60 group-hover:rotate-12 transition-transform" />
                        <h4 className="font-bold text-foreground">TuTesisRD AI Activo</h4>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">Gemini Pro está impulsando los análisis de proyectos.</p>
                        <Button variant="outline" className="mt-4 w-full rounded-xl h-9 text-xs font-bold border-primary/30 text-primary hover:bg-primary/10 cursor-pointer">
                            Configurar Motor AI
                        </Button>
                    </Card>

                    <Button variant="ghost" className="w-full rounded-2xl h-12 font-bold flex gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer">
                        <LogOut className="h-4 w-4" /> Cerrar Sesión
                    </Button>
                </div>

                {/* Contenido Principal de Ajustes */}
                <div className="xl:col-span-3">
                    <Card className="rounded-2xl border-border bg-card shadow-sm min-h-[500px]">
                        <CardHeader className="border-b border-border/50 pb-6 mb-6">
                            <CardTitle className="text-xl font-bold">{navItems.find(i => i.id === activeTab)?.label}</CardTitle>
                            <CardDescription className="text-sm font-medium">Actualiza tu información y personaliza tu entorno de trabajo.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 animate-in fade-in duration-300">

                            {activeTab === "General" && (
                                <div className="space-y-6 max-w-2xl">
                                    <div className="flex items-center gap-6">
                                        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-black shadow-inner ring-4 ring-background">
                                            {profileData.name.charAt(0)}
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-bold text-foreground">Avatar del Perfil</h3>
                                            <div className="flex gap-2">
                                                <Button size="sm" className="rounded-xl cursor-pointer">Subir Nueva Foto</Button>
                                                <Button size="sm" variant="outline" className="rounded-xl cursor-pointer">Remover</Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-muted-foreground">Nombre Completo</label>
                                            <Input
                                                className="rounded-xl bg-accent/30"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-muted-foreground">Correo Electrónico</label>
                                            <Input
                                                className="rounded-xl bg-accent/30"
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-muted-foreground">Rol Asignado</label>
                                            <Input className="rounded-xl bg-accent/30 opacity-70" value={profileData.role} disabled />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-muted-foreground">Idioma Regional</label>
                                            <select
                                                className="w-full rounded-xl border border-border bg-accent/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring h-10 font-medium"
                                                value={profileData.language}
                                                onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
                                            >
                                                <option>Español (RD)</option>
                                                <option>English (US)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Operaciones" && (
                                <div className="space-y-6 max-w-2xl">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-accent/10 hover:bg-accent/20 transition-colors cursor-pointer" onClick={() => setToggles({ ...toggles, aiEnabled: !toggles.aiEnabled })}>
                                            <div>
                                                <h4 className="font-bold text-foreground">Asistencia AI Global</h4>
                                                <p className="text-xs text-muted-foreground mt-1">Permitir a Gemini analizar tablas e interpretar documentos PDF cargados.</p>
                                            </div>
                                            <div className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors duration-300 ${toggles.aiEnabled ? 'bg-primary' : 'bg-muted'}`}>
                                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${toggles.aiEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-accent/10 hover:bg-accent/20 transition-colors cursor-pointer" onClick={() => setToggles({ ...toggles, dailyBackup: !toggles.dailyBackup })}>
                                            <div>
                                                <h4 className="font-bold text-foreground">Copias de Seguridad (Backups)</h4>
                                                <p className="text-xs text-muted-foreground mt-1">Realizar vaciado automático de la base de datos a un clúster seguro cada 24 horas.</p>
                                            </div>
                                            <div className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors duration-300 ${toggles.dailyBackup ? 'bg-primary' : 'bg-muted'}`}>
                                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${toggles.dailyBackup ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Apariencia Visual (Bento UI)</label>
                                        <select
                                            className="w-full rounded-xl border border-border bg-accent/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring h-10 font-medium"
                                            value={profileData.theme}
                                            onChange={(e) => setProfileData({ ...profileData, theme: e.target.value })}
                                        >
                                            <option>Sistema (Auto)</option>
                                            <option>Bento Light Mode</option>
                                            <option>Bento Dark Mode</option>
                                            <option>Minimal Gray</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Notificaciones" && (
                                <div className="space-y-6 max-w-2xl">
                                    <div>
                                        <h3 className="text-lg font-bold">Alertas por Correo Electrónico</h3>
                                        <p className="text-sm text-muted-foreground">Configura cómo y cuándo deseas recibir avisos en tu bandeja de entrada.</p>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-accent/10 hover:bg-accent/20 transition-colors cursor-pointer" onClick={() => setToggles({ ...toggles, pushOn: !toggles.pushOn })}>
                                            <div>
                                                <h4 className="font-bold text-foreground">Nuevos Proyectos Asignados</h4>
                                                <p className="text-xs text-muted-foreground mt-1">Recibir un correo cuando el director te asigne una nueva tesis.</p>
                                            </div>
                                            <div className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors duration-300 ${toggles.pushOn ? 'bg-primary' : 'bg-muted'}`}>
                                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${toggles.pushOn ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-accent/10 hover:bg-accent/20 transition-colors cursor-pointer" onClick={() => setToggles({ ...toggles, emailOn: !toggles.emailOn })}>
                                            <div>
                                                <h4 className="font-bold text-foreground">Actualizaciones de Hitos</h4>
                                                <p className="text-xs text-muted-foreground mt-1">Notificar cuando un estudiante suba un avance o hito de proyecto.</p>
                                            </div>
                                            <div className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors duration-300 ${toggles.emailOn ? 'bg-primary' : 'bg-muted'}`}>
                                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${toggles.emailOn ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-accent/10 hover:bg-accent/20 transition-colors cursor-pointer" onClick={() => setToggles({ ...toggles, dailyBackup: !toggles.dailyBackup })}>
                                            <div>
                                                <h4 className="font-bold text-foreground">Recordatorios de Entrega</h4>
                                                <p className="text-xs text-muted-foreground mt-1">Avisos 48 horas antes de la fecha límite de un proyecto.</p>
                                            </div>
                                            <div className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors duration-300 ${toggles.dailyBackup ? 'bg-primary' : 'bg-muted'}`}>
                                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${toggles.dailyBackup ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "Seguridad" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h3 className="text-lg font-bold">Gestión de Acceso y Equipo</h3>
                                            <p className="text-sm text-muted-foreground">Administra las credenciales y roles de los colaboradores.</p>
                                        </div>
                                        <Dialog open={isNewColabOpen} onOpenChange={setIsNewColabOpen}>
                                            <DialogTrigger asChild>
                                                <Button className="rounded-xl h-9 text-sm font-semibold gap-2 cursor-pointer">
                                                    <UserPlus className="h-4 w-4" /> Nuevo Colaborador
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[420px]">
                                                <DialogHeader>
                                                    <DialogTitle>Crear Colaborador</DialogTitle>
                                                    <DialogDescription>
                                                        El colaborador recibirá acceso a la plataforma con el rol asignado.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase text-muted-foreground">Nombre Completo</label>
                                                        <Input
                                                            placeholder="Ej: Ana Martínez"
                                                            className="rounded-xl"
                                                            value={newColab.name}
                                                            onChange={(e) => setNewColab({ ...newColab, name: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase text-muted-foreground">Correo Electrónico</label>
                                                        <Input
                                                            placeholder="colaborador@tutesisrd.com"
                                                            type="email"
                                                            className="rounded-xl"
                                                            value={newColab.email}
                                                            onChange={(e) => setNewColab({ ...newColab, email: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase text-muted-foreground">Rol</label>
                                                        <select
                                                            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring h-10"
                                                            value={newColab.role}
                                                            onChange={(e) => setNewColab({ ...newColab, role: e.target.value as TeamMember["role"] })}
                                                        >
                                                            <option value="collaborator">Colaborador</option>
                                                            <option value="reviewer">Revisor</option>
                                                            <option value="admin">Administrador</option>
                                                        </select>
                                                    </div>
                                                    {colabError && (
                                                        <p className="text-xs text-destructive font-medium">{colabError}</p>
                                                    )}
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" className="rounded-xl cursor-pointer" onClick={() => setIsNewColabOpen(false)}>Cancelar</Button>
                                                    <Button className="rounded-xl cursor-pointer" onClick={handleCreateColab} disabled={isCreatingColab}>
                                                        {isCreatingColab ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando...</> : "Crear Acceso"}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    <div className="space-y-4">
                                        {teamMembers.length === 0 ? (
                                            <div className="py-8 text-center border-2 border-dashed border-border rounded-2xl bg-accent/5">
                                                <p className="text-sm text-muted-foreground">No hay colaboradores registrados aún.</p>
                                            </div>
                                        ) : (
                                            teamMembers.map((member) => (
                                                <div key={member.id} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-accent/10 hover:bg-accent/20 transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                                            {member.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-sm">
                                                                {member.name}
                                                                {member.is_super_admin && <span className="ml-2 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Super Admin</span>}
                                                                {!member.is_super_admin && <span className="ml-2 text-[10px] bg-accent text-muted-foreground px-2 py-0.5 rounded-full capitalize">{member.role}</span>}
                                                            </h4>
                                                            <p className="text-xs text-muted-foreground">{member.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`h-2 w-2 rounded-full ${member.is_active ? 'bg-emerald-500' : 'bg-rose-500'} shadow-[0_0_8px_rgba(16,185,129,0.4)]`}></span>
                                                        <Button variant="ghost" size="sm" className="rounded-xl h-8 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">Editar</Button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="pt-6 border-t border-border/50">
                                        <h4 className="font-bold text-sm mb-4">Seguridad de la Cuenta</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Button variant="outline" className="rounded-2xl h-12 font-bold justify-start px-6 border-slate-200 dark:border-slate-800">
                                                <Shield className="mr-2 h-4 w-4 text-primary" /> Cambiar Contraseña
                                            </Button>
                                            <Button variant="outline" className="rounded-2xl h-12 font-bold justify-start px-6 border-slate-200 dark:border-slate-800">
                                                <Database className="mr-2 h-4 w-4 text-primary" /> Auditoría de Accesos
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}


                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

