"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { generateDescription } from "@/app/actions/ai";
import { toast } from "sonner";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface MagicWriteButtonProps {
    onGenerate: (text: string) => void;
    getPromptContext: () => string;
}

export function MagicWriteButton({ onGenerate, getPromptContext }: MagicWriteButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleMagicWrite = async () => {
        const promptData = getPromptContext();
        if (!promptData || promptData.length < 10) {
            toast.error("Preencha alguns dados básicos (Título, Tipo, etc.) para a IA trabalhar.");
            return;
        }

        setIsLoading(true);
        toast.info("A IA está criando uma descrição incrível...", { duration: 2000 });

        try {
            const result = await generateDescription(promptData);
            if (result.success && result.data) {
                onGenerate(result.data);
                toast.success("Descrição gerada com sucesso! ✨");
            } else {
                toast.error(result.error || "Erro ao gerar descrição.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro inesperado na IA.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 transition-all duration-300"
                        onClick={handleMagicWrite}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Sparkles className="h-4 w-4 mr-2 text-emerald-600" />
                        )}
                        {isLoading ? "Criando..." : "Magic Write"}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Gere uma descrição profissional usando IA baseada nos campos preenchidos.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
