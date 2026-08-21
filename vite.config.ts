import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  // Only use the repo-specific base path on GitHub Actions (for GitHub Pages)
  return {
    base: '/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    build: {
      chunkSizeWarningLimit: 1000,

      // AQUI HABIA UN `rollupOptions.output.manualChunks` Y QUITARLO FUE EL
      // ARREGLO. No lo vuelvas a poner sin leer esto.
      //
      // Agrupaba a mano los vendors: 'pdf-vendor': ['pdfjs-dist','jspdf',...],
      // 'doc-vendor', 'ai-vendor', 'react-vendor'. El efecto real era el
      // contrario del buscado: Rollup metia el helper `__vitePreload` de Vite
      // --el modulo virtual que implementa TODO import() dinamico-- dentro de
      // `pdf-vendor`. A partir de ahi, CUALQUIER chunk de la app necesitaba
      // `pdf-vendor` solo para arrancar, `index.html` lo declaraba en un
      // <link rel="modulepreload"> y la PORTADA se descargaba 270 kB
      // comprimidos (871 kB en crudo) de pdfjs/jspdf que no usa. Justo la
      // pagina que recibe el trafico de Google Ads y Meta.
      //
      // Probado: la forma de funcion (`manualChunks(id) {...}`) NO lo arregla,
      // el helper sigue cayendo en `pdf-vendor`. Lo unico que lo arregla es no
      // agrupar a mano y dejar que Vite reparta segun los `lazy(() =>
      // import())` de App.tsx, que ya cubren todas las rutas.
      //
      // Medido en `dist/index.html`:
      //   antes  -> index + pdf-vendor + react-vendor  ~= 432 kB gzip
      //   ahora  -> index                              ~= 162 kB gzip
      //
      // Si tocas esto, la comprobacion es una linea y no admite interpretacion:
      //   grep -c 'pdf' dist/index.html     # tiene que dar 0
    }
  };
});
