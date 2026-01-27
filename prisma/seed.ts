import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient() as any

// ----------------------------------------------------------------------
// DATA BANK 🏦
// ----------------------------------------------------------------------

const NEIGHBORHOODS = [
    "Jardins", "Itaim Bibi", "Vila Nova Conceição", "Pinheiros", "Higienópolis",
    "Moema", "Brooklin", "Alto de Pinheiros", "Morumbi", "Jardim Europa"
];

const PROPERTY_TYPES = ["Casa", "Apartamento", "Cobertura", "Loft", "Comercial"];

const FEATURES_POOL = [
    "Piscina", "Churrasqueira", "Ar Condicionado", "Jardim", "Lareira",
    "Segurança 24h", "Academia", "Varanda Gourmet", "Vista Panorâmica",
    "Jacuzzi", "Portaria Blindada", "Reformado", "Pet Friendly",
    "Playground", "Pé Direito Alto", "Metrô Próximo", "Cozinha Americana",
    "Elevador", "Salão de Festas", "Sauna"
];

// Unsplash IDs for high-quality interior/exterior real estate photos
const IMAGE_BANK = [
    "1613490493576-7fde63acd811", "1600210492486-724fe5c67fb0",
    "1600566753190-17f0baa2a6c3", "1600607687939-ce8a6c25118c",
    "1512917774080-9991f1c4c750", "1600607687644-c7171b42498f",
    "1600585154340-be6161a56a0c", "1600566753086-00f18fb6b3ea",
    "1600566753151-384129cf4e3e",
    "1600607687920-4e2a09cf159d", "1560448204-e02f11c3d0e2",
    "1600585154526-990dced4db0d", "1600566753376-12c8ab7fb75b"
];

function getRandomItems<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function getRandomImage() {
    const id = IMAGE_BANK[Math.floor(Math.random() * IMAGE_BANK.length)];
    return `https://images.unsplash.com/photo-${id}?q=80&w=1200`;
}

