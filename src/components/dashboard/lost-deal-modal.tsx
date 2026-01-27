"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";
import { updateLead } from "@/app/actions/leads";
import { toast } from "sonner";

interface LostDealModalProps {
    isOpen: boolean;
    onClose: () => void;
    leadId: number;
    leadName: string;
    onSuccess?: () => void;
}

const LOST_REASONS = [
    "Preço Alto",
    "Localização Indesejada",
    "Comprou com Concorrente",
    "Desistiu da Compra",
    "Financeiro Reprovado",
    "Outro"
];

export function LostDealModal({ isOpen, onClose, leadId, leadName, onSuccess }: LostDealModalProps) {
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState<string>("");
    const [notes, setNotes] = useState("");

    const handleSubmit = async () => {
        if (!reason) {
            toast.error("Por favor, selecione um motivo.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("id", leadId.toString());
        formData.append("status", "Perdido"); // Update Status
        // We will need to leverage updateLead correctly.
        // updateLead expects all fields usually, so we might need a dedicated `markLeadAsLost` action or assume partial update if we tweak `leads.ts` or passing partials works if DB allows.
        // Actually, looking at `updateLead` in leads.ts, it destructures everything. Passing just ID and Status might wipe other fields if not handled!
        // Safer to use a new action `markLeadAsLost`.

        // For now, let's assume we call a specific client-side wrapper or server action.
        // Let's create `markLeadAsLost` in `leads.ts` for safety in next step.
        // We'll call `markLeadAsLost(leadId, reason, notes)`.

        try {
            // Temporary: using updateLead but it might be risky without fetching current data.
            // Better Plan: Call `updateLeadStage` but we also want to save the REASON.
            // I will create `markLeadLost` action in next step. This component will use it.
            const res = await markLeadLostAction(leadId, reason, notes);

            if (res.success) {
                toast.success("Lead marcado como perdido.");
                onSuccess?.();
                onClose();
            } else {
                toast.error("Erro ao atualizar.");
            }
        } catch (error) {
            toast.error("Erro interno.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !loading && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-rose-600">
                        <AlertCircle className="h-5 w-5" /> Motivo da Perda
                    </DialogTitle>
                    <DialogDescription>
                        Por que o negócio com <b>{leadName}</b> não deu certo?
                        Essa informação é crucial para melhorarmos.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label>Motivo Principal</Label>
                        <Select onValueChange={setReason} value={reason}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                                {LOST_REASONS.map((r) => (
                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Observações Adicionais</Label>
                        <Textarea
                            placeholder="Detalhes sobre o motivo..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleSubmit}
                        disabled={loading || !reason}
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirmar Perda
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Temporary bridge until we define the action
async function markLeadLostAction(id: number, reason: string, notes: string) {
    // We will implement this in `leads.ts`
    // Importing dynamically to avoid circle issues if in same file? standard import is fine.
    const { markLeadAsLost } = await import("@/app/actions/leads");
    return markLeadAsLost(id, reason, notes);
}
