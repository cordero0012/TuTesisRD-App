import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../components/SEO', () => ({
    default: () => null
}));

const { saveHeroLeadMock } = vi.hoisted(() => ({
    saveHeroLeadMock: vi.fn()
}));

vi.mock('../services/leads/heroLeadService', () => ({
    saveHeroLead: saveHeroLeadMock
}));

import LandingPage from '../pages/LandingPage';

const renderLandingPage = () =>
    render(
        <BrowserRouter>
            <LandingPage />
        </BrowserRouter>
    );

const buildDeferred = <T,>() => {
    let resolve!: (value: T | PromiseLike<T>) => void;
    const promise = new Promise<T>((res) => {
        resolve = res;
    });

    return { promise, resolve };
};

describe('LandingPage conversion flow', () => {
    const originalOpen = window.open;

    beforeEach(() => {
        saveHeroLeadMock.mockReset();
        window.open = vi.fn();
        (window as any).dataLayer = [];
        (window as any).fbq = vi.fn();
    });

    afterEach(() => {
        window.open = originalOpen;
    });

    it('includes the selected etapa and nivel in the WhatsApp URL opened from the hero form', async () => {
        const user = userEvent.setup();
        saveHeroLeadMock.mockResolvedValue(true);

        renderLandingPage();

        await user.selectOptions(
            screen.getByRole('combobox', { name: /en qué etapa estás/i }),
            'Me preparo para la defensa'
        );
        await user.selectOptions(
            screen.getByRole('combobox', { name: /nivel académico/i }),
            'Doctorado'
        );
        await user.click(screen.getByRole('button', { name: /recibir mi diagnóstico gratis/i }));

        expect(window.open).toHaveBeenCalledWith(
            expect.stringContaining('https://wa.me/18297513267'),
            '_blank',
            'noopener,noreferrer'
        );

        const openedUrl = new URL((window.open as any).mock.calls[0][0]);
        const message = openedUrl.searchParams.get('text');

        expect(message).toContain('Hola, quiero mi diagnóstico gratis.');
        expect(message).toContain('Etapa: Me preparo para la defensa');
        expect(message).toContain('Nivel académico: Doctorado');
    });

    it('opens WhatsApp before the hero lead persistence promise resolves', async () => {
        const user = userEvent.setup();
        const deferred = buildDeferred<boolean>();
        saveHeroLeadMock.mockReturnValue(deferred.promise);

        renderLandingPage();

        await user.click(screen.getByRole('button', { name: /recibir mi diagnóstico gratis/i }));

        expect(window.open).toHaveBeenCalledTimes(1);
        expect(saveHeroLeadMock).toHaveBeenCalledWith({
            etapa: 'Tengo la idea inicial / Anteproyecto',
            nivel: 'Grado / Licenciatura'
        });
        expect((window as any).dataLayer).toEqual([]);

        deferred.resolve(false);

        await waitFor(() => {
            expect((window as any).dataLayer).toContainEqual(
                expect.objectContaining({
                    event: 'form_submit',
                    lead_stored: false
                })
            );
        });
    });

    it('pushes a form_submit analytics event with the selected diagnostic context', async () => {
        const user = userEvent.setup();
        saveHeroLeadMock.mockResolvedValue(true);

        renderLandingPage();

        await user.selectOptions(
            screen.getByRole('combobox', { name: /en qué etapa estás/i }),
            'Aplicando Metodología / Instrumentos'
        );
        await user.selectOptions(
            screen.getByRole('combobox', { name: /nivel académico/i }),
            'Maestría / Posgrado'
        );
        await user.click(screen.getByRole('button', { name: /recibir mi diagnóstico gratis/i }));

        await waitFor(() => {
            expect((window as any).dataLayer).toContainEqual({
                event: 'form_submit',
                'dlv - service_type': 'Diagnostico Rapido',
                diagnostico_etapa: 'Aplicando Metodología / Instrumentos',
                diagnostico_nivel: 'Maestría / Posgrado',
                lead_stored: true
            });
        });
    });

    it('reports the persisted diagnostic as a Meta Lead', async () => {
        const user = userEvent.setup();
        saveHeroLeadMock.mockResolvedValue(true);

        renderLandingPage();

        await user.click(screen.getByRole('button', { name: /recibir mi diagnóstico gratis/i }));

        await waitFor(() => {
            expect((window as any).fbq.mock.calls).toContainEqual(
                expect.arrayContaining([
                    'track',
                    'Lead',
                    expect.objectContaining({
                        content_name: 'Diagnostico Rapido',
                        content_category: 'Grado / Licenciatura'
                    })
                ])
            );
        });
    });

    it('renders the hero diagnostic controls with accessible labels', () => {
        renderLandingPage();

        expect(screen.getByRole('heading', { name: /recibe tu diagnóstico inicial/i })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /en qué etapa estás/i })).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /nivel académico/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /recibir mi diagnóstico gratis/i })).toBeInTheDocument();
    });

    it('keeps the diagnostic form text outside perspective and 3D transforms', () => {
        renderLandingPage();

        const paperStack = screen.getByTestId('diagnostic-paper-stack');
        const paperContent = screen.getByTestId('diagnostic-paper-content');

        expect(paperStack.className).not.toContain('perspective');
        expect(paperContent).not.toHaveAttribute('style');
        expect(paperStack.querySelector('[style*="translateZ"]')).toBeNull();
        expect(paperStack.querySelector('[style*="translate3d"]')).toBeNull();
    });

    it('uses the official orange with dark text in the hero trust strip', () => {
        renderLandingPage();

        const trustStrip = screen.getByTestId('hero-trust-strip');

        expect(trustStrip).toHaveClass('bg-tutesis-orange', 'text-tutesis-black');
        expect(trustStrip).not.toHaveClass('bg-tutesis-gold/15');
        expect(trustStrip).not.toHaveClass('text-tutesis-white');
    });

    it('renders named WhatsApp call-to-action links for the landing conversion path', () => {
        const { container } = renderLandingPage();

        expect(screen.getByRole('link', { name: /inicia tu diagnóstico gratis/i })).toHaveAttribute(
            'href',
            expect.stringContaining('wa.me')
        );

        [
            /diagnóstico gratis/i,
            /solicitar diagnóstico gratuito/i,
            /whatsapp: \+1/i,
            /solicitar diagnóstico con miguel/i
        ].forEach((accessibleName) => {
            const matchingLinks = screen.getAllByRole('link', { name: accessibleName });
            expect(matchingLinks.length).toBeGreaterThan(0);
            matchingLinks.forEach((link) => {
                expect(link).toHaveAttribute('href', expect.stringContaining('wa.me'));
            });
        });

        const whatsappLinks = screen.getAllByRole('link', { name: /hablar por whatsapp/i });
        expect(whatsappLinks.length).toBeGreaterThan(0);
        whatsappLinks.forEach((link) => {
            expect(link).toHaveAttribute('href', expect.stringContaining('wa.me'));
        });

        const renderedWhatsAppLinks = container.querySelectorAll('a[href*="wa.me"]');
        expect(renderedWhatsAppLinks.length).toBeGreaterThanOrEqual(7);
    });
});
