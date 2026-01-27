"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, X, MessageCircle, MapPin, Bed, Ruler, Car } from "lucide-react";
import { motion, PanInfo, useAnimation } from "framer-motion";

interface MatchCardProps {
    property: any;
    matchScore: number;
    onLike: () => void;
    onPass: () => void;
}

export function MatchCard({ property, matchScore, onLike, onPass }: MatchCardProps) {
    const controls = useAnimation();

    const handleDragEnd = async (event: any, info: PanInfo) => {
        if (info.offset.x > 100) {
            await controls.start({ x: 500, opacity: 0 });
            onLike();
        } else if (info.offset.x < -100) {
            await controls.start({ x: -500, opacity: 0 });
            onPass();
        } else {
            controls.start({ x: 0 });
        }
    };

    return (
        <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={controls}
            className="absolute w-full max-w-md cursor-grab active:cursor-grabbing"
            style={{ touchAction: "none" }}
        >
            <Card className="overflow-hidden shadow-2xl border-none rounded-3xl h-[600px] relative select-none">
                {/* Image Background */}
                <div className="absolute inset-0 z-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={property.image || '/placeholder.png'} className="w-full h-full object-cover" alt={property.title} draggable={false} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 text-white">
                    <div className="flex justify-between items-start">
                        <Badge className={`
                            text-lg px-3 py-1 font-bold border-none
                            ${matchScore >= 90 ? 'bg-gradient-to-r from-pink-500 to-rose-500 animate-pulse' : ''}
                            ${matchScore >= 70 && matchScore < 90 ? 'bg-emerald-500' : ''}
                            ${matchScore < 70 ? 'bg-blue-500' : ''}
                        `}>
                            {matchScore}% Match
                        </Badge>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h2 className="text-3xl font-bold leading-tight shadow-md">{property.title}</h2>
                            <div className="flex items-center text-gray-300 mt-2 font-medium">
                                <MapPin className="w-4 h-4 mr-1 text-emerald-400" />
                                {property.address}
                            </div>
                        </div>

                        <div className="flex gap-4 text-sm font-medium">
                            <span className="flex items-center gap-1 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-md border border-white/10">
                                <Bed className="w-4 h-4" /> {property.bedrooms} Beds
                            </span>
                            <span className="flex items-center gap-1 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-md border border-white/10">
                                <Ruler className="w-4 h-4" /> {property.area}m²
                            </span>
                            <span className="flex items-center gap-1 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-md border border-white/10">
                                <Car className="w-4 h-4" /> {property.garage} Vagas
                            </span>
                        </div>

                        <div className="text-3xl font-bold text-emerald-400">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(property.price)}
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <Button
                                variant="outline"
                                className="h-14 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all text-lg font-bold bg-transparent"
                                onClick={() => {
                                    controls.start({ x: -500, opacity: 0 });
                                    onPass();
                                }}
                            >
                                <X className="w-6 h-6 mr-2" />
                                Pular
                            </Button>
                            <Button
                                className="h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all text-lg font-bold"
                                onClick={() => {
                                    controls.start({ x: 500, opacity: 0 });
                                    onLike();
                                }}
                            >
                                <MessageCircle className="w-6 h-6 mr-2" />
                                Enviar
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
