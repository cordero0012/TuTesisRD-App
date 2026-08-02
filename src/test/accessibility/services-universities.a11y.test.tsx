import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import axe from 'axe-core';
import Services from '../../pages/Services';
import UniversityDirectory from '../../pages/Universities/UniversityDirectory';
import UniversityTemplate from '../../pages/Universities/UniversityTemplate';

// Helper for programmatic WCAG contrast ratio calculation
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
    const runAxeStructureChecks = async (container: HTMLElement) => {
        const results = await axe.run(container, {
            rules: {
                // Color contrast disabled in Axe/JSDOM due to lack of CSS computed styles rendering.
                // Palette contrast is programmatically verified in the test suite below.
                'color-contrast': { enabled: false }
            }
        });
        return results.violations;
    };

    it('programmatically verifies WCAG 2.2 AA contrast ratios for the official 4 UI color tokens', () => {
        const black = '#0E0E0F';
        const softWhite = '#F7F7F7';
        const orange = '#F29727';
        const gold = '#D99A4E';

        // Dark background with soft white text
        const whiteOnBlackRatio = getContrastRatio(softWhite, black);
        expect(whiteOnBlackRatio).toBeGreaterThanOrEqual(7.0); // Exceeds AAA (7:1)

        // Dark background with orange text/accent
        const orangeOnBlackRatio = getContrastRatio(orange, black);
        expect(orangeOnBlackRatio).toBeGreaterThanOrEqual(7.0); // Exceeds AAA (7:1)

        // Dark background with gold text/accent
        const goldOnBlackRatio = getContrastRatio(gold, black);
        expect(goldOnBlackRatio).toBeGreaterThanOrEqual(4.5); // Exceeds AA (4.5:1)

        // Orange button background with black text
        const blackOnOrangeRatio = getContrastRatio(black, orange);
        expect(blackOnOrangeRatio).toBeGreaterThanOrEqual(7.0); // Exceeds AAA (7:1)
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
