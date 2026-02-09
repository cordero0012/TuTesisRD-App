import { z } from 'zod';

/**
 * Validation Schemas for TuTesisRD Application
 * All user inputs must be validated using these schemas before processing
 */

// ==============================================================================
// STUDENT SCHEMAS
// ==============================================================================

export const StudentRegistrationSchema = z.object({
    name: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios')
        .transform(val => val.trim()),

    lastname: z
        .string()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(100, 'El apellido no puede exceder 100 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras y espacios')
        .transform(val => val.trim()),

    email: z
        .string()
        .email('Email inválido')
        .max(255, 'El email no puede exceder 255 caracteres')
        .toLowerCase()
        .transform(val => val.trim()),

    phone: z
        .string()
        .regex(
            /^(\+?1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
            'Formato de teléfono inválido (ej: 809-555-1234)'
        )
        .transform(val => val.replace(/\D/g, '')), // Remove non-digits

    university: z
        .string()
        .min(3, 'El nombre de la universidad debe tener al menos 3 caracteres')
        .max(200, 'El nombre de la universidad no puede exceder 200 caracteres')
        .optional()
        .transform(val => val?.trim()),

    career: z
        .string()
        .min(3, 'El nombre de la carrera debe tener al menos 3 caracteres')
        .max(200, 'El nombre de la carrera no puede exceder 200 caracteres')
        .optional()
        .transform(val => val?.trim()),
});

export type StudentRegistrationInput = z.infer<typeof StudentRegistrationSchema>;

// ==============================================================================
// PROJECT SCHEMAS
// ==============================================================================

export const ProjectTypeSchema = z.enum([
    'tesis',
    'monografia',
    'proyecto_grado',
    'anteproyecto',
    'otros',
], {
    errorMap: () => ({ message: 'Tipo de proyecto inválido' }),
});

export const ProjectStatusSchema = z.enum([
    'pending',
    'in_progress',
    'completed',
    'cancelled',
], {
    errorMap: () => ({ message: 'Estado de proyecto inválido' }),
});

export const ProjectCreationSchema = z.object({
    student_id: z
        .string()
        .uuid('ID de estudiante inválido'),

    type: ProjectTypeSchema,

    description: z
        .string()
        .min(10, 'La descripción debe tener al menos 10 caracteres')
        .max(5000, 'La descripción no puede exceder 5000 caracteres')
        .transform(val => val.trim())
        .optional(),

    total_amount: z
        .number()
        .min(0, 'El monto total no puede ser negativo')
        .max(1000000, 'El monto total no puede exceder $1,000,000')
        .default(0),

    paid_amount: z
        .number()
        .min(0, 'El monto pagado no puede ser negativo')
        .default(0),

    due_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')
        .optional()
        .refine(
            (date) => {
                if (!date) return true;
                const d = new Date(date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return d >= today;
            },
            { message: 'La fecha de vencimiento no puede ser en el pasado' }
        ),

    status: ProjectStatusSchema.default('pending'),
}).refine(
    (data) => data.paid_amount <= data.total_amount,
    {
        message: 'El monto pagado no puede exceder el monto total',
        path: ['paid_amount'],
    }
);

export type ProjectCreationInput = z.infer<typeof ProjectCreationSchema>;

// ==============================================================================
// ANALYSIS SCHEMAS
// ==============================================================================

export const AnalysisTypeSchema = z.enum(['consistency', 'audit'], {
    errorMap: () => ({ message: 'Tipo de análisis inválido' }),
});

export const SaveAnalysisSchema = z.object({
    project_id: z
        .string()
        .uuid('ID de proyecto inválido'),

    type: AnalysisTypeSchema,

    result: z.record(z.any()).refine(
        (val) => Object.keys(val).length > 0,
        { message: 'El resultado del análisis no puede estar vacío' }
    ),

    status: z
        .string()
        .max(50, 'El estado no puede exceder 50 caracteres')
        .default('ok'),

    warnings: z
        .array(z.string().max(500))
        .default([])
        .refine(
            (arr) => arr.length <= 100,
            { message: 'No se pueden tener más de 100 advertencias' }
        ),

    version: z
        .string()
        .regex(/^\d+\.\d+$/, 'Formato de versión inválido (ej: 1.0)')
        .default('1.0'),
});

export type SaveAnalysisInput = z.infer<typeof SaveAnalysisSchema>;

// ==============================================================================
// TRACKING CODE SCHEMA
// ==============================================================================

export const TrackingCodeSchema = z
    .string()
    .regex(/^TRX-[A-Z0-9]{6}$/, 'Código de seguimiento inválido (formato: TRX-XXXXXX)')
    .toUpperCase();

export type TrackingCode = z.infer<typeof TrackingCodeSchema>;

// ==============================================================================
// UTILITY VALIDATION FUNCTIONS
// ==============================================================================

/**
 * Safely validates and parses input data
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result with data or errors
 */
export function validateInput<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
    const result = schema.safeParse(data);

    if (result.success) {
        return { success: true, data: result.data };
    }

    // Format errors for easy consumption
    const errors: Record<string, string[]> = {};

    result.error.errors.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) {
            errors[path] = [];
        }
        errors[path].push(err.message);
    });

    return { success: false, errors };
}

/**
 * Sanitizes HTML to prevent XSS attacks
 * Use this before displaying user-generated content
 */
export function sanitizeHtml(input: string): string {
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Sanitizes SQL input to prevent SQL injection
 * Note: This is a fallback. Always use parameterized queries.
 */
export function sanitizeSqlInput(input: string): string {
    return input.replace(/['";\\]/g, '');
}

/**
 * Rate limiting helper (client-side)
 * Prevents abuse by limiting actions per time window
 */
export class RateLimiter {
    private attempts: Map<string, number[]> = new Map();

    constructor(
        private maxAttempts: number,
        private windowMs: number
    ) { }

    /**
     * Check if action is allowed
     * @param key - Unique identifier (e.g., user ID, IP)
     * @returns true if allowed, false if rate limited
     */
    isAllowed(key: string): boolean {
        const now = Date.now();
        const attempts = this.attempts.get(key) || [];

        // Remove attempts outside the window
        const recentAttempts = attempts.filter(
            (timestamp) => now - timestamp < this.windowMs
        );

        if (recentAttempts.length >= this.maxAttempts) {
            return false;
        }

        // Record this attempt
        recentAttempts.push(now);
        this.attempts.set(key, recentAttempts);

        return true;
    }

    /**
     * Reset rate limit for a key
     */
    reset(key: string): void {
        this.attempts.delete(key);
    }
}

// ==============================================================================
// EXPORTS
// ==============================================================================

export const ValidationSchemas = {
    student: StudentRegistrationSchema,
    project: ProjectCreationSchema,
    analysis: SaveAnalysisSchema,
    trackingCode: TrackingCodeSchema,
} as const;
