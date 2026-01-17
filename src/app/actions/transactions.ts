"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

export async function createTransaction(formData: FormData) {
    const session = await auth();
    const user = session?.user;

    const type = formData.get("type") as string;
    const value = parseFloat(formData.get("value") as string);
    const commissionRate = parseFloat(formData.get("commissionRate") as string);
    const agentName = formData.get("agentName") as string;
    const propertyId = parseInt(formData.get("propertyId") as string);
    const leadId = parseInt(formData.get("leadId") as string);

    if (!type || !value || !commissionRate || !propertyId || !leadId) {
        return { success: false, error: "Dados inválidos para a transação." };
    }

    const commissionValue = value * (commissionRate / 100);
    const agentShare = commissionValue * 0.40; // 40% for agent
    const agencyShare = commissionValue - agentShare;

    try {
        // Try to link User by Auth first, then Name
        let userIdToLink = user?.id;

        // If Admin is creating for someone else (future feature), we typically keep it self-assigned or specific input
        // For now, if Agent creates, it's theirs.

        // If system has "agentName" override, we might check that user exists?
        // Fallback or override logic:
        const agent = await db.user.findFirst({
            where: { name: agentName }
        });
        if (agent) userIdToLink = agent.id;

        // Create Transaction
        await db.transaction.create({
            data: {
                type,
                value,
                commissionRate,
                commissionValue,
                agentShare,
                agencyShare,
                agentName: agentName || user?.name || "Corretor",
                userId: userIdToLink, // LINKING USER!
                propertyId,
                leadId,
                date: new Date(),
            }
        });

        // Update Property Status
        const newStatus = type === 'Venda' ? 'Vendido' : 'Alugado';
        await db.property.update({
            where: { id: propertyId },
            data: { status: newStatus }
        });

        // Update Lead Status
        await db.lead.update({
            where: { id: leadId },
            data: {
                status: 'Fechado',
                pipelineStage: 'Fechado'
            }
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/leads");
        revalidatePath("/dashboard/properties");

        return { success: true };
    } catch (error) {
        console.error("Error creating transaction:", error);
        return { success: false, error: "Erro ao registrar transação." };
    }
}

export async function getFinancialStats() {
    try {
        const session = await auth();
        const user = session?.user;

        let whereClause: any = {};
        if (user && (user as any).role === 'AGENT') {
            whereClause = { userId: user.id };
        }

        const transactions = await db.transaction.findMany({
            where: whereClause,
            orderBy: { date: 'desc' },
            include: { property: true, lead: true },
            take: 100 // Limit history
        });

        const totalVGV = transactions.reduce((acc: number, t: any) => acc + t.value, 0);

        // RBAC Adjustment:
        const isAgent = (user as any).role === 'AGENT';

        // If Agent: "Total Commission" = Their Share. "Revenue" = Same (or hide).
        const totalCommission = transactions.reduce((acc: number, t: any) =>
            acc + (isAgent ? t.agentShare : t.commissionValue), 0
        );

        // If Agent: Show their earnings as "Revenue" in some contexts, or 0? 
        // Let's keep agencyRevenue as Agency Share for Admin, but for Agent maybe it's irrelevant or 0?
        // Actually, let's treat "agencyRevenue" as "Net Revenue" for the viewer.
        const agencyRevenue = transactions.reduce((acc: number, t: any) =>
            acc + (isAgent ? t.agentShare : t.agencyShare), 0
        );

        const monthlyData: Record<string, number> = transactions.reduce((acc: any, t: any) => {
            const month = new Date(t.date).toLocaleString('pt-BR', { month: 'short' });
            acc[month] = (acc[month] || 0) + ((user as any).role === 'AGENT' ? t.agentShare : t.agencyShare);
            return acc;
        }, {});

        const chartData = Object.entries(monthlyData)
            .map(([name, total]) => ({ name, total }))
            .slice(0, 6); // Last 6 months

        return {
            totalVGV,
            totalCommission,
            agencyRevenue,
            recentTransactions: transactions.slice(0, 5),
            chartData,
            userRole: (user as any).role // Pass role to UI for label customization
        };
    } catch (error) {
        return { totalVGV: 0, totalCommission: 0, agencyRevenue: 0, recentTransactions: [], chartData: [] };
    }
}

export async function getFinancialMetrics() {
    try {
        const session = await auth();
        const user = session?.user;

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        let whereClause: any = {
            date: {
                gte: startOfMonth,
                lte: endOfMonth
            }
        };

        if (user && (user as any).role === 'AGENT') {
            whereClause.userId = user.id;
        }

        // Fetch all transactions for the current month
        const transactions = await db.transaction.findMany({
            where: whereClause
        });

        // Calculate totals
        const totalVGV = transactions.reduce((acc, t) => acc + t.value, 0);
        const totalRevenue = transactions.reduce((acc, t) => acc + t.agencyShare, 0);
        const totalCommissions = transactions.reduce((acc, t) => acc + t.agentShare, 0);
        const dealCount = transactions.length;

        // Fetch Company Goal 
        // If AGENT, fetch only their goal
        let companyGoal = 1000000;

        if (user && (user as any).role === 'AGENT') {
            const userData = await db.user.findUnique({ where: { id: user.id }, select: { goal: true } });
            companyGoal = userData?.goal || 50000;
        } else {
            const agents = await db.user.findMany({
                where: { role: 'AGENT' },
                select: { goal: true }
            });
            companyGoal = agents.reduce((acc, a) => acc + a.goal, 0) || 1000000;
        }

        return {
            success: true,
            data: {
                totalVGV,
                totalRevenue,
                totalCommissions,
                dealCount,
                companyGoal,
                goalProgress: (totalVGV / companyGoal) * 100
            }
        };

    } catch (error) {
        console.error("Error fetching financial metrics:", error);
        return { success: false, error: "Failed to fetch metrics" };
    }
}
