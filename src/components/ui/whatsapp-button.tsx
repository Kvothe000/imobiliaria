"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface WhatsAppButtonProps {
    phone: string;
    message?: string;
    label?: string;
    className?: string;
    variant?: "default" | "icon" | "floating";
}

export function WhatsAppButton({
    phone,
    message = "Olá! Gostaria de falar sobre o imóvel.",
    label = "Conversar",
    className,
    variant = "default"
}: WhatsAppButtonProps) {

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const cleanPhone = phone.replace(/\D/g, "");
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/55${cleanPhone}?text=${encodedMessage}`;
        window.open(url, "_blank");
    };

    if (variant === "floating") {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={handleClick}
                            className={cn(
                                "fixed bottom-6 right-6 h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-xl z-50 animate-bounce-subtle",
                                className
                            )}
                            size="icon"
                        >
                            <MessageCircle className="h-7 w-7 text-white" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Falar no WhatsApp</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    if (variant === "icon") {
        return (
            <Button
                onClick={handleClick}
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full", className)}
                title="Abrir WhatsApp"
            >
                <MessageCircle className="h-4 w-4" />
            </Button>
        );
    }

    return (
        <Button
            onClick={handleClick}
            className={cn(
                "bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors",
                className
            )}
            size="sm"
        >
            <MessageCircle className="h-4 w-4 mr-2" />
            {label}
        </Button>
    );
}
