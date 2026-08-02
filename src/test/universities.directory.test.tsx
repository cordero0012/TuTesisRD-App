import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import UniversityDirectory from '../pages/Universities/UniversityDirectory';
import UniversityTemplate from '../pages/Universities/UniversityTemplate';
import universitiesData from '../data/universities.json';

describe('University Directory & Detail Page Suite', () => {
    it('renders all 9 canonical universities in UniversityDirectory', () => {
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
        });
    });

    it('renders detail view for /tesis/uasd with canonical details and wa.me link', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/tesis/uasd']}>
                <Routes>
                    <Route path="/tesis/:universityId" element={<UniversityTemplate />} />
                </Routes>
            </MemoryRouter>
        );

        // Header and description
        expect(screen.getAllByText(/UASD/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/Universidad Autónoma de Santo Domingo/i)).toBeInTheDocument();

        // WhatsApp CTA must be a valid <a> containing wa.me and no nested button
        const waLink = container.querySelector('a[href*="wa.me"]');
        expect(waLink).not.toBeNull();
        expect(waLink?.tagName.toLowerCase()).toBe('a');
        expect(waLink?.querySelector('button')).toBeNull();

        // Tool link
        const toolLink = container.querySelector('a[href*="/herramientas/matriz"]');
        expect(toolLink).not.toBeNull();

        // Disclaimer for official manual
        expect(screen.getByText(/manual/i)).toBeInTheDocument();
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
