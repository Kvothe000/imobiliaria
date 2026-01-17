import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        const properties = await db.property.findMany({
            where: {
                status: 'Disponível',
                publishOnPortals: true
            }
        });

        const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<ListingDataFeed xmlns="http://www.vivareal.com/schemas/1.0/VRSync" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.vivareal.com/schemas/1.0/VRSync  http://xml.vivareal.com/vrsync.xsd">
    <Header>
        <Provider>Titan Imóveis CRM</Provider>
        <Email>contato@titanimoveis.com.br</Email>
        <ContactName>Matheus</ContactName>
        <PublishDate>${new Date().toISOString()}</PublishDate>
    </Header>
    <Listings>
        ${properties.map(property => `
        <Listing>
            <ListingID>${property.code || property.id}</ListingID>
            <Title><![CDATA[${property.title}]]></Title>
            <TransactionType>For Sale</TransactionType>
            <ListPrice currency="BRL">${property.price}</ListPrice>
            <DetailViewUrl>https://titanimoveis.com.br/imoveis/${property.id}</DetailViewUrl>
            <Location displayAddress="All">
                <Country abbreviation="BR">Brasil</Country>
                <State abbreviation="${property.state || 'SP'}">${property.state || 'São Paulo'}</State>
                <City>${property.city || 'São Paulo'}</City>
                <Neighborhood>${property.neighborhood || ''}</Neighborhood>
                <Address>${property.street || ''}</Address>
                <StreetNumber>${property.number || ''}</StreetNumber>
                <PostalCode>${property.zipCode || ''}</PostalCode>
            </Location>
            <Details>
                <PropertyType>${mapPropertyType(property.type)}</PropertyType>
                <Description><![CDATA[${property.description || ''}]]></Description>
                <LivingArea unit="square metres">${property.area}</LivingArea>
                <LotArea unit="square metres">${property.totalArea || property.area}</LotArea>
                <Bedrooms>${property.bedrooms}</Bedrooms>
                <Bathrooms>${property.bathrooms}</Bathrooms>
                <Suites>${property.suites}</Suites>
                <Garage>${property.garage}</Garage>
                <Features>
                    ${property.features.map(f => `<Feature>${f}</Feature>`).join('')}
                </Features>
            </Details>
            <Media>
                <Item medium="image" caption="Foto Principal" primary="true">${property.image || ''}</Item>
                ${property.gallery.map(img => `<Item medium="image">${img}</Item>`).join('')}
            </Media>
            <ContactInfo>
                <Name>Equipe Titan</Name>
                <Email>vendas@titan.com.br</Email>
                <Website>www.titan.com.br</Website>
                <Logo>https://titan.com.br/logo.png</Logo>
                <Telephone>(11) 99999-9999</Telephone>
            </ContactInfo>
        </Listing>
        `).join('')}
    </Listings>
</ListingDataFeed>`;

        return new NextResponse(xmlContent, {
            headers: {
                'Content-Type': 'application/xml',
                // Cache control to ensure portals get fresh data
                'Cache-Control': 's-maxage=3600, stale-while-revalidate'
            }
        });
    } catch (error) {
        console.error("XML Feed Error:", error);
        return new NextResponse("Error generating feed", { status: 500 });
    }
}

function mapPropertyType(type: string) {
    // Map internal types to Portal standard
    const map: Record<string, string> = {
        'Apartamento': 'Apartment',
        'Casa': 'Residential / Home',
        'Sobrado': 'Residential / Home',
        'Cobertura': 'Residential / Apartment',
        'Terreno': 'Land / Lot',
        'Comercial': 'Commercial / Office'
    };
    return map[type] || 'Residential / Home';
}
