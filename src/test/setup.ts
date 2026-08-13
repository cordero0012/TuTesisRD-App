import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { axe as axeCore, toHaveNoViolations } from 'jest-axe';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Extend Vitest's expect with axe matchers
expect.extend(toHaveNoViolations);

/**
 * `axe-core` es un SINGLETON: una segunda llamada mientras la primera sigue en
 * marcha lanza «Axe is already running».
 *
 * Eso convertía estos tests en intermitentes, y el mecanismo no era el que
 * parecía. Con la suite completa en paralelo, la CPU va justa y un `axe.run()`
 * pasa de ~1 s a más de 5 s, o sea por encima del `testTimeout` por defecto.
 * Vitest aborta ESE test, pero no puede abortar el `axe.run()` que quedó
 * corriendo por dentro: el siguiente test lo encuentra ocupado y falla, y el
 * siguiente también. De ahí que fallaran en cascada (3, 1, 3 fallos según la
 * pasada) y que en aislado pasaran siempre.
 *
 * Esta cola encadena las llamadas, así que una ejecución huérfana retrasa a la
 * siguiente en vez de tumbarla. El `catch` es lo que corta la cascada: si la
 * anterior terminó en error, la siguiente arranca igual.
 */
let axeQueue: Promise<unknown> = Promise.resolve();

export const runAxe = <T>(start: () => Promise<T>): Promise<T> => {
    const result = axeQueue.then(start, start);
    // La cola no debe rechazar nunca, o encadenaría el fallo a todo lo que venga.
    axeQueue = result.catch(() => undefined);
    return result;
};

// Export axe for use in tests — disable color-contrast in jsdom (no real CSS)
export const axe = (container: Element) =>
    runAxe(() =>
        axeCore(container, {
            rules: { 'color-contrast': { enabled: false } },
        }),
    );

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// Mock environment variables
process.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.VITE_GEMINI_API_KEY = 'test-gemini-key';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => { },
    }),
});

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock crypto.randomUUID
if (!globalThis.crypto) {
    globalThis.crypto = {} as Crypto;
}

(globalThis.crypto as any).randomUUID = (): `${string}-${string}-${string}-${string}-${string}` => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    }) as `${string}-${string}-${string}-${string}-${string}`;
};
