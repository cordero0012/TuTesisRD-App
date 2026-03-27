import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';

// ---- Types ----
export interface AdminStudent {
    id: string;
    name: string;
    lastname: string;
    email: string;
    phone?: string;
    university?: string;
    career?: string;
    created_at: string;
    projects?: AdminProject[];
}

export interface AdminProject {
    id: string;
    title?: string;
    type?: string;
    status: string;
    total_amount: number;
    paid_amount: number;
    due_date?: string;
    progress_percent: number;
    tracking_code: string;
    created_at: string;
    student_id?: string;
    students?: {
        name: string;
        lastname: string;
        email: string;
        university?: string;
    };
}

export interface DashboardKPIs {
    activeProjects: number;
    monthlyRevenue: number;
    completionRate: number;
    overdueProjects: number;
}

export interface FinanceMonthData {
    month: string;
    ingresos: number;
    gastos: number;
}

export interface ActivityItem {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'danger';
    created_at: string;
}

// ---- Service Functions ----
const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/** Fetch all students with their project count */
export async function fetchStudents(): Promise<AdminStudent[]> {
    const { data, error } = await supabase
        .from('students')
        .select(`
            *,
            projects:projects(id, status, type, tracking_code, total_amount, paid_amount, due_date, progress_percent, created_at)
        `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

/** Fetch all projects with student data */
export async function fetchProjects(): Promise<AdminProject[]> {
    const { data, error } = await supabase
        .from('projects')
        .select(`
            *,
            students:student_id(name, lastname, email, university)
        `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

/** Fetch dashboard KPIs derived from real data */
export async function fetchDashboardKPIs(): Promise<DashboardKPIs> {
    const now = new Date().toISOString();

    // Parallel queries
    const [activeRes, monthRes, totalRes, overdueRes] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true })
            .in('status', ['pending', 'assigned', 'in_progress']),
        supabase.from('projects').select('paid_amount')
            .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        supabase.from('projects').select('id, status', { count: 'exact' }),
        supabase.from('projects').select('id', { count: 'exact', head: true })
            .lt('due_date', now).not('status', 'eq', 'completed')
    ]);

    const monthlyRevenue = (monthRes.data || []).reduce((sum, p) => sum + (p.paid_amount || 0), 0);
    const totalProjects = totalRes.count || 0;
    const completedProjects = (totalRes.data || []).filter(p => p.status === 'completed').length;
    const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

    return {
        activeProjects: activeRes.count || 0,
        monthlyRevenue,
        completionRate,
        overdueProjects: overdueRes.count || 0,
    };
}

/** Derive monthly finance chart data from projects */
export async function fetchFinanceChartData(): Promise<FinanceMonthData[]> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
        .from('projects')
        .select('created_at, paid_amount, total_amount')
        .gte('created_at', sixMonthsAgo.toISOString())
        .order('created_at', { ascending: true });

    if (error) throw error;

    // Build monthly buckets
    const buckets: Record<string, { ingresos: number; gastos: number }> = {};
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const key = MONTH_NAMES[d.getMonth()];
        buckets[key] = { ingresos: 0, gastos: 0 };
    }

    (data || []).forEach(p => {
        const d = new Date(p.created_at);
        const key = MONTH_NAMES[d.getMonth()];
        if (buckets[key]) {
            buckets[key].ingresos += p.paid_amount || 0;
            buckets[key].gastos += (p.total_amount || 0) - (p.paid_amount || 0);
        }
    });

    return Object.entries(buckets).map(([month, vals]) => ({ month, ...vals }));
}

/** Fetch recent activity from notification_logs */
export async function fetchRecentActivity(): Promise<ActivityItem[]> {
    const { data, error } = await supabase
        .from('notification_logs')
        .select('id, title, message, type, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) throw error;
    return (data || []).map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type as ActivityItem['type'],
        created_at: n.created_at,
    }));
}

/** Create a new student/client */
export async function createStudent(data: { name: string; lastname: string; email: string; university: string }): Promise<AdminStudent> {
    const { data: student, error } = await supabase
        .from('students')
        .insert([data])
        .select()
        .single();

    if (error) throw error;
    return student;
}

/** Create a new project tied to a student */
export async function createProject(data: {
    title: string;
    student_id?: string;
    client_name?: string;
    type: string;
    due_date?: string;
}): Promise<AdminProject> {
    const { data: project, error } = await supabase
        .from('projects')
        .insert([{
            title: data.title,
            student_id: data.student_id,
            type: data.type,
            due_date: data.due_date || null,
            status: 'pending',
            progress_percent: 0,
        }])
        .select(`*, students:student_id(name, lastname, email, university)`)
        .single();

    if (error) throw error;
    return project;
}

/** Update project status */
export async function updateProjectStatus(projectId: string, status: string): Promise<void> {
    const { error } = await supabase
        .from('projects')
        .update({ status, progress_percent: status === 'completed' ? 100 : undefined })
        .eq('id', projectId);

    if (error) throw error;
}

/** Delete a project */
export async function deleteProject(projectId: string): Promise<void> {
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

    if (error) throw error;
}

/** Update student status (no status column → update via notification or project) */
export async function deleteStudent(studentId: string): Promise<void> {
    const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);

    if (error) throw error;
}

// ---- Utility ----
export function formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffMin / 60);
    const diffD = Math.floor(diffH / 24);

    if (diffMin < 1) return 'Ahora mismo';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffH < 24) return `Hace ${diffH} h`;
    if (diffD === 1) return 'Ayer';
    if (diffD < 7) return `Hace ${diffD} días`;
    return date.toLocaleDateString('es-DO');
}

export function getStudentDisplayStatus(projects: AdminProject[] = []): string {
    if (projects.length === 0) return 'Sin proyectos';
    const hasActive = projects.some(p => ['pending', 'assigned', 'in_progress'].includes(p.status));
    const hasPending = projects.some(p => p.status === 'pending' && (p.total_amount || 0) > (p.paid_amount || 0));
    if (hasPending) return 'Pendiente Pago';
    if (hasActive) return 'Activo';
    return 'Finalizado';
}
