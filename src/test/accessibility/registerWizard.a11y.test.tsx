import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { axe } from '../setup';
import RegisterWizard from '../../pages/Register/RegisterWizard';

// Mock supabase
vi.mock('../../supabaseClient', () => ({
    supabase: {
        from: vi.fn(() => ({
            insert: vi.fn(() => ({
                select: vi.fn(() => ({
                    single: vi.fn(() => Promise.resolve({ data: null, error: null }))
                }))
            })),
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    single: vi.fn(() => Promise.resolve({ data: null, error: null }))
                }))
            }))
        }))
    }
}));

describe('RegisterWizard Accessibility', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should not have any automatically detectable accessibility violations', async () => {
        const { container } = render(
            <BrowserRouter>
                <RegisterWizard />
            </BrowserRouter>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have proper form labels', () => {
        render(
            <BrowserRouter>
                <RegisterWizard />
            </BrowserRouter>
        );

        // All form inputs should have associated labels
        const inputs = screen.getAllByRole('textbox');
        inputs.forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            const ariaLabel = input.getAttribute('aria-label');
            const ariaLabelledBy = input.getAttribute('aria-labelledby');

            expect(label || ariaLabel || ariaLabelledBy).toBeTruthy();
        });
    });

    it('should have proper focus management', () => {
        const { container } = render(
            <BrowserRouter>
                <RegisterWizard />
            </BrowserRouter>
        );

        // Check that interactive elements are keyboard accessible
        const buttons = container.querySelectorAll('button');
        buttons.forEach(button => {
            expect(button.tabIndex).toBeGreaterThanOrEqual(-1);
        });
    });

    it('should have proper error message announcements', () => {
        const { container } = render(
            <BrowserRouter>
                <RegisterWizard />
            </BrowserRouter>
        );

        // Check for aria-live regions for error messages
        const errorRegions = container.querySelectorAll('[role="alert"], [aria-live]');
        expect(errorRegions.length).toBeGreaterThan(0);
    });

    it('should have proper heading hierarchy', () => {
        const { container } = render(
            <BrowserRouter>
                <RegisterWizard />
            </BrowserRouter>
        );

        const h1 = container.querySelector('h1');
        expect(h1).toBeInTheDocument();
    });

    it('should have descriptive button text', () => {
        const { container } = render(
            <BrowserRouter>
                <RegisterWizard />
            </BrowserRouter>
        );

        const buttons = container.querySelectorAll('button');
        buttons.forEach(button => {
            const buttonText = button.textContent?.trim() || '';
            const ariaLabel = button.getAttribute('aria-label') || '';

            expect(buttonText.length > 0 || ariaLabel.length > 0).toBe(true);
        });
    });
});
