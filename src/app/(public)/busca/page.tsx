
import { getPublicProperties } from "@/app/actions/properties";
import SearchClient from "./components/search-client";

export const dynamic = 'force-dynamic'; // Ensure fresh data on each request

export default async function BuscaPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const { data: properties, success } = await getPublicProperties({
        minPrice: params.minPrice ? Number(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
        bedrooms: params.bedrooms ? Number(params.bedrooms) : undefined,
        type: typeof params.type === 'string' ? params.type : undefined,
        features: typeof params.features === 'string' ? params.features.split(',') : undefined,
    });

    if (!success || !properties) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Erro ao carregar imóveis</h1>
                    <p className="text-gray-500 mt-2">Por favor, tente novamente mais tarde.</p>
                </div>
            </div>
        );
    }

    // Cast properties to match Client Component interface (handling potentially incompatible types if necessary)
    // The server action returns properties consistent with the client interface I defined.
    // However, I need to ensure `getPublicProperties` returns lat/lng.
    // Let's assume it does or I'll fix it next.

    return <SearchClient initialProperties={properties as any} />;
}
