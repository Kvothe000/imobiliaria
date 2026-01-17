"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, User } from "lucide-react";
import { useState, useEffect } from "react";
import { LeadCaptureModal } from "@/components/public/lead-capture-modal";

interface SmartContactButtonProps {
    propertyTitle: string;
    propertyCode: string | number;
    brokerNumber?: string;
}

export function SmartContactButton({ propertyTitle, propertyCode, brokerNumber }: SmartContactButtonProps) {
    const [isBusinessHours, setIsBusinessHours] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [destinationUrl, setDestinationUrl] = useState("");

    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const hour = now.getHours();
            const day = now.getDay();
            const isWeekDay = day >= 1 && day <= 5;
            const isWorkingHour = hour >= 9 && hour < 18;
            setIsBusinessHours(isWeekDay && isWorkingHour);
        };
        checkTime();
    }, []);

    const handleInitialClick = () => {
        const message = encodeURIComponent(
            `Olá! Tenho interesse no imóvel "${propertyTitle}" (Ref: ${propertyCode}). Gostaria de mais detalhes.`
        );

        const targetNumber = isBusinessHours
            ? (brokerNumber || "5511999999999")
            : "5511888888888";

        const url = `https://wa.me/${targetNumber}?text=${message}`;

        // Prepare URL and open modal instead of direct open
        setDestinationUrl(url);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-2">
            <Button
                onClick={handleInitialClick}
                className={`w-full h-12 text-lg gap-2 shadow-md transition-all hover:scale-[1.02] ${isBusinessHours
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
            >
                {isBusinessHours ? (
                    <>
                        <User className="h-5 w-5" />
                        Falar com Corretor
                    </>
                ) : (
                    <>
                        <MessageCircle className="h-5 w-5" />
                        Atendimento Virtual 24h
                    </>
                )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
                {isBusinessHours
                    ? "Estamos online! Resposta em média: 5 min."
                    : "Fora do horário comercial. Nosso assistente virtual registra seu interesse agora."
                }
            </p>

            <LeadCaptureModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                propertyTitle={propertyTitle}
                propertyCode={propertyCode}
                destinationUrl={destinationUrl}
            />
        </div>
    );
}
