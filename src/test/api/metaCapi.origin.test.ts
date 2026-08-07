import { describe, it, expect, beforeEach, afterAll } from 'vitest';

import handler from '../../../api/meta-capi';

/**
 * Guards the Origin allowlist on /api/meta-capi.
 *
 * Without it the endpoint accepts conversions from anywhere, so any page on
 * the internet can fire `Lead` events at the pixel and teach Meta's optimizer
 * to chase traffic that never converts.
 *
 * The assertions never reach Meta: the Pixel env vars are deliberately unset,
 * so a request that passes the gate stops at the "not configured" branch.
 * 403 therefore means "rejected by the gate" and 500 means "allowed through".
 *
 * This test lives under src/test/ rather than next to the handler because
 * Vercel deploys every file in api/ as a serverless function — a test file
 * there would ship as a public endpoint.
 */

const ORIGINAL_ENV = { ...process.env };

const callHandler = async (origin: string | undefined, vercelEnv: string): Promise<number> => {
    process.env.VERCEL_ENV = vercelEnv;

    let statusCode = 0;
    const res = {
        status(code: number) { statusCode = code; return res; },
        json() { return res; },
        end() { return res; },
    };
    const req = {
        method: 'POST',
        headers: origin === undefined ? {} : { origin },
        body: { eventName: 'Lead', eventId: 'test-event-id' },
    };

    await handler(req as never, res as never);
    return statusCode;
};

describe('/api/meta-capi origin allowlist', () => {
    beforeEach(() => {
        // Unset so an accepted request stops before any Graph API call.
        delete process.env.META_PIXEL_ID;
        delete process.env.VITE_META_PIXEL_ID;
        delete process.env.META_CAPI_ACCESS_TOKEN;
    });

    afterAll(() => {
        process.env = { ...ORIGINAL_ENV };
    });

    it.each([
        ['https://www.tutesisrd.online'],
        ['https://tutesisrd.online'],
    ])('accepts the production origin %s', async (origin) => {
        expect(await callHandler(origin, 'production')).toBe(500);
    });

    it('rejects an unrelated site', async () => {
        expect(await callHandler('https://evil.example.com', 'production')).toBe(403);
    });

    it('rejects a request with no Origin header', async () => {
        expect(await callHandler(undefined, 'production')).toBe(403);
    });

    it('rejects the opaque "null" origin used by sandboxed frames', async () => {
        expect(await callHandler('null', 'production')).toBe(403);
    });

    it('rejects localhost in production', async () => {
        expect(await callHandler('http://localhost:3000', 'production')).toBe(403);
    });

    it.each([
        ['http://localhost:3000'],  // vercel dev
        ['http://localhost:5173'],  // vite dev
        ['http://127.0.0.1:4000'],
    ])('accepts %s outside production', async (origin) => {
        expect(await callHandler(origin, 'development')).toBe(500);
    });

    it('rejects a non-POST method before looking at the origin', async () => {
        let statusCode = 0;
        const res = {
            status(code: number) { statusCode = code; return res; },
            json() { return res; },
            end() { return res; },
        };
        const req = { method: 'GET', headers: { origin: 'https://www.tutesisrd.online' }, body: {} };

        await handler(req as never, res as never);
        expect(statusCode).toBe(405);
    });
});
