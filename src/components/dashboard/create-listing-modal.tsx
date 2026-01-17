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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createListing } from "@/app/actions/listings"; // Server Action
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "../image-upload"; // Import ImageUpload
import { MagicWriteButton } from "../magic-write-button";

interface CreateListingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateListingModal({ isOpen, onClose }: CreateListingModalProps) {
    const [loading, setLoading] = useState(false);

    // Form State
    const [ownerName, setOwnerName] = useState("");
    const [ownerPhone, setOwnerPhone] = useState("");
    const [address, setAddress] = useState("");
    const [expectedValue, setExpectedValue] = useState("");
    const [notes, setNotes] = useState("");
    const [images, setImages] = useState<string[]>([]); // New state for images

    const handleSubmit = async () => {
        if (!ownerName || !address) {
            toast.error("Nome e Endereço são obrigatórios.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("ownerName", ownerName);
        formData.append("ownerPhone", ownerPhone);
        formData.append("address", address);
        formData.append("expectedValue", expectedValue);
        formData.append("notes", notes);
        // Pass images as JSON string
        formData.append("images", JSON.stringify(images));

        try {
            const res = await createListing(formData);
            if (res.success) {
                toast.success("Captação criada com sucesso! 🕵️‍♂️");
                onClose();
                // Reset form
                setOwnerName("");
                setOwnerPhone("");
                setAddress("");
                setExpectedValue("");
                setNotes("");
                setImages([]);
            } else {
                toast.error(res.error || "Erro ao criar captação.");
            }
        } catch (error) {
            toast.error("Erro inesperado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-indigo-700">
                        <UserPlus className="h-6 w-6" /> Nova Captação
                    </DialogTitle>
                    <DialogDescription>
                        Registre um novo proprietário e imóvel em fase de agenciamento.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4 overflow-y-auto px-1">
                    <div className="space-y-2">
                        <Label>Nome do Proprietário *</Label>
                        <Input
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            placeholder="Ex: Sr. João da Silva"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Telefone / WhatsApp</Label>
                            <Input
                                value={ownerPhone}
                                onChange={(e) => setOwnerPhone(e.target.value)}
                                placeholder="(11) 99999-9999"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Valor Pretendido (R$)</Label>
                            <Input
                                type="number"
                                value={expectedValue}
                                onChange={(e) => setExpectedValue(e.target.value)}
                                placeholder="0,00"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Endereço do Imóvel *</Label>
                        <Input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Rua das Acácias, 123"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Fotos da Captação 📷</Label>
                        <ImageUpload
                            value={images}
                            onChange={setImages}
                            onRemove={(url) => setImages(images.filter((i) => i !== url))}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label>Observações</Label>
                            <MagicWriteButton
                                onGenerate={(text) => setNotes(text)}
                                getPromptContext={() => {
                                    return `Imóvel: ${address}. Proprietário: ${ownerName}. Valor: R$ ${expectedValue}.`;
                                }}
                            />
                        </div>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Detalhes sobre a negociação..."
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !ownerName || !address}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar Captação
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
