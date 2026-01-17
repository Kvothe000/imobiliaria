"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Loader2, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Script from "next/script";

interface LeadData {
    id: number;
    name: string;
    cpf?: string | null;
    rg?: string | null;
    nationality?: string | null;
    maritalStatus?: string | null;
    profession?: string | null;
    phone: string;
}

interface ContractModalProps {
    lead: LeadData;
}

export function ContractModal({ lead }: ContractModalProps) {
    const [loading, setLoading] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [template, setTemplate] = useState<"rental" | "sales">("rental");

    // Check if script is already loaded (for re-opens)
    useEffect(() => {
        if (typeof window !== "undefined" && (window as any).jspdf) {
            setScriptLoaded(true);
        }
    }, []);

    // Local state for missing fields (user can fill them on the fly)
    const [formData, setFormData] = useState({
        cpf: lead.cpf || "",
        rg: lead.rg || "",
        nationality: lead.nationality || "Brasileiro",
        maritalStatus: lead.maritalStatus || "Solteiro",
        profession: lead.profession || "",
        // Imóvel fake por enquanto se não tiver contexto de seleção
        propertyAddress: "Rua Exemplo, 123",
        propertyValue: "2.500,00",
        ownerName: "Proprietário Exemplo Ltda",
    });

    const handleGenerate = () => {
        if (!scriptLoaded) {
            if (typeof window !== "undefined" && (window as any).jspdf) {
                setScriptLoaded(true); // Force update if missed
            } else {
                alert("Aguarde o carregamento do gerador de PDF...");
                return;
            }
        }
        setLoading(true);
        setTimeout(() => {
            generatePDF();
            setLoading(false);
        }, 800);
    };

    const generatePDF = () => {
        try {
            // Access global jspdf loaded via CDN
            const doc = new (window as any).jspdf.jsPDF();
            const lineHeight = 7;
            let y = 20;

            // Title
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text(template === "rental" ? "CONTRATO DE LOCAÇÃO RESIDENCIAL" : "PROPOSTA DE COMPRA E VENDA", 105, y, { align: "center" });
            y += 20;

            // Body
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");

            let text = "";

            if (template === "rental") {
                text = `
Pelo presente instrumento particular, de um lado:

LOCADOR(A): ${formData.ownerName}, doravante denominado simplesmente LOCADOR.

LOCATÁRIO(A): ${lead.name}, nacionalidade ${formData.nationality}, estado civil ${formData.maritalStatus},
profissão ${formData.profession}, portador(a) do RG nº ${formData.rg} e CPF nº ${formData.cpf},
residente e domiciliado(a) neste ato.

Têm entre si justo e contratado o seguinte:

CLÁUSULA PRIMEIRA: O objeto deste contrato é o imóvel situado à:
${formData.propertyAddress}.

CLÁUSULA SEGUNDA: O valor mensal do aluguel é de R$ ${formData.propertyValue}, a ser pago
até o dia 05 de cada mês.

CLÁUSULA TERCEIRA: O prazo de locação é de 30 (trinta) meses, iniciando-se nesta data.

E por estarem justos e contratados, assinam o presente em 02 (duas) vias de igual teor.
                `;
            } else {
                text = `
PROPOSTA DE AQUISIÇÃO DE IMÓVEL

PROPONENTE COMPRADOR(A): ${lead.name}, nacionalidade ${formData.nationality}, estado civil ${formData.maritalStatus},
profissão ${formData.profession}, portador(a) do RG nº ${formData.rg} e CPF nº ${formData.cpf}.

VENDEDOR(A): ${formData.ownerName}.

OBJETO: Imóvel situado à ${formData.propertyAddress}.

VALOR DA PROPOSTA: R$ ${formData.propertyValue} (Valor à Vista / Financiado).

CONDIÇÕES DE PAGAMENTO:
1. Sinal de 10% no ato da assinatura do Compromisso.
2. Saldo restante via Financiamento Bancário.

VALIDADE DA PROPOSTA: 05 (cinco) dias úteis.

São Paulo, na data abaixo assinada.
                `;
            }

            const splitText = doc.splitTextToSize(text, 170);
            doc.text(splitText, 20, y);

            y += (splitText.length * lineHeight) + 30;

            // Date
            const today = format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
            doc.text(`São Paulo, ${today}`, 105, y, { align: "center" });

            y += 40;

            // Signatures
            doc.line(30, y, 90, y);
            doc.line(120, y, 180, y);
            y += 5;
            doc.setFontSize(10);
            if (template === "rental") {
                doc.text("LOCADOR", 60, y, { align: "center" });
                doc.text("LOCATÁRIO", 150, y, { align: "center" });
            } else {
                doc.text("VENDEDOR", 60, y, { align: "center" });
                doc.text("COMPRADOR", 150, y, { align: "center" });
            }

            doc.save(`${template === 'rental' ? 'Contrato' : 'Proposta'}_${lead.name.replace(/\s/g, '_')}.pdf`);
        } catch (error) {
            console.error(error);
            alert("Erro ao gerar PDF.");
        }
    };

    return (
        <Dialog>
            <Script
                src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
                strategy="lazyOnload"
                onLoad={() => setScriptLoaded(true)}
            />
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2 border-emerald-200 hover:bg-emerald-50 text-emerald-700">
                    <FileText className="w-4 h-4" />
                    Gerar Contrato
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Gerar Contrato para {lead.name}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                        <Button
                            variant={template === "rental" ? "default" : "ghost"}
                            className={`flex-1 ${template === "rental" ? "bg-emerald-600" : ""}`}
                            onClick={() => setTemplate("rental")}
                        >
                            Locação
                        </Button>
                        <Button
                            variant={template === "sales" ? "default" : "ghost"}
                            className="flex-1"
                            onClick={() => setTemplate("sales")}
                        >
                            Venda
                        </Button>
                    </div>

                    <div className="space-y-3 border p-4 rounded-md bg-slate-50">
                        <Label className="text-xs font-semibold text-gray-500 uppercase">Dados Faltantes para o Contrato</Label>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label htmlFor="cpf">CPF</Label>
                                <Input id="cpf" value={formData.cpf} onChange={e => setFormData({ ...formData, cpf: e.target.value })} placeholder="000.000.000-00" />
                            </div>
                            <div>
                                <Label htmlFor="rg">RG</Label>
                                <Input id="rg" value={formData.rg} onChange={e => setFormData({ ...formData, rg: e.target.value })} placeholder="00.000.000-X" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label htmlFor="marital">Estado Civil</Label>
                                <Input id="marital" value={formData.maritalStatus} onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })} />
                            </div>
                            <div>
                                <Label htmlFor="profession">Profissão</Label>
                                <Input id="profession" value={formData.profession} onChange={e => setFormData({ ...formData, profession: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Imóvel Selecionado</Label>
                        <Input value={formData.propertyAddress} onChange={e => setFormData({ ...formData, propertyAddress: e.target.value })} />
                    </div>

                    <Button onClick={handleGenerate} disabled={loading || !scriptLoaded} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-2">
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                        {!scriptLoaded ? "Carregando Gerador..." : (loading ? "Gerando PDF..." : "Baixar PDF Assinável")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
