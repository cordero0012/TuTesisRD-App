import { supabase } from '../../supabaseClient';

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'collaborator' | 'reviewer';
    is_super_admin: boolean;
    is_active: boolean;
    auth_user_id?: string;
    created_at: string;
    notification_preferences: {
        new_projects: boolean;
        project_milestones: boolean;
        financial_summaries: boolean;
        system_alerts: boolean;
    };
}

export const adminService = {
    /**
     * Get all team members (requires admin privileges)
     */
    async getTeamMembers(): Promise<TeamMember[]> {
        const { data, error } = await supabase
            .from('team_members')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    /**
     * Check if a user is super admin
     */
    async checkSuperAdmin(userId: string): Promise<boolean> {
        const { data, error } = await supabase
            .from('team_members')
            .select('is_super_admin')
            .eq('auth_user_id', userId)
            .single();

        if (error) return false;
        return data?.is_super_admin || false;
    },

    /**
     * Invite/Create a new team member
     * Path: 1. Create entry in team_members, 2. The user will need to sign up/set password (or we can use Edge Functions for invitations)
     */
    async createTeamMember(member: Partial<TeamMember>): Promise<TeamMember> {
        const { data, error } = await supabase
            .from('team_members')
            .insert([member])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Toggle member active status
     */
    async toggleMemberStatus(memberId: string, isActive: boolean): Promise<void> {
        const { error } = await supabase
            .from('team_members')
            .update({ is_active: isActive })
            .eq('id', memberId);

        if (error) throw error;
    },

    /**
     * Update notification preferences for a member
     */
    async updateNotificationPreferences(memberId: string, preferences: Partial<TeamMember['notification_preferences']>): Promise<void> {
        const { error } = await supabase
            .from('team_members')
            .update({ notification_preferences: preferences })
            .eq('id', memberId);

        if (error) throw error;
    },

    /**
     * Get recent notifications for the logged in member
     */
    async getMyNotifications(limit = 10): Promise<any[]> {
        const { data, error } = await supabase
            .from('notification_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    }
};
