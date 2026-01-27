export interface RegistrationFormData {
    name: string;
    lastname: string;
    email: string;
    phone: string;
    university: string;
    normative: string;
    totalAmount: string;
    paidAmount: string;
    dueDate: string;
    career: string;
    type: string;
    plan: string;
}

export type RegisterMode = 'register' | 'monitor';
