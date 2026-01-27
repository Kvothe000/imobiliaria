"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target } from "lucide-react";

export function GamificationWidget() {
    // Mock data for MVP
    const level = "Corretor Prata";
    const currentXp = 750;
    const nextLevelXp = 1000;
    const progress = (currentXp / nextLevelXp) * 100;

    return (
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100 dark:from-indigo-950 dark:to-blue-950 dark:border-indigo-900">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Seu Progresso
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{level}</h3>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                            {currentXp} / {nextLevelXp} XP
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full border border-amber-200">
                            Próximo: Ouro 🥇
                        </span>
                    </div>
                </div>

                <Progress value={progress} className="h-2 bg-indigo-200 dark:bg-indigo-800" indicatorClassName="bg-indigo-600 dark:bg-indigo-400" />

                <div className="mt-4 pt-3 border-t border-indigo-100 dark:border-indigo-800">
                    <div className="flex items-center gap-3">
                        <div className="bg-white dark:bg-indigo-900/50 p-2 rounded-lg border border-indigo-100 dark:border-indigo-800">
                            <Target className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Próxima Missão</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Cadastre +2 imóveis completos</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
