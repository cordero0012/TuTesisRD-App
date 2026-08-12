/**
 * Single source of truth for contact data.
 *
 * These values were duplicated as string literals across 20+ components, which
 * is how three different phone numbers ended up representing the brand at the
 * same time. Import from here instead of hardcoding.
 */
export const CONTACT = {
    /** WhatsApp number used by every CTA on the site (digits only, for wa.me). */
    WHATSAPP: "18297513267",
    /** Landline declared in schema.org and the footer. */
    PHONE: "+18094557280",
    EMAIL: "ttesisrd@gmail.com",
    /**
     * El handle real lleva punto. El icono del footer apuntaba a
     * `instagram.com/tutesisrd/`, que no es la cuenta de la marca; la verificada
     * en Search Console —y la que acumula las publicaciones— es `tutesis.rd`.
     * El mismo error estaba en el `sameAs` del JSON-LD de index.html, y un
     * `sameAs` equivocado impide a Google consolidar la entidad de marca.
     */
    INSTAGRAM: "https://www.instagram.com/tutesis.rd/",
    FACEBOOK: "https://www.facebook.com/tutesisrd"
} as const;

/**
 * Builds a wa.me link carrying a prefilled message.
 *
 * Every WhatsApp link on the site used to open an empty chat, so the sales team
 * received conversations with no context and no way to tell which page or
 * campaign produced them. `context` is echoed back in the message so the origin
 * survives the jump into WhatsApp.
 */
export const buildWhatsAppUrl = (context?: string): string => {
    const base = `https://wa.me/${CONTACT.WHATSAPP}`;
    if (!context) return base;
    return `${base}?text=${encodeURIComponent(context)}`;
};

export const CONFIG = {
    APP_NAME: "TuTesisRD",
    VERSION: "2.0.0",

    // AI Consistency Analyzer Configuration
    CONSISTENCY_AI_MODEL: import.meta.env.VITE_CONSISTENCY_AI_MODEL || "gemini-3-flash-preview",
    CONSISTENCY_AI_TEMPERATURE: parseFloat(import.meta.env.VITE_CONSISTENCY_AI_TEMPERATURE || '0.1'),
    // 500k chars ≈ ~120k tokens input (tesis completa de ~120 páginas). Gemini 3 Flash soporta 1M tokens.
    CONSISTENCY_MAX_CHARS: parseInt(import.meta.env.VITE_CONSISTENCY_MAX_CHARS || '500000', 10),
    // 16k tokens ≈ ~64k chars de JSON — suficiente para inventarios + reglas + feedback sin truncar.
    CONSISTENCY_MAX_OUTPUT_TOKENS: parseInt(import.meta.env.VITE_CONSISTENCY_MAX_OUTPUT_TOKENS || '16384', 10)
};
