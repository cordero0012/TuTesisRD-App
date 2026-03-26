-- ==============================================================================
-- TuTesis RD - Full Schema Reconstruction
-- Migration: 2026-03-10
-- ==============================================================================

-- 1. Ensure students table exists with auth_user_id
CREATE TABLE IF NOT EXISTS public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    university TEXT,
    career TEXT,
    auth_user_id UUID REFERENCES auth.users(id)
);

-- 2. Scholar Projects (The actual thesis/document content)
-- This is what ProjectContext.tsx uses
CREATE TABLE IF NOT EXISTS public.scholar_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT DEFAULT 'Mi Tesis',
    content TEXT DEFAULT '',
    owner_id UUID REFERENCES auth.users(id),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 3. Projects (Admin/Financial tracking)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    student_id UUID REFERENCES public.students(id),
    type TEXT,
    description TEXT,
    total_amount NUMERIC DEFAULT 0,
    paid_amount NUMERIC DEFAULT 0,
    due_date DATE,
    status TEXT DEFAULT 'pending',
    tracking_code TEXT UNIQUE DEFAULT 'TRX-' || upper(substr(md5(random()::text), 1, 6)),
    progress_percent INTEGER DEFAULT 0,
    priority TEXT DEFAULT 'medium',
    title TEXT
);

-- 4. Team Members (Admin staff)
-- Ensure is_super_admin and auth_user_id exist
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    role TEXT NOT NULL DEFAULT 'collaborator',
    is_super_admin BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    auth_user_id UUID REFERENCES auth.users(id),
    avatar_url TEXT,
    phone TEXT,
    notification_preferences JSONB DEFAULT '{
      "new_projects": true,
      "project_milestones": true,
      "financial_summaries": false,
      "system_alerts": true
    }'::jsonb
);

-- Fix for existing tables:
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT false;
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "new_projects": true,
  "project_milestones": true,
  "financial_summaries": false,
  "system_alerts": true
}'::jsonb;

-- Also check students
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);

-- 5. Analysis Reports (AI Persistence)
CREATE TABLE IF NOT EXISTS public.analysis_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  project_id UUID NOT NULL, -- Logical link to scholar_projects.id
  type TEXT NOT NULL,
  result JSONB NOT NULL,
  status TEXT DEFAULT 'ok',
  warnings TEXT[] DEFAULT '{}',
  version TEXT DEFAULT '1.0'
);

-- 6. Notification Logs
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  team_member_id UUID REFERENCES public.team_members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ==============================================================================
-- 7. RLS FUNCTIONS & POLICIES
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM public.team_members
      WHERE auth_user_id = auth.uid()
      AND is_active = true
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM public.team_members
      WHERE auth_user_id = auth.uid()
      AND is_super_admin = true
      AND is_active = true
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholar_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- scholar_projects Policies
CREATE POLICY "Users can manage own scholar_projects" 
ON public.scholar_projects FOR ALL 
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Admins can view all scholar_projects" 
ON public.scholar_projects FOR SELECT 
USING (public.is_admin());

-- analysis_reports Policies
CREATE POLICY "Users can manage own analyses" 
ON public.analysis_reports FOR ALL 
USING (EXISTS (
    SELECT 1 FROM public.scholar_projects 
    WHERE id = project_id AND owner_id = auth.uid()
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.scholar_projects 
    WHERE id = project_id AND owner_id = auth.uid()
));

-- team_members Policies
CREATE POLICY "Super admins can manage team_members"
ON public.team_members FOR ALL
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

CREATE POLICY "Users can view own team_member profile"
ON public.team_members FOR SELECT
USING (auth.uid() = auth_user_id);
