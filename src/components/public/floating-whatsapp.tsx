"use client";

import { MessageCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function FloatingWhatsApp() {
    const [open, setOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        // Show tooltip after 3 seconds to grab attention
        const timer = setTimeout(() => setShowTooltip(true), 3000);
        return () => clearTimeout(timer);
    }, []);

    const whatsappLink = "https://wa.me/5511999999999?text=Olá, gostaria de saber mais sobre os imóveis da Titan.";

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">

            {showTooltip && (
                <div className="bg-white p-4 rounded-lg shadow-xl border border-emerald-100 max-w-xs animate-in slide-in-from-bottom-2 fade-in duration-500 relative">
                    <button
                        onClick={() => setShowTooltip(false)}
                        className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    <p className="font-semibold text-slate-800">Precisa de ajuda?</p>
                    <p className="text-sm text-slate-600 mt-1">
                        Nossos corretores estão online agora para te ajudar a encontrar seu imóvel ideal. 🏡
                    </p>
                    <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45 border-b border-r border-emerald-100"></div>
                </div>
            )}

            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button
                    size="lg"
                    className="h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] shadow-xl transition-all hover:scale-110 flex items-center justify-center p-0"
                >
                    <MessageCircle className="h-8 w-8 text-white" />
                </Button>
            </a>
        </div>
    );
}
