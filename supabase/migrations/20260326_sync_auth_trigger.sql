-- ==============================================================================
-- 1. AUTO-SYNC TRIGGER FOR NEW AUTH.USERS
-- ==============================================================================

-- Create the function that will be executed by the trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role TEXT;
    user_name TEXT;
BEGIN
    -- Extract role and name from metadata, defaulting to student if missing
    user_role := COALESCE(new.raw_user_meta_data->>'role', 'student');
    user_name := COALESCE(new.raw_user_meta_data->>'full_name', 'Nuevo Usuario');

    IF user_role IN ('admin', 'collaborator', 'reviewer') THEN
        -- Insert into team_members
        INSERT INTO public.team_members (auth_user_id, email, name, role, is_active)
        VALUES (new.id, new.email, user_name, user_role, true)
        ON CONFLICT (email) DO UPDATE 
        SET auth_user_id = EXCLUDED.auth_user_id;
    ELSE
        -- Insert into students
        INSERT INTO public.students (auth_user_id, email, name)
        VALUES (new.id, new.email, user_name)
        -- Assuming students might have an email conflict constraint
        ON CONFLICT (email) DO UPDATE 
        SET auth_user_id = EXCLUDED.auth_user_id;
    END IF;
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to avoid errors on re-run
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger on auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 2. PERFORMANCE INDEXING
-- ==============================================================================

-- Speed up queries on analysis_reports which is heavily used by persistenceService
CREATE INDEX IF NOT EXISTS analysis_reports_project_id_idx ON public.analysis_reports(project_id);
CREATE INDEX IF NOT EXISTS analysis_reports_created_at_idx ON public.analysis_reports(created_at DESC);
