import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        /**
         * Los 5 s por defecto se quedaban cortos. Un `axe.run()` sobre la
         * landing tarda ~2-3 s con la máquina libre, y con la suite entera en
         * paralelo se pasaba del límite: vitest abortaba el test pero no podía
         * abortar el `axe.run()` de dentro, y como `axe-core` es un singleton,
         * los tests siguientes fallaban con «Axe is already running». La cola de
         * `src/test/setup.ts` corta esa cascada; este margen evita que se dispare.
         */
        testTimeout: 20000,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/test/',
                '**/*.d.ts',
                '**/*.config.*',
                '**/mockData',
                'dist/',
            ],
        },
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
