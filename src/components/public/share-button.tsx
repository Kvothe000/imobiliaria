"use client";

import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ShareButton({ title, text }: { title: string, text: string }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: text,
                    url: url,
                });
                return;
            } catch (err) {
                // Ignore abort errors
            }
        }

        // Fallback to Clipboard
        navigator.clipboard.writeText(`${text}\n${url}`);
        setCopied(true);
        toast.info("Link copiado para a área de transferência!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button variant="outline" className="w-full gap-2 text-slate-600 border-slate-300 hover:bg-slate-50" onClick={handleShare}>
            {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {copied ? "Copiado!" : "Compartilhar Imóvel"}
        </Button>
    );
}
