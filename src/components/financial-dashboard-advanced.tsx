"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { User, Trophy, TrendingUp, Target } from "lucide-react";

interface FinancialStats {
    totalVGV: number;
    totalCommission: number;
    agencyRevenue: number;
    topAgents: {
        id: string;
        name: string | null;
        image: string | null;
        salesCount: number;
        volume: number;
    }[];
    monthlyGoal: number;
    currentMonthRevenue: number;
    userRole?: string;
}

export function AdvancedFinancialDashboard({ stats }: { stats: FinancialStats }) {
    const progressPercentage = Math.min((stats.currentMonthRevenue / stats.monthlyGoal) * 100, 100);

    return (
        <div className="space-y-6">
            {/* Meta da Imobiliária */}
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Target className="w-48 h-48" />
                </div>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-emerald-400" />
                        {stats.userRole === 'AGENT' ? 'Minha Meta Mensal' : 'Meta Mensal da Agência'}
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                        {stats.userRole === 'AGENT' ? 'Seu objetivo de vendas para este mês' : 'Objetivo de receita para este mês'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-4xl font-bold">
                                    {stats.currentMonthRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                                <p className="text-sm text-slate-400 mt-1">
                                    de {stats.monthlyGoal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-emerald-400">{progressPercentage.toFixed(1)}%</p>
                                <p className="text-sm text-slate-400">Concluído</p>
                            </div>
                        </div>
                        <Progress value={progressPercentage} className="h-3 bg-slate-700" />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ranking de Corretores */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            Ranking de Vendas
                        </CardTitle>
                        <CardDescription>Top performers deste mês</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.topAgents.map((agent, index) => (
                                <div key={agent.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`
                                            flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm
                                            ${index === 0 ? 'bg-amber-100 text-amber-700' :
                                                index === 1 ? 'bg-slate-200 text-slate-700' :
                                                    index === 2 ? 'bg-orange-100 text-orange-800' : 'bg-transparent text-slate-500'}
                                        `}>
                                            {index + 1}º
                                        </div>
                                        <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm">
                                            <AvatarImage src={agent.image || ''} />
                                            <AvatarFallback>{agent.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm">{agent.name}</p>
                                            <p className="text-xs text-muted-foreground">{agent.salesCount} vendas</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-emerald-600">
                                            {agent.volume.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {stats.topAgents.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    Nenhuma venda registrada neste mês.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Gráfico de Performance (Placeholder para V2) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            Previsão de Receita
                        </CardTitle>
                        <CardDescription>Baseado nos leads em fase de "Proposta"</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-lg border-dashed border-2">
                        <div className="text-center space-y-2">
                            <TrendingUp className="w-10 h-10 text-slate-300 mx-auto" />
                            <p className="text-sm text-muted-foreground">O gráfico de projeção aparecerá aqui<br />assim que houver mais dados.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
