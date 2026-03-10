import { supabase } from '../../supabaseClient';

export interface NotificationPayload {
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    target_roles?: string[];
    member_id?: string;
}

export const notificationService = {
    /**
     * Send a notification to a specific team member
     * In a production environment, this would also trigger an email via Supabase Edge Functions or an external provider like Resend
     */
    async sendToMember(payload: NotificationPayload): Promise<void> {
        if (!payload.member_id) return;

        const { error } = await supabase
            .from('notification_logs')
            .insert([{
                team_member_id: payload.member_id,
                title: payload.title,
                message: payload.message,
                type: payload.type || 'info'
            }]);

        if (error) throw error;

        // NOTE: Here you would integrate with an email API (SendGrid, Mailgun, Resend)
        console.log(`[Notification] Sending email to member ${payload.member_id}: ${payload.title}`);
    },

    /**
     * Broadcast a notification to all members with a specific role
     */
    async broadcastToRole(role: string, payload: Omit<NotificationPayload, 'member_id'>): Promise<void> {
        const { data: members, error: fetchError } = await supabase
            .from('team_members')
            .select('id, email, notification_preferences')
            .eq('role', role)
            .eq('is_active', true);

        if (fetchError) throw fetchError;

        const notifications = members
            ?.filter(m => m.notification_preferences?.new_projects !== false) // Basic filtering
            .map(m => ({
                team_member_id: m.id,
                title: payload.title,
                message: payload.message,
                type: payload.type || 'info'
            })) || [];

        if (notifications.length === 0) return;

        const { error: insertError } = await supabase
            .from('notification_logs')
            .insert(notifications);

        if (insertError) throw insertError;
    }
};
