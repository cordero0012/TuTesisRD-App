const https = require('https');

const token = 'sbp_fdefde65fc39c192ee9e3edb7b07a9f3e3d24ef5';

const options = {
    hostname: 'api.supabase.com',
    path: '/v1/organizations',
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'NodeJS-Script' // Good practice
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
                const orgs = JSON.parse(data);
                console.log("Organizations found:");
                orgs.forEach(org => {
                    console.log(`- Name: ${org.name}, ID: ${org.id}`);
                });
            } catch (e) {
                console.error("Error parsing JSON response:", e);
                console.log("Raw Body:", data);
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
