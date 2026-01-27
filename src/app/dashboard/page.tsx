import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Home, Users, ArrowUpRight } from "lucide-react";
import { getDashboardStats } from "@/app/actions/dashboard";
import { getProperties } from "@/app/actions/properties";
import { getLeads, getAppointments } from "@/app/actions/leads";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialStats } from "@/components/financial-stats";
import { GamificationWidget } from "@/components/dashboard/gamification-widget";

export default async function DashboardPage() {
    // 1. Fetch Parallel Data
    const [statsResult, propertiesResult, leadsResult, appointmentsResult] = await Promise.all([
        getDashboardStats(),
        getProperties(),
        getLeads(),
        getAppointments()
    ]);

    const stats = statsResult.data || { totalProperties: 0, activeProperties: 0, totalLeads: 0, portfolioValue: 0 };
    const recentProperties = propertiesResult.data ? propertiesResult.data.slice(0, 5) : [];
    const recentLeads = leadsResult.data ? leadsResult.data.slice(0, 5) : [];
    const appointments = appointmentsResult.data || [];

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100">Visão Geral</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Dados em tempo real</span>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Operacional</TabsTrigger>
                    <TabsTrigger value="financial">Financeiro 💰</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    {/* KPI Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="hover:shadow-md transition-shadow border-emerald-100">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Portfólio (VGV)</CardTitle>
                                <DollarSign className="h-4 w-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-emerald-600">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(stats.portfolioValue)}
                                </div>
                                <p className="text-xs text-muted-foreground flex items-center mt-1">
                                    Valor Geral de Vendas
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Imóveis Ativos</CardTitle>
                                <Home className="h-4 w-4 text-violet-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.activeProperties}</div>
                                <p className="text-xs text-muted-foreground text-gray-500 mt-1">
                                    de {stats.totalProperties} imóveis cadastrados
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Leads Totais</CardTitle>
                                <Users className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalLeads}</div>
                                <p className="text-xs text-muted-foreground text-blue-600 flex items-center mt-1">
                                    Clientes no pipeline
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-800 border-none">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Ações Rápidas</CardTitle>
                            </CardHeader>
                            <CardContent className="flex gap-2">
                                <Link href="/dashboard/properties" className="text-xs bg-white dark:bg-gray-700 border px-2 py-1 rounded hover:bg-gray-100">
                                    + Imóvel
                                </Link>
                                <Link href="/dashboard/leads" className="text-xs bg-white dark:bg-gray-700 border px-2 py-1 rounded hover:bg-gray-100">
                                    + Lead
                                </Link>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        {/* Recent Properties */}
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Imóveis Recém Cadastrados</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {recentProperties.map((property) => (
                                        <Link key={property.id} href={`/dashboard/properties/${property.id}`} className="flex items-center group cursor-pointer">
                                            <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden relative">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={property.image || '/placeholder.png'} className="object-cover w-full h-full group-hover:scale-110 transition-transform" alt="" />
                                            </div>
                                            <div className="ml-4 space-y-1 flex-1">
                                                <p className="text-sm font-medium leading-none group-hover:text-emerald-600 transition-colors">{property.title}</p>
                                                <p className="text-xs text-gray-500">{property.address}</p>
                                            </div>
                                            <div className="ml-auto font-medium text-emerald-600 text-sm">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(property.price)}
                                            </div>
                                        </Link>
                                    ))}
                                    <Link href="/dashboard/properties" className="block text-center text-xs text-gray-400 hover:text-emerald-600 mt-4">
                                        Ver todos os imóveis &rarr;
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="col-span-3 space-y-4">
                            <GamificationWidget />

                            <Card className="border-emerald-100 shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-emerald-950">Próximos Compromissos 📅</CardTitle>
                                    <Link href="/dashboard/appointments" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                                        Ver Agenda &rarr;
                                    </Link>
                                </CardHeader>
                                <CardContent>
                                    {appointments.length > 0 ? (
                                        <div className="space-y-4">
                                            {appointments.map((apt) => (
                                                <div key={apt.id} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 hover:bg-emerald-50 transition-colors">
                                                    <div className="flex flex-col items-center bg-white p-2 rounded border border-emerald-100 min-w-[50px]">
                                                        <span className="text-xs font-bold text-emerald-600 uppercase">
                                                            {format(new Date(apt.date), 'MMM', { locale: ptBR })}
                                                        </span>
                                                        <span className="text-lg font-bold text-gray-800 leading-none">
                                                            {format(new Date(apt.date), 'dd')}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-1 flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <p className="text-sm font-bold text-gray-800">{apt.lead.name}</p>
                                                            <Badge variant="secondary" className="text-[10px] bg-white text-gray-500 border-gray-200">
                                                                {format(new Date(apt.date), 'HH:mm')}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs text-gray-600 line-clamp-1">
                                                            {apt.property ? `Visita: ${apt.property.title}` : `Novo agendamento`}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed">
                                            <p className="text-sm">Nenhuma visita agendada.</p>
                                            <p className="text-xs mt-1">Use o Kanban para agendar.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="financial" className="space-y-4">
                    <FinancialStats />
                </TabsContent>
            </Tabs>
        </div>
    );
}
