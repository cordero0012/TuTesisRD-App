// =============================================
// TuTesis RD - Admin Service
// =============================================

import { DashboardSummary } from '../../types/admin';

/**
 * Admin Service (Mock Implementation)
 * This serves as an abstraction layer to prevent UI dependency on DB structure.
 */

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
    // Audit Note: Simulating network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
        kpis: [
            {
                title: "Proyectos activos",
                value: "12",
                hint: "+3 esta semana",
                iconName: "FolderKanban",
                trend: 'up',
            },
            {
                title: "Ingresos del mes",
                value: "RD$52,000",
                hint: "+21% vs. mes anterior",
                iconName: "Wallet",
                trend: 'up',
            },
            {
                title: "Tasa de finalización",
                value: "86%",
                hint: "rendimiento operativo",
                iconName: "CheckCircle2",
                trend: 'stable',
            },
            {
                title: "Alertas críticas",
                value: "2",
                hint: "requieren atención hoy",
                iconName: "AlertTriangle",
                trend: 'down',
            },
        ],
        financeData: [
            { month: "Oct", income: 22000, expenses: 12000 },
            { month: "Nov", income: 34000, expenses: 18000 },
            { month: "Dic", income: 28000, expenses: 14000 },
            { month: "Ene", income: 41000, expenses: 22000 },
            { month: "Feb", income: 38000, expenses: 21000 },
            { month: "Mar", income: 52000, expenses: 24000 },
        ],
        pipelineData: [
            { name: "Activos", total: 12 },
            { name: "En revisión", total: 5 },
            { name: "Entregados", total: 8 },
            { name: "Retrasados", total: 2 },
        ],
        recentActivities: [
            {
                title: "Capítulo metodológico aprobado",
                detail: "Proyecto: Tesis doctoral de educación",
                time: "Hace 18 min",
                type: "success",
            },
            {
                title: "Pendiente de pago",
                detail: "Cliente: Asesoría TFM UAPA",
                time: "Hace 1 h",
                type: "warning",
            },
            {
                title: "Nuevo proyecto captado",
                detail: "Investigación documental - maestría",
                time: "Hace 3 h",
                type: "info",
            },
            {
                title: "Entrega vencida detectada",
                detail: "Proyecto de psicología educativa",
                time: "Hace 5 h",
                type: "danger",
            },
        ],
        priorityProjects: [
            {
                name: "Tesis doctoral - Convivencia escolar",
                owner: "Miguel",
                progress: 82,
                due: "08 Mar",
                status: "En revisión",
            },
            {
                name: "TFM - Deterioro cognitivo",
                owner: "Equipo",
                progress: 64,
                due: "11 Mar",
                status: "En curso",
            },
            {
                name: "Artículo científico derivado",
                owner: "Redacción",
                progress: 91,
                due: "13 Mar",
                status: "Listo",
            },
            {
                name: "Instrumento Google Forms",
                owner: "Soporte",
                progress: 38,
                due: "15 Mar",
                status: "Pendiente",
            },
        ]
    };
};
