import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import axe from 'axe-core';
import Services from '../../pages/Services';
import UniversityDirectory from '../../pages/Universities/UniversityDirectory';
import UniversityTemplate from '../../pages/Universities/UniversityTemplate';

describe('Services & Universities Accessibility Suite (a11y)', () => {
    const runAxe = async (container: HTMLElement) => {
        const results = await axe.run(container, {
            rules: {
                'color-contrast': { enabled: false } // Disabled in JSDOM due to missing computed layout styles
            }
        });
        return results.violations;
    };

    it('Services page has exactly one H1 and passes basic axe checks', async () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/servicios']}>
                <Services />
            </MemoryRouter>
        );

        const h1Elements = container.querySelectorAll('h1');
        expect(h1Elements.length).toBe(1);

        const violations = await runAxe(container);
        expect(violations.filter(v => v.id !== 'region')).toEqual([]);
    });

    it('UniversityDirectory page has exactly one H1 and passes basic axe checks', async () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/universidades']}>
                <UniversityDirectory />
            </MemoryRouter>
        );

        const h1Elements = container.querySelectorAll('h1');
        expect(h1Elements.length).toBe(1);

        const violations = await runAxe(container);
        expect(violations.filter(v => v.id !== 'region')).toEqual([]);
    });

    it('UniversityTemplate (/tesis/uasd) has exactly one H1 and passes basic axe checks', async () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/tesis/uasd']}>
                <Routes>
                    <Route path="/tesis/:universityId" element={<UniversityTemplate />} />
                </Routes>
            </MemoryRouter>
        );

        const h1Elements = container.querySelectorAll('h1');
        expect(h1Elements.length).toBe(1);

        const violations = await runAxe(container);
        expect(violations.filter(v => v.id !== 'region')).toEqual([]);
    });
});
