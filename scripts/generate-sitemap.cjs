const fs = require('fs');
const path = require('path');

// Import JSON directly using readFileSync to avoid JSON import assertions issues in plain node
const dataPath = path.resolve(__dirname, '../src/data/universities.json');
const universities = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const BASE_URL = 'https://tutesisrd.com';
const TODAY = new Date().toISOString().split('T')[0];

const staticPages = [
    '',
    '/nosotros',
    '/servicios',
    '/universidades',
    '/blog',
    '/registro',
    '/herramientas/auditor',
    '/design'
];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

// Add Static Pages
staticPages.forEach(page => {
    sitemap += `
    <url>
        <loc>${BASE_URL}${page}</loc>
        <lastmod>${TODAY}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${page === '' ? '1.0' : '0.8'}</priority>
    </url>`;
});

// Add Dynamic University Pages
universities.forEach((uni) => {
    sitemap += `
    <url>
        <loc>${BASE_URL}/tesis/${uni.id}</loc>
        <lastmod>${TODAY}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    </url>`;
});

sitemap += `
</urlset>`;

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap.trim());

console.log(`✅ Sitemap generated at ${path.join(publicDir, 'sitemap.xml')} with ${staticPages.length + universities.length} URLs.`);
