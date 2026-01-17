"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createTransaction } from "@/app/actions/transactions";
import { getAvailablePropertiesSelect } from "@/app/actions/properties";
import { getAgents } from "@/app/actions/users";
import { Loader2, DollarSign } from "lucide-react";
import { toast } from "sonner";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface CloseDealModalProps {
    isOpen: boolean;
    onClose: () => void;
    leadId: number;
    leadName: string;
    propertyId?: number; // Optional, might select manually if not linked
    initialValue?: number;
}

export function CloseDealModal({
    isOpen,
    onClose,
    leadId,
    leadName,
    propertyId: initialPropertyId,
    initialValue = 0,
}: CloseDealModalProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { width, height } = useWindowSize();

    const [value, setValue] = useState(initialValue);
    const [type, setType] = useState("Venda");
    const [commissionRate, setCommissionRate] = useState(6.0);
    const [agentName, setAgentName] = useState("Matheus Titan"); // Fallback
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | undefined>(initialPropertyId);

    // Data Lists
    const [availableProperties, setAvailableProperties] = useState<{ id: number, title: string, price: number, code: string | null }[]>([]);
    const [agents, setAgents] = useState<{ id: string, name: string }[]>([]);

    useEffect(() => {
        if (isOpen) {
            // Fetch properties
            getAvailablePropertiesSelect().then(res => {
                if (res.success && res.data) {
                    setAvailableProperties(res.data);
                }
            });
            // Fetch Agents
            getAgents().then(res => {
                if (res.success && res.data) {
                    const validAgents = res.data
                        .filter(a => a.name !== null)
                        .map(a => ({ id: a.id, name: a.name as string }));

                    setAgents(validAgents);
                    // Pre-select first agent if available
                    if (validAgents.length > 0) setAgentName(validAgents[0].name);
                }
            });
        }
    }, [isOpen]);

    // Update value when property is selected
    const handlePropertySelect = (idStr: string) => {
        const id = parseInt(idStr);
        setSelectedPropertyId(id);
        const prop = availableProperties.find(p => p.id === id);
        if (prop) {
            setValue(prop.price);
        }
    };

    // Derived calculations
    const totalCommission = value * (commissionRate / 100);
    const agentShare = totalCommission * 0.4; // 40% fixo por enquanto
    const agencyShare = totalCommission - agentShare;

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

    const handleSubmit = async () => {
        if (!selectedPropertyId) {
            toast.error("Selecione o imóvel negociado.");
            return;
        }
        if (loading || success) return; // Prevent double submit

        setLoading(true);
        const formData = new FormData();
        formData.append("type", type);
        formData.append("value", value.toString());
        formData.append("commissionRate", commissionRate.toString());
        formData.append("agentName", agentName);
        formData.append("propertyId", selectedPropertyId.toString());
        formData.append("leadId", leadId.toString());

        try {
            const res = await createTransaction(formData);

            if (res.success) {
                setSuccess(true);
                toast.success("Negócio fechado com sucesso! 🚀");
                setTimeout(() => {
                    // Force reload to update all dashboards
                    window.location.reload();
                }, 4000);
            } else {
                toast.error(res.error || "Erro ao fechar negócio.");
                setLoading(false); // Only reset loading on error
            }
        } catch (error) {
            toast.error("Erro desconhecido.");
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {success && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}
            <Dialog open={isOpen} onOpenChange={(open) => {
                // Prevent closing if showing success animation or loading
                if ((loading || success) && !open) return;
                onClose();
            }}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl text-emerald-700">
                            <DollarSign className="h-8 w-8" /> Fechamento de Negócio
                        </DialogTitle>
                        <DialogDescription>
                            Parabéns! Registre os detalhes financeiros da transação com {leadName}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        {/* Property Select */}
                        <div className="space-y-2">
                            <Label>Imóvel Negociado</Label>
                            <Select onValueChange={handlePropertySelect} value={selectedPropertyId?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o imóvel..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableProperties.map(prop => (
                                        <SelectItem key={prop.id} value={prop.id.toString()}>
                                            {prop.code ? `[${prop.code}] ` : ''}{prop.title} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prop.price)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tipo de Transação</Label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Venda">Venda</SelectItem>
                                        <SelectItem value="Aluguel">Aluguel</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Valor Total (VGV)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-500">R$</span>
                                    <Input
                                        type="number"
                                        value={value}
                                        onChange={(e) => setValue(Number(e.target.value))}
                                        className="pl-10 font-bold text-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 border rounded-lg p-4 bg-slate-50">
                            <div className="flex justify-between items-center">
                                <Label>Comissão (%)</Label>
                                <Input
                                    type="number"
                                    value={commissionRate}
                                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                                    className="w-24 text-right"
                                    step="0.1"
                                />
                            </div>

                            <div className="space-y-2 pt-2 border-t">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Comissão Total:</span>
                                    <span className="font-semibold">{formatCurrency(totalCommission)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Repasse Corretor (40%):</span>
                                    <span className="font-semibold text-orange-600">{formatCurrency(agentShare)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span className="text-emerald-800">Receita Imobiliária:</span>
                                    <span className="text-emerald-700">{formatCurrency(agencyShare)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Corretor Responsável</Label>
                            {agents.length > 0 ? (
                                <Select value={agentName} onValueChange={setAgentName}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o corretor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {agents.map(agent => (
                                            <SelectItem key={agent.id} value={agent.name}>
                                                {agent.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Input value={agentName} onChange={(e) => setAgentName(e.target.value)} />
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={onClose} disabled={loading || success}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading || success || value <= 0 || !selectedPropertyId}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirmar Fechamento
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
