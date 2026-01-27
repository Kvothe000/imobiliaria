"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Zap, MessageCircle, Mail, Clock, Trash2, Play, CheckCircle2 } from "lucide-react";
import { Switch } from "../ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Mock Data for Initial State
const INITIAL_FLOWS = [
    {
        id: 1,
        name: "Boas-vindas WhatsApp",
        trigger: "Novo Lead",
        action: "Enviar WhatsApp",
        active: true,
        executions: 124,
        icon: MessageCircle,
        color: "text-green-500",
        bg: "bg-green-50"
    },
    {
        id: 2,
        name: "Follow-up 24h",
        trigger: "Sem Resposta (24h)",
        action: "Enviar Email",
        active: true,
        executions: 45,
        icon: Mail,
        color: "text-blue-500",
        bg: "bg-blue-50"
    },
    {
        id: 3,
        name: "Agendou Visita",
        trigger: "Status mudou para 'Visita'",
        action: "Criar Tarefa",
        active: false,
        executions: 12,
        icon: Clock,
        color: "text-amber-500",
        bg: "bg-amber-50"
    }
];

export function AutomatorClient() {
    const [flows, setFlows] = useState(INITIAL_FLOWS);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const toggleFlow = (id: number) => {
        setFlows(prev => prev.map(f => {
            if (f.id === id) {
                const newState = !f.active;
                toast.success(`Fluxo "${f.name}" ${newState ? 'ativado' : 'desativado'}.`);
                return { ...f, active: newState };
            }
            return f;
        }));
    };

    const deleteFlow = (id: number) => {
        setFlows(prev => prev.filter(f => f.id !== id));
        toast.success("Fluxo removido.");
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const trigger = (form.querySelector('[name="trigger"]') as HTMLInputElement)?.value || "Novo Lead";
        const action = (form.querySelector('[name="action"]') as HTMLInputElement)?.value || "Enviar WhatsApp";

        const newFlow = {
            id: Date.now(),
            name,
            trigger: trigger === "new_lead" ? "Novo Lead" : trigger === "status_visit" ? "Status mudou para 'Visita'" : "Aniversário",
            action: action === "send_whatsapp" ? "Enviar WhatsApp" : "Enviar Email",
            active: true,
            executions: 0,
            icon: Zap,
            color: "text-purple-500",
            bg: "bg-purple-50"
        };

        setFlows([...flows, newFlow]);
        setIsCreateOpen(false);
        toast.success("Novo fluxo criado com sucesso! 🚀");
    };

    return (
        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Fluxos Ativos</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{flows.filter(f => f.active).length}</div>
                        <p className="text-xs text-muted-foreground">+1 criado hoje</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Execuções (24h)</CardTitle>
                        <Play className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">18</div>
                        <p className="text-xs text-muted-foreground">+12% vs ontem</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Horas Economizadas</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4.5h</div>
                        <p className="text-xs text-muted-foreground">Esta semana</p>
                    </CardContent>
                </Card>
            </div>

            {/* Actions */}
            <div className="flex justify-end">
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-200">
                            <Plus className="mr-2 h-4 w-4" /> Novo Fluxo Inteligente
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Criar Automação</DialogTitle>
                            <DialogDescription>
                                Configure o gatilho e a ação para seu novo fluxo.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nome do Fluxo</Label>
                                <Input id="name" name="name" placeholder="Ex: Boas-vindas VIP" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="trigger">Gatilho (Quando...)</Label>
                                <Select name="trigger" defaultValue="new_lead">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o gatilho" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="new_lead">⚡ Novo Lead Cadastrado</SelectItem>
                                        <SelectItem value="status_visit">🔄 Status mudou para 'Visita'</SelectItem>
                                        <SelectItem value="birthday">🎂 Aniversário do Cliente</SelectItem>
                                        <SelectItem value="inactive">💤 Lead inativo por 7 dias</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="action">Ação (Faça...)</Label>
                                <Select name="action" defaultValue="send_whatsapp">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a ação" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="send_whatsapp">📱 Enviar WhatsApp Automático</SelectItem>
                                        <SelectItem value="send_email">📧 Enviar Sequência de Email</SelectItem>
                                        <SelectItem value="create_task">📝 Criar Tarefa para Agente</SelectItem>
                                        <SelectItem value="notify_manager">🔔 Notificar Gerente</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Salvar Fluxo</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Flows List */}
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full md:w-auto">
                    <TabsTrigger value="all">Todos os Fluxos</TabsTrigger>
                    <TabsTrigger value="active">Ativos</TabsTrigger>
                    <TabsTrigger value="paused">Pausados</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 mt-4">
                    {flows.map((flow) => (
                        <Card key={flow.id} className="transition-all hover:shadow-md border-l-4" style={{ borderLeftColor: flow.active ? '#10b981' : '#e5e7eb' }}>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full ${flow.bg} ${flow.color}`}>
                                        <flow.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                                            {flow.name}
                                            {!flow.active && <Badge variant="secondary" className="text-xs">Pausado</Badge>}
                                        </h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                            <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-700">{flow.trigger}</span>
                                            <ArrowRightIcon />
                                            <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-700">{flow.action}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden md:block">
                                        <div className="text-2xl font-bold text-gray-900">{flow.executions}</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">Execuções</div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={flow.active}
                                            onCheckedChange={() => toggleFlow(flow.id)}
                                        />
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500" onClick={() => deleteFlow(flow.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function ArrowRightIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
