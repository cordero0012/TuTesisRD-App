-- ==============================================================================
-- 1. ENHANCE TEAM MEMBERS FOR ADMIN ROLES
-- ==============================================================================

-- Add Auth Link and SuperAdmin flag to team_members
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT false;

-- Add Auth Link to students
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);

-- ==============================================================================
-- 2. UPDATED RLS POLICIES FOR SECURE ADMIN ACCESS
-- ==============================================================================

-- Function to check if the current user is an admin
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

-- Function to check if the current user is a super admin
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

-- Update team_members policies
DROP POLICY IF EXISTS "Admin full access team_members" ON public.team_members;

CREATE POLICY "Super admins can manage team_members"
  ON public.team_members
  FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "Admins can view team_members"
  ON public.team_members
  FOR SELECT
  USING (public.is_admin());

-- Update project policies to allow admins
CREATE POLICY "Admins can manage all projects"
  ON public.projects
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 3. INITIAL SUPER ADMIN SEED (Template)
-- ==============================================================================
-- NOTE: This requires the Super Admin to already exist in auth.users
-- INSERT INTO public.team_members (name, email, role, is_super_admin, auth_user_id)
-- SELECT 'Admin Name', 'admin@email.com', 'admin', true, id
-- FROM auth.users WHERE email = 'admin@email.com';
