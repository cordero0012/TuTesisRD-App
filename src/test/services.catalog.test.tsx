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
                expect(catElem.textContent).toContain(plan.title);
                expect(catElem.textContent).toContain(plan.price);
                plan.features.forEach((feature) => {
                    totalBenefitsCount++;
                    expect(catElem.textContent).toContain(feature);
                });
            });
        });

        expect(totalPlansCount).toBe(28);
        expect(totalBenefitsCount).toBe(84);
    });

    it('verifies exactly 28 unique plan CTAs where each decoded URL simultaneously contains BOTH plan title and category name', () => {
        renderServices();

        const uniquePlanUrls = new Set<string>();

        pricingCategories.forEach((cat) => {
            const catElem = screen.getByTestId(`category-${cat.id}`);
            
            cat.plans.forEach((plan) => {
                // Find title element for this specific plan inside category container
                const titleHeading = Array.from(catElem.querySelectorAll('h4')).find(
                    (h4) => h4.textContent?.trim() === plan.title
                );
                expect(titleHeading).toBeDefined();

                // Find card container wrapping this heading
                const planCard = titleHeading?.closest('div');
                expect(planCard).not.toBeNull();

                // Find plan's specific CTA link
                const ctaLink = planCard?.querySelector('a[href*="wa.me"]');
                expect(ctaLink).not.toBeNull();
                expect(ctaLink?.tagName.toLowerCase()).toBe('a');
                expect(ctaLink?.querySelector('button')).toBeNull(); // No nested <button> inside <a>

                const rawHref = ctaLink?.getAttribute('href') || '';
                const decodedHref = decodeURIComponent(rawHref);

                // MUST SIMULTANEOUSLY CONTAIN BOTH PLAN TITLE AND CATEGORY NAME
                expect(decodedHref).toContain(plan.title);
                expect(decodedHref).toContain(cat.name);

                uniquePlanUrls.add(rawHref);
            });
        });

        // Exactly 28 distinct, unique plan CTA links
        expect(uniquePlanUrls.size).toBe(28);
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
