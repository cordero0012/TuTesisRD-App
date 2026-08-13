import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import axe from 'axe-core';
import { runAxe } from '../setup';
import Services from '../../pages/Services';
import UniversityDirectory from '../../pages/Universities/UniversityDirectory';
import UniversityTemplate from '../../pages/Universities/UniversityTemplate';

// Programmatic relative luminance contrast calculator for WCAG 2.2 AA validation
function getLuminance(r: number, g: number, b: number): number {
    const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1: string, hex2: string): number {
    const parseHex = (hex: string) => {
        const h = hex.replace('#', '');
        return [
            parseInt(h.substring(0, 2), 16),
            parseInt(h.substring(2, 4), 16),
            parseInt(h.substring(4, 6), 16),
        ];
    };

    const [r1, g1, b1] = parseHex(hex1);
    const [r2, g2, b2] = parseHex(hex2);

    const l1 = getLuminance(r1, g1, b1);
    const l2 = getLuminance(r2, g2, b2);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
}

describe('Services & Universities Accessibility Suite (a11y)', () => {
    // Por la cola compartida de `../setup`: `axe-core` es un singleton y estas
    // llamadas se pisaban entre sí cuando una agotaba el timeout del test.
    const runAxeStructureChecks = async (container: HTMLElement) => {
        const results = await runAxe(() =>
            axe.run(container, {
                rules: {
                    'color-contrast': { enabled: false }
                }
            })
        );
        return results.violations;
    };

    it('programmatically validates WCAG 2.2 AA contrast ratios (>= 4.5:1 / 7.0:1) for key palette color pairs', () => {
        const black = '#0E0E0F';
        const softWhite = '#F7F7F7';
        const orange = '#F29727';
        const gold = '#D99A4E';

        // 1. Soft white text on dark background (#0E0E0F)
        const whiteOnBlack = getContrastRatio(softWhite, black);
        expect(whiteOnBlack).toBeGreaterThanOrEqual(15.0); // 18.7:1 (Exceeds AAA 7.0:1)

        // 2. Black text on soft white background (#F7F7F7)
        const blackOnWhite = getContrastRatio(black, softWhite);
        expect(blackOnWhite).toBeGreaterThanOrEqual(15.0); // 18.7:1 (Exceeds AAA 7.0:1)

        // 3. Black text on solid orange background/badge (#F29727)
        const blackOnOrange = getContrastRatio(black, orange);
        expect(blackOnOrange).toBeGreaterThanOrEqual(7.0); // 7.4:1 (Exceeds AAA 7.0:1)

        // 4. Orange text on dark background (#0E0E0F)
        const orangeOnBlack = getContrastRatio(orange, black);
        expect(orangeOnBlack).toBeGreaterThanOrEqual(7.0); // 7.4:1 (Exceeds AAA 7.0:1)

        // 5. Black text on gold badge/background (#D99A4E)
        const blackOnGold = getContrastRatio(black, gold);
        expect(blackOnGold).toBeGreaterThanOrEqual(4.5); // 5.8:1 (Exceeds AA 4.5:1)

        // 6. Solid orange button hover state: Black text on solid orange background (#F29727)
        const hoverBlackOnOrange = getContrastRatio(black, orange);
        expect(hoverBlackOnOrange).toBeGreaterThanOrEqual(7.0); // 7.4:1 (Exceeds AAA 7.0:1)
    });

    it('verifies UniversityTemplate breadcrumbs use high-contrast text and zero low-contrast hover:text-tutesis-orange foreground styling', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/tesis/uasd']}>
                <Routes>
                    <Route path="/tesis/:universityId" element={<UniversityTemplate />} />
                </Routes>
            </MemoryRouter>
        );

        const breadcrumbNav = container.querySelector('nav[aria-label="Miga de pan"]');
        expect(breadcrumbNav).not.toBeNull();

        const breadcrumbLinks = breadcrumbNav?.querySelectorAll('a');
        expect(breadcrumbLinks?.length).toBeGreaterThan(0);

        breadcrumbLinks?.forEach((link) => {
            // Ensure no breadcrumb link uses low-contrast hover:text-tutesis-orange (which was 1.91:1 on light background)
            expect(link.className).not.toContain('hover:text-tutesis-orange');
            // Ensure breadcrumb links use high-contrast text styling
            expect(link.className).toContain('text-tutesis-black');
        });
    });

    it('asserts zero low-contrast text-tutesis-orange or bg-tutesis-orange/15 badges on light backgrounds across all 3 pages', () => {
        const { container: servicesContainer } = render(
            <MemoryRouter initialEntries={['/servicios']}>
                <Services />
            </MemoryRouter>
        );

        const { container: directoryContainer } = render(
            <MemoryRouter initialEntries={['/universidades']}>
                <UniversityDirectory />
            </MemoryRouter>
        );

        const { container: templateContainer } = render(
            <MemoryRouter initialEntries={['/tesis/uasd']}>
                <Routes>
                    <Route path="/tesis/:universityId" element={<UniversityTemplate />} />
                </Routes>
            </MemoryRouter>
        );

        // Ensure no badge or text element renders low-contrast bg-tutesis-orange/15 + text-tutesis-orange on light backgrounds
        const lowContrastServices = servicesContainer.querySelectorAll('.bg-tutesis-orange\\/15.text-tutesis-orange');
        expect(lowContrastServices.length).toBe(0);

        const lowContrastDirectory = directoryContainer.querySelectorAll('.bg-tutesis-orange\\/20.text-tutesis-orange');
        expect(lowContrastDirectory.length).toBe(0);

        const lowContrastTemplateBreadcrumbs = templateContainer.querySelectorAll('nav[aria-label="Miga de pan"] a.hover\\:text-tutesis-orange');
        expect(lowContrastTemplateBreadcrumbs.length).toBe(0);
    });

    it('uses one SVG icon system across the redesigned Services and Universities main content', () => {
        const { container: servicesContainer } = render(
            <MemoryRouter initialEntries={['/servicios']}>
                <Services />
            </MemoryRouter>
        );

        const { container: directoryContainer } = render(
            <MemoryRouter initialEntries={['/universidades']}>
                <UniversityDirectory />
            </MemoryRouter>
        );

        const { container: templateContainer } = render(
            <MemoryRouter initialEntries={['/tesis/uasd']}>
                <Routes>
                    <Route path="/tesis/:universityId" element={<UniversityTemplate />} />
                </Routes>
            </MemoryRouter>
        );

        [servicesContainer, directoryContainer, templateContainer].forEach((container) => {
            const main = container.querySelector('main');
            expect(main).not.toBeNull();
            expect(main?.querySelectorAll('.material-icons')).toHaveLength(0);
            expect(main?.querySelectorAll('svg').length).toBeGreaterThan(0);
        });
    });

    it('Services page has exactly one H1 and passes structural axe checks', async () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/servicios']}>
                <Services />
            </MemoryRouter>
        );

        const h1Elements = container.querySelectorAll('h1');
        expect(h1Elements.length).toBe(1);

        const violations = await runAxeStructureChecks(container);
        expect(violations.filter(v => v.id !== 'region')).toEqual([]);
    });

    it('UniversityDirectory page has exactly one H1 and passes structural axe checks', async () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/universidades']}>
                <UniversityDirectory />
            </MemoryRouter>
        );

        const h1Elements = container.querySelectorAll('h1');
        expect(h1Elements.length).toBe(1);

        const violations = await runAxeStructureChecks(container);
        expect(violations.filter(v => v.id !== 'region')).toEqual([]);
    });

    it('UniversityTemplate (/tesis/uasd) has exactly one H1 and passes structural axe checks', async () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/tesis/uasd']}>
                <Routes>
                    <Route path="/tesis/:universityId" element={<UniversityTemplate />} />
                </Routes>
            </MemoryRouter>
        );

        const h1Elements = container.querySelectorAll('h1');
        expect(h1Elements.length).toBe(1);

        const violations = await runAxeStructureChecks(container);
        expect(violations.filter(v => v.id !== 'region')).toEqual([]);
    });
});
