"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Fix Leaflet Default Icon issue in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface PropertyMapProps {
    properties: any[];
}

export function PropertyMap({ properties }: PropertyMapProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-[600px] w-full bg-gray-100 animate-pulse rounded-xl" />;

    // Default center (São Paulo) if no properties
    const defaultCenter: [number, number] = [-23.5505, -46.6333];

    // Calculate center based on first property with coords, or default
    const validProperties = properties.filter(p => p.latitude && p.longitude);
    const center: [number, number] = validProperties.length > 0
        ? [validProperties[0].latitude, validProperties[0].longitude]
        : defaultCenter;

    return (
        <div className="h-[600px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 z-0 relative">
            <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {validProperties.map((property) => (
                    <Marker
                        key={property.id}
                        position={[property.latitude, property.longitude]}
                        icon={customIcon}
                    >
                        <Popup className="min-w-[250px]">
                            <div className="flex flex-col gap-2">
                                <div className="w-full h-32 bg-gray-100 rounded-md overflow-hidden relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={property.image || '/placeholder.png'} className="object-cover w-full h-full" alt={property.title} />
                                    <Badge className="absolute top-2 right-2 bg-emerald-600 hover:bg-emerald-700">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(property.price)}
                                    </Badge>
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm line-clamp-1">{property.title}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-1">{property.address}</p>
                                </div>
                                <Link href={`/dashboard/properties/${property.id}`} className="w-full">
                                    <Button size="sm" className="w-full text-xs h-8">
                                        Ver Detalhes <ArrowRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
