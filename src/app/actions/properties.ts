"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getProperties() {
    try {
        const properties = await db.property.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: properties };
    } catch (error) {
        console.error("Error fetching properties:", error);
        return { success: false, error: "Failed to fetch properties" };
    }
}

export async function getProperty(id: number) {
    try {
        const property = await db.property.findUnique({
            where: { id }
        });
        return { success: true, data: property };
    } catch (error) {
        console.error("Error fetching property:", error);
        return { success: false, error: "Failed to fetch property" };
    }
}

export async function getAvailablePropertiesSelect() {
    try {
        const properties = await db.property.findMany({
            where: { status: 'Disponível' },
            select: { id: true, title: true, code: true, price: true }
        });
        return { success: true, data: properties };
    } catch (error) {
        return { success: false, error: "Failed to fetch properties" };
    }
}

export async function getSimilarProperties(excludeId: number, type?: string) {
    try {
        const properties = await db.property.findMany({
            where: {
                id: { not: excludeId },
                type: type || undefined,
                status: 'Disponível',
                publishOnPortals: true
            },
            take: 3,
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: properties };
    } catch (error) {
        return { success: false, error: "Failed to load similar properties" };
    }
}

export async function createProperty(formData: FormData) {
    const title = formData.get("title") as string;
    // Reconstruct address or use provided fields
    const street = formData.get("street") as string;
    const number = formData.get("number") as string;
    const neighborhood = formData.get("neighborhood") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const address = `${street}, ${number} - ${neighborhood}, ${city}/${state}`;

    const price = parseFloat(formData.get("price") as string);
    const type = formData.get("type") as string;
    const image = formData.get("image") as string;

    // New Fields
    const code = formData.get("code") as string;
    const zipCode = formData.get("zipCode") as string;
    const complement = formData.get("complement") as string;
    const iptuPrice = parseFloat(formData.get("iptuPrice") as string) || 0;
    const condoPrice = parseFloat(formData.get("condoPrice") as string) || 0;
    const totalArea = parseFloat(formData.get("totalArea") as string) || 0;
    const suites = parseInt(formData.get("suites") as string) || 0;
    const publishOnPortals = formData.get("publishOnPortals") === "on";

    const bedrooms = parseInt(formData.get("bedrooms") as string) || 0;
    const bathrooms = parseInt(formData.get("bathrooms") as string) || 0;
    const garage = parseInt(formData.get("garage") as string) || 0;
    const area = parseFloat(formData.get("area") as string) || 0;
    const description = formData.get("description") as string;

    if (!title || !price || !type) {
        return { success: false, error: "Título, Preço e Tipo são obrigatórios." };
    }

    try {
        await db.property.create({
            data: {
                title,
                address: address || "Endereço não informado", // Fallback
                price,
                type,
                status: "Disponível",
                image: image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&q=60",
                bedrooms,
                bathrooms,
                garage,
                area,
                description,

                // New Fields
                code,
                zipCode,
                city,
                state,
                neighborhood,
                street,
                number,
                complement,
                iptuPrice,
                condoPrice,
                suites,
                totalArea,
                publishOnPortals,

                gallery: [],
            },
        });

        revalidatePath("/dashboard/properties");
        return { success: true };
    } catch (error) {
        console.error("Error creating property:", error);
        return { success: false, error: "Erro ao criar imóvel. Verifique se o código já existe." };
    }
}

export async function updateProperty(formData: FormData) {
    const id = parseInt(formData.get("id") as string);
    const title = formData.get("title") as string;
    const address = formData.get("address") as string;
    const price = parseFloat(formData.get("price") as string);
    const type = formData.get("type") as string;
    const status = formData.get("status") as string;
    const image = formData.get("image") as string;
    const bedrooms = parseInt(formData.get("bedrooms") as string) || 0;
    const bathrooms = parseInt(formData.get("bathrooms") as string) || 0;
    const garage = parseInt(formData.get("garage") as string) || 0;
    const area = parseFloat(formData.get("area") as string) || 0;
    const description = formData.get("description") as string;

    if (!id || !title || !address || !price || !type || !status) {
        return { success: false, error: "Preencha todos os campos obrigatórios." };
    }

    try {
        await db.property.update({
            where: { id },
            data: {
                title,
                address,
                price,
                type,
                status,
                image,
                bedrooms,
                bathrooms,
                garage,
                area,
                description,
            },
        });

        revalidatePath("/dashboard/properties");
        return { success: true };
    } catch (error) {
        console.error("Error updating property:", error);
        return { success: false, error: "Erro ao atualizar imóvel." };
    }
}

export async function getMatchingProperties(interest: string) {
    if (!interest) return { success: true, data: [] };

    // Simple keyword extraction (ignore small words)
    const terms = interest.split(' ')
        .filter(term => term.length > 3)
        .map(term => term.trim());

    if (terms.length === 0) return { success: true, data: [] };

    try {
        const properties = await db.property.findMany({
            where: {
                status: 'Disponível',
                OR: terms.map(term => ({
                    OR: [
                        { title: { contains: term, mode: 'insensitive' } },
                        { description: { contains: term, mode: 'insensitive' } },
                        { type: { contains: term, mode: 'insensitive' } },
                        { address: { contains: term, mode: 'insensitive' } }
                    ]
                }))
            },
            take: 5
        });
        return { success: true, data: properties };
    } catch (error) {
        console.error("Error matching properties:", error);
        return { success: false, error: "Failed to match properties" };
    }
}

export async function getPublicProperties(filters: {
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    type?: string;
    search?: string;
    features?: string[]; // Add features support
} = {}) {
    try {
        const whereClause: any = {
            status: 'Disponível',
            publishOnPortals: true
        };

        if (filters.minPrice) whereClause.price = { ...whereClause.price, gte: filters.minPrice };
        if (filters.maxPrice) whereClause.price = { ...whereClause.price, lte: filters.maxPrice };
        if (filters.bedrooms) whereClause.bedrooms = { gte: filters.bedrooms };
        if (filters.bathrooms) whereClause.bathrooms = { gte: filters.bathrooms };
        if (filters.type && filters.type !== "todos") whereClause.type = filters.type;

        // Features Filter (Must have ALL selected features)
        if (filters.features && filters.features.length > 0) {
            whereClause.features = {
                hasEvery: filters.features
            };
        }

        if (filters.search) {
            const terms = filters.search.split(' ').filter(t => t.length > 2);
            if (terms.length > 0) {
                whereClause.OR = terms.map(term => ({
                    OR: [
                        { title: { contains: term, mode: 'insensitive' } },
                        { description: { contains: term, mode: 'insensitive' } },
                        { address: { contains: term, mode: 'insensitive' } },
                        { neighborhood: { contains: term, mode: 'insensitive' } },
                        { city: { contains: term, mode: 'insensitive' } }
                    ]
                }));
            }
        }

        const properties = await db.property.findMany({
            where: whereClause,
            take: 20,
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: properties };
    } catch (error) {
        console.error("Error fetching public properties:", error);
        return { success: false, error: "Failed to load properties" };
    }
}
