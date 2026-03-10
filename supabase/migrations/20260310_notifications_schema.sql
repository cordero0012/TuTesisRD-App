-- =============================================
-- TuTesis RD - Notification Settings & Logs
-- Migration: 2026-03-10
-- =============================================

-- 1. Add notification settings to team_members
ALTER TABLE public.team_members 
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "new_projects": true,
  "project_milestones": true,
  "financial_summaries": false,
  "system_alerts": true
}'::jsonb;

-- 2. Create notifications log table
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  team_member_id UUID REFERENCES public.team_members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 3. Enable RLS
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- 4. Policies
CREATE POLICY "Users can view their own notifications" 
ON public.notification_logs FOR SELECT 
USING (auth.uid() IN (
    SELECT auth_user_id FROM public.team_members WHERE id = team_member_id
));

CREATE POLICY "Admins can manage all notifications" 
ON public.notification_logs FOR ALL 
USING (EXISTS (
    SELECT 1 FROM public.team_members 
    WHERE auth_user_id = auth.uid() AND (role = 'admin' OR is_super_admin = true)
));

-- 5. Indexes
CREATE INDEX IF NOT EXISTS notification_logs_member_idx ON public.notification_logs(team_member_id);
CREATE INDEX IF NOT EXISTS notification_logs_created_idx ON public.notification_logs(created_at);
