// Comprueba el enrutado de vercel.json contra dist/ SIN desplegar.
//
// Por que existe: el 2026-08-21 se descubrio que el comodin `/(.*)` -> `/`
// servia cualquier URL inexistente como la portada, con HTTP 200, `index,
// follow` y el `canonical` de la home. Es un fallo INVISIBLE desde el
// navegador --la pagina se ve perfectamente-- y solo se detecta mirando el
// codigo de estado. Al acotar el comodin habia que demostrar dos cosas a la
// vez: que la basura pasa a 404 y que ninguna ruta real se rompio por el
// camino. Esto hace justo eso, y sin desplegar nada.
//
//   npm run build                      # imprescindible: se comprueba dist/
//   node scripts/verify-routing.mjs
//
// Sale con codigo 1 si hay una regresion, asi que vale tal cual para CI.
// Con --serve levanta el simulador en :4180 para curiosear a mano.
//
// Las expectativas NO estan escritas a mano: las rutas que deben responder
// 200 se derivan de los index.html que dejo el prerender en dist/, de modo
// que si el prerender gana o pierde una ruta, esta comprobacion se entera
// sola en vez de quedarse mintiendo.
//
// Ojo con lo que este script NO puede ver: la redireccion del apex a www
// depende de la cabecera Host y la aplica el edge de Vercel antes que
// vercel.json, asi que aqui se omite. Esa hay que medirla contra el dominio
// real con `curl -sI https://tutesisrd.online/`.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));

if (!fs.existsSync(DIST)) {
  console.error('No hay dist/. Ejecuta `npm run build` antes que esto.');
  process.exit(1);
}

// --- traduccion de los `source` de Vercel a RegExp --------------------------
// Cubre las tres formas que usa este proyecto: (.*), :param y :param*
const SPECIAL = '.*+?^${}()|[]';
const BS = String.fromCharCode(92);

function toRe(source) {
  let re = '';
  let i = 0;
  while (i < source.length) {
    const c = source[i];
    if (c === '(') {
      const end = source.indexOf(')', i);
      re += source.slice(i, end + 1);
      i = end + 1;
    } else if (c === ':') {
      let j = i + 1;
      while (j < source.length && /[A-Za-z0-9_]/.test(source[j])) j += 1;
      if (source[j] === '*') {
        re += '(.*)';
        j += 1;
      } else {
        re += '([^/]+)';
      }
      i = j;
    } else {
      re += SPECIAL.indexOf(c) >= 0 ? BS + c : c;
      i += 1;
    }
  }
  return new RegExp('^' + re + '$');
}

const GROUP_REF = new RegExp(BS + '$(' + BS + 'd+)', 'g');
const expand = (dest, m) => dest.replace(GROUP_REF, (_, n) => m[Number(n)] || '');

function onDisk(p) {
  const clean = decodeURIComponent(p.split('?')[0]);
  const asFile = path.join(DIST, clean);
  if (fs.existsSync(asFile) && fs.statSync(asFile).isFile()) return asFile;
  const asIndex = path.join(DIST, clean, 'index.html');
  if (fs.existsSync(asIndex)) return asIndex;
  return null;
}

// --- el orden real de Vercel: redirects, ficheros, rewrites, 404 ------------
// El paso 2 es el que hace seguro acotar el comodin: el sistema de ficheros
// tiene precedencia sobre los rewrites, asi que las rutas prerenderizadas se
// resuelven solas y nunca llegan a necesitar el respaldo de la SPA.
export function resolve(url) {
  const p = url.split('?')[0];

  for (const r of cfg.redirects || []) {
    if (r.has) continue; // depende del Host (apex -> www); no se puede simular
    const m = p.match(toRe(r.source));
    if (m) return { status: r.permanent ? 308 : 307, location: expand(r.destination, m) };
  }

  let file = onDisk(p);

  if (!file) {
    for (const r of cfg.rewrites || []) {
      const m = p.match(toRe(r.source));
      if (!m) continue;
      const dest = expand(r.destination, m);
      if (dest.startsWith('/api/')) return { status: 200, file: '(funcion serverless)' };
      file = onDisk(dest);
      break;
    }
  }

  if (!file) return { status: 404, file: path.join(DIST, '404.html') };
  return { status: 200, file };
}

