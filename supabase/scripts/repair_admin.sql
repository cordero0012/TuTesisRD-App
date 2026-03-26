-- ==============================================================================
-- REPAIR & PROMOTE ADMIN
-- Run this in the Supabase SQL Editor if you can log in but cannot enter the admin panel.
-- ==============================================================================

-- 1. Ensure the admin user exists in team_members and is linked to their Auth ID
-- Replace 'admin@tutesisrd.com' if you are using a different email.
INSERT INTO public.team_members (name, email, role, is_super_admin, auth_user_id, is_active)
SELECT 'Super Admin', email, 'admin', true, id, true
FROM auth.users 
WHERE email = 'admin@tutesisrd.com'
ON CONFLICT (email) DO UPDATE 
SET auth_user_id = EXCLUDED.auth_user_id,
    is_super_admin = true,
    role = 'admin',
    is_active = true;

-- 2. Verify results
SELECT * FROM public.team_members WHERE email = 'admin@tutesisrd.com';
