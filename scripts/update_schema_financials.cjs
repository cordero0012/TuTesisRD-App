const { Client } = require('pg');

const projectRef = 'rxzphenvgpbitltqrtjw';
const dbPass = 'TuTesisRD_2026_Secure!';
const connectionString = `postgres://postgres:${dbPass}@db.${projectRef}.supabase.co:5432/postgres`;

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

const sql = `
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS due_date DATE,
ADD COLUMN IF NOT EXISTS total_amount NUMERIC,
ADD COLUMN IF NOT EXISTS paid_amount NUMERIC;
`;

async function run() {
    try {
        await client.connect();
        console.log("Connected to database.");
        await client.query(sql);
        console.log("Schema updated successfully.");
    } catch (err) {
        console.error("Database error:", err);
    } finally {
        await client.end();
    }
}

run();
