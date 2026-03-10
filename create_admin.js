import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://svtcteibilcazhphvmgn.supabase.co';
const supabaseServiceKey = 'sbp_74ace5aee14a3b83cdbf34941a1e39a0370b4cfb'; // Using the provided token as it might have service role privileges or we can use the actual service role key if needed... wait, the token provided is a Personal Access Token (sbp_), not a service role key.

// Wait, Personal Access Tokens (pat) are for the Management API.
// To use Supabase JS admin api, we need the service_role key.
