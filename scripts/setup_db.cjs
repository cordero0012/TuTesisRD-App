const https = require('https');

const token = 'sbp_fdefde65fc39c192ee9e3edb7b07a9f3e3d24ef5';
const projectRef = 'rxzphenvgpbitltqrtjw';

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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT projects_tracking_code_key UNIQUE (tracking_code)
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for all users" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for all" ON projects FOR SELECT USING (true);
`;

const data = JSON.stringify({ query: sql });

const options = {
    hostname: 'api.supabase.com',
    path: `/v1/projects/${projectRef}/query`,
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data), // Handle unicode correctly? JSON.stringify handles it? Buffer length is safer.
        'User-Agent': 'NodeJS-Script'
    }
};

const req = https.request(options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log("SQL Executed successfully.");
            console.log(responseBody);
        } else {
            console.error("SQL Execution failed.");
            console.error(responseBody);
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
