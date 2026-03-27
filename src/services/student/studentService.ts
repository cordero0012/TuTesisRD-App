import { supabase } from '../../supabaseClient';

export interface StudentProjectDetails {
    id: string;
    title: string;
    type: string;
    status: string;
    progress_percent: number;
    due_date: string | null;
}

/**
 * Recibe el auth_user_id y busca en public.students -> public.projects
 * el proyecto activo más reciente.
 */
export async function fetchStudentActiveProject(authUserId: string): Promise<StudentProjectDetails | null> {
    try {
        // 1. Encontrar el student_id basado en el auth_user_id
        const { data: student, error: studentError } = await supabase
            .from('students')
            .select('id')
            .eq('auth_user_id', authUserId)
            .single();

        if (studentError || !student) {
            console.warn('Student profile not found for auth user', authUserId);
            return null;
        }

        // 2. Traer el proyecto más reciente asignado a este estudiante
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .select('id, title, type, status, progress_percent, due_date')
            .eq('student_id', student.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (projectError || !project) {
            return null;
        }

        return project;
    } catch (err) {
        console.error('Error fetching student project details:', err);
        return null;
    }
}
