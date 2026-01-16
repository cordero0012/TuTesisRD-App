const https = require('https');

const token = 'sbp_fdefde65fc39c192ee9e3edb7b07a9f3e3d24ef5';
const projectRef = 'rxzphenvgpbitltqrtjw';

const options = {
    hostname: 'api.supabase.com',
    path: `/v1/projects/${projectRef}/api-keys`,
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'NodeJS-Script'
    }
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
                const keys = JSON.parse(data);
                const fs = require('fs');
                fs.writeFileSync('supabase_config.json', JSON.stringify(keys, null, 2));
                console.log("Keys saved to supabase_config.json");
            } catch (e) {
                console.error("Error parsing JSON response:", e);
            }
        } else {
            console.error(`Request failed with status: ${res.statusCode}`);
            console.error("Body:", data);
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
