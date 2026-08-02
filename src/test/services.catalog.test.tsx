import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Services from '../pages/Services';
import PricingCatalog, { pricingCategories } from '../components/landing/PricingCatalog';

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
        expect(screen.getByTestId('category-grado')).toBeInTheDocument();
        expect(screen.getByTestId('category-monografico')).toBeInTheDocument();
        expect(screen.getByTestId('category-postgrado')).toBeInTheDocument();
        expect(screen.getByTestId('category-doctoral')).toBeInTheDocument();
        expect(screen.getByTestId('category-adicionales')).toBeInTheDocument();
    });

    it('asserts the exact manifest of 28 titles, 28 prices, and 84 benefits across all 5 categories', () => {
        renderServices();

        let totalPlansCount = 0;
        let totalBenefitsCount = 0;

        pricingCategories.forEach((cat) => {
            const catElem = screen.getByTestId(`category-${cat.id}`);
            expect(catElem).toBeInTheDocument();

            cat.plans.forEach((plan) => {
                totalPlansCount++;
                // Verify title inside category
                expect(catElem.textContent).toContain(plan.title);
                // Verify price inside category
                expect(catElem.textContent).toContain(plan.price);
                // Verify benefits inside category
                plan.features.forEach((feature) => {
                    totalBenefitsCount++;
                    expect(catElem.textContent).toContain(feature);
                });
            });
        });

        expect(totalPlansCount).toBe(28);
        expect(totalBenefitsCount).toBe(84);
    });

    it('ensures every plan CTA link is a valid <a> with wa.me href containing plan title and category', () => {
        const { container } = renderServices();

        pricingCategories.forEach((cat) => {
            const catElem = screen.getByTestId(`category-${cat.id}`);
            cat.plans.forEach((plan) => {
                const planCtas = Array.from(catElem.querySelectorAll('a[href*="wa.me"]'));
                const matchedCta = planCtas.find(cta => {
                    const href = cta.getAttribute('href') || '';
                    return href.includes(encodeURIComponent(plan.title)) || href.includes(encodeURIComponent(cat.name));
                });
                expect(matchedCta).toBeDefined();
                expect(matchedCta?.tagName.toLowerCase()).toBe('a');
                expect(matchedCta?.querySelector('button')).toBeNull();
            });
        });
    });

    it('preserves the printing variation note in adicionales', () => {
        renderServices();
        expect(
            screen.getByText(/El costo final de impresión puede variar según cantidad de páginas, tipo de papel, color y número de copias\./i)
        ).toBeInTheDocument();
    });

    it('includes the final CTA for diagnostic with wa.me link', () => {
        renderServices();
        const diagnosticCta = screen.getByText(/No sé cuál elegir: solicitar diagnóstico/i).closest('a');
        expect(diagnosticCta).toBeInTheDocument();
        expect(diagnosticCta?.getAttribute('href')).toContain('wa.me');
    });
});
