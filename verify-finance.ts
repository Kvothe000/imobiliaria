export { }; // Make this a module to avoid global scope pollution

const { getAdvancedStats } = require('./src/app/actions');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Starting verification...");
    try {
        const result = await getAdvancedStats();
        console.log("Result success:", result.success);
        if (result.success) {
            console.log("Data received:", JSON.stringify(result.data, null, 2));
        } else {
            console.error("Error:", result.error);
        }
    } catch (e) {
        console.error("Exception:", e);
    }
}

main();
