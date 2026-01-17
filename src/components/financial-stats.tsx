"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFinancialStats } from "@/app/actions/transactions";
import { DollarSign, TrendingUp, Wallet } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export function FinancialStats() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        getFinancialStats().then(setStats);
    }, []);

    if (!stats) return <div className="p-4 text-sm text-gray-500">Carregando financeiro...</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Financeiro (Esse Mês)</h2>
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">VGV Total (Vendas)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalVGV.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                        <p className="text-xs text-muted-foreground">+20.1% em relação ao mês anterior</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {stats.userRole === 'AGENT' ? 'Minha Comissão (Estimada)' : 'Receita Imobiliária'}
                        </CardTitle>
                        <Wallet className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">
                            {stats.agencyRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.userRole === 'AGENT' ? 'Bônus e Comissões a receber' : 'Lucro líquido estimado'}
                        </p>
                    </CardContent>
                </Card>
                {/* Hide "Comissões Pagas" card for Agents, as it's redundant or confusing. Maybe show Deal Count? */}
                {stats.userRole !== 'AGENT' && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Comissões Pagas</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalCommission.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </div>
                            <p className="text-xs text-muted-foreground">Repassado aos corretores</p>
                        </CardContent>
                    </Card>
                )}
                {/* For Agents, maybe show "Deals Closed"? */}
                {stats.userRole === 'AGENT' && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Transações</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.recentTransactions.length}
                            </div>
                            <p className="text-xs text-muted-foreground">Negócios fechados</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Receita Mensal</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={stats.chartData || []}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="total" fill="#059669" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Últimas Vendas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {stats.recentTransactions.map((t: any) => (
                                <div key={t.id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{t.property?.title || "Imóvel"}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {t.type === 'SALE' ? 'Venda' : 'Locação'} por {t.agentName || 'Corretor'}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        +{t.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </div>
                                </div>
                            ))}
                            {stats.recentTransactions.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma venda registrada.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
