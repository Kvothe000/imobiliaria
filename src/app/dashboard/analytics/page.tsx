"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp, Users, DollarSign, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";

// Mock Data
const REVENUE_DATA = [
    { name: "Jan", sales: 4000, commission: 240 },
    { name: "Fev", sales: 3000, commission: 139 },
    { name: "Mar", sales: 2000, commission: 980 },
    { name: "Abr", sales: 2780, commission: 390 },
    { name: "Mai", sales: 1890, commission: 480 },
    { name: "Jun", sales: 2390, commission: 380 },
    { name: "Jul", sales: 3490, commission: 430 },
];

const FUNNEL_DATA = [
    { name: "Leads Novos", value: 1200, fill: "#3b82f6" },
    { name: "Qualificados", value: 800, fill: "#6366f1" },
    { name: "Visitas", value: 450, fill: "#8b5cf6" },
    { name: "Propostas", value: 120, fill: "#d946ef" },
    { name: "Fechados", value: 45, fill: "#10b981" },
];

const AGENT_PERFORMANCE = [
    { name: "Ana Silva", deals: 12, revenue: 154000 },
    { name: "João Pedro", deals: 8, revenue: 98000 },
    { name: "Mariana Costa", deals: 15, revenue: 210000 },
    { name: "Carlos Souza", deals: 5, revenue: 45000 },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Titan Analytics</h1>
                <p className="text-muted-foreground">Visão geral da performance do seu negócio.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ 523.890,00</div>
                        <p className="text-xs text-muted-foreground flex items-center text-emerald-500">
                            <ArrowUpRight className="mr-1 h-3 w-3" /> +20.1% este mês
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Leads Ativos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2.350</div>
                        <p className="text-xs text-muted-foreground flex items-center text-emerald-500">
                            <ArrowUpRight className="mr-1 h-3 w-3" /> +180 novos
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4.8%</div>
                        <p className="text-xs text-muted-foreground flex items-center text-rose-500">
                            <ArrowDownRight className="mr-1 h-3 w-3" /> -0.2% semana passada
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ 980.000</div>
                        <p className="text-xs text-muted-foreground flex items-center text-emerald-500">
                            <ArrowUpRight className="mr-1 h-3 w-3" /> +12% YoY
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                    <TabsTrigger value="agents">Corretores</TabsTrigger>
                    <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Receita vs Comissões</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ResponsiveContainer width="100%" height={350}>
                                    <AreaChart data={REVENUE_DATA}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="sales" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" />
                                        <Area type="monotone" dataKey="commission" stroke="#10b981" fillOpacity={1} fill="#10b981" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Origem dos Leads</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={350}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Instagram', value: 400 },
                                                { name: 'Site', value: 300 },
                                                { name: 'Indicação', value: 300 },
                                                { name: 'Portais', value: 200 },
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            <Cell fill="#E11D48" /> {/* Instagram - Pink/Red */}
                                            <Cell fill="#2563EB" /> {/* Site - Blue */}
                                            <Cell fill="#F59E0B" /> {/* Indicação - Amber */}
                                            <Cell fill="#10B981" /> {/* Portais - Green */}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex justify-center gap-4 text-xs text-muted-foreground mt-4">
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-600"></div>Instagram</div>
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-600"></div>Site</div>
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div>Indicação</div>
                                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Portais</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="pipeline" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Funil de Vendas</CardTitle>
                            <CardDescription>Conversão etapa por etapa.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart
                                    data={FUNNEL_DATA}
                                    layout="vertical"
                                    barSize={30}
                                >
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {FUNNEL_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
