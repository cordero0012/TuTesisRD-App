import { describe, it, expect, beforeEach } from 'vitest';
import {
    validateInput,
    StudentRegistrationSchema,
    ProjectCreationSchema,
    SaveAnalysisSchema,
    TrackingCodeSchema,
    sanitizeHtml,
    RateLimiter,
} from './validation';

describe('Validation Schemas', () => {
    describe('StudentRegistrationSchema', () => {
        it('should validate a valid student registration', () => {
            const validData = {
                name: 'Juan',
                lastname: 'Pérez',
                email: 'juan@example.com',
                phone: '809-555-1234',
                university: 'UASD',
                career: 'Ingeniería',
            };

            const result = validateInput(StudentRegistrationSchema, validData);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.email).toBe('juan@example.com');
                expect(result.data.phone).toBe('8095551234'); // Stripped
            }
        });

        it('should reject invalid email', () => {
            const invalidData = {
                name: 'Juan',
                lastname: 'Pérez',
                email: 'not-an-email',
                phone: '809-555-1234',
            };

            const result = validateInput(StudentRegistrationSchema, invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.errors.email).toBeDefined();
            }
        });

        it('should reject names with numbers', () => {
            const invalidData = {
                name: 'Juan123',
                lastname: 'Pérez',
                email: 'juan@example.com',
                phone: '809-555-1234',
            };

            const result = validateInput(StudentRegistrationSchema, invalidData);
            expect(result.success).toBe(false);
        });

        it('should trim whitespace from names', () => {
            const dataWithSpaces = {
                name: '  Juan  ',
                lastname: '  Pérez  ',
                email: 'juan@example.com',
                phone: '809-555-1234',
            };

            const result = validateInput(StudentRegistrationSchema, dataWithSpaces);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.name).toBe('Juan');
                expect(result.data.lastname).toBe('Pérez');
            }
        });
    });

    describe('ProjectCreationSchema', () => {
        it('should validate a valid project', () => {
            const validData = {
                student_id: '123e4567-e89b-12d3-a456-426614174000',
                type: 'tesis',
                description: 'Tesis sobre IA en educación',
                total_amount: 5000,
                paid_amount: 2000,
                due_date: '2026-12-31',
            };

            const result = validateInput(ProjectCreationSchema, validData);
            expect(result.success).toBe(true);
        });

        it('should reject paid amount exceeding total', () => {
            const invalidData = {
                student_id: '123e4567-e89b-12d3-a456-426614174000',
                type: 'tesis',
                total_amount: 1000,
                paid_amount: 2000,
            };

            const result = validateInput(ProjectCreationSchema, invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.errors.paid_amount).toBeDefined();
            }
        });

        it('should reject negative amounts', () => {
            const invalidData = {
                student_id: '123e4567-e89b-12d3-a456-426614174000',
                type: 'tesis',
                total_amount: -500,
                paid_amount: 0,
            };

            const result = validateInput(ProjectCreationSchema, invalidData);
            expect(result.success).toBe(false);
        });

        it('should reject invalid project type', () => {
            const invalidData = {
                student_id: '123e4567-e89b-12d3-a456-426614174000',
                type: 'invalid_type',
                total_amount: 1000,
                paid_amount: 0,
            };

            const result = validateInput(ProjectCreationSchema, invalidData);
            expect(result.success).toBe(false);
        });
    });

    describe('SaveAnalysisSchema', () => {
        it('should validate a valid analysis', () => {
            const validData = {
                project_id: '123e4567-e89b-12d3-a456-426614174000',
                type: 'consistency',
                result: { score: 95, details: 'Excellent' },
                status: 'ok',
                warnings: [],
                version: '1.0',
            };

            const result = validateInput(SaveAnalysisSchema, validData);
            expect(result.success).toBe(true);
        });

        it('should reject empty result', () => {
            const invalidData = {
                project_id: '123e4567-e89b-12d3-a456-426614174000',
                type: 'audit',
                result: {},
                status: 'ok',
            };

            const result = validateInput(SaveAnalysisSchema, invalidData);
            expect(result.success).toBe(false);
        });

        it('should reject too many warnings', () => {
            const invalidData = {
                project_id: '123e4567-e89b-12d3-a456-426614174000',
                type: 'consistency',
                result: { data: 'test' },
                warnings: new Array(101).fill('warning'),
            };

            const result = validateInput(SaveAnalysisSchema, invalidData);
            expect(result.success).toBe(false);
        });
    });

    describe('TrackingCodeSchema', () => {
        it('should validate correct tracking code', () => {
            const result = validateInput(TrackingCodeSchema, 'TRX-ABC123');
            expect(result.success).toBe(true);
        });

        it('should convert lowercase to uppercase', () => {
            const result = validateInput(TrackingCodeSchema, 'trx-abc123');
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toBe('TRX-ABC123');
            }
        });

        it('should reject invalid format', () => {
            const result = validateInput(TrackingCodeSchema, 'INVALID');
            expect(result.success).toBe(false);
        });
    });
});

describe('Utility Functions', () => {
    describe('sanitizeHtml', () => {
        it('should escape HTML tags', () => {
            const dirty = '<script>alert("xss")</script>';
            const clean = sanitizeHtml(dirty);
            expect(clean).not.toContain('<script>');
            expect(clean).toContain('&lt;script&gt;');
        });

        it('should escape quotes', () => {
            const dirty = 'Hello "World" and \'foo\'';
            const clean = sanitizeHtml(dirty);
            expect(clean).toContain('&quot;');
            expect(clean).toContain('&#x27;');
        });

        it('should handle ampersands', () => {
            const dirty = 'Tom & Jerry';
            const clean = sanitizeHtml(dirty);
            expect(clean).toBe('Tom &amp; Jerry');
        });
    });

    describe('RateLimiter', () => {
        beforeEach(() => {
            // Reset time
        });

        it('should allow requests within limit', () => {
            const limiter = new RateLimiter(3, 1000); // 3 requests per second

            expect(limiter.isAllowed('user1')).toBe(true);
            expect(limiter.isAllowed('user1')).toBe(true);
            expect(limiter.isAllowed('user1')).toBe(true);
        });

        it('should block requests exceeding limit', () => {
            const limiter = new RateLimiter(2, 1000); // 2 requests per second

            expect(limiter.isAllowed('user1')).toBe(true);
            expect(limiter.isAllowed('user1')).toBe(true);
            expect(limiter.isAllowed('user1')).toBe(false); // Third should be blocked
        });

        it('should track different users separately', () => {
            const limiter = new RateLimiter(1, 1000);

            expect(limiter.isAllowed('user1')).toBe(true);
            expect(limiter.isAllowed('user2')).toBe(true); // Different user, allowed
            expect(limiter.isAllowed('user1')).toBe(false); // Same user, blocked
        });

        it('should reset limits for a specific key', () => {
            const limiter = new RateLimiter(1, 1000);

            expect(limiter.isAllowed('user1')).toBe(true);
            expect(limiter.isAllowed('user1')).toBe(false);

            limiter.reset('user1');

            expect(limiter.isAllowed('user1')).toBe(true); // Should be allowed after reset
        });
    });
});
