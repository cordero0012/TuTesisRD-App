import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * The WhatsApp CTA is the primary conversion of the business, and it is
 * measured on two independent rails that must not bleed into each other:
 *
 *   GA4  -> owned by GTM (Click - Just Links on `gtm.elementUrl` contains
 *           "wa.me"). Nothing in this codebase may emit a GA4 event for this
 *           click, or contact_whatsapp doubles.
 *   Meta -> owned by initWhatsAppMetaTracking(). GTM sends Meta nothing here,
 *           so without it the pixel never observes the Lead it is being asked
 *           to optimize for. That was the live state until 2026-08-10: the
 *           pixel had recorded only PageView and scroll, never a single Lead.
 *
 * These tests pin both halves of that contract.
 */
describe('WhatsApp CTA -> Meta Lead', () => {
    let fbq: ReturnType<typeof vi.fn>;
    let gtag: ReturnType<typeof vi.fn>;
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.resetModules();
        vi.stubEnv('VITE_META_PIXEL_ID', '1304072538248053');
        vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-2XTMDMXZFC');
        fbq = vi.fn();
        gtag = vi.fn();
        (window as any).fbq = fbq;
        (window as any).gtag = gtag;
        fetchMock = vi.fn(() => Promise.resolve({ ok: true } as Response));
        vi.stubGlobal('fetch', fetchMock);
        Object.defineProperty(document, 'referrer', { value: '', configurable: true });
        document.body.innerHTML = '';
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
        delete (window as any).fbq;
        delete (window as any).gtag;
        document.body.innerHTML = '';
    });

    const mountCta = (href: string, inner = 'Escríbenos') => {
        document.body.innerHTML = `<a href="${href}"><span>${inner}</span></a>`;
        return document.querySelector('span') as HTMLElement;
    };

    const leadCalls = () => fbq.mock.calls.filter(c => c[0] === 'track' && c[1] === 'Lead');

    it('fires a Meta Lead when a wa.me anchor is clicked', async () => {
        const { initWhatsAppMetaTracking } = await import('../utils/analytics');
        initWhatsAppMetaTracking();

        mountCta('https://wa.me/18297513267?text=Hola').click();

        expect(leadCalls().length, 'el clic en el CTA de WhatsApp debe emitir un Lead a Meta').toBe(1);
    });

    it('fires when the click lands on a child of the anchor, not the anchor itself', async () => {
        const { initWhatsAppMetaTracking } = await import('../utils/analytics');
        initWhatsAppMetaTracking();

        // Real CTAs wrap an icon and a label, so the event target is a child.
        mountCta('https://wa.me/18297513267').click();

        expect(leadCalls().length).toBe(1);
    });

    it('never emits a GA4 event for the click — GTM already owns that', async () => {
        const { initWhatsAppMetaTracking } = await import('../utils/analytics');
        initWhatsAppMetaTracking();

        mountCta('https://wa.me/18297513267').click();

        expect(
            gtag.mock.calls.length,
            'un gtag aquí duplicaría contact_whatsapp, que ya dispara GTM',
        ).toBe(0);
    });

    it('carries an eventID and mirrors the same id to the CAPI endpoint', async () => {
        const { initWhatsAppMetaTracking } = await import('../utils/analytics');
        initWhatsAppMetaTracking();

        mountCta('https://wa.me/18297513267').click();

        const options = leadCalls()[0][3] as { eventID?: string };
        expect(options?.eventID, 'sin eventID Meta no puede deduplicar').toBeTruthy();

        const capiCall = fetchMock.mock.calls.find(c => String(c[0]).includes('/api/meta-capi'));
        expect(capiCall, 'debe enviarse el espejo server-side').toBeDefined();

        const body = JSON.parse((capiCall![1] as RequestInit).body as string);
        expect(body.eventName).toBe('Lead');
        expect(body.eventId).toBe(options.eventID);
    });

    it('ignores clicks on links that are not WhatsApp', async () => {
        const { initWhatsAppMetaTracking } = await import('../utils/analytics');
        initWhatsAppMetaTracking();

        mountCta('https://www.tutesisrd.online/servicios').click();

        expect(leadCalls().length).toBe(0);
    });

    it('does not double-register the listener when initialized twice', async () => {
        const { initWhatsAppMetaTracking } = await import('../utils/analytics');
        initWhatsAppMetaTracking();
        initWhatsAppMetaTracking();

        mountCta('https://wa.me/18297513267').click();

        expect(leadCalls().length, 'React StrictMode monta dos veces en desarrollo').toBe(1);
    });

    it('does not double-register when the module itself is loaded twice', async () => {
        // Vite can emit this module into more than one chunk. A module-scoped
        // flag would reset with each copy and attach a second listener, so the
        // guard has to survive a fresh module instance.
        const first = await import('../utils/analytics');
        first.initWhatsAppMetaTracking();

        vi.resetModules();
        const second = await import('../utils/analytics');
        second.initWhatsAppMetaTracking();

        mountCta('https://wa.me/18297513267').click();

        expect(leadCalls().length, 'dos copias del módulo no pueden duplicar el Lead').toBe(1);
    });

    it('stays silent for internal testing traffic', async () => {
        Object.defineProperty(document, 'referrer', {
            value: 'https://tagassistant.google.com/',
            configurable: true,
        });
        const { initWhatsAppMetaTracking } = await import('../utils/analytics');
        initWhatsAppMetaTracking();

        mountCta('https://wa.me/18297513267').click();

        expect(leadCalls().length).toBe(0);
        expect(fetchMock.mock.calls.length).toBe(0);
    });

    it('gives two separate clicks two different event ids', async () => {
        const { initWhatsAppMetaTracking } = await import('../utils/analytics');
        initWhatsAppMetaTracking();

        const cta = mountCta('https://wa.me/18297513267');
        cta.click();
        cta.click();

        const calls = leadCalls();
        expect(calls.length).toBe(2);
        const first = (calls[0][3] as { eventID?: string })?.eventID;
        const second = (calls[1][3] as { eventID?: string })?.eventID;
        expect(first).not.toBe(second);
    });
});
