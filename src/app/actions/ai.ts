"use server";

import OpenAI from "openai";

export async function generateDescription(prompt: string) {
    if (!process.env.OPENAI_API_KEY) {
        return { success: false, error: "Chave da API OpenAI não configurada no servidor." };
    }

    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Cost-effective and fast
            messages: [
                {
                    role: "system",
                    content: `Você é um copywriter especialista em mercado imobiliário de alto padrão.
                    Crie uma descrição atraente, profissional e persuasiva para um imóvel com base nos dados fornecidos.
                    Foco em benefícios, estilo de vida e exclusividade.
                    Use tópicos para destacar características principais se apropriado.
                    Escreva em português do Brasil.
                    Máximo de 150 palavras.`
                },
                {
                    role: "user",
                    content: `Dados do imóvel: ${prompt}`
                }
            ],
            temperature: 0.7,
        });

        const description = response.choices[0].message.content;
        return { success: true, data: description };

    } catch (error) {
        console.error("Error generating description:", error);
        return { success: false, error: "Falha ao gerar descrição com IA." };
    }
}

export async function generateInstagramCaption(propertyTitle: string, propertyAddress: string, templateStyle: string) {
    if (!process.env.OPENAI_API_KEY) {
        return { success: false, error: "Chave da API OpenAI não configurada." };
    }

    const tones = {
        modern: "moderno, direto e focado em tendências",
        elegant: "sofisticado, luxuoso e exclusivo",
        bold: "urgente, persuasivo e focado em oportunidade"
    };

    const tone = tones[templateStyle as keyof typeof tones] || tones.modern;

    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `Você é um social media expert em mercado imobiliário.
                    Crie uma legenda para Instagram para este imóvel.
                    O tom deve ser ${tone}.
                    
                    Estrutura obrigatória:
                    1. Headline chamativa (com emoji)
                    2. Breve descrição convidativa (2-3 frases)
                    3. Call to Action (CTA) claro para contato via Direct.
                    4. 5-8 hashtags relevantes (ex: #imoveis #alto-padrao).
                    
                    Use quebras de linha para separar os blocos.
                    Não use aspas na resposta.`
                },
                {
                    role: "user",
                    content: `Imóvel: ${propertyTitle}\nLocalização: ${propertyAddress}`
                }
            ],
            temperature: 0.8,
        });

        const caption = response.choices[0].message.content;
        return { success: true, data: caption };

    } catch (error: any) {
        console.error("Error generating caption:", error);

        // Fallback for testing/quota issues
        if (error?.status === 429 || error?.code === 'insufficient_quota') {
            console.warn("Quota exceeded. Returning mock caption for demonstration.");
            const mockCaption = `🏡 *${propertyTitle}* - Sua Nova Vida Começa Aqui! ✨\n\n` +
                `Descubra o requinte e o conforto de morar no coração de ${propertyAddress.split(',')[1] || 'cidade'}. ` +
                `Este imóvel exclusivo combina design ${tone.split(',')[0]} com funcionalidade para você e sua família.\n\n` +
                `✨ Destaques:\n` +
                `• Localização Privilegiada\n` +
                `• Acabamentos de Alto Padrão\n` +
                `• Espaços Amplos e Bem Iluminados\n\n` +
                `📲 Agende sua visita agora mesmo! Envie um DIRECT para mais informações.\n\n` +
                `#imoveisdeluxo #mercadocimobiliario #${templateStyle} #oportunidade #realestate`;

            return { success: true, data: mockCaption };
        }

        return { success: false, error: "Falha ao gerar legenda." };
    }
}
