import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabaseClient';
import { TeamMember } from '../services/admin/adminService';

interface AdminAuthContextType {
    session: any;
    teamMember: Partial<TeamMember> | null;
    isLoading: boolean;
    isAdmin: boolean;
    isCollaborator: boolean;
    isSuperAdmin: boolean;
    hasAccess: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<any>(null);
    const [teamMember, setTeamMember] = useState<Partial<TeamMember> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            try {
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                setSession(currentSession);

                if (currentSession) {
                    const rootEmails = ['admin@tutesisrd.com', 'miguelcordero0012@gmail.com'];
                    if (currentSession.user.email && rootEmails.includes(currentSession.user.email)) {
                        setTeamMember({
                            role: 'admin',
                            is_super_admin: true,
                            is_active: true
                        });
                    } else {
                        const { data: member, error } = await supabase
                            .from('team_members')
                            .select('*')
                            .eq('auth_user_id', currentSession.user.id)
                            .single();

                        if (!error && member && member.is_active) {
                            setTeamMember(member);
                        } else {
                            setTeamMember(null);
                        }
                    }
                } else {
                    setTeamMember(null);
                }
            } catch (err) {
                console.error("[AdminAuthContext] Critical auth check error:", err);
                setTeamMember(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            // INITIAL_SESSION is already handled by the checkAuth() call above — skip to prevent double DB query
            if (_event === 'INITIAL_SESSION') return;

            if (session) {
                checkAuth();
            } else {
                setSession(null);
                setTeamMember(null);
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const isAdmin = teamMember?.role === 'admin' || teamMember?.is_super_admin === true;
    const isCollaborator = teamMember?.role === 'collaborator' || teamMember?.role === 'reviewer';
    const isSuperAdmin = teamMember?.is_super_admin === true;
    const hasAccess = !!teamMember && teamMember.is_active === true;

    return (
        <AdminAuthContext.Provider value={{ session, teamMember, isLoading, isAdmin, isCollaborator, isSuperAdmin, hasAccess }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (context === undefined) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
}
