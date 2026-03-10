import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { Sparkles, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            navigate('/admin');
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-colors duration-300">
            {/* Branding Background Decor */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-brand-orange/5 to-transparent pointer-events-none"></div>
            
            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-orange/10 ring-1 ring-brand-orange/20 mb-6 mx-auto">
                        <Sparkles className="h-8 w-8 text-brand-orange" />
                    </div>
                    <img 
                        src="/logos/Logo-TuTesis-Color.png" 
                        alt="TuTesisRD" 
                        className="h-10 mx-auto mb-2"
                    />
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Portal Administrativo</p>
                </div>

                <Card className="border-border bg-card shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-8 md:p-10">
                        <h2 className="text-2xl font-bold text-foreground mb-2">Bienvenido de nuevo</h2>
                        <p className="text-sm text-muted-foreground mb-8">Ingresa tus credenciales para acceder al panel.</p>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground ml-1">Correo Electrónico</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="ejemplo@tutesisrd.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-12 h-12 rounded-2xl border-border bg-accent/30 focus:bg-card transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground ml-1">Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-12 h-12 rounded-2xl border-border bg-accent/30 focus:bg-card transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm animate-shake">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <Button 
                                type="submit" 
                                className="w-full h-12 rounded-2xl bg-brand-orange hover:bg-orange-600 text-white font-bold transition-all shadow-lg shadow-brand-orange/20 flex items-center justify-center gap-2 mt-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        Entrar al Sistema
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center">
                    <a href="/" className="text-xs font-semibold text-muted-foreground hover:text-brand-orange transition-colors">
                        ← Volver a la página principal
                    </a>
                </div>
            </div>

            {/* Bottom Accent */}
            <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent"></div>
        </div>
    );
}