const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

if (process.argv.includes('--serve')) {
  http
    .createServer((req, res) => {
      const out = resolve(req.url);
      if (out.location) {
        res.writeHead(out.status, { Location: out.location });
        return res.end();
      }
      const body = out.file && fs.existsSync(out.file) ? fs.readFileSync(out.file) : 'Not Found';
      res.writeHead(out.status, { 'content-type': TYPES[path.extname(out.file || '')] || 'text/plain' });
      return res.end(body);
    })
    .listen(4180, () => console.log('Simulador de enrutado en http://localhost:4180'));
} else {
  // 200: todo lo que el prerender dejo en dist/, mas lo que solo cubre un rewrite.
  const prerendered = [];
  (function walk(dir, base) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) walk(path.join(dir, e.name), base + '/' + e.name);
      else if (e.name === 'index.html') prerendered.push(base === '' ? '/' : base);
    }
  })(DIST, '');

  const debenSer200 = [
    ...prerendered,
    '/admin',
    '/admin/proyectos',
    '/admin/finanzas',
    '/admin/settings',
    '/robots.txt',
    '/sitemap.xml',
  ];

  // 404: basura inventada, que hasta el 2026-08-21 se servia como la portada
  // declarandose `index, follow` y canonica de la home.
  //
  // Sondeos tipicos de bots (/wp-admin, /index.php, /.env) los comprobaba este
  // script y aqui daban 404, pero medido en produccion devuelven **403** con
  // `X-Vercel-Mitigated: deny`: el firewall de Vercel los corta en el edge
  // ANTES de que se evalue vercel.json, asi que nunca llegan a este enrutado.
  // Se dejan fuera para que la comprobacion local no prometa algo que la
  // produccion no cumple -- 403 ahi no es un fallo, es un corte mas temprano.
  const debenSer404 = [
    '/ruta-que-no-existe-xyz',
    '/blog/no-existe-abc',
    '/tesis/universidad-inventada',
    '/recursos/inventado',
    '/portal/inventado',
    '/herramientas/inventado',
    '/blog/categoria/inventada',
    '/servicios/inventado',
  ];

  const debenRedirigir = (cfg.redirects || [])
    .filter((r) => !r.has)
    .map((r) => r.source.replace(/:[A-Za-z0-9_]+\*/, 'lo-que-sea').replace(/\(\.\*\)/, 'lo-que-sea'));

  let fallos = 0;
  const linea = (ok, got, want, etiqueta) => {
    if (!ok) fallos += 1;
    console.log(`  ${ok ? 'ok' : 'XX'}  ${String(got).padEnd(4)} (esperado ${want})  ${etiqueta}`);
  };

  console.log('\nRutas reales (deben responder 200)');
  for (const u of debenSer200) {
    const r = resolve(u);
    linea(r.status === 200, r.status, 200, u);
  }

  console.log('\nURLs inexistentes (deben responder 404, no servirse como la portada)');
  for (const u of debenSer404) {
    const r = resolve(u);
    linea(r.status === 404, r.status, 404, u);
  }

  console.log('\nRedirecciones (deben responder 308 permanente)');
  for (const u of debenRedirigir) {
    const r = resolve(u);
    linea(r.status === 308, r.status, 308, `${u} -> ${r.location || '?'}`);
  }

  // Que el 404 no se declare canonico de la home era el nucleo del fallo.
  console.log('\nCabecera del 404');
  const html404 = fs.readFileSync(path.join(DIST, '404.html'), 'utf8');
  const noindex = /<meta name="robots" content="noindex/.test(html404);
  const canonical = (html404.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  linea(noindex, noindex ? 'si' : 'no', 'noindex', 'declara noindex');
  linea(canonical.endsWith('/404'), canonical || '(ninguno)', '.../404', 'canonical propio, no el de la home');

  console.log(
    fallos === 0
      ? `\nSin regresiones: ${debenSer200.length} rutas en 200, ${debenSer404.length} en 404, ${debenRedirigir.length} redirecciones.\n`
      : `\n${fallos} comprobacion(es) fallaron. NO despliegues esto.\n`,
  );
  process.exit(fallos === 0 ? 0 : 1);
}
