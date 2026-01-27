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
import { updateLeadStage } from "@/app/actions/leads";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import ScrollContainer from 'react-indiana-drag-scroll';
import { EditLeadModal } from "@/components/edit-lead-modal";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import Link from "next/link";

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
            await updateLeadStage(leadId, newStatus);
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

                            <div className="flex gap-2">
                                <Link href={`/dashboard/smart-match/${lead.id}`} title="Encontrar Imóvel (Smart Match)">
                                    <button className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flame"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.332-.224-4.205 1.06-0.817 1.284 2.857 1.075 4 1.458 4.225A2.5 2.5 0 0 0 13 14.5a.5.5 0 0 1 .91-.417 2.75 2.75 0 0 0 2.92 2.73 3 2.98 0 0 0 2.97-2.92c0-2.316-.246-4.52-1-6.103A11.75 11.75 0 0 0 12 11c-1.89-1.95-3.32-4.13-4.14-0.18-0.82 2.95-3 5.3-6.09 7.03a11.5 11.5 0 0 0-4.04 1.93c1.7 4.1 5.92 7 10.74 7 3.52 0 6.64-1.6 8.78-4.12" /></svg>
                                    </button>
                                </Link>

                                {/* WhatsApp Shortcut */}
                                <WhatsAppButton
                                    phone={lead.phone}
                                    message={`Olá ${lead.name}, vi que você tem interesse em ${lead.interest}...`}
                                    label="WhatsApp"
                                    className="transform hover:scale-105 shadow-sm"
                                />
                            </div>
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
