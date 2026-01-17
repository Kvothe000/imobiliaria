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
import { Plus, Home, MapPin, DollarSign, List, Sparkles } from "lucide-react";
import { createProperty } from "@/app/actions/properties";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { MagicWriteButton } from "./magic-write-button";

export function CreatePropertyModal() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("basic");
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);

        // Ensure checkboxes or specific formats are handled if needed
        // For now, formData captures standard inputs correctly

        const result = await createProperty(formData);

        if (result.success) {
            setOpen(false);
            router.refresh();
            // Reset logic if needed
        } else {
            alert(result.error);
        }
        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Imóvel
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">Cadastrar Novo Imóvel 🏠</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="mt-2">
                    <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full min-h-[500px] flex flex-col">
                        <TabsList className="grid w-full grid-cols-4 mb-4">
                            <TabsTrigger value="basic">Básico</TabsTrigger>
                            <TabsTrigger value="address">Endereço</TabsTrigger>
                            <TabsTrigger value="financial">Financeiro</TabsTrigger>
                            <TabsTrigger value="features">Detalhes</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4 py-2">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Título do Anúncio (Portal)</Label>
                                <Input id="title" name="title" required placeholder="Ex: Apartamento Luxo Jardins com Vista" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="code">Código (Ref)</Label>
                                    <Input id="code" name="code" placeholder="REF-2024" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="type">Tipo</Label>
                                    <Select name="type" defaultValue="Apartamento">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Apartamento">Apartamento</SelectItem>
                                            <SelectItem value="Casa">Casa</SelectItem>
                                            <SelectItem value="Sobrado">Sobrado</SelectItem>
                                            <SelectItem value="Cobertura">Cobertura</SelectItem>
                                            <SelectItem value="Terreno">Terreno</SelectItem>
                                            <SelectItem value="Comercial">Comercial</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="image">Foto Principal URL</Label>
                                <Input id="image" name="image" placeholder="https://..." />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex justify-between items-end">
                                    <Label htmlFor="description">Descrição Completa</Label>

                                    {/* AI Controls Container */}
                                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-purple-800 flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" /> Titan AI Generator
                                            </span>
                                            <MagicWriteButton
                                                onGenerate={(text) => {
                                                    const textarea = document.getElementById('description') as HTMLTextAreaElement;
                                                    if (textarea) textarea.value = text;
                                                }}
                                                getPromptContext={() => {
                                                    // Gather data from form
                                                    const title = (document.getElementById('title') as HTMLInputElement)?.value || '';
                                                    const typeElement = document.querySelector('[name="type"]');
                                                    const type = typeElement ? (typeElement as HTMLElement).innerText : 'Imóvel'; // Crude
                                                    const district = (document.getElementById('neighborhood') as HTMLInputElement)?.value || '';
                                                    const area = (document.getElementById('area') as HTMLInputElement)?.value || '';
                                                    const beds = (document.getElementById('bedrooms') as HTMLInputElement)?.value || '';

                                                    return `Título: ${title}. Tipo: ${type}. Bairro: ${district}. Área: ${area}m². Quartos: ${beds}. Crie uma descrição vendedora.`;
                                                }}
                                            />
                                        </div>

                                    </div>
                                </div>
                                <Textarea id="description" name="description" className="h-32 text-slate-600" placeholder="O texto gerado aparecerá aqui..." />
                            </div>
                        </TabsContent>

                        <TabsContent value="address" className="space-y-4 py-2">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="zipCode">CEP</Label>
                                    <Input id="zipCode" name="zipCode" placeholder="00000-000" />
                                </div>
                                <div className="grid gap-2 col-span-2">
                                    <Label htmlFor="city">Cidade</Label>
                                    <Input id="city" name="city" placeholder="São Paulo" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="neighborhood">Bairro</Label>
                                    <Input id="neighborhood" name="neighborhood" placeholder="Jardins" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="state">Estado (UF)</Label>
                                    <Input id="state" name="state" placeholder="SP" maxLength={2} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="street">Logradouro (Rua/Av)</Label>
                                <Input id="street" name="street" placeholder="Rua Oscar Freire" />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="number">Número</Label>
                                    <Input id="number" name="number" placeholder="123" />
                                </div>
                                <div className="grid gap-2 col-span-2">
                                    <Label htmlFor="complement">Complemento</Label>
                                    <Input id="complement" name="complement" placeholder="Apto 42 Bloco B" />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="financial" className="space-y-4 py-2">
                            <div className="grid gap-4 p-4 border rounded-lg bg-emerald-50/50 border-emerald-100">
                                <div className="grid gap-2">
                                    <Label htmlFor="price" className="text-base font-semibold text-emerald-900">Valor de Venda (R$)</Label>
                                    <Input id="price" name="price" type="number" step="0.01" className="text-lg font-medium h-12" required placeholder="0,00" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="iptuPrice">IPTU (Anual)</Label>
                                    <Input id="iptuPrice" name="iptuPrice" type="number" step="0.01" placeholder="0,00" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="condoPrice">Condomínio (Mensal)</Label>
                                    <Input id="condoPrice" name="condoPrice" type="number" step="0.01" placeholder="0,00" />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="features" className="space-y-4 py-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="area">Área Útil (m²)</Label>
                                    <Input id="area" name="area" type="number" step="0.01" placeholder="100" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="totalArea">Área Total (m²)</Label>
                                    <Input id="totalArea" name="totalArea" type="number" step="0.01" placeholder="150" />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="bedrooms">Quartos</Label>
                                    <Input id="bedrooms" name="bedrooms" type="number" placeholder="0" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="suites">Suítes</Label>
                                    <Input id="suites" name="suites" type="number" placeholder="0" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="bathrooms">Banheiros</Label>
                                    <Input id="bathrooms" name="bathrooms" type="number" placeholder="0" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="garage">Vagas</Label>
                                    <Input id="garage" name="garage" type="number" placeholder="0" />
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <Label className="mb-2 block">Características do Imóvel</Label>
                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded">
                                    {/* Future: Add checkboxes for features array */}
                                    <p>Será possível selecionar itens como Piscina, Churrasqueira, etc.</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox id="publishOnPortals" name="publishOnPortals" defaultChecked />
                                <Label htmlFor="publishOnPortals">Publicar nos Portais (Zap/VivaReal)</Label>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="mt-8 flex justify-between sm:justify-between w-full">
                        <div className="flex gap-2">
                            {/* Optional: Add Back/Next buttons logic */}
                        </div>
                        <Button type="submit" disabled={loading} size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white">
                            {loading ? "Salvando..." : "Salvar Imóvel"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
}
