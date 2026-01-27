"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";


export async function getLeads() {
    try {
        const session = await auth();
        const user = session?.user;

        let whereClause: any = {};

        // RBAC: If not Admin, filter leads
        if (user && (user as any).role === 'AGENT') {
            whereClause = { assignedAgentId: user.id };
        }

        const leads = await db.lead.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: {
                assignedAgent: { select: { name: true, avatar: true } },
                tags: true,
                stage: true // Get Stage Name
            },
            take: 100 // OPTIMIZATION: Initial load 100 recent leads (Paginated rest)
        });
        return { success: true, data: leads };
    } catch (error) {
        console.error("Error fetching leads:", error);
        return { success: false, error: "Failed to fetch leads" };
    }
}

export async function fetchLeadsByStage(stage: string, skip: number = 0, take: number = 20) {
    try {
        const session = await auth();
        const user = session?.user;

        let whereClause: any = { pipelineStage: stage };

        // RBAC: If not Admin, filter leads
        if (user && (user as any).role === 'AGENT') {
            whereClause.assignedAgentId = user.id;
        }

        const leads = await db.lead.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: { assignedAgent: { select: { name: true, avatar: true } } },
            skip,
            take
        });

        return { success: true, data: leads };
    } catch (error) {
        console.error("Error fetching leads by stage:", error);
        return { success: false, error: "Failed to fetch leads" };
    }
}

export async function createLead(formData: FormData) {
    const session = await auth();
    const userSession = session?.user;

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const interest = formData.get("interest") as string;
    const source = formData.get("source") as string;

    if (!name || !phone) {
        return { success: false, error: "Nome e Telefone são obrigatórios." };
    }

    try {
        const lead = await db.lead.create({
            data: {
                name,
                phone,
                email,
                interest,
                source: source || "Manual",
                status: "Novo",
                // Assign to creator if Agent (or current user)
                assignedAgent: userSession?.id ? { connect: { id: userSession.id } } : undefined,
                // New Fields Mockup (Defaulting)
                stage: {
                    connect: {
                        // Connect to first stage of Buy Pipeline by default (Assuming ID 1 is "Novo Lead" from seed)
                        // In prod, fetch the default pipeline first.
                        id: 1
                    }
                }
            }
        });
        revalidatePath("/dashboard/leads");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Erro ao criar lead." };
    }
}

export async function createWebLead(data: { name: string; phone: string; email: string; interest: string }) {
    if (!data.name || !data.phone) {
        return { success: false, error: "Nome e Telefone são obrigatórios." };
    }

    try {
        await db.lead.create({
            data: {
                name: data.name,
                phone: data.phone,
                email: data.email || null,
                interest: data.interest,
                source: "Site",
                status: "Novo",
                stage: {
                    connect: { id: 1 } // Default to first stage
                }
            }
        });

        revalidatePath("/dashboard/leads");
        return { success: true };
    } catch (error) {
        console.error("Error creating web lead:", error);
        return { success: false, error: "Erro ao salvar contato." };
    }
}

export async function updateLead(formData: FormData) {
    const id = parseInt(formData.get("id") as string);
    // ... basic fields ...
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const interest = formData.get("interest") as string;
    const source = formData.get("source") as string;
    const status = formData.get("status") as string;
    // const pipelineStage = formData.get("pipelineStage") as string; // Deprecated string, use relation

    const cpf = formData.get("cpf") as string;
    const rg = formData.get("rg") as string;
    const nationality = formData.get("nationality") as string;
    const maritalStatus = formData.get("maritalStatus") as string;
    const profession = formData.get("profession") as string;
    const tags = formData.get("tags") ? JSON.parse(formData.get("tags") as string) : [];

    try {
        await db.lead.update({
            where: { id },
            data: {
                name,
                phone,
                email,
                interest,
                source,
                status,
                // pipelineStage, // Legacy
                cpf,
                rg,
                nationality,
                maritalStatus,
                profession,
                score: parseInt(formData.get("score") as string) || 50,
                tags: {
                    set: [], // Clear old
                    connect: tags.map((tagId: number) => ({ id: tagId })) // Connect new
                }
            }
        });
        revalidatePath("/dashboard/leads");
        return { success: true };
    } catch (error) {
        console.log(error);
        return { success: false, error: "Erro ao atualizar lead." };
    }
}

export async function deleteLead(id: number) {
    try {
        await db.lead.delete({
            where: { id }
        });
        revalidatePath("/dashboard/leads");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Erro ao deletar lead." };
    }
}

