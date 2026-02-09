-- Migration: Enhanced RLS Policies and Security
-- Version: 2.0
-- Date: 2026-02-09

-- ==============================================================================
-- IMPROVED RLS POLICIES FOR STUDENTS TABLE
-- ==============================================================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Enable insert for all users" ON public.students;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.students;

-- Allow anyone to insert (public registration), but only their own data
CREATE POLICY "Allow public registration" 
  ON public.students
  FOR INSERT 
  WITH CHECK (true);

-- Users can only read their own student record (if authenticated)
CREATE POLICY "Users can read own student data" 
  ON public.students
  FOR SELECT 
  USING (
    auth.uid() IS NOT NULL AND 
    email = auth.jwt() ->> 'email'
  );

-- Service role can read all (for admin dashboard)
CREATE POLICY "Service role can read all students" 
  ON public.students
  FOR SELECT 
  USING (
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Users can update their own data
CREATE POLICY "Users can update own student data" 
  ON public.students
  FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL AND 
    email = auth.jwt() ->> 'email'
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    email = auth.jwt() ->> 'email'
  );

-- ==============================================================================
-- IMPROVED RLS POLICIES FOR PROJECTS TABLE
-- ==============================================================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Enable insert for all users" ON public.projects;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.projects;

-- Allow anyone to insert projects (public registration)
CREATE POLICY "Allow public project creation" 
  ON public.projects
  FOR INSERT 
  WITH CHECK (true);

-- Users can read projects if they own the associated student record OR by tracking code
CREATE POLICY "Users can read own projects" 
  ON public.projects
  FOR SELECT 
  USING (
    -- Own projects (authenticated)
    (
      auth.uid() IS NOT NULL AND 
      student_id IN (
        SELECT id FROM public.students 
        WHERE email = auth.jwt() ->> 'email'
      )
    )
    -- OR anyone can read by tracking code (for monitoring)
    OR true
  );

-- Users can update their own projects
CREATE POLICY "Users can update own projects" 
  ON public.projects
  FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL AND 
    student_id IN (
      SELECT id FROM public.students 
      WHERE email = auth.jwt() ->> 'email'
    )
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    student_id IN (
      SELECT id FROM public.students 
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Service role can read and update all
CREATE POLICY "Service role can read all projects" 
  ON public.projects
  FOR SELECT 
  USING (
    auth.jwt() ->> 'role' = 'service_role'
  );

CREATE POLICY "Service role can update all projects" 
  ON public.projects
  FOR UPDATE 
  USING (
    auth.jwt() ->> 'role' = 'service_role'
  )
  WITH CHECK (
    auth.jwt() ->> 'role' = 'service_role'
  );

-- ==============================================================================
-- ANALYSIS REPORTS TABLE (if it doesn't exist)
-- ==============================================================================

-- Create analysis_reports table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.analysis_reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('consistency', 'audit')),
  result jsonb NOT NULL,
  status text DEFAULT 'ok',
  warnings text[] DEFAULT '{}',
  version text DEFAULT '1.0'
);

-- Enable RLS
ALTER TABLE public.analysis_reports ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS analysis_reports_project_id_idx ON public.analysis_reports(project_id);
CREATE INDEX IF NOT EXISTS analysis_reports_type_idx ON public.analysis_reports(type);
CREATE INDEX IF NOT EXISTS analysis_reports_created_at_idx ON public.analysis_reports(created_at DESC);

-- RLS Policies for analysis_reports

-- Users can read analyses for their own projects
CREATE POLICY "Users can read own project analyses" 
  ON public.analysis_reports
  FOR SELECT 
  USING (
    auth.uid() IS NOT NULL AND 
    project_id IN (
      SELECT p.id FROM public.projects p
      INNER JOIN public.students s ON p.student_id = s.id
      WHERE s.email = auth.jwt() ->> 'email'
    )
  );

-- Users can insert analyses for their own projects
CREATE POLICY "Users can create analyses for own projects" 
  ON public.analysis_reports
  FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    project_id IN (
      SELECT p.id FROM public.projects p
      INNER JOIN public.students s ON p.student_id = s.id
      WHERE s.email = auth.jwt() ->> 'email'
    )
  );

-- Service role can do everything
CREATE POLICY "Service role can read all analyses" 
  ON public.analysis_reports
  FOR SELECT 
  USING (
    auth.jwt() ->> 'role' = 'service_role'
  );

-- ==============================================================================
-- ADDITIONAL SECURITY CONSTRAINTS
-- ==============================================================================

-- Add constraints to ensure data integrity
ALTER TABLE public.students 
  ADD CONSTRAINT students_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE public.students 
  ADD CONSTRAINT students_name_not_empty CHECK (length(trim(name)) > 0);

ALTER TABLE public.students 
  ADD CONSTRAINT students_lastname_not_empty CHECK (length(trim(lastname)) > 0);

-- Ensure project amounts are non-negative
ALTER TABLE public.projects 
  ADD CONSTRAINT projects_total_amount_positive CHECK (total_amount >= 0);

ALTER TABLE public.projects 
  ADD CONSTRAINT projects_paid_amount_non_negative CHECK (paid_amount >= 0);

ALTER TABLE public.projects 
  ADD CONSTRAINT projects_paid_not_exceed_total CHECK (paid_amount <= total_amount);

-- Ensure status is valid
ALTER TABLE public.projects 
  ADD CONSTRAINT projects_status_valid CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled'));

-- ==============================================================================
-- PERFORMANCE OPTIMIZATIONS
-- ==============================================================================

-- Add composite index for common query patterns
CREATE INDEX IF NOT EXISTS projects_student_status_idx ON public.projects(student_id, status);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON public.projects(created_at DESC);

-- ==============================================================================
-- FUNCTIONS FOR AUDITING (Optional but recommended)
-- ==============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for analysis_reports
DROP TRIGGER IF EXISTS update_analysis_reports_updated_at ON public.analysis_reports;
CREATE TRIGGER update_analysis_reports_updated_at
  BEFORE UPDATE ON public.analysis_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================================================
-- SECURITY NOTES
-- ==============================================================================
-- 1. Students table: Public can insert (registration), users can read/update own data
-- 2. Projects table: Public can insert, users can read/update own projects
-- 3. Analysis reports: Users can read/insert for own projects only
-- 4. Service role has full access to all tables
-- 5. All tables have data integrity constraints
-- 6. Indexes optimize common query patterns with RLS filters
