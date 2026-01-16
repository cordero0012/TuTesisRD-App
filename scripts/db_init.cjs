const { Client } = require('pg');

const projectRef = 'rxzphenvgpbitltqrtjw';
const dbPass = 'TuTesisRD_2026_Secure!';
const connectionString = `postgres://postgres:${dbPass}@db.${projectRef}.supabase.co:5432/postgres`;

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

const sql = `
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  university TEXT NOT NULL,
  career TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT,
  amount TEXT,
  status TEXT DEFAULT 'pending',
  tracking_code TEXT UNIQUE DEFAULT upper(substring(md5(random()::text), 1, 8)),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for registration)
CREATE POLICY "Enable insert for all users" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON projects FOR INSERT WITH CHECK (true);

-- Allow select by tracking code (via public select for now, MVP)
CREATE POLICY "Enable select for all" ON projects FOR SELECT USING (true);
`;

async function run() {
    try {
        await client.connect();
        console.log("Connected to database.");
        await client.query(sql);
        console.log("Schema applied successfully.");
    } catch (err) {
        console.error("Database error:", err);
    } finally {
        await client.end();
    }
}

run();
