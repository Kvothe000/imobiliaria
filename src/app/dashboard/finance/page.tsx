import { getFinancialMetrics } from "@/app/actions/transactions";
import { getBrokerRanking } from "@/app/actions/users";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, TrendingUp, Users, Wallet, Trophy, Medal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function FinancePage() {
    const { data: metrics } = await getFinancialMetrics();
    const { data: ranking } = await getBrokerRanking();

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="space-y-8 p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Financeiro & Metas</h2>
                    <p className="text-muted-foreground">Visão geral do desempenho financeiro e ranking de vendas.</p>
                </div>
            </div>

            {/* Big Numbers */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">VGV Total (Mês)</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(metrics?.totalVGV || 0)}</div>
                        <p className="text-xs text-muted-foreground">Valor Geral de Vendas</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Receita da Agência</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-700">{formatCurrency(metrics?.totalRevenue || 0)}</div>
                        <p className="text-xs text-muted-foreground">Lucro Líquido</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Comissões Pagas</CardTitle>
                        <Wallet className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{formatCurrency(metrics?.totalCommissions || 0)}</div>
                        <p className="text-xs text-muted-foreground">Repasse aos Corretores</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Negócios Fechados</CardTitle>
                        <Users className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.dealCount || 0}</div>
                        <p className="text-xs text-muted-foreground">Transações no período</p>
                    </CardContent>
                </Card>
            </div>

            {/* Goal Progress */}
            <Card className="border-emerald-100 bg-emerald-50/50">
                <CardContent className="pt-6">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <p className="font-semibold text-emerald-800">Meta Mensal da Agência</p>
                            <p className="text-2xl font-bold text-slate-900">{formatCurrency(metrics?.companyGoal || 0)}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-bold text-emerald-600">{metrics?.goalProgress?.toFixed(1)}%</span>
                            <p className="text-xs text-muted-foreground">Concluído</p>
                        </div>
                    </div>
                    <Progress value={metrics?.goalProgress || 0} className="h-4 bg-emerald-200" />
                </CardContent>
            </Card>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Ranking */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="text-yellow-500 h-5 w-5" /> Ranking de Vendas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {ranking && ranking.map((broker, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Avatar className="h-10 w-10 border-2 border-slate-100">
                                                <AvatarImage src={broker.avatar || undefined} />
                                                <AvatarFallback>{broker.agentName?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            {index === 0 && <span className="absolute -top-1 -right-1 text-lg">🥇</span>}
                                            {index === 1 && <span className="absolute -top-1 -right-1 text-lg">🥈</span>}
                                            {index === 2 && <span className="absolute -top-1 -right-1 text-lg">🥉</span>}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{broker.agentName || "Corretor"}</p>
                                            <p className="text-xs text-muted-foreground">{broker._count.id} Vendas</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900">{formatCurrency(broker._sum.value || 0)}</p>
                                        <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">
                                            Comissão: {formatCurrency(broker._sum.agentShare || 0)}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                            {(!ranking || ranking.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                    Nenhuma venda registrada este mês.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity Placeholder (Or Detailed List) */}
                <Card className="col-span-1 border-dashed bg-slate-50 flex items-center justify-center p-8 text-center text-muted-foreground">
                    <div>
                        <Medal className="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <p>O gráfico de evolução de vendas aparecerá aqui.</p>
                        <p className="text-xs">(Funcionalidade em desenvolvimento)</p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
