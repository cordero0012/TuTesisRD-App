-- =============================================
-- TuTesis RD - Super Admin Initialization
-- =============================================

-- INSTRUCTIONS:
-- 1. Go to your Supabase Dashboard -> SQL Editor
-- 2. First, sign up as a regular user in your application (using the email you want for admin)
-- 3. Run the query below, replacing 'YOUR_EMAIL@example.com' with the email you just registered.

-- This will "promote" your account to Super Admin status.

DO $$
DECLARE
    target_email TEXT := 'admin@tutesisrd.com'; -- <--- CHANGE THIS TO YOUR EMAIL
    target_id UUID;
BEGIN
    -- Get the auth ID from the email
    SELECT id INTO target_id FROM auth.users WHERE email = target_email;

    IF target_id IS NULL THEN
        RAISE NOTICE 'User with email % not found in auth.users. Please sign up in the app first.', target_email;
    ELSE
        -- Insert or Update the team_members record
        INSERT INTO public.team_members (
            name, 
            email, 
            role, 
            is_super_admin, 
            auth_user_id, 
            is_active
        )
        VALUES (
            'Super Admin', 
            target_email, 
            'admin', 
            true, 
            target_id, 
            true
        )
        ON CONFLICT (email) 
        DO UPDATE SET 
            is_super_admin = true, 
            role = 'admin', 
            auth_user_id = target_id,
            is_active = true;
            
        RAISE NOTICE 'User % has been promoted to Super Admin successfully!', target_email;
    END IF;
END $$;
