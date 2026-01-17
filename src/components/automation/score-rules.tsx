"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data linking back to the questions we defined
// In a real app, this would come from the same context/state as the questions
const SCORABLE_QUESTIONS = [
    {
        id: "2",
        text: "Objetivo",
        options: ["Comprar para Morar", "Investir", "Alugar", "Vender meu Imóvel"]
    },
    {
        id: "5", // Budget is tricky for exact match, usually range based. Skipping for this MVP UI.
        text: "Pagamento",
        options: ["À Vista (Recursos Próprios)", "Financiamento Bancário", "Permuta (Troca)", "Parcelamento Direto"]
    },
    {
        id: "7",
        text: "Urgência (Prazo)",
        options: ["Imediato / Urgente", "Nos próximos 3 meses", "Estou apenas pesquisando", "Indefinido"]
    }
];

type ScoreRule = {
    questionId: string;
    option: string;
    points: number;
};

export function ScoreRules() {
    // Default "Broker Mindset" Rules
    const [rules, setRules] = useState<ScoreRule[]>([
        { questionId: "5", option: "À Vista (Recursos Próprios)", points: 50 },
        { questionId: "5", option: "Financiamento Bancário", points: 20 },
        { questionId: "7", option: "Imediato / Urgente", points: 30 },
        { questionId: "2", option: "Investir", points: 15 },
        { questionId: "7", option: "Estou apenas pesquisando", points: -10 },
    ]);

    const updatePoints = (index: number, delta: number) => {
        const newRules = [...rules];
        newRules[index].points += delta;
        setRules(newRules);
    };

    return (
        <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
                <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                    <h3 className="text-sm font-semibold text-blue-900">Como funciona o Lead Score?</h3>
                    <p className="text-sm text-blue-700 mt-1">
                        Cada novo lead começa com <strong>50 pontos</strong> (Neutro).
                        Conforme ele responde suas perguntas, ganhamos ou perdemos pontos.
                        <br />
                        <span className="font-medium">Acima de 80pts = Lead Quente 🔥</span> (Prioridade Máxima).
                    </p>
                </div>
            </div>

            <div className="grid gap-6">
                {SCORABLE_QUESTIONS.map((q) => (
                    <Card key={q.id} className="overflow-hidden border-slate-200">
                        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center gap-2">
                            <span className="text-xs font-mono text-slate-500">PERGUNTA {q.id}</span>
                            <span className="text-sm font-medium text-slate-800">{q.text}</span>
                        </div>
                        <CardContent className="p-0">
                            {q.options.map((option) => {
                                const ruleIndex = rules.findIndex(r => r.questionId === q.id && r.option === option);
                                const points = ruleIndex >= 0 ? rules[ruleIndex].points : 0;
                                const isPositive = points > 0;
                                const isNegative = points < 0;

                                return (
                                    <div key={option} className="flex items-center justify-between p-4 border-b last:border-0 border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <span className="text-sm text-gray-700">{option}</span>

                                        <div className="flex items-center gap-3">
                                            {points !== 0 && (
                                                <Badge variant={isPositive ? "default" : "destructive"} className={isPositive ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-red-100 text-red-700 hover:bg-red-100"}>
                                                    {isPositive ? "+" : ""}{points} pts
                                                </Badge>
                                            )}

                                            {ruleIndex >= 0 ? (
                                                <div className="flex items-center gap-1">
                                                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updatePoints(ruleIndex, -5)}>
                                                        <Minus className="w-3 h-3" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updatePoints(ruleIndex, 5)}>
                                                        <Plus className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button size="sm" variant="ghost" className="text-xs text-gray-400" onClick={() => setRules([...rules, { questionId: q.id, option, points: 10 }])}>
                                                    Configurar
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
