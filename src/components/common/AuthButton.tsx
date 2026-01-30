import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Session } from '@supabase/supabase-js';

export const AuthButton = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error('Error logging in:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        setLoading(false);
    };

    if (session) {
        return (
            <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {session.user.user_metadata.full_name || session.user.email}
                    </div>
                    <div className="text-[10px] text-slate-400">Sesión Activa</div>
                </div>
                {session.user.user_metadata.avatar_url ? (
                    <img
                        src={session.user.user_metadata.avatar_url}
                        alt="User"
                        className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-xs">
                        {session.user.email?.charAt(0).toUpperCase()}
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500"
                    title="Cerrar Sesión"
                >
                    <span className="material-symbols-outlined text-lg">logout</span>
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm hover:shadow-md transition-all hover:border-brand-orange/50 group"
        >
            {loading ? (
                <span className="material-symbols-outlined animate-spin text-lg">sync</span>
            ) : (
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
            )}
            <span>Iniciar Sesión</span>
        </button>
    );
};
