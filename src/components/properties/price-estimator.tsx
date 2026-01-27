"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { calculateEstimatedPrice } from "@/app/actions/ai";

interface PriceEstimatorProps {
    propertyDetails: {
        area: number;
        bedrooms: number;
        garage: number;
        type: string;
        location?: string;
    };
    onPriceEstimated: (price: number) => void;
}

export function PriceEstimator({ propertyDetails, onPriceEstimated }: PriceEstimatorProps) {
    const [loading, setLoading] = useState(false);

    const handleEstimate = async () => {
        if (!propertyDetails.area) {
            toast.error("Preencha a área do imóvel para calcular.");
            return;
        }

        setLoading(true);
        try {
            // Artificial delay for "AI thinking" effect
            await new Promise(resolve => setTimeout(resolve, 1500));

            const result = await calculateEstimatedPrice(propertyDetails);

            if (result.success && result.data) {
                onPriceEstimated(result.data);
                toast.success("Preço estimado com Sucesso!", {
                    description: "Baseado em imóveis semelhantes na região.",
                    icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
                });
            } else {
                toast.error("Não foi possível estimar o preço.");
            }
        } catch (error) {
            toast.error("Erro ao conectar com Market Pulse.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleEstimate}
            disabled={loading}
            type="button"
            variant="outline"
            className="w-full border-dashed border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
        >
            {loading ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analisando Mercado...
                </>
            ) : (
                <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Market Pulse (Sugerir Preço)
                </>
            )}
        </Button>
    );
}
