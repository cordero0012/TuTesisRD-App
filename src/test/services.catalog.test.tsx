import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Services from '../pages/Services';
import PricingCatalog from '../components/landing/PricingCatalog';

describe('Services & PricingCatalog Inventory & Measurement Contract', () => {
    const renderServices = () => {
        return render(
            <BrowserRouter>
                <Services />
            </BrowserRouter>
        );
    };

    it('renders all 5 commercial categories simultaneously in the DOM', () => {
        renderServices();
        expect(screen.getByTestId('category-grado') || screen.getByText('Tesis de Grado')).toBeInTheDocument();
        expect(screen.getByTestId('category-monografico') || screen.getByText('Monográficos')).toBeInTheDocument();
        expect(screen.getByTestId('category-postgrado') || screen.getByText('Postgrado/Maestría')).toBeInTheDocument();
        expect(screen.getByTestId('category-doctoral') || screen.getByText('Tesis Doctoral')).toBeInTheDocument();
        expect(screen.getByTestId('category-adicionales') || screen.getByText('Servicios de Apoyo')).toBeInTheDocument();
    });

    it('contains all 28 offers across the 5 categories simultaneously', () => {
        const { container } = renderServices();

        // Repeating plan titles across categories
        expect(screen.getAllByText('Plan 1 - Corrección y Asesoría').length).toBe(2);
        expect(screen.getAllByText('Plan 2 - Desarrollo Parcial').length).toBe(4);
        expect(screen.getAllByText('Plan 3 - Desarrollo Completo').length).toBe(3);
        expect(screen.getAllByText('Plan 4 - Completo + Diapositivas').length).toBe(2);
        expect(screen.getAllByText('Plan 5 - VIP Completo').length).toBe(3);
        expect(screen.getAllByText('Capítulo Individual').length).toBe(2);

        // Doctoral specific plans
        expect(screen.getByText('Plan 1 - Corrección Doctoral')).toBeInTheDocument();
        expect(screen.getByText('Plan 3 - Desarrollo Doctoral')).toBeInTheDocument();
        expect(screen.getByText('Plan 4 - Defensa Doctoral')).toBeInTheDocument();
        expect(screen.getByText('Plan 5 - VIP Doctoral')).toBeInTheDocument();
        expect(screen.getByText('Capítulo Estratégico')).toBeInTheDocument();

        // Adicionales
        expect(screen.getByText('Diapositivas')).toBeInTheDocument();
        expect(screen.getByText('Artículos Científicos')).toBeInTheDocument();
        expect(screen.getByText('Tareas Académicas')).toBeInTheDocument();
        expect(screen.getByText('Impresión y Empastado')).toBeInTheDocument();

        // Total 28 commercial CTA links for plans
        const planCtas = container.querySelectorAll('a[href*="wa.me"]');
        expect(planCtas.length).toBeGreaterThanOrEqual(28);
    });

    it('preserves the printing variation note', () => {
        renderServices();
        expect(
            screen.getByText(/El costo final de impresión puede variar según cantidad de páginas, tipo de papel, color y número de copias\./i)
        ).toBeInTheDocument();
    });

    it('ensures all commercial CTAs are valid <a> links with wa.me href', () => {
        const { container } = renderServices();
        const whatsappLinks = container.querySelectorAll('a[href*="wa.me"]');
        expect(whatsappLinks.length).toBeGreaterThanOrEqual(28);

        whatsappLinks.forEach((link) => {
            expect(link.tagName.toLowerCase()).toBe('a');
            expect(link.getAttribute('href')).toContain('wa.me');
            expect(link.querySelector('button')).toBeNull(); // No nested buttons inside <a>
        });
    });

    it('includes the final CTA for diagnostic', () => {
        renderServices();
        expect(screen.getByText(/No sé cuál elegir: solicitar diagnóstico/i)).toBeInTheDocument();
    });
});
