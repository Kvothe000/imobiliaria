"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function getListings() {
    try {
        const session = await auth();
        const user = session?.user;

        let whereClause = {};
        // Agent sees only their own captures
        if (user && (user as any).role !== 'ADMIN') {
            whereClause = { userId: user.id };
        }

        const listings = await db.listing.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, avatar: true } } }
        });
        return { success: true, data: listings };
    } catch (error) {
        return { success: false, error: "Failed to fetch listings" };
    }
}

export async function createListing(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const ownerName = formData.get("ownerName") as string;
    const ownerPhone = formData.get("ownerPhone") as string;
    const address = formData.get("address") as string;
    const expectedValue = parseFloat(formData.get("expectedValue") as string) || 0;
    const notes = formData.get("notes") as string;
    const imagesJson = formData.get("images") as string;
    const images = imagesJson ? JSON.parse(imagesJson) : [];

    if (!ownerName || !address) return { success: false, error: "Nome e Endereço obrigatórios." };

    function generateSlug(length = 6) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let slug = '';
        for (let i = 0; i < length; i++) {
            slug += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return slug;
    }

    try {
        const slug = generateSlug();
        await db.listing.create({
            data: {
                slug,
                ownerName,
                ownerPhone,
                address,
                expectedValue,
                notes,
                userId: session.user.id,
                status: "Novo",
                images: images
            }
        });
        revalidatePath("/dashboard/agenciamento");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Erro ao criar captação." };
    }
}

export async function updateListingStatus(id: number, status: string) {
    try {
        await db.listing.update({
            where: { id },
            data: { status }
        });
        revalidatePath("/dashboard/agenciamento");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update status" };
    }
}

export async function promoteListingToProperty(id: number) {
    try {
        const listing = await db.listing.findUnique({ where: { id } });
        if (!listing) return { success: false, error: "Listing not found" };

        // Create Property from Listing
        await db.property.create({
            data: {
                title: `Imóvel de ${listing.ownerName}`,
                address: listing.address,
                price: listing.expectedValue,
                type: "Casa", // Default
                status: "Disponível",
                description: listing.notes || "Imóvel captado recentemente.",
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&q=60" // Placeholder
            }
        });

        // Update Listing Status
        await db.listing.update({
            where: { id },
            data: { status: "Captado" }
        });

        revalidatePath("/dashboard/agenciamento");
        revalidatePath("/dashboard/properties");
        return { success: true };

    } catch (error) {
        return { success: false, error: "Failed to promote listing" };
    }
}
