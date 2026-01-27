'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BedDouble, Car, Ruler } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Import Mapa Dinamicamente (CSR Only)
const SplitViewMap = dynamic(() => import('@/components/public/SplitViewMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">Carregando Mapa...</div>
});

interface Property {
    id: string; // Database ID is string
    title: string;
    price: number | null;
    address: string | null;
    bedrooms: number;
    suites: number;
    area: number | null;
    parkingSpots: number;
    gallery: string[]; // Changed from images to match Prisma
    image: string | null; // Added main image
    // Financials
    iptuPrice: number;
    condoPrice: number;
    createdAt: Date | string; // Date from JSON/DB
    // Add other fields as needed
    latitude: number | null;
    longitude: number | null;
}

interface SearchClientProps {
    initialProperties: any[]; // Loosened to allow any passed from server, but casted internally
}

export default function SearchClient({ initialProperties }: SearchClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Cast initialProperties to local Property type to ensure type safety in code
    const typedProperties = initialProperties as Property[];

    const currentType = searchParams.get('type') || 'todos';
    const currentBedrooms = searchParams.get('bedrooms') || '0';
    const currentMinPrice = searchParams.get('minPrice') || '';
    const currentMaxPrice = searchParams.get('maxPrice') || '';
    const currentSort = searchParams.get('sort') || 'recent';

    // Calculate Average Price/m² for "Opportunity" Badge logic (Dynamic)
    const validPropertiesForStats = typedProperties.filter(p => p.price && p.area);
    const avgPricePerSqm = validPropertiesForStats.reduce((acc, p) => acc + (p.price! / p.area!), 0) / (validPropertiesForStats.length || 1);

    // Client-side sorting
    const sortedProperties = [...typedProperties].sort((a, b) => {
        if (currentSort === 'price_asc') return (a.price || 0) - (b.price || 0);
        if (currentSort === 'price_desc') return (b.price || 0) - (a.price || 0);
        if (currentSort === 'sqm_asc') {
            const sqmA = (a.price || 0) / (a.area || 1);
            const sqmB = (b.price || 0) / (b.area || 1);
            return sqmA - sqmB;
        }
        return 0;
    });



    const [showMap, setShowMap] = useState(true);

    const FEATURES_LIST = [
        "Piscina", "Churrasqueira", "Ar Condicionado", "Jardim", "Lareira",
        "Segurança 24h", "Academia", "Varanda Gourmet", "Vista Panorâmica",
        "Jacuzzi", "Portaria Blindada", "Reformado", "Pet Friendly",
        "Playground", "Pé Direito Alto", "Metrô Próximo", "Cozinha Americana",
        "Elevador", "Salão de Festas", "Sauna"
    ];

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'todos' && value !== '0') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/busca?${params.toString()}`);
    };

    const toggleFeature = (feature: string) => {
        const currentFeatures = searchParams.get('features') ? searchParams.get('features')!.split(',') : [];
        let newFeatures;

        if (currentFeatures.includes(feature)) {
            newFeatures = currentFeatures.filter(f => f !== feature);
        } else {
            newFeatures = [...currentFeatures, feature];
        }

        updateFilter('features', newFeatures.join(','));
    };

    const mapProperties = sortedProperties
        .filter(p => p.latitude && p.longitude && p.price)
        .map(p => ({
            id: Number(p.id) || 0,
            title: p.title,
            price: p.price || 0,
            lat: p.latitude!,
            lng: p.longitude!,
            image: p.image || (p.gallery && p.gallery.length > 0 ? p.gallery[0] : null) || '/placeholder.jpg'
        }));

    // Helper to check if property is "New" (< 30 days)
    const isNew = (date: Date | string) => {
        const d = new Date(date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return d > thirtyDaysAgo;
    };

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Esquerda: Lista (Scrollável) */}
            <div className={`h-full overflow-y-auto bg-white transition-all duration-300 ${showMap ? 'w-full lg:w-[60%] border-r' : 'w-full'}`}>
                <div className="sticky top-0 z-10 bg-white border-b p-4 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold">Imóveis encontrados</h1>
                            <span className="text-sm text-gray-500">({typedProperties.length})</span>
                        </div>

                        {/* Map Toggle Button (Visible on Desktop) */}
                        <div className="hidden lg:flex items-center gap-2 bg-gray-100 p-1 rounded-lg border border-gray-200">
                            <button
                                onClick={() => setShowMap(false)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${!showMap ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Lista
                            </button>
                            <button
                                onClick={() => setShowMap(true)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${showMap ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Mapa
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 items-center">
                        {/* ... Filters (Type, Bedrooms, Price, Sort) ... */}

                        {/* Keeping all existing filters select inputs here exactly as they were */}
                        <Select value={currentType} onValueChange={(v) => updateFilter('type', v)}>
                            <SelectTrigger className="w-[180px] rounded-full bg-gray-50 border-gray-200">
                                <SelectValue placeholder="Tipo de Imóvel" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos os tipos</SelectItem>
                                <SelectItem value="Apartamento">Apartamento</SelectItem>
                                <SelectItem value="Casa">Casa</SelectItem>
                                <SelectItem value="Cobertura">Cobertura</SelectItem>
                                <SelectItem value="Terreno">Terreno</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={currentBedrooms} onValueChange={(v) => updateFilter('bedrooms', v)}>
                            <SelectTrigger className="w-[140px] rounded-full bg-gray-50 border-gray-200">
                                <SelectValue placeholder="Quartos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Qualquer</SelectItem>
                                <SelectItem value="1">1+ Quartos</SelectItem>
                                <SelectItem value="2">2+ Quartos</SelectItem>
                                <SelectItem value="3">3+ Quartos</SelectItem>
                                <SelectItem value="4">4+ Quartos</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={currentMaxPrice} onValueChange={(v) => updateFilter('maxPrice', v)}>
                            <SelectTrigger className="w-[180px] rounded-full bg-gray-50 border-gray-200">
                                <SelectValue placeholder="Até R$" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Qualquer Valor</SelectItem>
                                <SelectItem value="300000">Até R$ 300k</SelectItem>
                                <SelectItem value="500000">Até R$ 500k</SelectItem>
                                <SelectItem value="800000">Até R$ 800k</SelectItem>
                                <SelectItem value="1000000">Até R$ 1M</SelectItem>
                                <SelectItem value="2000000">Até R$ 2M</SelectItem>
                                <SelectItem value="5000000">Até R$ 5M</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={searchParams.get('sort') || 'recent'} onValueChange={(v) => updateFilter('sort', v)}>
                            <SelectTrigger className="w-[180px] rounded-full bg-white border-gray-300">
                                <SelectValue placeholder="Ordenar" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recent">Mais Recentes</SelectItem>
                                <SelectItem value="price_asc">Menor Preço</SelectItem>
                                <SelectItem value="price_desc">Maior Preço</SelectItem>
                                <SelectItem value="sqm_asc">Melhor Preço/m² (Investidor)</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Mais Filtros (Dialog) */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${searchParams.get('features') ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                                    + Filtros {searchParams.get('features') ? '(!)' : ''}
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] bg-white">
                                <DialogHeader>
                                    <DialogTitle>Características do Imóvel</DialogTitle>
                                    <DialogDescription>
                                        Selecione o que é indispensável para você.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
                                    {FEATURES_LIST.map((feature) => {
                                        const isActive = (searchParams.get('features') || '').split(',').includes(feature);
                                        return (
                                            <div key={feature} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={feature}
                                                    checked={isActive}
                                                    onChange={() => toggleFeature(feature)}
                                                />
                                                <Label
                                                    htmlFor={feature}
                                                    className="text-sm font-normal cursor-pointer text-gray-700"
                                                >
                                                    {feature}
                                                </Label>
                                            </div>
                                        )
                                    })}
                                </div>
                                <DialogFooter className="flex justify-between sm:justify-between w-full">
                                    <button
                                        onClick={() => updateFilter('features', '')}
                                        className="text-sm text-red-500 hover:underline px-4 py-2"
                                    >
                                        Limpar Filtros
                                    </button>
                                    <DialogTrigger asChild>
                                        <button className="bg-black text-white px-6 py-2 rounded-md font-bold hover:bg-gray-800">
                                            Ver Imóveis
                                        </button>
                                    </DialogTrigger>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {(currentType !== 'todos' || currentBedrooms !== '0' || currentMaxPrice !== '' || searchParams.get('features')) && (
                            <button
                                onClick={() => router.push('/busca')}
                                className="text-sm text-red-500 hover:text-red-700 font-medium px-2"
                            >
                                Limpar
                            </button>
                        )}
                    </div>
                </div>

                {/* Grid Responsivo */}
                <div className={`p-4 grid gap-4 ${showMap ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
                    {sortedProperties.map((prop) => {
                        const pricePerSqm = (prop.price && prop.area) ? prop.price / prop.area : 0;
                        const isOpportunity = pricePerSqm > 0 && pricePerSqm < (avgPricePerSqm * 0.9); // 10% below avg

                        return (
                            <div key={prop.id}>
                                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border-gray-200 h-full flex flex-col">
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <Image
                                            src={prop.image || (prop.gallery && prop.gallery.length > 0 ? prop.gallery[0] : '/placeholder.jpg')}
                                            alt={prop.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                                            <Badge className="bg-white/90 text-black hover:bg-white text-xs font-bold shadow-sm backdrop-blur-sm">
                                                Exclusivo
                                            </Badge>
                                            {isNew(prop.createdAt) && (
                                                <Badge className="bg-blue-600/90 text-white hover:bg-blue-700 text-xs font-bold shadow-sm backdrop-blur-sm">
                                                    Novo
                                                </Badge>
                                            )}
                                            {isOpportunity && (
                                                <Badge className="bg-emerald-500/90 text-white hover:bg-emerald-600 text-xs font-bold shadow-sm backdrop-blur-sm">
                                                    ★ Oportunidade
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
                                            <p className="text-white font-bold text-lg truncate drop-shadow-md">
                                                {prop.price ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(prop.price) : 'Sob Consulta'}
                                            </p>
                                        </div>
                                    </div>
                                    <CardContent className="p-4 flex-1 flex flex-col">
                                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 h-10">{prop.title}</h3>
                                        <p className="text-gray-500 text-xs mb-3 truncate">{prop.address || 'Porto Alegre, RS'}</p>

                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg">
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center gap-1 font-medium text-gray-700">
                                                    <BedDouble className="w-3.5 h-3.5" />
                                                    <span>{prop.bedrooms}</span>
                                                </div>
                                                <span className="text-[10px]">Quartos</span>
                                            </div>
                                            <div className="w-px h-6 bg-gray-200"></div>
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center gap-1 font-medium text-gray-700">
                                                    <Car className="w-3.5 h-3.5" />
                                                    <span>{prop.parkingSpots}</span>
                                                </div>
                                                <span className="text-[10px]">Vagas</span>
                                            </div>
                                            <div className="w-px h-6 bg-gray-200"></div>
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center gap-1 font-medium text-gray-700">
                                                    <Ruler className="w-3.5 h-3.5" />
                                                    <span>{prop.area}</span>
                                                </div>
                                                <span className="text-[10px]">m² Úteis</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto space-y-2 pt-2 border-t border-gray-100">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-400">Condomínio</span>
                                                <span className="font-medium text-gray-600">
                                                    {prop.condoPrice > 0 ? `R$ ${prop.condoPrice}` : '-'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-400">IPTU</span>
                                                <span className="font-medium text-gray-600">
                                                    {prop.iptuPrice > 0 ? `R$ ${prop.iptuPrice}` : '-'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 mt-1 border-t border-dashed border-gray-200">
                                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Investidor</span>
                                                <div className="text-right">
                                                    <span className={`text-sm font-bold ${isOpportunity ? 'text-emerald-600' : 'text-gray-700'}`}>
                                                        {pricePerSqm > 0 ?
                                                            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pricePerSqm) + '/m²'
                                                            : '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Direita: Mapa (Fixo) - Controlado pelo Estado e CSS */}
            {showMap && (
                <div className="hidden lg:block w-[40%] h-full bg-gray-100 relative border-l">
                    <SplitViewMap properties={mapProperties} />
                </div>
            )}
        </div>
    );
}
