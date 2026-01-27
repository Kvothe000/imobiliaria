"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Instagram, Download, Copy, Sparkles, Loader2, MapPin } from "lucide-react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { generateInstagramCaption } from "@/app/actions/ai";

interface InstagramCardModalProps {
    property: any; // Using any for MVP flexibility or strictly typed if interface available
}

export function InstagramCardModal({ property }: InstagramCardModalProps) {
    const [open, setOpen] = useState(false);
    const [template, setTemplate] = useState("modern");
    const [generatedCaption, setGeneratedCaption] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        try {
            const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `instagram-card-${property.id}.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Card baixado com sucesso!");
        } catch (err) {
            console.error(err);
            toast.error("Erro ao gerar imagem.");
        }
    };

    const handleGenerateCaption = async () => {
        setIsGenerating(true);
        try {
            const result = await generateInstagramCaption(property.title, property.address, template);
            if (result.success && result.data) {
                setGeneratedCaption(result.data);
                toast.success("Legenda gerada!");
            } else {
                toast.error("Erro ao comunicar com a IA.");
            }
        } catch (error) {
            toast.error("Erro desconhecido.");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedCaption);
        toast.success("Legenda copiada!");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-md">
                    <Instagram className="w-4 h-4 mr-2" />
                    Gerar Post Instagram
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] h-[90vh] overflow-y-auto flex flex-col md:flex-row gap-6">

                {/* Visual Preview Side */}
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 p-4 rounded-xl border">
                    <div
                        ref={cardRef}
                        className="w-[350px] h-[450px] bg-white shadow-2xl relative overflow-hidden flex flex-col text-left rounded-lg shrink-0"
                    >
                        {/* Background Image */}
                        <div className="h-[65%] w-full relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={property.image || '/placeholder.png'}
                                alt="Property"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                <div className="text-white">
                                    <p className="text-xs font-semibold uppercase tracking-widest opacity-90 mb-1">{property.type}</p>
                                    <div className="flex items-center text-sm font-medium">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        {property.city || "Cidade"}
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(property.price)}
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="flex-1 p-5 bg-white flex flex-col justify-between relative">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 leading-tight mb-2">
                                    {property.title}
                                </h2>
                                <div className="flex gap-3 text-xs text-gray-500 font-medium">
                                    <span className="bg-gray-100 px-2 py-1 rounded">{property.bedrooms} Quartos</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">{property.area}m²</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded">{property.garage} Vagas</span>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    {/* Fake Logo */}
                                    <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                                        Ti
                                    </div>
                                    <span className="text-xs font-bold text-gray-900">Titan Imóveis</span>
                                </div>
                                <span className="text-[10px] text-gray-400">Ref: {property.id}</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-4">
                        * A prévia pode variar ligeiramente da imagem final baixada.
                    </p>
                </div>

                {/* Controls Side */}
                <div className="flex-1 space-y-6 py-2">
                    <DialogHeader>
                        <DialogTitle>Estúdio de Criação Social 📸</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Estilo do Template</Label>
                            <Select value={template} onValueChange={setTemplate}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="modern">Moderno & Clean</SelectItem>
                                    <SelectItem value="elegant">Dark Luxury</SelectItem>
                                    <SelectItem value="bold">Oportunidade (Vermelho)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button onClick={handleDownload} className="w-full" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Baixar Imagem (.png)
                        </Button>

                        <div className="border-t pt-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-600" />
                                    Gerador de Legenda IA
                                </Label>
                                <Button
                                    onClick={handleGenerateCaption}
                                    disabled={isGenerating}
                                    size="sm"
                                    className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200"
                                >
                                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
                                    Gerar Legenda
                                </Button>
                            </div>

                            <div className="relative">
                                <Textarea
                                    value={generatedCaption}
                                    onChange={(e) => setGeneratedCaption(e.target.value)}
                                    placeholder="A legenda gerada aparecerá aqui..."
                                    className="min-h-[150px] text-sm pr-10"
                                />
                                {generatedCaption && (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute top-2 right-2 h-6 w-6"
                                        onClick={copyToClipboard}
                                    >
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
