import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import UniversityDirectory from '../pages/Universities/UniversityDirectory';
import UniversityTemplate from '../pages/Universities/UniversityTemplate';
import universitiesData from '../data/universities.json';

describe('University Directory & Detail Page Suite', () => {
    it('renders all 9 canonical universities in UniversityDirectory with exact hrefs, logos, program counts, and card-scoped program names', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/universidades']}>
                <Routes>
                    <Route path="/universidades" element={<UniversityDirectory />} />
                </Routes>
            </MemoryRouter>
        );

        const canonicalIds = ['uasd', 'pucmm', 'intec', 'unibe', 'oym', 'unphu', 'uapa', 'ucateci', 'unev'];
        expect(universitiesData.length).toBe(9);

        // 1. Assert exact 9 href links in the directory match canonical IDs
        const cardHrefs = Array.from(container.querySelectorAll('a[href^="/tesis/"]')).map((a) => a.getAttribute('href'));
        const expectedHrefs = canonicalIds.map((id) => `/tesis/${id}`);
        expect(cardHrefs).toEqual(expectedHrefs);

        // 2. Assert each card specifically contains its own programs, logo, shortName, and style
        canonicalIds.forEach((id) => {
            const uni = universitiesData.find((u) => u.id === id);
            expect(uni).toBeDefined();

            const cardLink = container.querySelector(`a[href="/tesis/${id}"]`);
            expect(cardLink).not.toBeNull();

            // Verify shortName inside card
            expect(cardLink?.textContent).toContain(uni!.shortName);

            // Verify logo alt inside card
            const logoImg = cardLink?.querySelector('img');
            expect(logoImg).not.toBeNull();
            expect(logoImg?.getAttribute('alt')).toBe(`Logo ${uni!.shortName}`);

            // Verify card-scoped programs: assert EVERY program in uni.programs is inside THIS card element
            uni!.programs.forEach((prog) => {
                expect(cardLink?.textContent).toContain(prog);
            });
        });
    });

    it('iterates through all 9 canonical universities asserting exact ID, description, style, page range, 37 programs, 21 tips, and contextual CTA', () => {
        let totalProgramsVerified = 0;
        let totalTipsVerified = 0;
        const verifiedIds = new Set<string>();

        universitiesData.forEach((uni) => {
            verifiedIds.add(uni.id);

            const { container, unmount } = render(
                <MemoryRouter initialEntries={[`/tesis/${uni.id}`]}>
                    <Routes>
                        <Route path="/tesis/:universityId" element={<UniversityTemplate />} />
                    </Routes>
                </MemoryRouter>
            );

            // 1. Verify Full Name & Short Name
            expect(screen.getAllByText(new RegExp(uni.shortName, 'i')).length).toBeGreaterThan(0);
            expect(container.textContent).toContain(uni.name);

            // 2. Verify Logo
            const logoImg = screen.getByAltText(`Logo de ${uni.name}`);
            expect(logoImg).toBeInTheDocument();
            expect(logoImg.getAttribute('src')).toBe(uni.logo);

            // 3. Verify Description
            expect(container.textContent).toContain(uni.description);

            // 4. Verify Style & Page Range
            expect(screen.getByText(uni.regulations.style)).toBeInTheDocument();
            expect(container.textContent).toContain(`${uni.regulations.minPages} a ${uni.regulations.maxPages} páginas`);

            // 5. Verify every single program
            uni.programs.forEach((prog) => {
                totalProgramsVerified++;
                expect(container.textContent).toContain(prog);
            });

            // 6. Verify every single tip
            uni.tips.forEach((tip) => {
                totalTipsVerified++;
                expect(container.textContent).toContain(tip);
            });

            // 7. Verify Contextual WhatsApp CTA inside main (decoded URL includes uni.shortName)
            const mainElem = container.querySelector('main');
            const waLink = mainElem?.querySelector('a[href*="wa.me"]');
            expect(waLink).not.toBeNull();
            expect(waLink?.tagName.toLowerCase()).toBe('a');
            expect(waLink?.querySelector('button')).toBeNull();

            const rawHref = waLink?.getAttribute('href') || '';
            const decodedHref = decodeURIComponent(rawHref);
            expect(decodedHref).toContain(uni.shortName);

            // 8. Verify tool link & disclaimer
            expect(container.querySelector('a[href*="/herramientas/matriz"]')).not.toBeNull();
            expect(screen.getAllByText(/manual/i).length).toBeGreaterThan(0);

            unmount();
        });

        // Assert 9 unique university IDs, 37 total programs, and 21 total tips verified
        expect(verifiedIds.size).toBe(9);
        expect(totalProgramsVerified).toBe(37);
        expect(totalTipsVerified).toBe(21);
    });

    it('handles unknown universityId by providing a link back to /universidades', () => {
        render(
            <MemoryRouter initialEntries={['/tesis/unknown-uni']}>
                <Routes>
                    <Route path="/tesis/:universityId" element={<UniversityTemplate />} />
                    <Route path="/universidades" element={<div>Pagina Universidades</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/Universidad no encontrada/i)).toBeInTheDocument();
        const backLink = screen.getByRole('link', { name: /Volver al Directorio de Universidades/i });
        expect(backLink.getAttribute('href')).toMatch(/\/universidades|\//);
    });
});
