import { getPublicProperties } from "@/app/actions/properties";
import { PublicPropertyCard } from "@/components/public/property-card";
import { PropertyFilters } from "@/components/public/property-filters";

export const dynamic = 'force-dynamic'; // Force dynamic rendering for search params

export default async function ImoveisPage(props: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const searchParams = await props.searchParams;

    // Parse filters from URL
    const filters = {
        minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
        maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
        bedrooms: searchParams.bedrooms ? Number(searchParams.bedrooms) : undefined,
        type: searchParams.type,
        search: searchParams.search
    };

    const { data: properties, success } = await getPublicProperties(filters);

    return (
        <div className="container mx-auto px-4 md:px-6 py-8 space-y-8">
            <div className="space-y-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Imóveis Disponíveis</h1>
                    <p className="text-muted-foreground">Encontre seu próximo lar com nossos filtros inteligentes.</p>
                </div>

                <div className="sticky top-20 z-30">
                    <PropertyFilters />
                </div>
            </div>

            {success && properties && properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {properties.map((property) => (
                        <PublicPropertyCard key={property.id} property={property} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <div className="max-w-md mx-auto space-y-2">
                        <p className="text-xl font-semibold text-slate-900">Nenhum imóvel encontrado</p>
                        <p className="text-muted-foreground">Tente ajustar seus filtros para encontrar o que procura.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
