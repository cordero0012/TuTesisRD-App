import React, { useState, useEffect, useRef } from "react";
import {
    User,
    Bell,
    Shield,
    Layout,
    Database,
    LogOut,
    Sparkles,
    CheckCircle2,
    Loader2,
    UserPlus,
    Eye,
    EyeOff,
    Edit2,
    Lock,
    ClipboardList,
    Camera,
    Trash2,
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
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

// ─── helpers ─────────────────────────────────────────────────────────────────

const LS_THEME = "admin-theme";
const LS_NOTIFS = "admin-notif-prefs";

function readLS<T>(key: string, fallback: T): T {
    try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
    } catch {
        return fallback;
    }
}

// ─── component ───────────────────────────────────────────────────────────────

export function Settings() {
    const navigate = useNavigate();
    const { session } = useAdminAuth();
    const fileRef = useRef<HTMLInputElement>(null);

    const [activeTab, setActiveTab] = useState("General");

    // ── profile ──────────────────────────────────────────────────────────────
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        role: "Administrador",
        language: "Español (RD)",
    });
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);

    // Load real profile from Supabase auth on mount
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (!data.user) return;
            const meta = data.user.user_metadata || {};
            setProfileData({
                name: meta.full_name || meta.name || data.user.email?.split("@")[0] || "",
                email: data.user.email || "",
                role: meta.role || "Administrador",
                language: meta.language || "Español (RD)",
            });
            if (meta.avatar_url) setAvatarPreview(meta.avatar_url);
        });
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMsg(null);
        try {
            await supabase.auth.updateUser({
                data: {
                    full_name: profileData.name,
                    language: profileData.language,
                    avatar_url: avatarPreview || undefined,
                },
            });
            setSaveMsg({ ok: true, text: "Cambios guardados" });
        } catch (err: any) {
            setSaveMsg({ ok: false, text: err?.message || "Error al guardar" });
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMsg(null), 3500);
        }
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    // ── theme (persisted to localStorage + event) ─────────────────────────────
    const [theme, setThemeState] = useState<string>(() => readLS(LS_THEME, "light"));

    const applyTheme = (val: string) => {
        setThemeState(val);
        localStorage.setItem(LS_THEME, JSON.stringify(val));
        window.dispatchEvent(new Event("admin-theme-change"));
    };

    // ── notification toggles (persisted) ─────────────────────────────────────
    const [notifPrefs, setNotifPrefs] = useState(() =>
        readLS(LS_NOTIFS, { pushOn: true, emailOn: true, deadlines: true })
    );

    const toggleNotif = (key: keyof typeof notifPrefs) => {
        const next = { ...notifPrefs, [key]: !notifPrefs[key] };
        setNotifPrefs(next);
        localStorage.setItem(LS_NOTIFS, JSON.stringify(next));
    };

    // ── ai / backup toggles ───────────────────────────────────────────────────
    const [opsToggles, setOpsToggles] = useState(() =>
        readLS("admin-ops-prefs", { aiEnabled: true, dailyBackup: true })
    );

    const toggleOps = (key: keyof typeof opsToggles) => {
        const next = { ...opsToggles, [key]: !opsToggles[key] };
        setOpsToggles(next);
        localStorage.setItem("admin-ops-prefs", JSON.stringify(next));
    };

    // ── team members ──────────────────────────────────────────────────────────
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isNewColabOpen, setIsNewColabOpen] = useState(false);
    const [newColab, setNewColab] = useState({ name: "", email: "", role: "collaborator" as TeamMember["role"] });
    const [isCreatingColab, setIsCreatingColab] = useState(false);
    const [colabError, setColabError] = useState<string | null>(null);

    // Edit member
    const [editMember, setEditMember] = useState<TeamMember | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSavingMember, setIsSavingMember] = useState(false);

    useEffect(() => {
        adminService.getTeamMembers().then(setTeamMembers).catch(console.error);
    }, []);

    const handleCreateColab = async () => {
        if (!newColab.name || !newColab.email) return;
        setIsCreatingColab(true);
        setColabError(null);
        try {
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
                    system_alerts: true,
                },
            } as any);
            setTeamMembers((prev) => [created, ...prev]);
            setNewColab({ name: "", email: "", role: "collaborator" });
            setIsNewColabOpen(false);
        } catch (err: any) {
            setColabError(err?.message || "Error al crear el colaborador.");
        } finally {
            setIsCreatingColab(false);
        }
    };

    const openEditMember = (m: TeamMember) => {
        setEditMember({ ...m });
        setIsEditOpen(true);
    };

    const handleSaveMember = async () => {
        if (!editMember) return;
        setIsSavingMember(true);
        try {
            await adminService.toggleMemberStatus(editMember.id, editMember.is_active);
            // Update role via direct supabase call (adminService doesn't expose it yet)
            await supabase
                .from("team_members")
                .update({ role: editMember.role, name: editMember.name })
                .eq("id", editMember.id);
            setTeamMembers((prev) =>
                prev.map((m) => (m.id === editMember.id ? { ...m, ...editMember } : m))
            );
            setIsEditOpen(false);
        } catch (err: any) {
            alert(err?.message || "Error al guardar cambios");
        } finally {
            setIsSavingMember(false);
        }
    };

    // ── change password ───────────────────────────────────────────────────────
    const [isPwdOpen, setIsPwdOpen] = useState(false);
    const [pwdData, setPwdData] = useState({ newPwd: "", confirmPwd: "" });
    const [showPwd, setShowPwd] = useState(false);
    const [isPwdSaving, setIsPwdSaving] = useState(false);
    const [pwdMsg, setPwdMsg] = useState<{ ok: boolean; text: string } | null>(null);

    const handleChangePwd = async () => {
        if (!pwdData.newPwd || pwdData.newPwd !== pwdData.confirmPwd) {
            setPwdMsg({ ok: false, text: "Las contraseñas no coinciden." });
            return;
        }
        if (pwdData.newPwd.length < 8) {
            setPwdMsg({ ok: false, text: "Mínimo 8 caracteres." });
            return;
        }
        setIsPwdSaving(true);
        setPwdMsg(null);
        try {
            const { error } = await supabase.auth.updateUser({ password: pwdData.newPwd });
            if (error) throw error;
            setPwdMsg({ ok: true, text: "Contraseña actualizada." });
            setPwdData({ newPwd: "", confirmPwd: "" });
            setTimeout(() => { setPwdMsg(null); setIsPwdOpen(false); }, 2000);
        } catch (err: any) {
            setPwdMsg({ ok: false, text: err?.message || "Error al actualizar." });
        } finally {
            setIsPwdSaving(false);
        }
    };

    // ── access audit ─────────────────────────────────────────────────────────
    const [isAuditOpen, setIsAuditOpen] = useState(false);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [isLoadingAudit, setIsLoadingAudit] = useState(false);

    const openAudit = async () => {
        setIsAuditOpen(true);
        setIsLoadingAudit(true);
        try {
            // Fetch last 20 notification_logs as audit trail
            const { data } = await supabase
                .from("notification_logs")
                .select("id, title, message, type, created_at, team_member_id")
                .order("created_at", { ascending: false })
                .limit(20);
            setAuditLogs(data || []);
        } catch {
            setAuditLogs([]);
        } finally {
            setIsLoadingAudit(false);
        }
    };

    // ── sign out ──────────────────────────────────────────────────────────────
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate("/admin/login");
    };

    // ─────────────────────────────────────────────────────────────────────────

    const navItems = [
        { id: "General", icon: User, label: "Perfil General" },
        { id: "Operaciones", icon: Layout, label: "Preferencias" },
        { id: "Notificaciones", icon: Bell, label: "Mis Notificaciones" },
        { id: "Seguridad", icon: Shield, label: "Seguridad y Acceso" },
    ];

    const ToggleSwitch = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
        <button
            onClick={onClick}
            className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors duration-300 cursor-pointer ${on ? "bg-[hsl(var(--primary))]" : "bg-muted"}`}
        >
            <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${on ? "translate-x-5" : "translate-x-0"}`} />
        </button>
    );

    return (
        <div className="space-y-6">
            {/* Top action bar */}
            <div className="flex items-center justify-end gap-3">
                {saveMsg && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold ${saveMsg.ok ? "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10" : "text-destructive bg-destructive/10"}`}>
                        <CheckCircle2 className="h-4 w-4" /> {saveMsg.text}
                    </div>
                )}
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="rounded-xl h-9 text-sm font-semibold px-5 min-w-[130px] cursor-pointer"
                >
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</> : "Guardar Cambios"}
                </Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Sidebar nav */}
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

                    {/* AI card */}
                    <Card className="rounded-2xl border-border bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-sm p-6 relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 bg-primary/20 p-6 rounded-full group-hover:scale-110 transition-transform duration-500 blur-xl" />
                        <Sparkles className="absolute top-4 right-4 h-8 w-8 text-primary opacity-60 group-hover:rotate-12 transition-transform" />
                        <h4 className="font-bold text-foreground">TuTesisRD AI Activo</h4>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">Gemini Pro está impulsando los análisis de proyectos.</p>
                        <Button
                            variant="outline"
                            className="mt-4 w-full rounded-xl h-9 text-xs font-bold border-primary/30 text-primary hover:bg-primary/10 cursor-pointer"
                            onClick={() => setActiveTab("Operaciones")}
                        >
                            Configurar Motor AI
                        </Button>
                    </Card>

                    {/* Sign out */}
                    <Button
                        variant="ghost"
                        className="w-full rounded-2xl h-12 font-bold flex gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                        onClick={handleSignOut}
                    >
                        <LogOut className="h-4 w-4" /> Cerrar Sesión
                    </Button>
                </div>

                {/* Main content */}
                <div className="xl:col-span-3">
                    <Card className="rounded-2xl border-border bg-card shadow-sm min-h-[500px]">
                        <CardHeader className="border-b border-border/50 pb-6 mb-6">
                            <CardTitle className="text-xl font-bold">{navItems.find((i) => i.id === activeTab)?.label}</CardTitle>
                            <CardDescription className="text-sm font-medium">Actualiza tu información y personaliza tu entorno de trabajo.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 animate-in fade-in duration-300">

                            {/* ── General ──────────────────────────────────── */}
                            {activeTab === "General" && (
                                <div className="space-y-6 max-w-2xl">
                                    {/* Avatar */}
                                    <div className="flex items-center gap-6">
                                        <div className="relative group/avatar">
                                            {avatarPreview ? (
                                                <img
                                                    src={avatarPreview}
                                                    alt="Avatar"
                                                    className="h-24 w-24 rounded-full object-cover ring-4 ring-background shadow-inner"
                                                />
                                            ) : (
                                                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-black shadow-inner ring-4 ring-background">
                                                    {profileData.name.charAt(0)?.toUpperCase() || "A"}
                                                </div>
                                            )}
                                            {/* Overlay on hover */}
                                            <button
                                                onClick={() => fileRef.current?.click()}
                                                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                                            >
                                                <Camera className="h-6 w-6 text-white" />
                                            </button>
                                            <input
                                                ref={fileRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handlePhotoSelect}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-bold text-foreground">Foto de Perfil</h3>
                                            <p className="text-xs text-muted-foreground">JPG, PNG o GIF. Máx 2 MB.</p>
                                            <div className="flex gap-2">
                                                <Button size="sm" className="rounded-xl cursor-pointer gap-1.5" onClick={() => fileRef.current?.click()}>
                                                    <Camera className="h-3.5 w-3.5" /> Subir Foto
                                                </Button>
                                                {avatarPreview && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="rounded-xl cursor-pointer gap-1.5"
                                                        onClick={() => { setAvatarPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" /> Remover
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form fields */}
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
                                                className="rounded-xl bg-accent/30 opacity-70"
                                                type="email"
                                                value={profileData.email}
                                                disabled
                                                title="El correo no se puede cambiar desde aquí"
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

                            {/* ── Operaciones ───────────────────────────────── */}
                            {activeTab === "Operaciones" && (
                                <div className="space-y-6 max-w-2xl">
                                    <div className="space-y-4">
                                        <div
                                            className="flex items-center justify-between p-4 rounded-2xl border border-border bg-accent/10 hover:bg-accent/20 transition-colors cursor-pointer"
                                            onClick={() => toggleOps("aiEnabled")}
                                        >
                                            <div>
                                                <h4 className="font-bold text-foreground">Asistencia AI Global</h4>
                                                <p className="text-xs text-muted-foreground mt-1">Permitir a Gemini analizar tablas e interpretar documentos PDF cargados.</p>
                                            </div>
                                            <ToggleSwitch on={opsToggles.aiEnabled} onClick={() => toggleOps("aiEnabled")} />
                                        </div>

                                        <div
                                            className="flex items-center justify-between p-4 rounded-2xl border border-border bg-accent/10 hover:bg-accent/20 transition-colors cursor-pointer"
                                            onClick={() => toggleOps("dailyBackup")}
                                        >
                                            <div>
                                                <h4 className="font-bold text-foreground">Copias de Seguridad (Backups)</h4>
                                                <p className="text-xs text-muted-foreground mt-1">Vaciado automático de la base de datos a un clúster seguro cada 24 horas.</p>
                                            </div>
                                            <ToggleSwitch on={opsToggles.dailyBackup} onClick={() => toggleOps("dailyBackup")} />
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <label className="text-xs font-bold uppercase text-muted-foreground">Apariencia Visual</label>
                                        <select
                                            className="w-full rounded-xl border border-border bg-accent/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring h-10 font-medium"
                                            value={theme}
                                            onChange={(e) => applyTheme(e.target.value)}
                                        >
                                            <option value="dark">Modo Oscuro</option>
                                            <option value="light">Modo Claro</option>
                                            <option value="gray">Minimal Gray</option>
                                        </select>
                                        <p className="text-xs text-muted-foreground">El cambio se aplica de inmediato en toda la plataforma.</p>
                                    </div>
                                </div>
                            )}

                            {/* ── Notificaciones ────────────────────────────── */}
                            {activeTab === "Notificaciones" && (
                                <div className="space-y-6 max-w-2xl">
                                    <div>
                                        <h3 className="text-lg font-bold">Alertas por Correo Electrónico</h3>
                                        <p className="text-sm text-muted-foreground">Configura cuándo deseas recibir avisos en tu bandeja de entrada.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div
                                            className="flex items-center justify-between p-4 rounded-2xl border border-border bg-accent/10 hover:bg-accent/20 transition-colors cursor-pointer"
                                            onClick={() => toggleNotif("pushOn")}
                                        >
                                            <div>
                                                <h4 className="font-bold text-foreground">Nuevos Proyectos Asignados</h4>
                                                <p className="text-xs text-muted-foreground mt-1">Recibir un correo cuando se asigne una nueva tesis.</p>
                                            </div>
                                            <ToggleSwitch on={notifPrefs.pushOn} onClick={() => toggleNotif("pushOn")} />
                                        </div>

                                        <div
                                            className="flex items-center justify-between p-4 rounded-2xl border border-border bg-accent/10 hover:bg-accent/20 transition-colors cursor-pointer"
                                            onClick={() => toggleNotif("emailOn")}
                                        >
                                            <div>
                                                <h4 className="font-bold text-foreground">Actualizaciones de Hitos</h4>
                                                <p className="text-xs text-muted-foreground mt-1">Notificar cuando un estudiante suba un avance o hito de proyecto.</p>
                                            </div>
                                            <ToggleSwitch on={notifPrefs.emailOn} onClick={() => toggleNotif("emailOn")} />
                                        </div>

                                        <div
                                            className="flex items-center justify-between p-4 rounded-2xl border border-border bg-accent/10 hover:bg-accent/20 transition-colors cursor-pointer"
                                            onClick={() => toggleNotif("deadlines")}
                                        >
                                            <div>
                                                <h4 className="font-bold text-foreground">Recordatorios de Entrega</h4>
                                                <p className="text-xs text-muted-foreground mt-1">Avisos 48 horas antes de la fecha límite de un proyecto.</p>
                                            </div>
                                            <ToggleSwitch on={notifPrefs.deadlines} onClick={() => toggleNotif("deadlines")} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Seguridad ─────────────────────────────────── */}
                            {activeTab === "Seguridad" && (
                                <div className="space-y-6">
                                    {/* Team members */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold">Gestión de Acceso y Equipo</h3>
                                            <p className="text-sm text-muted-foreground">Administra los colaboradores y sus permisos.</p>
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
                                                    <DialogDescription>El colaborador recibirá acceso con el rol asignado.</DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase text-muted-foreground">Nombre Completo</label>
                                                        <Input placeholder="Ej: Ana Martínez" className="rounded-xl" value={newColab.name} onChange={(e) => setNewColab({ ...newColab, name: e.target.value })} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase text-muted-foreground">Correo Electrónico</label>
                                                        <Input placeholder="colaborador@tutesisrd.com" type="email" className="rounded-xl" value={newColab.email} onChange={(e) => setNewColab({ ...newColab, email: e.target.value })} />
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
                                                    {colabError && <p className="text-xs text-destructive font-medium">{colabError}</p>}
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

                                    <div className="space-y-3">
                                        {teamMembers.length === 0 ? (
                                            <div className="py-8 text-center border-2 border-dashed border-border rounded-2xl bg-accent/5">
                                                <p className="text-sm text-muted-foreground">No hay colaboradores registrados aún.</p>
                                            </div>
                                        ) : (
                                            teamMembers.map((member) => (
                                                <div key={member.id} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-accent/10 hover:bg-accent/20 transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                                                            {member.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-sm flex items-center gap-2">
                                                                {member.name}
                                                                {member.is_super_admin
                                                                    ? <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Super Admin</span>
                                                                    : <span className="text-[10px] bg-accent text-muted-foreground px-2 py-0.5 rounded-full capitalize">{member.role}</span>
                                                                }
                                                            </h4>
                                                            <p className="text-xs text-muted-foreground">{member.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`h-2 w-2 rounded-full shrink-0 ${member.is_active ? "bg-emerald-500" : "bg-rose-500"}`} title={member.is_active ? "Activo" : "Inactivo"} />
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="rounded-xl h-8 text-xs font-bold gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                            onClick={() => openEditMember(member)}
                                                        >
                                                            <Edit2 className="h-3.5 w-3.5" /> Editar
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Account security */}
                                    <div className="pt-6 border-t border-border/50">
                                        <h4 className="font-bold text-sm mb-4">Seguridad de la Cuenta</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Change password */}
                                            <Dialog open={isPwdOpen} onOpenChange={setIsPwdOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" className="rounded-2xl h-12 font-bold justify-start px-6 border-border cursor-pointer">
                                                        <Lock className="mr-2 h-4 w-4 text-primary" /> Cambiar Contraseña
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[400px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Cambiar Contraseña</DialogTitle>
                                                        <DialogDescription>Establece una nueva contraseña segura para tu cuenta.</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold uppercase text-muted-foreground">Nueva Contraseña</label>
                                                            <div className="relative">
                                                                <Input
                                                                    type={showPwd ? "text" : "password"}
                                                                    placeholder="Mínimo 8 caracteres"
                                                                    className="rounded-xl pr-10"
                                                                    value={pwdData.newPwd}
                                                                    onChange={(e) => setPwdData({ ...pwdData, newPwd: e.target.value })}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowPwd((v) => !v)}
                                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                                                >
                                                                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold uppercase text-muted-foreground">Confirmar Contraseña</label>
                                                            <Input
                                                                type={showPwd ? "text" : "password"}
                                                                placeholder="Repite la contraseña"
                                                                className="rounded-xl"
                                                                value={pwdData.confirmPwd}
                                                                onChange={(e) => setPwdData({ ...pwdData, confirmPwd: e.target.value })}
                                                            />
                                                        </div>
                                                        {pwdMsg && (
                                                            <p className={`text-xs font-semibold ${pwdMsg.ok ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
                                                                {pwdMsg.text}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <DialogFooter>
                                                        <Button variant="outline" className="rounded-xl cursor-pointer" onClick={() => setIsPwdOpen(false)}>Cancelar</Button>
                                                        <Button className="rounded-xl cursor-pointer" onClick={handleChangePwd} disabled={isPwdSaving}>
                                                            {isPwdSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Actualizando...</> : "Actualizar"}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

                                            {/* Access audit */}
                                            <Dialog open={isAuditOpen} onOpenChange={setIsAuditOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" className="rounded-2xl h-12 font-bold justify-start px-6 border-border cursor-pointer" onClick={openAudit}>
                                                        <ClipboardList className="mr-2 h-4 w-4 text-primary" /> Auditoría de Accesos
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[520px]">
                                                    <DialogHeader>
                                                        <DialogTitle>Auditoría de Accesos</DialogTitle>
                                                        <DialogDescription>Últimos registros de actividad en la plataforma.</DialogDescription>
                                                    </DialogHeader>
                                                    <div className="max-h-80 overflow-y-auto space-y-2 py-2">
                                                        {isLoadingAudit ? (
                                                            <div className="flex justify-center py-8">
                                                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                                            </div>
                                                        ) : auditLogs.length === 0 ? (
                                                            <p className="text-center text-sm text-muted-foreground py-8">No hay registros disponibles.</p>
                                                        ) : (
                                                            auditLogs.map((log) => (
                                                                <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-accent/10">
                                                                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${log.type === "success" ? "bg-emerald-500" : log.type === "warning" ? "bg-amber-500" : log.type === "danger" ? "bg-rose-500" : "bg-blue-500"}`} />
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="text-xs font-semibold text-foreground">{log.title}</p>
                                                                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{log.message}</p>
                                                                    </div>
                                                                    <p className="text-[10px] text-muted-foreground/60 shrink-0">
                                                                        {new Date(log.created_at).toLocaleDateString("es-DO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                                                    </p>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                    <DialogFooter>
                                                        <Button variant="outline" className="rounded-xl cursor-pointer" onClick={() => setIsAuditOpen(false)}>Cerrar</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Edit member dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Editar Colaborador</DialogTitle>
                        <DialogDescription>Modifica el nombre, rol o estado de acceso.</DialogDescription>
                    </DialogHeader>
                    {editMember && (
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Nombre</label>
                                <Input
                                    className="rounded-xl"
                                    value={editMember.name}
                                    onChange={(e) => setEditMember({ ...editMember, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-muted-foreground">Rol</label>
                                <select
                                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring h-10"
                                    value={editMember.role}
                                    onChange={(e) => setEditMember({ ...editMember, role: e.target.value as TeamMember["role"] })}
                                    disabled={editMember.is_super_admin}
                                >
                                    <option value="collaborator">Colaborador</option>
                                    <option value="reviewer">Revisor</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                            <div
                                className="flex items-center justify-between p-4 rounded-2xl border border-border bg-accent/10 cursor-pointer"
                                onClick={() => !editMember.is_super_admin && setEditMember({ ...editMember, is_active: !editMember.is_active })}
                            >
                                <div>
                                    <h4 className="font-bold text-sm">Acceso Activo</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">El colaborador puede iniciar sesión en la plataforma.</p>
                                </div>
                                <ToggleSwitch
                                    on={editMember.is_active}
                                    onClick={() => !editMember.is_super_admin && setEditMember({ ...editMember, is_active: !editMember.is_active })}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" className="rounded-xl cursor-pointer" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
                        <Button className="rounded-xl cursor-pointer" onClick={handleSaveMember} disabled={isSavingMember}>
                            {isSavingMember ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</> : "Guardar Cambios"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
