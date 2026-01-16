import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rxzphenvgpbitltqrtjw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4enBoZW52Z3BiaXRsdHFydGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MjIyMjIsImV4cCI6MjA4NDA5ODIyMn0.lyaCydU7VZnt4SdHGjmvZXsewtYzMqsA8AFIJAiWV5I'

export const supabase = createClient(supabaseUrl, supabaseKey)
