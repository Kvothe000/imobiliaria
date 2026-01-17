"use client";

import { useState, useEffect } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updateLeadStatus } from "@/app/actions/leads";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import ScrollContainer from 'react-indiana-drag-scroll';
import { EditLeadModal } from "@/components/edit-lead-modal";

interface Lead {
    id: number;
    name: string;
    phone: string;
    interest: string | null;
    status: string;
    source: string;
    email: string | null;
    pipelineStage: string;
    score: number;
}

const COLUMNS = [
    { id: "Novo", title: "Novo", color: "bg-blue-500/10 text-blue-700 border-blue-200" },
    { id: "Em Atendimento", title: "Em Atendimento", color: "bg-yellow-500/10 text-yellow-700 border-yellow-200" },
    { id: "Visita", title: "Visita Agendada", color: "bg-purple-500/10 text-purple-700 border-purple-200" },
    { id: "Proposta", title: "Proposta", color: "bg-orange-500/10 text-orange-700 border-orange-200" },
    { id: "Fechado", title: "Fechado", color: "bg-green-500/10 text-green-700 border-green-200" },
];

export function LeadsKanban({ initialLeads }: { initialLeads: Lead[] }) {
    const [leads, setLeads] = useState<Lead[]>(initialLeads);
    const [activeId, setActiveId] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // CRITICAL: Sync local state when server data changes (e.g. after revalidatePath)
    useEffect(() => {
        setLeads(initialLeads);
    }, [initialLeads]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        setActiveId(active.id as number);
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over) return;

        const leadId = active.id as number;
        const newStatus = over.id as string;

        const currentLead = leads.find((l) => l.id === leadId);
        if (currentLead && currentLead.status !== newStatus) {
            // Optimistic Update
            setLeads((prev) =>
                prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
            );

            // Server Update
            await updateLeadStatus(leadId, newStatus);
        }

        setActiveId(null);
    }

    if (!mounted) {
        return null;
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <ScrollContainer
                className="flex gap-6 overflow-x-auto pb-8 h-[calc(100vh-140px)] px-2 cursor-grab active:cursor-grabbing select-none"
                hideScrollbars={false}
                ignoreElements=".dnd-card"
            >
                {COLUMNS.map((col) => (
                    <div key={col.id} className="min-w-[320px] flex flex-col h-full shrink-0">
                        {/* Header Column */}
                        <div className={`
                p-3 rounded-t-xl border-b-2 font-bold flex justify-between items-center mb-2
                ${col.color} bg-opacity-20 border-opacity-50
            `}>
                            {col.title}
                            <Badge className={`bg-white/80 text-black shadow-sm font-bold`}>{leads.filter(l => l.status === col.id).length}</Badge>
                        </div>

                        {/* Droppable Area */}
                        <div className="flex-1 bg-gray-50/50 dark:bg-gray-800/30 rounded-b-xl border border-t-0 p-2 border-gray-200 dark:border-gray-700/50">
                            <StatusColumn id={col.id} leads={leads.filter((l) => l.status === col.id)} />
                        </div>
                    </div>
                ))}
            </ScrollContainer>

            <DragOverlay>
                {activeId ? (
                    <LeadCard lead={leads.find((l) => l.id === activeId)!} isOverlay />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}


function StatusColumn({ id, leads }: { id: string; leads: Lead[] }) {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div ref={setNodeRef} className="h-full space-y-3 overflow-y-auto pr-2 min-h-[100px]">
            {leads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
            ))}
            {leads.length === 0 && (
                <div className="h-32 flex items-center justify-center text-gray-400 text-sm italic border-2 border-dashed rounded-lg border-gray-200 dark:border-gray-700 m-2">
                    Arraste aqui
                </div>
            )}
        </div>
    );
}

function LeadCard({ lead, isOverlay }: { lead: Lead, isOverlay?: boolean }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: lead.id,
    });
    const [editOpen, setEditOpen] = useState(false);

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    // Prevent opening modal if it's the overlay card
    const handleCardClick = () => {
        if (!isOverlay) {
            setEditOpen(true);
        }
    };

    // Calculate Score Color
    const getScoreColor = (score: number) => {
        if (score >= 80) return "bg-red-500"; // Hot
        if (score >= 50) return "bg-yellow-500"; // Warm
        return "bg-blue-500"; // Cold
    };

    const handleWhatsApp = (e: React.MouseEvent) => {
        e.stopPropagation();
        const cleanPhone = lead.phone.replace(/\D/g, '');
        window.open(`https://wa.me/55${cleanPhone}?text=Olá ${lead.name}, vi que você tem interesse em ${lead.interest}...`, '_blank');
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...listeners}
                {...attributes}
                className={`touch-none ${isOverlay ? 'rotate-2 scale-105 shadow-xl cursor-grabbing' : ''}`}
            >
                <Card
                    onClick={handleCardClick}
                    className={`
                dnd-card cursor-grab hover:shadow-lg transition-all duration-200 dark:bg-gray-900 border-l-4 bg-white shadow-sm group
                ${lead.status === 'Novo' ? 'border-l-blue-500' : ''}
                ${lead.status === 'Em Atendimento' ? 'border-l-yellow-500' : ''}
                ${lead.status === 'Visita' ? 'border-l-purple-500' : ''}
                ${lead.status === 'Proposta' ? 'border-l-orange-500' : ''}
                ${lead.status === 'Fechado' ? 'border-l-green-500' : ''}
        `}>
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div className="font-bold text-gray-900 dark:text-gray-100">{lead.name}</div>

                            {/* Score Indicator */}
                            <div title={`Score: ${lead.score}`} className={`w-3 h-3 rounded-full ${getScoreColor(lead.score || 50)} animate-pulse`} />
                        </div>

                        <div className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-1 line-clamp-1">{lead.interest}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mb-3">{lead.phone}</div>

                        <div className="flex items-center justify-between text-xs text-gray-400 border-t pt-2 mt-2 dark:border-gray-800">
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1">
                                    {lead.source === 'Instagram' && '📸'}
                                    {lead.source === 'Site' && '🌐'}
                                    {lead.source === 'Indicação' && '👥'}
                                    {lead.source === 'Manual' && '📝'}
                                    {lead.source}
                                </span>
                            </div>

                            {/* WhatsApp Shortcut */}
                            <button
                                onClick={handleWhatsApp}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] text-white hover:bg-[#128C7E] shadow-sm hover:shadow-md transition-all transform hover:scale-105"
                                title="Chamar no WhatsApp"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                <span className="text-[10px] font-bold">WhatsApp</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Only render modal if not overlay to avoid duplication and hydration issues */}
            {!isOverlay && (
                <EditLeadModal lead={lead} open={editOpen} setOpen={setEditOpen} />
            )}
        </>
    );
}
