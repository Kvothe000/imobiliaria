"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Loader2 } from "lucide-react";
import { createWebLead } from "@/app/actions/leads";
import { toast } from "sonner";

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyTitle: string;
    propertyCode: string | number;
    destinationUrl: string;
}

export function LeadCaptureModal({ isOpen, onClose, propertyTitle, propertyCode, destinationUrl }: LeadCaptureModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // 1. Save Lead to CRM
        const result = await createWebLead({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            interest: `Imóvel: ${propertyTitle} (Ref: ${propertyCode})`
        });

        setIsLoading(false);

        if (result.success) {
            toast.success("Contato registrado! Redirecionando para o WhatsApp...");
            // 2. Open WhatsApp
            window.open(destinationUrl, '_blank');
            onClose();
        } else {
            toast.error("Erro ao registrar. Tente novamente ou use o link direto.");
            // Optional: Open WhatsApp anyway if error? 
            // window.open(destinationUrl, '_blank');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Quase lá! 🚀</DialogTitle>
                    <DialogDescription>
                        Informe seus dados para que nosso corretor possa identificar seu atendimento com prioridade.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                            id="name"
                            required
                            placeholder="Seu nome"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefone / WhatsApp *</Label>
                        <Input
                            id="phone"
                            required
                            type="tel"
                            placeholder="(11) 99999-9999"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail (Opcional)</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        />
                    </div>

                    <DialogFooter className="flex-col sm:flex-col gap-2">
                        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2" disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                            Enviar e ir para WhatsApp
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full text-xs text-muted-foreground"
                            onClick={() => {
                                window.open(destinationUrl, '_blank');
                                onClose();
                            }}
                        >
                            Pular e ir direto para o WhatsApp (Sem prioridade)
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
