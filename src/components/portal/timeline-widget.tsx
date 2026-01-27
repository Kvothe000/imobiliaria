"use client";

import { Check, Clock, Home, FileText, PenTool } from "lucide-react";

interface TimelineWidgetProps {
    currentStage: string;
}

export function TimelineWidget({ currentStage }: TimelineWidgetProps) {
    const steps = [
        { id: "Novo", label: "Cadastro", icon: Home },
        { id: "Em Atendimento", label: "Atendimento", icon: Clock },
        { id: "Visita", label: "Visitas", icon: Check },
        { id: "Proposta", label: "Proposta", icon: FileText },
        { id: "Fechado", label: "Contrato", icon: PenTool },
    ];

    // Simple mapping: if currentStage matches, it's active. Preceding are done.
    // We need to know the index.
    const currentIndex = steps.findIndex(s => s.id === currentStage) === -1
        ? 0 // Default to first if unknown (e.g. 'new')
        : steps.findIndex(s => s.id === currentStage);

    // Fallback for English keys if mismatch
    const normalizedIndex = currentIndex === 0 && currentStage === 'new' ? 0 : currentIndex;


    return (
        <div className="w-full py-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Sua Jornada</h3>
            <div className="relative flex items-center justify-between w-full px-2">
                {/* Progress Bar Background */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />

                {/* Active Progress Bar */}
                <div
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-emerald-500 -z-10 transition-all duration-1000"
                    style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    const Icon = step.icon;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-2">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500
                                ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300 text-gray-400'}
                                ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}
                            `}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-xs font-semibold ${isCurrent ? 'text-emerald-600' : 'text-gray-500'}`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
