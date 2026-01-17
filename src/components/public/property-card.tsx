"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, BedDouble, Bath, Car, Maximize } from "lucide-react";

interface PropertyProps {
    id: number;
    title: string;
    price: number;
    address: string;
    image: string | null;
    bedrooms: number;
    bathrooms: number;
    garage: number;
    area: number;
    type: string;
    neighborhood: string | null;
    city: string | null;
    state: string | null;
}

export function PublicPropertyCard({ property }: { property: PropertyProps }) {
    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const location = property.neighborhood
        ? `${property.neighborhood}, ${property.city}`
        : property.address.split(',')[0]; // Fallback to simple address if structured data missing

    return (
        <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-none shadow-md">
            <div className="relative aspect-[4/3] overflow-hidden">
                <Link href={`/imoveis/${property.id}`} className="block w-full h-full">
                    <img
                        src={property.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"}
                        alt={property.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-4 right-4 bg-emerald-600 hover:bg-emerald-700 pointer-events-none">
                        {property.type}
                    </Badge>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <p className="text-white font-bold text-lg">{formatPrice(property.price)}</p>
                    </div>
                </Link>
            </div>

            <CardHeader className="p-4 pb-2">
                <h3 className="font-bold text-lg line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {property.title}
                </h3>
                <div className="flex items-center text-muted-foreground text-sm gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="line-clamp-1">{location}</span>
                </div>
            </CardHeader>

            <CardContent className="p-4 py-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <BedDouble className="h-3 w-3" /> {property.bedrooms} <span className="hidden sm:inline">Quartos</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Bath className="h-3 w-3" /> {property.bathrooms} <span className="hidden sm:inline">Banheiros</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Maximize className="h-3 w-3" /> {property.area}m²
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-2">
                <Link href={`/imoveis/${property.id}`} className="w-full">
                    <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                        Ver Detalhes
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
