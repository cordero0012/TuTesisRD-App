-- =============================================
-- TuTesis RD - Admin Panel Database Tables
-- Migration: 2026-03-04
-- =============================================

-- 1. Team Members Table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'collaborator', -- 'admin', 'collaborator', 'reviewer'
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  projects_count INTEGER DEFAULT 0
);

-- 2. Project Assignments (many-to-many)
CREATE TABLE IF NOT EXISTS public.project_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  team_member_id UUID REFERENCES public.team_members(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'assigned', -- 'assigned', 'reviewer', 'supervisor'
  UNIQUE(project_id, team_member_id)
);

-- 3. Project Notes (progress log)
CREATE TABLE IF NOT EXISTS public.project_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  note_type TEXT DEFAULT 'progress' -- 'progress', 'issue', 'review', 'delivery'
);

-- 4. Project Milestones
CREATE TABLE IF NOT EXISTS public.project_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  estimated_date DATE,
  completed_date DATE,
  is_completed BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0
);

-- 5. Financial Transactions
CREATE TABLE IF NOT EXISTS public.financial_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC NOT NULL CHECK (amount > 0),
  concept TEXT NOT NULL,
  category TEXT, -- 'payment', 'material', 'salary', 'tools', 'marketing', 'other'
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  team_member_id UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  transaction_date DATE DEFAULT CURRENT_DATE,
  notes TEXT
);

-- 6. Add new columns to existing projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS progress_percent INTEGER DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low'));
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS title TEXT;

-- 7. Indexes for performance
CREATE INDEX IF NOT EXISTS team_members_email_idx ON public.team_members(email);
CREATE INDEX IF NOT EXISTS team_members_active_idx ON public.team_members(is_active);
CREATE INDEX IF NOT EXISTS project_assignments_project_idx ON public.project_assignments(project_id);
CREATE INDEX IF NOT EXISTS project_assignments_member_idx ON public.project_assignments(team_member_id);
CREATE INDEX IF NOT EXISTS project_notes_project_idx ON public.project_notes(project_id);
CREATE INDEX IF NOT EXISTS project_milestones_project_idx ON public.project_milestones(project_id);
CREATE INDEX IF NOT EXISTS financial_transactions_type_idx ON public.financial_transactions(type);
CREATE INDEX IF NOT EXISTS financial_transactions_project_idx ON public.financial_transactions(project_id);
CREATE INDEX IF NOT EXISTS financial_transactions_date_idx ON public.financial_transactions(transaction_date);

-- 8. RLS Policies (allow authenticated users full access for admin panel)
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- Policies: Allow all operations for authenticated users (admin)
CREATE POLICY "Admin full access team_members" ON public.team_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access project_assignments" ON public.project_assignments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access project_notes" ON public.project_notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access project_milestones" ON public.project_milestones FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access financial_transactions" ON public.financial_transactions FOR ALL USING (true) WITH CHECK (true);
