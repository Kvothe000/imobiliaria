
const leads = [
    { name: "Juliana Paes", phone: "(11) 99999-1111", interest: "Cobertura no Jardins", source: "Instagram Ads" },
    { name: "Marcos Mion", phone: "(11) 98888-2222", interest: "Casa em Condomínio", source: "Bot WhatsApp" },
    { name: "Ana Maria", phone: "(21) 97777-3333", interest: "Apartamento 2 Quartos", source: "Site Oficial" },
    { name: "Fausto Silva", phone: "(11) 96666-4444", interest: "Investimento Comercial", source: "Indicação" },
    { name: "Xuxa Meneghel", phone: "(21) 95555-5555", interest: "Mansão na Barra", source: "Bot WhatsApp" }
];

async function simulate() {
    console.log("🤖 Iniciando Simulação do Bot (5 Leads)...");

    for (const [index, lead] of leads.entries()) {
        console.log(`\n[${index + 1}/5] Bot conversando com ${lead.name}...`);

        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const response = await fetch('http://localhost:3001/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lead)
            });

            if (response.ok) {
                console.log(`✅ Lead cadastrado com sucesso! (${lead.interest})`);
            } else {
                console.error(`❌ Erro ao cadastrar: ${response.statusText}`);
            }
        } catch (error) {
            console.error("❌ Erro de conexão. O servidor está rodando em localhost:3001?");
        }
    }

    console.log("\n✨ Simulação Concluída! Verifique o Dashboard.");
}

simulate();
