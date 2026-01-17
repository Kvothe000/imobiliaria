"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTransaction } from "@/app/actions/transactions";
import { DollarSign, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

interface CloseDealModalProps {
    leadId: number;
    leadName: string;
    propertyId?: number; // Optional, might select manually if not linked
}

export function CloseDealModal({ leadId, leadName, propertyId }: CloseDealModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"input" | "success">("input");

    // Form State
    const [type, setType] = useState<"SALE" | "RENT">("SALE");
    const [value, setValue] = useState("");
    const [commissionRate, setCommissionRate] = useState("6.0");
    const [agentName, setAgentName] = useState("Corretor Padrão");
    const [selectedPropertyId, setSelectedPropertyId] = useState(propertyId?.toString() || "");

    const router = useRouter();

    const commissionValue = (parseFloat(value || "0") * parseFloat(commissionRate || "0")) / 100;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("type", type);
        formData.append("value", value);
        formData.append("commissionRate", commissionRate);
        formData.append("agentName", agentName);
        formData.append("leadId", leadId.toString());
        // For now we assume a property is linked or we need a selector. 
        // If propertyId matches comes from props, use it. Ideally we should list properties.
        // Hardcoding a fallback or using the prop.
        formData.append("propertyId", selectedPropertyId || "1");

        const res = await createTransaction(formData);

        if (res.success) {
            setStep("success");
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
            setTimeout(() => {
                setOpen(false);
                setStep("input");
                router.refresh();
            }, 3000);
        } else {
            alert("Erro ao fechar negócio");
        }
        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                    <DollarSign className="w-4 h-4" />
                    Fechar Negócio
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                {step === "input" ? (
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Fechamento de Negócio 💰</DialogTitle>
                            <DialogDescription>
                                Parabéns! Registre os detalhes da negociação com {leadName}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tipo</Label>
                                    <Select value={type} onValueChange={(v: any) => setType(v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SALE">Venda</SelectItem>
                                            <SelectItem value="RENT">Locação</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Valor Final (R$)</Label>
                                    <Input
                                        type="number"
                                        placeholder="EX: 500000"
                                        value={value}
                                        onChange={e => setValue(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Comissão (%)</Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        value={commissionRate}
                                        onChange={e => setCommissionRate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Receita (Prevista)</Label>
                                    <div className="flex h-10 w-full items-center justify-center rounded-md border border-input bg-slate-50 text-sm font-medium text-emerald-600">
                                        R$ {commissionValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Corretor Responsável</Label>
                                <Input value={agentName} onChange={e => setAgentName(e.target.value)} />
                            </div>

                            {/* Hidden fallback for property ID if not selected contextually */}
                            {!propertyId && (
                                <div className="space-y-2">
                                    <Label>ID do Imóvel (Temporário)</Label>
                                    <Input value={selectedPropertyId} onChange={e => setSelectedPropertyId(e.target.value)} placeholder="ID do Imóvel" required />
                                </div>
                            )}

                        </div>
                        <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar Venda ($$$)"}
                        </Button>
                    </form>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                        <div className="rounded-full bg-emerald-100 p-3">
                            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Sucesso!</h2>
                        <p className="text-slate-500">A venda foi registrada e a comissão calculada.</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
