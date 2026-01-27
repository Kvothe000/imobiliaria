'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

// Fix for default Leaflet markers in Next.js
const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom price marker (Advanced)
const createPriceIcon = (price: string) => {
    return L.divIcon({
        className: 'custom-price-marker',
        html: `<div class="bg-white text-black font-bold px-2 py-1 rounded-lg shadow-md border border-gray-200 text-sm hover:scale-110 transition-transform">${price}</div>`,
        iconSize: [60, 30],
        iconAnchor: [30, 30]
    });
};

interface Property {
    id: number;
    title: string;
    price: number;
    lat: number;
    lng: number;
    image?: string;
}

export default function SplitViewMap({ properties }: { properties: Property[] }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">Carregando Mapa...</div>;

    // Default center (Porto Alegre based on context)
    const center: [number, number] = [-30.0346, -51.2177];

    return (
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {properties.map((prop) => (
                <Marker
                    key={prop.id}
                    position={[prop.lat, prop.lng]}
                    icon={icon} // TODO: Use price icon later
                >
                    <Popup>
                        <div className="w-48">
                            <img src={prop.image || '/placeholder.jpg'} alt={prop.title} className="w-full h-24 object-cover rounded-t-md mb-2" />
                            <h3 className="font-bold text-sm truncate">{prop.title}</h3>
                            <p className="text-green-600 font-semibold">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prop.price)}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
