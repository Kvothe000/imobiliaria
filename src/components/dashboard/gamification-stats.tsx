"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Trophy, Zap, Target } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GamificationStatsProps {
    initialLevel?: string;
    initialXp?: number;
    nextLevelXp?: number;
}

export function GamificationStats({
    initialLevel = "Corretor Prata",
    initialXp = 750,
    nextLevelXp = 1000
}: GamificationStatsProps) {
    const [xp, setXp] = useState(initialXp);
    const [level, setLevel] = useState(initialLevel);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const calculatedProgress = (xp / nextLevelXp) * 100;
        setProgress(Math.min(calculatedProgress, 100));
    }, [xp, nextLevelXp]);

    const handleSimulateAction = () => {
        const newXp = xp + 50;
        setXp(newXp);

        if (newXp >= nextLevelXp) {
            triggerLevelUp();
        } else {
            toast.success("+50 XP! Continue assim!");
        }
    };

    const triggerLevelUp = () => {
        setLevel("Corretor Ouro 🥇");
        setXp(0); // Reset for next level or carry over
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        toast.success("PARABÉNS! VOCÊ SUBIU DE NÍVEL!", {
            description: "Agora você é um Corretor Ouro!",
            duration: 5000,
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent transform transition-all duration-300 hover:scale-105 inline-block cursor-default">
                        {level}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-1">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        {xp} / {nextLevelXp} XP para o próximo nível
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800 shadow-sm animate-pulse-subtle">
                        Próximo: Ouro 🥇
                    </span>
                </div>
            </div>

            <div className="relative pt-1">
                <Progress value={progress} className="h-3 bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800/50" indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000 ease-out" />
                <p className="text-[10px] text-right mt-1 text-gray-400">
                    {Math.round(progress)}% Concluído
                </p>
            </div>

            <div className="bg-white/50 dark:bg-white/5 rounded-lg p-3 border border-indigo-100 dark:border-indigo-800/30 transition-all hover:bg-white/80 dark:hover:bg-white/10">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Target className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Próxima Missão</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Cadastre +2 imóveis completos</p>
                        </div>
                    </div>
                    {/* Simulator Button - Hidden in Prod usually */}
                    <Button variant="ghost" size="icon" onClick={handleSimulateAction} className="h-6 w-6 opacity-30 hover:opacity-100" title="Simular Ganho de XP">
                        <Zap className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
