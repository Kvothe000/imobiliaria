import { getPublicProperties } from "@/app/actions/properties";
import SearchClient from "../busca/components/search-client";

export const dynamic = 'force-dynamic';

export default async function ImoveisPage(props: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const searchParams = await props.searchParams;

    const { data: properties, success } = await getPublicProperties({
        minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
        maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
        bedrooms: searchParams.bedrooms ? Number(searchParams.bedrooms) : undefined,
        type: typeof searchParams.type === 'string' ? searchParams.type : undefined,
        features: typeof searchParams.features === 'string' ? searchParams.features.split(',') : undefined,
        search: typeof searchParams.search === 'string' ? searchParams.search : undefined,
    });

    if (!success || !properties) {
        return <div>Erro ao carregar imóveis.</div>;
    }

    return (
        <SearchClient initialProperties={properties} />
    );
}