async function main() {
    console.log('🌱 Start seeding ...')

    // 1. CLEANUP 🧹
    await prisma.appointment.deleteMany() // Depends on Lead/Property
    await prisma.selection.deleteMany()   // Depends on Lead
    await prisma.transaction.deleteMany() // Depends on Lead/Property/User
    await prisma.lead.deleteMany()        // Depends on User (Agent)
    await prisma.listing.deleteMany()     // Depends on User
    await prisma.property.deleteMany()    // Independent
    await prisma.user.deleteMany()        // Independent (Root)

    // Hash passwords
    const adminPassword = await bcrypt.hash("admin123", 10);
    const agentPassword = await bcrypt.hash("titan123", 10);

    // 2. CREATE USERS (BROKERS) 👥
    const adminEmail = "admin@titan.com";
    const admin = await prisma.user.create({
        data: {
            email: adminEmail,
            name: "Matheus Admin",
            password: adminPassword,
            role: "ADMIN",
            avatar: "https://ui-avatars.com/api/?name=Matheus+Admin&background=0D8ABC&color=fff"
        }
    });

    const brokersData = [
        { name: "Ana Silva", email: "ana@titan.com" },
        { name: "Carlos Souza", email: "carlos@titan.com" },
        { name: "Beatriz Costa", email: "bia@titan.com" },
        { name: "João Pereira", email: "joao@titan.com" }
    ];

    const brokers = [];
    for (const b of brokersData) {
        const user = await prisma.user.create({
            data: {
                email: b.email,
                name: b.name,
                password: agentPassword,
                role: "AGENT",
                avatar: `https://ui-avatars.com/api/?name=${b.name.replace(" ", "+")}&background=random`
            }
        });
        brokers.push(user);
    }
    const allUsers = [admin, ...brokers];

    // 3. CREATE PROPERTIES 🏠 (50 units)
    const totalProperties = 50;
    const properties = [];

    for (let i = 0; i < totalProperties; i++) {
        const type = PROPERTY_TYPES[Math.floor(Math.random() * PROPERTY_TYPES.length)];
        const neighborhood = NEIGHBORHOODS[Math.floor(Math.random() * NEIGHBORHOODS.length)];
        const bedrooms = Math.floor(Math.random() * 5) + 1; // 1-5
        const price = Math.floor(Math.random() * 10000000) + 500000; // 500k - 10.5M

        // Generate Gallery
        const galleryCount = 6;
        const gallery = Array.from({ length: galleryCount }, () => getRandomImage());
        const mainImage = gallery[0];

        const prop = await prisma.property.create({
            data: {
                title: `${type} Incrível no ${neighborhood}`,
                description: `Oportunidade única de morar no melhor do ${neighborhood}. \nEste ${type.toLowerCase()} possui acabamentos de alto padrão, localização privilegiada e vista definitiva. \nAgende sua visita hoje mesmo.`,
                price: price,
                image: mainImage,
                gallery: gallery,
                address: `Rua Aleatória ${i}, ${neighborhood}`,
                type: type,
                bedrooms: bedrooms,
                bathrooms: bedrooms + 1,
                garage: Math.floor(Math.random() * 4) + 1,
                area: Math.floor(Math.random() * 400) + 50,
                status: Math.random() > 0.8 ? "Vendido" : "Disponível", // 20% Sold
                iptuPrice: Math.floor(price * 0.001),
                condoPrice: Math.floor(price * 0.0005),
                publishOnPortals: Math.random() > 0.5,
                features: getRandomItems(FEATURES_POOL, 5),
                // Porto Alegre Coordinates with random variance
                latitude: -30.0346 + (Math.random() - 0.5) * 0.05,
                longitude: -51.2177 + (Math.random() - 0.5) * 0.05,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 40 * 24 * 60 * 60 * 1000)) // 0-40 days old (mix of New and Old)
            }
        });
        properties.push(prop);
    }

    // 4. CREATE LEADS 💼 (100 leads)
    const pipelineStages = ["Novo", "Qualificação", "Visita", "Proposta", "Fechado", "Perdido"];
    const leadNames = ["Lucas", "Mariana", "Pedro", "Juliana", "Roberto", "Fernanda", "Ricardo", "Camila", "Gustavo", "Larissa"];
    const leads: any[] = [];

    for (let i = 0; i < 100; i++) {
        const name = `${leadNames[Math.floor(Math.random() * leadNames.length)]} ${Math.floor(Math.random() * 1000)}`;
        const agent = allUsers[Math.floor(Math.random() * allUsers.length)];
        const stage = pipelineStages[Math.floor(Math.random() * pipelineStages.length)];

        const lead = await prisma.lead.create({
            data: {
                name: name,
                email: `lead${i}@example.com`,
                phone: `(11) 9${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`,
                budget: Math.floor(Math.random() * 5000000) + 500000,
                pipelineStage: stage,
                status: "Novo",
                assignedAgentId: agent.id,
                source: Math.random() > 0.5 ? "Instagram" : "Site"
            }
        });
        leads.push(lead);
    }

    // 5. TRANSACTIONS 💰 (Some mock sales)
    const soldProperties = properties.filter(p => p.status === "Vendido");
    for (const prop of soldProperties) {
        const agent = brokers[Math.floor(Math.random() * brokers.length)]; // Only agents sell usually
        const buyer = leads[Math.floor(Math.random() * leads.length)];
        const price = prop.price;
        const totalCommission = price * 0.06; // 6%
        const agentCommission = totalCommission * 0.4; // 40% of 6%

        await prisma.transaction.create({
            data: {
                type: "Venda",
                status: "Pago",
                value: price,
                commissionRate: 6.0,
                commissionValue: totalCommission,
                agentShare: agentCommission,
                agencyShare: totalCommission - agentCommission,
                propertyId: prop.id,
                leadId: buyer.id,
                userId: agent.id,
                date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)) // Random past date
            }
        });
    }

    console.log(`✅ Seeded:
    - ${allUsers.length} Users
    - ${properties.length} Properties
    - 100 Leads
    - ${soldProperties.length} Transactions
    `);
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