function generateSlug(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let slug = '';
    for (let i = 0; i < length; i++) {
        slug += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return slug;
}

export async function createSelection(propertyIds: number[] | number, leadId?: number) {
    try {
        const slug = generateSlug();

        // Ensure propertyIds is an array
        const ids = Array.isArray(propertyIds) ? propertyIds : [propertyIds];

        await db.selection.create({
            data: {
                slug,
                leadId,
                properties: ids.map(String)
            }
        });
        return { success: true, slug };
    } catch (error) {
        console.error("Error creating selection:", error);
        return { success: false, error: "Failed to create selection" };
    }
}

export async function getSelection(slug: string) {
    try {
        const selection = await db.selection.findUnique({
            where: { slug }
        });

        if (!selection || !selection.leadId) return { success: false, error: "Selection not found" };

        const [properties, lead, appointments] = await Promise.all([
            db.property.findMany({
                where: {
                    id: { in: selection.properties.map(Number) }
                }
            }),
            db.lead.findUnique({
                where: { id: selection.leadId },
                include: { assignedAgent: true }
            }),
            db.appointment.findMany({
                where: { leadId: selection.leadId },
                orderBy: { date: 'asc' },
                include: { property: true }
            })
        ]);

        if (!lead) return { success: false, error: "Lead not found" };

        return {
            success: true,
            data: properties,
            lead: lead,
            appointments: appointments
        };
    } catch (error) {
        console.error("Error fetching selection:", error);
        return { success: false, error: "Failed to fetch selection" };
    }
}

export async function updateLeadStage(id: number, stage: string) {
    try {
        await db.lead.update({
            where: { id },
            data: { pipelineStage: stage }
        });
        revalidatePath('/dashboard/leads');
        return { success: true };
    } catch (error) {
        console.error("Error updating lead stage:", error);
        return { success: false, error: "Failed to update lead stage" };
    }
}

export async function createAppointment(leadId: number, date: Date, notes?: string, propertyId?: number) {
    try {
        const appointment = await db.appointment.create({
            data: {
                leadId,
                date,
                notes,
                propertyId,
                status: "Agendado"
            }
        });

        revalidatePath("/dashboard/leads");
        return { success: true, data: appointment };
    } catch (error) {
        console.error("Error creating appointment:", error);
        return { success: false, error: "Failed to create appointment" };
    }
}

export async function getAppointments() {
    try {
        const session = await auth();
        const user = session?.user;

        let whereClause: any = {
            date: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)) // Future or today only
            }
        };

        if (user && (user as any).role === 'AGENT') {
            whereClause.lead = { assignedAgentId: user.id };
        }

        const appointments = await db.appointment.findMany({
            orderBy: { date: 'asc' },
            where: whereClause,
            include: {
                lead: true,
                property: true
            },
            take: 10 // Limit for dashboard
        });
        return { success: true, data: appointments };
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return { success: false, error: "Failed to fetch appointments" };
    }
}

export async function getAllAppointments() {
    try {
        const session = await auth();
        const user = session?.user;

        let whereClause: any = {
            date: {
                gte: new Date(new Date().setDate(new Date().getDate() - 7))
            }
        };

        if (user && (user as any).role === 'AGENT') {
            whereClause.lead = { assignedAgentId: user.id };
        }

        const appointments = await db.appointment.findMany({
            orderBy: { date: 'asc' },
            where: whereClause,
            include: {
                lead: true,
                property: true
            },
            take: 100
        });
        return { success: true, data: appointments };
    } catch (error) {
        console.error("Error fetching all appointments:", error);
        return { success: false, error: "Failed to fetch all appointments" };
    }
}

export async function getPipelineStages(pipelineId: number = 1) {
    try {
        const stages = await db.pipelineStage.findMany({
            where: { pipelineId },
            orderBy: { order: 'asc' }
        });
        return { success: true, data: stages };
    } catch (error) {
        console.error("Error fetching stages:", error);
        return { success: false, error: "Failed to fetch stages" };
    }
}

export async function markLeadAsLost(id: number, reason: string, notes: string) {
    try {
        // Find "Perdido" stage first to be safe or assuming standard naming
        const lostStage = await db.pipelineStage.findFirst({
            where: { name: "Perdido" }
        });

        await db.lead.update({
            where: { id },
            data: {
                status: "Perdido",
                lostReason: reason,
                // Append notes to interest if needed, or ignore. 
                // Let's just update stage relation
                stage: lostStage ? { connect: { id: lostStage.id } } : undefined
            }
        });

        revalidatePath("/dashboard/leads");
        return { success: true };
    } catch (error) {
        console.error("Error marking lead as lost:", error);
        return { success: false, error: "Failed to update lead" };
    }
}
