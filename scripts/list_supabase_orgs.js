/**
 * Lista las organizaciones de Supabase a las que da acceso un token.
 *
 * Uso:
 *   SUPABASE_ACCESS_TOKEN=sbp_... node scripts/list_supabase_orgs.js
 *
 * El token va SIEMPRE por entorno, nunca escrito aquí. Este archivo llevaba uno
 * a mano desde el commit d106171 (2026-01-15) y este repositorio es PÚBLICO, así
 * que ese token estuvo expuesto en GitHub unos siete meses. Quitarlo de aquí no
 * lo borra del historial: la única forma de neutralizarlo es revocarlo en
 * https://supabase.com/dashboard/account/tokens. Ver AGENTS.md §5.
 */

const https = require('https');

const token = process.env.SUPABASE_ACCESS_TOKEN;

if (!token) {
    console.error('Falta SUPABASE_ACCESS_TOKEN en el entorno.');
    console.error('Uso: SUPABASE_ACCESS_TOKEN=sbp_... node scripts/list_supabase_orgs.js');
    process.exit(1);
}

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
            // El cuerpo de un error de la API de Supabase no repite el token,
            // pero no lo volcamos entero por si acaso.
            console.error(`Request failed with status: ${res.statusCode}`);
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
