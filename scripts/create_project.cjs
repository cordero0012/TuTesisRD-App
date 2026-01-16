const https = require('https');

const token = 'sbp_fdefde65fc39c192ee9e3edb7b07a9f3e3d24ef5';
const orgId = 'pzelpywqbkkerprhrnhg';
const dbPass = 'TuTesisRD_2026_Secure!'; // Strong password

const data = JSON.stringify({
    name: 'TuTesisRD',
    organization_id: orgId,
    db_pass: dbPass,
    region: 'us-east-1',
    plan: 'free'
});

const options = {
    hostname: 'api.supabase.com',
    path: '/v1/projects',
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'User-Agent': 'NodeJS-Script'
    }
};

const req = https.request(options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
                const project = JSON.parse(responseBody);
                console.log("Project created successfully!");
                console.log(`ID: ${project.id}`);
                console.log(`Reference ID: ${project.ref || 'N/A'}`); // Sometimes returned as 'ref' or just 'id' is mostly useful
                // Important: We need to know when it is ready.
            } catch (e) {
                console.error("Error parsing JSON response:", e);
                console.log("Raw Body:", responseBody);
            }
        } else {
            console.error(`Request failed with status: ${res.statusCode}`);
            console.error("Body:", responseBody);
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
