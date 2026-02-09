import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { axe } from '../setup';
import LandingPage from '../../pages/LandingPage';

describe('LandingPage Accessibility', () => {
    it('should not have any automatically detectable accessibility violations', async () => {
        const { container } = render(
            <BrowserRouter>
                <LandingPage />
            </BrowserRouter>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have proper heading hierarchy', () => {
        const { container } = render(
            <BrowserRouter>
                <LandingPage />
            </BrowserRouter>
        );

        // Check for h1 element
        const h1 = container.querySelector('h1');
        expect(h1).toBeInTheDocument();
    });

    it('should have alt text for all images', () => {
        const { container } = render(
            <BrowserRouter>
                <LandingPage />
            </BrowserRouter>
        );

        const images = container.querySelectorAll('img');
        images.forEach(img => {
            expect(img).toHaveAttribute('alt');
        });
    });

    it('should have proper ARIA labels for interactive elements', () => {
        const { container } = render(
            <BrowserRouter>
                <LandingPage />
            </BrowserRouter>
        );

        // Check buttons have accessible names
        const buttons = container.querySelectorAll('button');
        buttons.forEach(button => {
            const hasText = button.textContent && button.textContent.trim().length > 0;
            const hasAriaLabel = button.hasAttribute('aria-label');
            const hasAriaLabelledBy = button.hasAttribute('aria-labelledby');

            expect(hasText || hasAriaLabel || hasAriaLabelledBy).toBe(true);
        });
    });

    it('should have proper link text (no "click here")', () => {
        const { container } = render(
            <BrowserRouter>
                <LandingPage />
            </BrowserRouter>
        );

        const links = container.querySelectorAll('a');
        links.forEach(link => {
            const linkText = link.textContent?.toLowerCase() || '';
            expect(linkText).not.toBe('click here');
            expect(linkText).not.toBe('here');
            expect(linkText.length).toBeGreaterThan(0);
        });
    });
});
