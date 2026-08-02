import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Meta collapses two events sharing the same (event name, eventID) pair, so
 * every fbq call this codebase makes has to carry one. Without it a single user
 * action reported through two paths is counted twice.
 *
 * These tests pin that down: the analytics module must never call fbq without
 * an options object containing eventID.
 */
describe('Meta eventID', () => {
    let fbq: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.resetModules();
        vi.stubEnv('VITE_META_PIXEL_ID', '1885949815441420');
        vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-2XTMDMXZFC');
        fbq = vi.fn();
        (window as any).fbq = fbq;
        (window as any).gtag = vi.fn();
        Object.defineProperty(document, 'referrer', { value: '', configurable: true });
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        delete (window as any).fbq;
        delete (window as any).gtag;
    });

    const optionsOf = (call: unknown[]) => call[3] as { eventID?: string } | undefined;

    it('creates a distinct id on every call', async () => {
        const { createEventId } = await import('../utils/analytics');
        const ids = new Set(Array.from({ length: 50 }, () => createEventId()));
        expect(ids.size).toBe(50);
        ids.forEach(id => expect(String(id).length).toBeGreaterThan(8));
    });

    it('sends PageView with an eventID', async () => {
        const { logPageView } = await import('../utils/analytics');
        logPageView('/');

        const call = fbq.mock.calls.find(c => c[1] === 'PageView');
        expect(call, 'no se emitió PageView').toBeDefined();
        expect(optionsOf(call!)?.eventID).toBeTruthy();
    });

    it('sends a mapped standard event with an eventID', async () => {
        const { logEvent } = await import('../utils/analytics');
        logEvent('view_item', 'Blog', 'Un artículo');

        const call = fbq.mock.calls.find(c => c[0] === 'track' && c[1] === 'ViewContent');
        expect(call, 'view_item debe mapearse a ViewContent').toBeDefined();
        expect(optionsOf(call!)?.eventID).toBeTruthy();
    });

    it('sends a custom event through trackCustom with an eventID', async () => {
        const { logEvent } = await import('../utils/analytics');
        logEvent('tool_start', 'Herramientas', 'Matriz');

        const call = fbq.mock.calls.find(c => c[0] === 'trackCustom');
        expect(call, 'un evento sin equivalente estándar debe ir por trackCustom').toBeDefined();
        expect(call![1]).toBe('tool_start');
        expect(optionsOf(call!)?.eventID).toBeTruthy();
    });

    it('never calls fbq without an eventID', async () => {
        const { logPageView, logEvent } = await import('../utils/analytics');
        logPageView('/');
        logEvent('view_item', 'Blog', 'A');
        logEvent('generate_lead', 'Contacto', 'B');
        logEvent('tool_start', 'Herramientas', 'C');

        const tracking = fbq.mock.calls.filter(c => c[0] === 'track' || c[0] === 'trackCustom');
        expect(tracking.length).toBeGreaterThan(0);
        tracking.forEach(call => {
            expect(optionsOf(call)?.eventID, `sin eventID: ${String(call[1])}`).toBeTruthy();
        });
    });

    it('gives the two events of one action different ids', async () => {
        const { logEvent } = await import('../utils/analytics');
        logEvent('generate_lead', 'Contacto', 'A');
        logEvent('generate_lead', 'Contacto', 'A');

        const leads = fbq.mock.calls.filter(c => c[1] === 'Lead');
        expect(leads.length).toBe(2);
        expect(optionsOf(leads[0])?.eventID).not.toBe(optionsOf(leads[1])?.eventID);
    });
});
