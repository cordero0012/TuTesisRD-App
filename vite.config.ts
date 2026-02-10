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
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'pdf-vendor': ['pdfjs-dist', 'jspdf', 'jspdf-autotable'],
            'doc-vendor': ['mammoth', 'docx', 'file-saver'],
            'ai-vendor': ['@google/generative-ai', 'zod'],
          }
        }
      }
    }
  };
});
