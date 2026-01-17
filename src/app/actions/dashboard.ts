"use server";

import db from "@/lib/db";
import { getFinancialStats } from "./transactions";

export async function getDashboardStats() {
    try {
        const [
            totalProperties,
            activeProperties,
            totalLeads,
            portfolioValue
        ] = await Promise.all([
            db.property.count(),
            db.property.count({ where: { status: 'Disponível' } }),
            db.lead.count(),
            db.property.aggregate({ _sum: { price: true } })
        ]);

        return {
            success: true,
            data: {
                totalProperties,
                activeProperties,
                totalLeads,
                portfolioValue: portfolioValue._sum.price || 0
            }
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return { success: false, error: "Failed to fetch stats" };
    }
}

import { auth } from "@/auth";

export async function getAdvancedStats() {
    try {
        const session = await auth();
        const user = session?.user;
        const isAgent = (user as any)?.role === 'AGENT';

        const users = await db.user.findMany({
            include: {
                transactions: {
                    where: {
                        date: {
                            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) // This Month
                        }
                    }
                }
            }
        });

        // Calculate Ranking (Global is fine for competition, usually)
        const topAgents = users.map(u => {
            const volume = u.transactions.reduce((acc, t) => acc + t.value, 0);
            return {
                id: u.id,
                name: u.name,
                image: u.avatar,
                salesCount: u.transactions.length,
                volume
            };
        }).sort((a, b) => b.volume - a.volume);

        // Stats Logic
        let currentMonthRevenue = 0;
        let monthlyGoal = 0;

        if (isAgent) {
            // Agent View: MY Performance
            const currentUserStats = topAgents.find(a => a.id === user?.id);
            currentMonthRevenue = currentUserStats?.volume || 0;

            const currentUserData = users.find(u => u.id === user?.id);
            monthlyGoal = currentUserData?.goal || 20000; // Default Agent Goal
        } else {
            // Admin View: Global Performance
            currentMonthRevenue = topAgents.reduce((acc, agent) => acc + agent.volume, 0);
            // Sum individual goals to get Monthly Goal (Simulated for MVP)
            monthlyGoal = users.reduce((acc, u) => acc + (u.goal || 0), 0) || 500000;
        }

        // Get total stats (reusing logic or simplified)
        const totalStats = await getFinancialStats();

        return {
            success: true,
            data: {
                totalVGV: totalStats.totalVGV,
                totalCommission: totalStats.totalCommission,
                agencyRevenue: totalStats.agencyRevenue,
                topAgents,
                monthlyGoal,
                currentMonthRevenue,
                userRole: (user as any)?.role
            }
        };

    } catch (error) {
        console.error("Error fetching advanced stats:", error);
        return { success: false, error: "Failed to fetch advanced stats" };
    }
}
