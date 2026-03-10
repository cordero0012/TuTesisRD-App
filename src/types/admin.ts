// =============================================
// TuTesis RD - Admin DTOs (Data Transfer Objects)
// =============================================

export interface DashboardKpi {
    title: string;
    value: string;
    hint: string;
    iconName: string;
    trend: 'stable' | 'up' | 'down';
}

export interface FinancePoint {
    month: string;
    income: number;
    expenses: number;
}

export interface PipelineItem {
    name: string;
    total: number;
}

export interface ActivityItem {
    title: string;
    detail: string;
    time: string;
    type: 'success' | 'warning' | 'info' | 'danger';
}

export interface ProjectRow {
    name: string;
    owner: string;
    progress: number;
    due: string;
    status: string;
}

export interface DashboardSummary {
    kpis: DashboardKpi[];
    financeData: FinancePoint[];
    pipelineData: PipelineItem[];
    recentActivities: ActivityItem[];
    priorityProjects: ProjectRow[];
}
