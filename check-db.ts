
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Checking properties...');
    const id1 = 156;
    const p1 = await prisma.property.findUnique({ where: { id: id1 } });
    console.log(`Property ${id1}:`, p1 ? 'FOUND' : 'NOT FOUND');
    if (p1) console.log('P1 Title:', p1.title);

    const id2 = 160;
    const p2 = await prisma.property.findUnique({ where: { id: id2 } });
    console.log(`Property ${id2}:`, p2 ? 'FOUND' : 'NOT FOUND');
    if (p2) console.log('P2 Title:', p2.title);

    const all = await prisma.property.findMany({
        select: { id: true, title: true },
        orderBy: { id: 'asc' }
    });
    console.log('Total Properties:', all.length);
    console.log('First 5 IDs:', all.slice(0, 5).map(p => p.id));
    console.log('Last 5 IDs:', all.slice(-5).map(p => p.id));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
