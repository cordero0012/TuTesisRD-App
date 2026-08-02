import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import UniversityDirectory from '../pages/Universities/UniversityDirectory';
import UniversityTemplate from '../pages/Universities/UniversityTemplate';
import universitiesData from '../data/universities.json';

describe('University Directory & Detail Page Suite', () => {
    it('renders all 9 canonical universities in UniversityDirectory with logos and program counts', () => {
        render(
            <MemoryRouter initialEntries={['/universidades']}>
                <Routes>
                    <Route path="/universidades" element={<UniversityDirectory />} />
                </Routes>
            </MemoryRouter>
        );

        const canonicalIds = ['uasd', 'pucmm', 'intec', 'unibe', 'oym', 'unphu', 'uapa', 'ucateci', 'unev'];
        expect(universitiesData.length).toBe(9);

        canonicalIds.forEach((id) => {
            const uni = universitiesData.find((u) => u.id === id);
            expect(uni).toBeDefined();
            expect(screen.getByText(uni!.shortName)).toBeInTheDocument();
            expect(screen.getByAltText(`Logo ${uni!.shortName}`)).toBeInTheDocument();
        });
    });

    it('iterates through all 9 canonical universities verifying programs (37 total) and tips (21 total)', () => {
        let totalProgramsVerified = 0;
        let totalTipsVerified = 0;

        universitiesData.forEach((uni) => {
            const { container, unmount } = render(
                <MemoryRouter initialEntries={[`/tesis/${uni.id}`]}>
                    <Routes>
                        <Route path="/tesis/:universityId" element={<UniversityTemplate />} />
                    </Routes>
                </MemoryRouter>
            );

            // Verify title & style
            expect(screen.getAllByText(new RegExp(uni.shortName, 'i')).length).toBeGreaterThan(0);
            expect(screen.getByText(uni.regulations.style)).toBeInTheDocument();

            // Verify programs
            uni.programs.forEach((prog) => {
                totalProgramsVerified++;
                expect(container.textContent).toContain(prog);
            });

            // Verify tips
            uni.tips.forEach((tip) => {
                totalTipsVerified++;
                expect(container.textContent).toContain(tip);
            });

            // Verify WhatsApp CTA link structure
            const waLink = container.querySelector('a[href*="wa.me"]');
            expect(waLink).not.toBeNull();
            expect(waLink?.tagName.toLowerCase()).toBe('a');
            expect(waLink?.querySelector('button')).toBeNull();

            // Verify tool link & disclaimer
            expect(container.querySelector('a[href*="/herramientas/matriz"]')).not.toBeNull();
            expect(screen.getAllByText(/manual/i).length).toBeGreaterThan(0);

            unmount();
        });

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
