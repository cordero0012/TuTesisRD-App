import { supabase } from '../../supabaseClient';

export interface HeroLeadInput {
    etapa: string;
    nivel: string;
}

/**
 * Reads the UTM parameters from the current URL.
 *
 * Captured at submit time because the landing is a SPA: by the time the user
 * fills the form they may have navigated, but the query string survives.
 */
const readAttribution = () => {
    if (typeof window === 'undefined') return {};

    const params = new URLSearchParams(window.location.search);
    return {
        page_path: window.location.pathname,
        referrer: document.referrer || null,
        utm_source: params.get('utm_source'),
        utm_medium: params.get('utm_medium'),
        utm_campaign: params.get('utm_campaign')
    };
};

/**
 * Persists a "Diagnóstico Rápido" submission.
 *
 * Never throws: the form's job is to get the student into WhatsApp, and a
 * database hiccup must not block that. Returns whether the write succeeded so
 * the caller can decide what to report.
 */
export async function saveHeroLead(input: HeroLeadInput): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('hero_leads')
            .insert([{
                etapa: input.etapa,
                nivel: input.nivel,
                ...readAttribution()
            }]);

        if (error) {
            console.error('No se pudo guardar el lead del formulario:', error.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Error inesperado guardando el lead del formulario:', err);
        return false;
    }
}
