
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
    console.log('Seeding Pipelines...');

    // 1. Create Default "Vendas" Pipeline
    const buyPipeline = await db.pipeline.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: "Compra (Vendas)",
            stages: {
                create: [
                    { name: "Novo", order: 1 },
                    { name: "Em Atendimento", order: 2 },
                    { name: "Visita Agendada", order: 3 },
                    { name: "Proposta", order: 4 },
                    { name: "Fechado", order: 5 },
                    { name: "Perdido", order: 6 }, // Lost Stage
                ]
            }
        }
    });

    console.log({ buyPipeline });
}

main()
    .then(async () => {
        await db.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await db.$disconnect();
        process.exit(1);
    });
