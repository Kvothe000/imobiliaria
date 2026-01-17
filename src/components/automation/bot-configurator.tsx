"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical, MessageCircleQuestion } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Question = {
    id: string;
    text: string;
    type: "text" | "options" | "budget" | "location";
    options?: string[]; // For 'options' type
};

const INITIAL_QUESTIONS: Question[] = [
    { id: "1", text: "Olá! Sou o assistente virtual da Titan. Com quem eu falo?", type: "text" },
    { id: "2", text: "Prazer! Para melhor te atender, qual o seu objetivo principal?", type: "options", options: ["Comprar para Morar", "Investir", "Alugar", "Vender meu Imóvel"] },
    { id: "3", text: "Entendi. E qual tipo de imóvel você procura?", type: "options", options: ["Apartamento", "Casa / Sobrado", "Cobertura", "Terreno", "Comercial"] },
    { id: "4", text: "Tem alguma localização ou bairro específico em mente?", type: "location" },
    { id: "5", text: "Sobre valores, qual faixa de investimento você planeja?", type: "budget" },
    { id: "6", text: "E como você pretende fazer o pagamento?", type: "options", options: ["À Vista (Recursos Próprios)", "Financiamento Bancário", "Permuta (Troca)", "Parcelamento Direto"] },
    { id: "7", text: "Para finalizar: quando você pretender se mudar/investir?", type: "options", options: ["Imediato / Urgente", "Nos próximos 3 meses", "Estou apenas pesquisando", "Indefinido"] },
];

export function BotConfigurator() {
    const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);

    const addQuestion = () => {
        const newId = (questions.length + 1).toString();
        setQuestions([...questions, { id: newId, text: "Nova pergunta...", type: "text" }]);
    };

    const removeQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const updateQuestion = (id: string, field: keyof Question, value: any) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {questions.map((q, index) => (
                    <div key={q.id} className="flex gap-4 items-start p-4 bg-white border border-gray-100 rounded-lg shadow-sm group hover:border-emerald-200 transition-colors">
                        <div className="mt-3 text-gray-400 cursor-move">
                            <GripVertical className="w-5 h-5" />
                        </div>

                        <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                    Passo {index + 1}
                                </span>
                                <Button variant="ghost" size="sm" onClick={() => removeQuestion(q.id)} className="text-gray-400 hover:text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-3 space-y-1">
                                    <Label className="text-xs text-gray-500">Pergunta do Robô</Label>
                                    <Input
                                        value={q.text}
                                        onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                                        className="font-medium"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-gray-500">Tipo de Resposta</Label>
                                    <Select
                                        value={q.type}
                                        onValueChange={(val) => updateQuestion(q.id, 'type', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">Texto Livre</SelectItem>
                                            <SelectItem value="options">Múltipla Escolha</SelectItem>
                                            <SelectItem value="budget">Orçamento (R$)</SelectItem>
                                            <SelectItem value="location">Localização</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {q.type === 'options' && (
                                <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
                                    <Label className="text-xs text-slate-500 mb-2 block">Opções para o cliente (separadas por vírgula)</Label>
                                    <Input
                                        placeholder="Ex: Casa, Apartamento, Terreno"
                                        value={q.options?.join(", ") || ""}
                                        onChange={(e) => updateQuestion(q.id, 'options', e.target.value.split(",").map(s => s.trim()))}
                                        className="bg-white border-slate-200"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <Button onClick={addQuestion} variant="outline" className="w-full border-dashed border-gray-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Nova Pergunta
            </Button>
        </div>
    );
}
