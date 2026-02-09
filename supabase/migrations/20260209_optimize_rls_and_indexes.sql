-- Migration: Optimize RLS and Add Missing Indexes
-- Version: 2.1
-- Date: 2026-02-09
-- Description: Fixes linter warnings about auth.uid() performance and missing FK indexes

-- ==============================================================================
-- 1. OPTIMIZE RLS POLICIES (Use (select auth.uid()) cache)
-- ==============================================================================

-- STUDENTS TABLE
DROP POLICY IF EXISTS "Allow public registration" ON public.students;
DROP POLICY IF EXISTS "Users can read own student data" ON public.students;
DROP POLICY IF EXISTS "Service role can read all students" ON public.students;
DROP POLICY IF EXISTS "Users can update own student data" ON public.students;

CREATE POLICY "Allow public registration" 
  ON public.students FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can read own student data" 
  ON public.students FOR SELECT 
  USING (
    (select auth.uid()) IS NOT NULL AND 
    email = (select auth.jwt() ->> 'email')
  );

CREATE POLICY "Service role can read all students" 
  ON public.students FOR SELECT 
  USING (
    (select auth.jwt() ->> 'role') = 'service_role'
  );

CREATE POLICY "Users can update own student data" 
  ON public.students FOR UPDATE 
  USING (
    (select auth.uid()) IS NOT NULL AND 
    email = (select auth.jwt() ->> 'email')
  )
  WITH CHECK (
    (select auth.uid()) IS NOT NULL AND 
    email = (select auth.jwt() ->> 'email')
  );

-- PROJECTS TABLE
DROP POLICY IF EXISTS "Allow public project creation" ON public.projects;
DROP POLICY IF EXISTS "Users can read own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Service role can read all projects" ON public.projects;
DROP POLICY IF EXISTS "Service role can update all projects" ON public.projects;

CREATE POLICY "Allow public project creation" 
  ON public.projects FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can read own projects" 
  ON public.projects FOR SELECT 
  USING (
    (
      (select auth.uid()) IS NOT NULL AND 
      student_id IN (
        SELECT id FROM public.students 
        WHERE email = (select auth.jwt() ->> 'email')
      )
    )
    OR true -- Keep public tracking code access
  );

CREATE POLICY "Users can update own projects" 
  ON public.projects FOR UPDATE 
  USING (
    (select auth.uid()) IS NOT NULL AND 
    student_id IN (
      SELECT id FROM public.students 
      WHERE email = (select auth.jwt() ->> 'email')
    )
  )
  WITH CHECK (
    (select auth.uid()) IS NOT NULL AND 
    student_id IN (
      SELECT id FROM public.students 
      WHERE email = (select auth.jwt() ->> 'email')
    )
  );

CREATE POLICY "Service role can read all projects" 
  ON public.projects FOR SELECT 
  USING (
    (select auth.jwt() ->> 'role') = 'service_role'
  );

CREATE POLICY "Service role can update all projects" 
  ON public.projects FOR UPDATE 
  USING (
    (select auth.jwt() ->> 'role') = 'service_role'
  )
  WITH CHECK (
    (select auth.jwt() ->> 'role') = 'service_role'
  );

-- ANALYSIS REPORTS TABLE
DROP POLICY IF EXISTS "Users can read own project analyses" ON public.analysis_reports;
DROP POLICY IF EXISTS "Users can create analyses for own projects" ON public.analysis_reports;
DROP POLICY IF EXISTS "Service role can read all analyses" ON public.analysis_reports;

CREATE POLICY "Users can read own project analyses" 
  ON public.analysis_reports FOR SELECT 
  USING (
    (select auth.uid()) IS NOT NULL AND 
    project_id IN (
      SELECT p.id FROM public.projects p
      INNER JOIN public.students s ON p.student_id = s.id
      WHERE s.email = (select auth.jwt() ->> 'email')
    )
  );

CREATE POLICY "Users can create analyses for own projects" 
  ON public.analysis_reports FOR INSERT 
  WITH CHECK (
    (select auth.uid()) IS NOT NULL AND 
    project_id IN (
      SELECT p.id FROM public.projects p
      INNER JOIN public.students s ON p.student_id = s.id
      WHERE s.email = (select auth.jwt() ->> 'email')
    )
  );

CREATE POLICY "Service role can read all analyses" 
  ON public.analysis_reports FOR SELECT 
  USING (
    (select auth.jwt() ->> 'role') = 'service_role'
  );

-- ==============================================================================
-- 2. ADD MISSING INDEXES FOR FOREIGN KEYS (Linter fixes)
-- ==============================================================================

-- budget_plans
CREATE INDEX IF NOT EXISTS budget_plans_user_id_idx ON public.budget_plans(user_id);

-- credit_cards
CREATE INDEX IF NOT EXISTS credit_cards_user_id_idx ON public.credit_cards(user_id);

-- debts
CREATE INDEX IF NOT EXISTS debts_user_id_idx ON public.debts(user_id);

-- goals
CREATE INDEX IF NOT EXISTS goals_user_id_idx ON public.goals(user_id);

-- transactions
CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON public.transactions(user_id);

-- profiles (referenced in linter warnings, good practice)
CREATE INDEX IF NOT EXISTS profiles_id_idx ON public.profiles(id);

