import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Navbar from '../components/layout/Navbar';
import LandingPage from '../pages/LandingPage';

describe('Public Navigation & Contextual Links Suite', () => {
    it('renders Navbar with direct links to /servicios and /universidades', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/']}>
                <Navbar />
            </MemoryRouter>
        );

        const serviciosLink = container.querySelector('a[href="/servicios"]');
        const universidadesLink = container.querySelector('a[href="/universidades"]');

        expect(serviciosLink).not.toBeNull();
        expect(universidadesLink).not.toBeNull();
    });

    it('marks Universidades as active when path is /universidades or /tesis/uasd', () => {
        const { container, rerender } = render(
            <MemoryRouter initialEntries={['/universidades']}>
                <Navbar />
            </MemoryRouter>
        );

        let activeUniLink = container.querySelector('a[href="/universidades"][aria-current="page"]');
        expect(activeUniLink).not.toBeNull();

        rerender(
            <MemoryRouter initialEntries={['/tesis/uasd']}>
                <Navbar />
            </MemoryRouter>
        );

        activeUniLink = container.querySelector('a[href="/universidades"][aria-current="page"]');
        expect(activeUniLink).not.toBeNull();
    });

    it('LandingPage includes contextual link to /universidades while retaining /servicios link', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/']}>
                <LandingPage />
            </MemoryRouter>
        );

        const serviciosLinks = container.querySelectorAll('a[href="/servicios"]');
        const universidadesLinks = container.querySelectorAll('a[href="/universidades"]');

        expect(serviciosLinks.length).toBeGreaterThan(0);
        expect(universidadesLinks.length).toBeGreaterThan(0);
    });
});
