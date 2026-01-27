"use client";

import { useState } from "react";
import { MatchCard } from "@/components/smart-match/match-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SmartMatchClientProps {
    lead: any;
    properties: any[];
}

export function SmartMatchClient({ lead, properties }: SmartMatchClientProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();

    const currentProperty = properties[currentIndex];

    // Simple mock match score based on price/random for MVP
    // In real app, this would use the AI score we built earlier
    const getMatchScore = (property: any) => {
        // Mock logic: seeded randomish based on id
        return 70 + (property.id % 30);
    };

    const handleLike = () => {
        // Open WhatsApp
        const message = `Olá ${lead.name}, encontrei este imóvel que é a sua cara: *${currentProperty.title}* em ${currentProperty.address}. Vamos visitar?`;
        const phone = lead.phone.replace(/\D/g, "");
        window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, "_blank");

        toast.success("Imóvel enviado para o Lead!");
        nextCard();
    };

    const handlePass = () => {
        nextCard();
    };

    const nextCard = () => {
        setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
        }, 200); // Wait for animation
    };

    if (currentIndex >= properties.length) {
        return (
            <div className="flex flex-col items-center justify-center h-[600px] text-center p-8 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-12 h-12 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Fim das Sugestões!</h2>
                <p className="text-gray-500 mb-8 max-w-md">
                    Você analisou todos os imóveis disponíveis para este lead hoje.
                </p>
                <Link href="/dashboard/leads">
                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                        Voltar para Leads
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center max-w-4xl mx-auto h-[700px]">
            {/* Header */}
            <div className="w-full flex items-center justify-between mb-8">
                <Link href="/dashboard/leads">
                    <Button variant="ghost" className="hover:bg-gray-100">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                    </Button>
                </Link>
                <div className="text-center">
                    <h1 className="text-xl font-bold">Smart Match para <span className="text-emerald-600">{lead.name}</span></h1>
                    <p className="text-xs text-gray-500">Analisando {properties.length - currentIndex} opções restantes</p>
                </div>
                <div className="w-20" /> {/* Spacer for centering */}
            </div>

            {/* Deck */}
            <div className="relative w-full max-w-md h-[600px] flex justify-center items-center">
                {/* Render current and next card for stacking effect */}
                {properties[currentIndex + 1] && (
                    <div className="absolute top-4 scale-95 opacity-50 pointer-events-none">
                        <MatchCard
                            property={properties[currentIndex + 1]}
                            matchScore={getMatchScore(properties[currentIndex + 1])}
                            onLike={() => { }}
                            onPass={() => { }}
                        />
                    </div>
                )}

                <div className="absolute z-10 w-full">
                    <MatchCard
                        key={currentProperty.id}
                        property={currentProperty}
                        matchScore={getMatchScore(currentProperty)}
                        onLike={handleLike}
                        onPass={handlePass}
                    />
                </div>
            </div>
        </div>
    );
}
