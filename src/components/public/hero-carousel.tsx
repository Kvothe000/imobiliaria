"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Badge as LucideBadge, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface HeroCarouselProps {
    images: string[];
    title: string;
    type: string;
    address: string;
    price: string;
}

export function HeroCarousel({ images, title, type, address, price }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Ensure we have at least one image
    const validImages = images && images.length > 0 ? images : ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80"];

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % validImages.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    };

    return (
        <div className="relative h-[60vh] bg-slate-900 w-full overflow-hidden group">
            {/* Background Image */}
            <img
                src={validImages[currentIndex]}
                alt={`${title} - Foto ${currentIndex + 1}`}
                className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

            {/* Navigation Arrows (Interactive) */}
            {validImages.length > 1 && (
                <>
                    <button
                        onClick={handlePrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight className="h-8 w-8" />
                    </button>
                    {/* Dots Indicator */}
                    <div className="absolute top-4 right-4 flex gap-1">
                        {validImages.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Back Button */}
            <div className="absolute top-8 left-4 md:left-8 z-10">
                <Link href="/">
                    <Button variant="secondary" size="sm" className="gap-2 bg-white/90 hover:bg-white text-slate-900">
                        <ArrowLeft className="h-4 w-4" /> Voltar
                    </Button>
                </Link>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 container mx-auto pointer-events-none">
                <Badge className="bg-emerald-500 hover:bg-emerald-600 mb-4">{type}</Badge>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 shadow-sm">{title}</h1>
                <div className="flex items-center text-slate-200 gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-emerald-400" />
                    <span className="text-lg">{address}</span>
                </div>
                <p className="text-4xl font-bold text-white">{price}</p>
            </div>
        </div>
    );
}
