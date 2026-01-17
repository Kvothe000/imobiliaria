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
import { Plus } from "lucide-react";
import { createLead } from "@/app/actions/leads";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


export function CreateLeadModal() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        const result = await createLead(formData);

        if (result.success) {
            setOpen(false);
            router.refresh();
        } else {
            alert(result.error);
        }
        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Lead
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                    <DialogDescription>
                        Cadastre um novo lead manualmente no pipeline.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome do Cliente</Label>
                            <Input id="name" name="name" required placeholder="Ex: João Silva" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">WhatsApp / Telefone</Label>
                            <Input id="phone" name="phone" required placeholder="(11) 99999-9999" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email (Opcional)</Label>
                            <Input id="email" name="email" type="email" placeholder="cliente@email.com" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="interest">Interesse</Label>
                            <Input id="interest" name="interest" placeholder="Ex: Apartamento 3 quartos..." />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="source">Origem</Label>
                            <Select name="source" defaultValue="Manual">
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a origem" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Manual">Cadastro Manual</SelectItem>
                                    <SelectItem value="Indicação">Indicação</SelectItem>
                                    <SelectItem value="Instagram">Instagram</SelectItem>
                                    <SelectItem value="Site">Site</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Cadastrar" : "Adicionar Lead"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
