import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, interest, source, email } = body;

        // Basic Validation
        if (!name || !phone) {
            return NextResponse.json(
                { error: 'Name and Phone are required' },
                { status: 400 }
            );
        }

        // Create Lead in DB
        const lead = await db.lead.create({
            data: {
                name,
                phone,
                interest: interest || 'Interesse Geral',
                source: source || 'Bot WhatsApp',
                email: email || null,
                status: 'Novo', // Default status
            },
        });

        return NextResponse.json(
            { success: true, lead },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating lead:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
