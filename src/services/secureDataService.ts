import { supabase } from '../supabaseClient';
import { validateInput, StudentRegistrationSchema, ProjectCreationSchema, sanitizeHtml } from '../types/validation';

/**
 * Secure Data Service
 * Handles all database operations with input validation and security best practices
 */

export interface Student {
    id?: string;
    name: string;
    lastname: string;
    email: string;
    phone: string;
    university?: string;
    career?: string;
}

export interface Project {
    id?: string;
    student_id: string;
    type: string;
    description?: string;
    total_amount: number;
    paid_amount: number;
    due_date?: string;
    status: string;
    tracking_code?: string;
}

/**
 * Registers a new student with input validation
 */
export async function registerStudent(
    data: Omit<Student, 'id'>
): Promise<{ success: boolean; data?: Student; error?: string }> {
    // Validate input
    const validation = validateInput(StudentRegistrationSchema, data);

    if (!validation.success) {
        const errorMsg = Object.entries(validation.errors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('; ');
        return { success: false, error: errorMsg };
    }

    // Insert into database
    const { data: student, error } = await supabase
        .from('students')
        .insert([validation.data])
        .select()
        .single();

    if (error) {
        console.error('[SecureDataService] Error registering student:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data: student };
}

/**
 * Creates a new project with input validation
 */
export async function createProject(
    data: Omit<Project, 'id' | 'tracking_code'>
): Promise<{ success: boolean; data?: Project; error?: string }> {
    // Validate input
    const validation = validateInput(ProjectCreationSchema, data);

    if (!validation.success) {
        const errorMsg = Object.entries(validation.errors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('; ');
        return { success: false, error: errorMsg };
    }

    // Insert into database
    const { data: project, error } = await supabase
        .from('projects')
        .insert([validation.data])
        .select()
        .single();

    if (error) {
        console.error('[SecureDataService] Error creating project:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data: project };
}

/**
 * Retrieves a project by tracking code
 */
export async function getProjectByTrackingCode(
    trackingCode: string
): Promise<{ success: boolean; data?: Project; error?: string }> {
    // Sanitize input
    const sanitizedCode = trackingCode.trim().toUpperCase();

    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('tracking_code', sanitizedCode)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return { success: false, error: 'Proyecto no encontrado' };
        }
        console.error('[SecureDataService] Error fetching project:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

/**
 * Gets projects for a specific student (with RLS enforcement)
 */
export async function getStudentProjects(
    studentId: string
): Promise<{ success: boolean; data?: Project[]; error?: string }> {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[SecureDataService] Error fetching projects:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
}

/**
 * Updates project status (with RLS enforcement - user must own the project)
 */
export async function updateProjectStatus(
    projectId: string,
    newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled'
): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId);

    if (error) {
        console.error('[SecureDataService] Error updating project status:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

/**
 * Searches students by email (admin only - requires service_role or appropriate RLS)
 */
export async function findStudentByEmail(
    email: string
): Promise<{ success: boolean; data?: Student; error?: string }> {
    const sanitizedEmail = email.trim().toLowerCase();

    const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('email', sanitizedEmail)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return { success: false, error: 'Estudiante no encontrado' };
        }
        console.error('[SecureDataService] Error finding student:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

/**
 * Sanitizes user-generated content before display
 */
export function sanitizeForDisplay(content: string): string {
    return sanitizeHtml(content);
}
