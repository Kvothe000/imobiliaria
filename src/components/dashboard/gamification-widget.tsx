"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { GamificationStats } from "./gamification-stats";

export function GamificationWidget() {
    return (
        <Card className="glass-card border-none bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-10 -mt-10" />

            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Seu Progresso
                </CardTitle>
            </CardHeader>
            <CardContent>
                <GamificationStats />
            </CardContent>
        </Card>
    );
}
