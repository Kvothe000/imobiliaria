"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Sparkles } from "lucide-react";
import { updateProperty } from "@/app/actions/properties";
import { PriceEstimator } from "./properties/price-estimator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"


interface Property {
    id: number;
    title: string;
    address: string;
    price: number;
    type: string;
    status: string;
    image: string | null;
    bedrooms: number;
    bathrooms: number;
    garage: number;
    area: number;
    description: string | null;
}

export function EditPropertyModal({ property, children }: { property: Property, children?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        const result = await updateProperty(formData);

        if (result.success) {
            setOpen(false);
        } else {
            alert(result.error);
        }
        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="ghost" size="sm">
                        <Pencil className="w-4 h-4 mr-2" />
                        Editar
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar Imóvel #{property.id}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="id" value={property.id} />
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Título</Label>
                                <Input id="title" name="title" defaultValue={property.title} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select name="status" defaultValue={property.status}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Disponível">Disponível</SelectItem>
                                        <SelectItem value="Vendido">Vendido</SelectItem>
                                        <SelectItem value="Reservado">Reservado</SelectItem>
                                        <SelectItem value="Indisponível">Indisponível</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price">Preço (R$)</Label>
                                <div className="space-y-1">
                                    <Input id="price" name="price" type="number" step="0.01" defaultValue={property.price} required />
                                    <PriceEstimator
                                        propertyDetails={{
                                            area: property.area,
                                            bedrooms: property.bedrooms,
                                            garage: property.garage,
                                            type: property.type,
                                            location: property.address
                                        }}
                                        onPriceEstimated={(price) => {
                                            const priceInput = document.getElementById('price') as HTMLInputElement;
                                            if (priceInput) priceInput.value = price.toString();
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="area">Área (m²)</Label>
                                <Input id="area" name="area" type="number" step="0.01" defaultValue={property.area} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address">Endereço</Label>
                            <Input id="address" name="address" defaultValue={property.address} required />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="bedrooms">Quartos</Label>
                                <Input id="bedrooms" name="bedrooms" type="number" defaultValue={property.bedrooms} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="bathrooms">Banheiros</Label>
                                <Input id="bathrooms" name="bathrooms" type="number" defaultValue={property.bathrooms} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="garage">Vagas</Label>
                                <Input id="garage" name="garage" type="number" defaultValue={property.garage} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type">Tipo</Label>
                            <Input id="type" name="type" defaultValue={property.type} required />
                        </div>


                        <div className="grid gap-2">
                            <Label htmlFor="image">Foto URL</Label>
                            <Input id="image" name="image" defaultValue={property.image || ''} />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="description">Descrição</Label>

                                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-purple-800 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> Titan AI <span className="text-[10px] font-normal opacity-70">(Editor)</span>
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label className="text-[10px] uppercase text-gray-500 font-bold">Tom</Label>
                                            <Select name="ai-tone-edit" defaultValue="profissional">
                                                <SelectTrigger className="h-7 bg-white text-xs"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="profissional">👔 Profissional</SelectItem>
                                                    <SelectItem value="luxuoso">💎 Luxuoso</SelectItem>
                                                    <SelectItem value="poetico">🌹 Poético</SelectItem>
                                                    <SelectItem value="urgente">🔥 Oportunidade</SelectItem>
                                                    <SelectItem value="minimalista">✨ Minimalista</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label className="text-[10px] uppercase text-gray-500 font-bold">Extra</Label>
                                            <Input id="ai-context-edit" placeholder="Ex: Reformado..." className="h-7 bg-white text-xs" />
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        size="sm"
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white h-7 text-xs"
                                        onClick={() => {
                                            const type = (document.getElementById('type') as HTMLInputElement)?.value || 'Imóvel';
                                            const title = (document.getElementById('title') as HTMLInputElement)?.value;
                                            const address = (document.getElementById('address') as HTMLInputElement)?.value;
                                            const area = (document.getElementById('area') as HTMLInputElement)?.value;
                                            const beds = (document.getElementById('bedrooms') as HTMLInputElement)?.value;
                                            const garage = (document.getElementById('garage') as HTMLInputElement)?.value;
                                            const district = address?.split(',')[1]?.trim() || '';

                                            // Get AI Params
                                            const toneElement = document.querySelector('[name="ai-tone-edit"]') as HTMLButtonElement;
                                            let tone = toneElement?.innerText?.toLowerCase() || 'profissional';
                                            if (tone.includes('luxuoso')) tone = 'luxuoso';
                                            if (tone.includes('poético')) tone = 'poetico';
                                            if (tone.includes('oportunidade')) tone = 'urgente';
                                            if (tone.includes('minimalista')) tone = 'minimalista';
                                            if (tone.includes('profissional')) tone = 'profissional';

                                            const extraContext = (document.getElementById('ai-context-edit') as HTMLInputElement)?.value;

                                            // Simplified Templates for Edit Mode
                                            const templates: Record<string, string> = {
                                                profissional: `Oportunidade: ${title}. ${type} com ${area}m² em ${district}. ${beds} dormitórios, ${garage} vagas. Excelente estado de conservação.`,
                                                luxuoso: `Viva com classe neste ${type} em ${district}. Acabamentos premium, ${area}m² de sofisticação e conforto absoluto. ${title} espera por você.`,
                                                poetico: `${title}. Um refúgio em ${district} onde cada detalhe encanta. ${area}m² de pura harmonia. Sinta-se em casa.`,
                                                urgente: `🔥 ATENÇÃO: ${title} abaixo do valor! ${area}m² em ${district}. Venda rápida! Agende agora ou perca essa chance.`,
                                                minimalista: `${title} - ${district}. ${area}m². ${beds} Quartos. ${garage} Vagas. Disponível.`
                                            };

                                            let finalText = templates[tone] || templates['profissional'];
                                            if (extraContext) finalText += `\nObs: ${extraContext}`;

                                            const textarea = document.getElementById('description') as HTMLTextAreaElement;
                                            if (textarea) textarea.value = finalText;
                                        }}
                                    >
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        Gerar Novo Texto
                                    </Button>

                                    {/* Restore Hidden Input if previously used logic relied on it closing */}
                                </div>

                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={property.description || ''}
                                    placeholder="Descrição do imóvel..."
                                    className="h-32 text-slate-600"
                                />
                            </div>
                        </div>

                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
