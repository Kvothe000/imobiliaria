
import { getAdvancedStats } from "@/app/actions/dashboard";
import { CreateUserModal } from '@/components/create-user-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { User, Shield, Trophy, Medal } from 'lucide-react';
import { RankingPodium } from '@/components/team/ranking-podium';

export default async function TeamPage() {
    const { success, data } = await getAdvancedStats();

    if (!success || !data) {
        return <div>Erro ao carregar dados da equipe.</div>;
    }

    const { topAgents, monthlyGoal, currentMonthRevenue } = data;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gestão de Equipe & Performance</h1>
                    <p className="text-slate-500">Acompanhe o ranking e metas do time comercial.</p>
                </div>
                <CreateUserModal />
            </div>

            {/* Gamification: Podium */}
            <RankingPodium agents={topAgents as any[]} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {data.userRole === 'AGENT' ? 'Minha Meta (Pessoal)' : 'Meta Mensal da Agência'}
                        </CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyGoal)}</div>
                        <p className="text-xs text-muted-foreground">
                            {data.userRole === 'AGENT' ? 'Seu objetivo este mês' : 'Objetivo global da equipe'}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Realizado (Mês)</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentMonthRevenue)}</div>
                        <div className="h-2 w-full bg-slate-100 mt-2 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${Math.min((currentMonthRevenue / (monthlyGoal || 1)) * 100, 100)}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {((currentMonthRevenue / (monthlyGoal || 1)) * 100).toFixed(1)}% da meta
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Ranking de Corretores</CardTitle>
                    <CardDescription>
                        Performance detalhada por volume de vendas este mês.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">#</TableHead>
                                <TableHead className="w-[100px]">Avatar</TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Vendas (Qtd)</TableHead>
                                <TableHead className="text-right">VGV (Volume de Vendas)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topAgents.map((agent: any, index: number) => (
                                <TableRow key={agent.id}>
                                    <TableCell className="font-bold text-slate-500">
                                        {index + 1}º
                                    </TableCell>
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage src={agent.image || undefined} alt={agent.name || ''} />
                                            <AvatarFallback>{agent.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {agent.name}
                                        {index === 0 && <Badge className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-[10px]">Líder</Badge>}
                                    </TableCell>
                                    <TableCell>
                                        {/* Placeholder for future Badges */}
                                        <div className="flex gap-1">
                                            {index < 3 && <Medal className={`w-4 h-4 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-slate-400' : 'text-orange-400'}`} />}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {agent.salesCount}
                                    </TableCell>
                                    <TableCell className="text-right text-slate-500">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(agent.volume)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function DialogDescription({ children }: { children: React.ReactNode }) {
    return <p className="text-sm text-slate-500">{children}</p>;
}
