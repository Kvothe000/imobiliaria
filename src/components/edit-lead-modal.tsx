"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateLead, deleteLead, createSelection } from "@/app/actions/leads";
import { getMatchingProperties } from "@/app/actions/properties";
import { useRouter } from "next/navigation";
import { Trash2, Send, ExternalLink, Link2, Copy, Check, Calendar as CalendarIcon } from "lucide-react";
import { ContractModal } from "@/components/contract-modal";
import { CloseDealModal } from "@/components/close-deal-modal";
import { ScheduleVisitModal } from "@/components/schedule-visit-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

interface Lead {
    id: number;
    name: string;
    phone: string;
    interest: string | null;
    status: string;
    source: string;
    email: string | null;
    // New Fields
    cpf?: string | null;
    rg?: string | null;
    nationality?: string | null;
    maritalStatus?: string | null;
    profession?: string | null;
    pipelineStage: string;
    score?: number;
}

interface Property {
    id: number;
    title: string;
    price: number;
    image: string | null;
}

import { calculateLeadScore } from "@/app/actions/ai";
import { Loader2, Sparkles } from "lucide-react";

export function EditLeadModal({ lead, open, setOpen }: { lead: Lead, open: boolean, setOpen: (open: boolean) => void }) {
    const [loading, setLoading] = useState(false);
    const [matches, setMatches] = useState<Property[]>([]);
    const [loadingMatches, setLoadingMatches] = useState(false);

    // Score Logic
    const [leadScore, setLeadScore] = useState(lead.score || 50);
    const [calculatingScore, setCalculatingScore] = useState(false);

    useEffect(() => {
        setLeadScore(lead.score || 50);
    }, [lead]);

    const handleAiScore = async () => {
        setCalculatingScore(true);
        // Mock budget for now or extract from interest string if possible
        const result = await calculateLeadScore(lead.name, lead.interest || "", 0);
        if (result.success && result.data !== undefined) {
            setLeadScore(result.data);
        } else {
            alert("Erro ao calcular score");
        }
        setCalculatingScore(false);
    };

    // Selection Logic
    const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);
    const [copying, setCopying] = useState(false);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (open && lead.interest) {
            setLoadingMatches(true);
            getMatchingProperties(lead.interest).then(res => {
                if (res.success && res.data) {
                    setMatches(res.data as any);
                }
                setLoadingMatches(false);
            });
        }
        // Reset state when opening
        setSelectedProperties([]);
        setGeneratedLink(null);
    }, [open, lead.interest]);

    const toggleSelection = (id: number) => {
        setSelectedProperties(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handleGenerateLink = async () => {
        if (selectedProperties.length === 0) return;
        setLoading(true);
        const result = await createSelection(selectedProperties, lead.id);
        if (result.success && result.slug) {
            setGeneratedLink(`${window.location.origin}/share/${result.slug}`);
        } else {
            alert("Erro ao gerar link");
        }
        setLoading(false);
    };

    const copyToClipboard = () => {
        if (!generatedLink) return;
        navigator.clipboard.writeText(generatedLink);
        setCopying(true);
        setTimeout(() => setCopying(false), 2000);
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        const result = await updateLead(formData);

        if (result.success) {
            setOpen(false);
            router.refresh();
        } else {
            alert(result.error);
        }
        setLoading(false);
    }

    async function handleDelete() {
        if (!confirm("Tem certeza que deseja excluir este lead?")) return;
        setLoading(true);
        const result = await deleteLead(lead.id);
        if (result.success) {
            setOpen(false);
            router.refresh();
        } else {
            alert(result.error);
        }
        setLoading(false);
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[600px] h-[650px] flex flex-col">
                    <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <DialogTitle>Gerenciar Lead: {lead.name}</DialogTitle>
                        <div className="flex gap-2 ml-auto pr-8">
                            <CloseDealModal leadId={lead.id} leadName={lead.name} />
                            <ContractModal lead={lead} />
                            <Button
                                size="sm"
                                variant="outline"
                                className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                onClick={() => setIsScheduleOpen(true)}
                            >
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                Agendar
                            </Button>
                        </div>
                    </DialogHeader>

                    <Tabs defaultValue="data" className="flex-1 flex flex-col min-h-0">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="data">Dados do Cliente</TabsTrigger>
                            <TabsTrigger value="opportunities">Oportunidades 🎯</TabsTrigger>
                        </TabsList>

                        <TabsContent value="data" className="flex-1 overflow-y-auto pr-2">
                            <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                <input type="hidden" name="id" value={lead.id} />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nome Completo</Label>
                                        <Input id="name" name="name" defaultValue={lead.name} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Telefone (WhatsApp)</Label>
                                        <Input id="phone" name="phone" defaultValue={lead.phone} required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" defaultValue={lead.email || ""} />
                                </div>

                                {/* Contract Data Fields */}
                                <div className="p-4 bg-slate-50 rounded-lg space-y-4 border border-slate-100">
                                    <h4 className="text-sm font-semibold text-slate-700">Dados para Contrato (Opcional)</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="cpf">CPF</Label>
                                            <Input id="cpf" name="cpf" defaultValue={lead.cpf || ""} placeholder="000.000.000-00" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="rg">RG</Label>
                                            <Input id="rg" name="rg" defaultValue={lead.rg || ""} placeholder="00.000.000-0" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="nationality">Nacionalidade</Label>
                                            <Input id="nationality" name="nationality" defaultValue={lead.nationality || "Brasileiro(a)"} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="maritalStatus">Estado Civil</Label>
                                            <Select name="maritalStatus" defaultValue={lead.maritalStatus || "solteiro"}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                                                    <SelectItem value="casado">Casado(a)</SelectItem>
                                                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                                                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="profession">Profissão</Label>
                                            <Input id="profession" name="profession" defaultValue={lead.profession || ""} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="interest">Interesse (Bairros, Características)</Label>
                                    <Input id="interest" name="interest" defaultValue={lead.interest || ""} />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="score">Temperatura do Lead (Score: {leadScore})</Label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleAiScore}
                                            disabled={calculatingScore}
                                            className="text-xs text-purple-600 hover:bg-purple-50"
                                        >
                                            {calculatingScore ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                                            {calculatingScore ? "Calculando..." : "Calcular com IA"}
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-blue-500 font-bold">Frio</span>
                                        <input
                                            type="range"
                                            name="score"
                                            id="score"
                                            min="0"
                                            max="100"
                                            value={leadScore}
                                            onChange={(e) => setLeadScore(parseInt(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                        />
                                        <span className="text-xs text-red-500 font-bold">Quente</span>
                                    </div>
                                    <input type="hidden" name="score" value={leadScore} />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select name="status" defaultValue={lead.status}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="novo">Novo</SelectItem>
                                                <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
                                                <SelectItem value="visita_agendada">Visita Agendada</SelectItem>
                                                <SelectItem value="proposta">Proposta</SelectItem>
                                                <SelectItem value="fechado">Fechado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="source">Origem</Label>
                                        <Input id="source" name="source" defaultValue={lead.source} readOnly className="bg-gray-100" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pipelineStage">Etapa (Kanban)</Label>
                                        <Select name="pipelineStage" defaultValue={lead.pipelineStage || "new"}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="new">Novos</SelectItem>
                                                <SelectItem value="contacted">Em Contato</SelectItem>
                                                <SelectItem value="viewing">Visitas</SelectItem>
                                                <SelectItem value="negotiation">Propostas</SelectItem>
                                                <SelectItem value="closed">Fechado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex justify-between pt-4">
                                    <Button type="button" variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
                                        <Trash2 className="w-4 h-4 mr-2" /> Excluir
                                    </Button>
                                    <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                                        {loading ? "Salvando..." : "Salvar Alterações"}
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>

                        <TabsContent value="opportunities" className="flex-1 overflow-y-auto">
                            <div className="space-y-4 py-4">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                                    <h4 className="font-semibold text-blue-800 flex items-center mb-2">
                                        <Link2 className="w-4 h-4 mr-2" />
                                        Link Mágico (Seleção de Imóveis)
                                    </h4>
                                    <p className="text-sm text-blue-600 mb-4">
                                        Selecione os imóveis abaixo que combinam com o perfil de {lead.name} e gere um link personalizado.
                                    </p>

                                    {generatedLink ? (
                                        <div className="flex items-center gap-2 bg-white p-2 rounded border border-blue-200">
                                            <code className="text-xs flex-1 text-gray-600 truncate">{generatedLink}</code>
                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={copyToClipboard}>
                                                {copying ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                                                <Link href={generatedLink} target="_blank">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            size="sm"
                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                            disabled={loading || selectedProperties.length === 0}
                                            onClick={handleGenerateLink}
                                        >
                                            {loading ? "Gerando..." : `Gerar Link com ${selectedProperties.length} imóveis`}
                                        </Button>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wider">Imóveis Compatíveis ({matches.length})</h4>
                                    {loadingMatches ? (
                                        <div className="text-center py-8 text-gray-500">Buscando imóveis compatíveis...</div>
                                    ) : matches.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-2">
                                            {matches.map(property => (
                                                <div
                                                    key={property.id}
                                                    className={`
                                                        flex items-center p-2 rounded-lg border cursor-pointer transition-all
                                                        ${selectedProperties.includes(property.id)
                                                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                                            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}
                                                    `}
                                                    onClick={() => toggleSelection(property.id)}
                                                >
                                                    <div className="h-12 w-12 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                                                        {property.image ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img src={property.image} alt="" className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-slate-400">🏠</div>
                                                        )}
                                                    </div>
                                                    <div className="ml-3 flex-1 overflow-hidden">
                                                        <h5 className="text-sm font-medium truncate">{property.title}</h5>
                                                        <p className="text-xs text-green-600 font-semibold">
                                                            {property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                        </p>
                                                    </div>
                                                    <div className="ml-2">
                                                        {selectedProperties.includes(property.id) && (
                                                            <Check className="w-4 h-4 text-blue-600" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500 bg-slate-50 rounded-lg border border-dashed">
                                            Nenhum imóvel encontrado com o perfil "{lead.interest}".
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog >

            {/* Sub-modals */}
            < ScheduleVisitModal
                leadId={lead.id}
                leadName={lead.name}
                open={isScheduleOpen}
                setOpen={setIsScheduleOpen}
            />
        </>
    );
}
