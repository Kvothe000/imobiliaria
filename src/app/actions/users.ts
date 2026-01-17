"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import * as bcrypt from 'bcryptjs';

export async function getUsers() {
    try {
        const users = await db.user.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: {
                        transactions: true,
                        leads: true
                    }
                }
            }
        });
        return { success: true, data: users };
    } catch (error) {
        console.error("Error fetching users:", error);
        return { success: false, error: "Failed to fetch users" };
    }
}

export async function getAgents() {
    try {
        const agents = await db.user.findMany({
            where: { role: 'AGENT' },
            select: { id: true, name: true, avatar: true }
        });
        return { success: true, data: agents };
    } catch (error) {
        return { success: false, error: "Failed to fetch agents" };
    }
}

export async function createUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;

    if (!name || !email || !password || !role) {
        return { success: false, error: "Todos os campos são obrigatórios." };
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
            }
        });

        revalidatePath("/dashboard/team");
        return { success: true };
    } catch (error) {
        console.error("Error creating user:", error);
        return { success: false, error: "Erro ao criar usuário. Email pode já estar em uso." };
    }
}

export async function getBrokerRanking() {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Group transactions by user
        const ranking = await db.transaction.groupBy({
            by: ['userId', 'agentName'],
            where: {
                date: { gte: startOfMonth }
            },
            _sum: {
                value: true,
                agentShare: true,
            },
            _count: {
                id: true
            },
            orderBy: {
                _sum: {
                    value: 'desc'
                }
            }
        });

        const enrichedRanking = await Promise.all(ranking.map(async (item) => {
            let avatar = null;
            if (item.userId) {
                const user = await db.user.findUnique({ where: { id: item.userId }, select: { avatar: true } });
                avatar = user?.avatar;
            }
            return {
                ...item,
                avatar
            };
        }));

        return { success: true, data: enrichedRanking };

    } catch (error) {
        console.error("Error fetching broker ranking:", error);
        return { success: false, error: "Failed to fetch broker ranking" };
    }
}

export async function updateBrokerGoal(userId: string, newGoal: number) {
    try {
        await db.user.update({
            where: { id: userId },
            data: { goal: newGoal }
        });
        revalidatePath('/dashboard/finance');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update goal" };
    }
}
