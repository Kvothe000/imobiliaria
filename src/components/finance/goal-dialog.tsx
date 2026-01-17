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
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateBrokerGoal } from "@/app/actions/users";
import { Target, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface GoalDialogProps {
    brokerId: string;
    brokerName: string;
    currentGoal: number;
}

export function GoalDialog({ brokerId, brokerName, currentGoal }: GoalDialogProps) {
    const [goal, setGoal] = useState(currentGoal);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        const res = await updateBrokerGoal(brokerId, Number(goal));
        setLoading(false);

        if (res.success) {
            toast.success("Meta atualizada com sucesso!");
            setIsOpen(false);
        } else {
            toast.error("Erro ao atualizar meta.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Target className="h-4 w-4 text-muted-foreground hover:text-emerald-600" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Definir Meta de Vendas</DialogTitle>
                    <DialogDescription>
                        Ajuste a meta mensal de vendas para {brokerName}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="goal" className="text-right">
                            Meta (R$)
                        </Label>
                        <Input
                            id="goal"
                            type="number"
                            value={goal}
                            onChange={(e) => setGoal(Number(e.target.value))}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar Alterações
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
