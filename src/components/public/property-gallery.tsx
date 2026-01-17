"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import Image from "next/image";

interface GalleryProps {
    images: string[];
    title: string;
}

export function PropertyGallery({ images, title }: GalleryProps) {
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // If no images, return nothing (or fallback is handled by parent)
    if (!images || images.length === 0) return null;

    // Add main image to the list if not present? 
    // Usually the gallery is supplementary. Let's assume 'images' is the full list including cover if desired.
    // For now, let's treat 'images' as the list.

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Galeria de Fotos</h2>
                <Button variant="outline" onClick={() => setOpen(true)} className="gap-2">
                    <Maximize2 className="h-4 w-4" /> Ampliar Galeria
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.slice(0, 4).map((img, idx) => (
                    <div
                        key={idx}
                        className={`relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg group ${idx === 0 ? 'col-span-2 row-span-2' : ''}`}
                        onClick={() => {
                            setCurrentIndex(idx);
                            setOpen(true);
                        }}
                    >
                        <img
                            src={img}
                            alt={`${title} - Foto ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {idx === 3 && images.length > 4 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">+{images.length - 4}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[90vw] h-[90vh] bg-black/95 border-none p-0 flex items-center justify-center">
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 p-2"
                    >
                        <X className="h-8 w-8" />
                    </button>

                    <button
                        onClick={handlePrevious}
                        className="absolute left-4 text-white hover:text-gray-300 z-50 p-2 bg-black/50 rounded-full"
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </button>

                    <div className="relative w-full h-full p-4 flex items-center justify-center">
                        <img
                            src={images[currentIndex]}
                            alt={`Zoom ${currentIndex}`}
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>

                    <button
                        onClick={handleNext}
                        className="absolute right-4 text-white hover:text-gray-300 z-50 p-2 bg-black/50 rounded-full"
                    >
                        <ChevronRight className="h-8 w-8" />
                    </button>

                    <div className="absolute bottom-4 text-white text-sm">
                        {currentIndex + 1} / {images.length}
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}
