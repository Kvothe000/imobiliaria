"use client";

import { useState, useEffect, memo, useCallback, useRef } from "react";
import {
    DndContext,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    useDroppable,
    MeasuringStrategy,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, GripVertical, CheckCircle2, DollarSign, Calendar, Target, User, Instagram, Globe, Phone as PhoneIcon, Users, Loader2, ArrowDown } from "lucide-react";
import { updateLeadStage, fetchLeadsByStage } from "@/app/actions/leads";
import { useRouter } from "next/navigation";
import { EditLeadModal } from "@/components/edit-lead-modal";
import { CloseDealModal } from "@/components/dashboard/close-deal-modal";
import { ScheduleVisitModal } from "@/components/schedule-visit-modal";

// --- Types ---
interface Lead {
    id: number;
    name: string;
    phone: string;
    interest: string | null;
    status: string;
    source: string;
    pipelineStage: string;
    email: string | null;
}

interface KanbanBoardProps {
    initialLeads: Lead[];
}

const COLUMNS = [
    { id: "Novo", title: "Novos", color: "bg-blue-100 text-blue-800", icon: User },
    { id: "Qualificação", title: "Qualificação", color: "bg-purple-100 text-purple-800", icon: Target },
    { id: "Visita", title: "Visita", color: "bg-orange-100 text-orange-800", icon: Calendar },
    { id: "Proposta", title: "Proposta", color: "bg-yellow-100 text-yellow-800", icon: DollarSign },
    { id: "Fechado", title: "Fechado", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
];

const SOURCE_CONFIG: Record<string, { color: string, icon: any, label: string }> = {
    "Site": { color: "border-l-blue-500", icon: Globe, label: "Site" },
    "Instagram": { color: "border-l-pink-500", icon: Instagram, label: "Instagram" },
    "WhatsApp": { color: "border-l-green-500", icon: PhoneIcon, label: "WhatsApp" },
    "Indicação": { color: "border-l-yellow-500", icon: Users, label: "Indicação" },
    "Manual": { color: "border-l-gray-400", icon: User, label: "Manual" }
};

// --- Draggable Card Component ---
const KanbanCard = memo(function KanbanCard({ lead, onClick, isOverlay }: { lead: Lead, onClick?: (lead: Lead) => void, isOverlay?: boolean }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: String(lead.id) });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        willChange: 'transform, opacity', // GPU Optimization
    };

    const sourceConfig = SOURCE_CONFIG[lead.source] || SOURCE_CONFIG["Manual"];
    const SourceIcon = sourceConfig.icon;

    // Visual Simplification: When dragging (but not the overlay itself), we might hide details via CSS in parent
    // The overlay should always be full detail.

    return (
        <div ref={setNodeRef} style={style} className="mb-3 kanban-item-wrapper">
            <Card
                className={`group cursor-default hover:shadow-md transition-all border-l-4 ${sourceConfig.color} ${isDragging ? "shadow-xl ring-2 ring-primary/20" : ""} ${isOverlay ? "cursor-grabbing shadow-2xl rotate-2" : ""}`}
                style={{ touchAction: 'pan-y' }}
                onClick={() => onClick && onClick(lead)}
            >
                <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 max-w-[85%]" >
                            {/* Drag Handle */}
                            {!isOverlay && (
                                <div
                                    {...attributes}
                                    {...listeners}
                                    className="text-gray-400 hover:text-gray-600 p-2 -ml-2 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing touch-none"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <GripVertical size={16} />
                                </div>
                            )}
                            <span className="font-semibold text-sm truncate text-gray-800 cursor-pointer" title={lead.name}>{lead.name}</span>
                        </div>

                        {/* Detail Actions - Hidden during generic drag via CSS if needed, but here we keep them simple */}
                        {!isOverlay && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 kanban-action-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`https://wa.me/55${lead.phone.replace(/\D/g, '')}`, '_blank');
                                }}
                            >
                                <MessageSquare className="w-3 h-3" />
                            </Button>
                        )}
                    </div>

                    {/* Secondary Info - These will be targeted by CSS to hide during drag to save paint time */}
                    <div className="kanban-secondary-info">
                        {lead.interest && (
                            <p className="text-xs text-gray-500 mb-2 line-clamp-2 bg-gray-50 p-1 rounded cursor-pointer">
                                {lead.interest}
                            </p>
                        )}

                        <div className="flex justify-between items-center text-xs text-gray-400">
                            <div className="flex items-center gap-1" title={`Fonte: ${lead.source}`}>
                                <SourceIcon size={10} />
                                <span>{lead.source}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
});

// --- Droppable Column Component ---
const KanbanColumn = memo(function KanbanColumn({
    col,
    leadsItems,
    onClickCard,
    hasMore,
    isLoading,
    onLoadMore
}: {
    col: any,
    leadsItems: Lead[],
    onClickCard: (l: Lead) => void,
    hasMore: boolean,
    isLoading: boolean,
    onLoadMore: () => void
}) {
    const { setNodeRef } = useDroppable({
        id: col.id,
    });

    return (
        <div ref={setNodeRef} className="min-w-[280px] w-[280px] md:w-[320px] flex-shrink-0 bg-gray-50/50 rounded-xl border border-gray-100 flex flex-col h-full max-h-[calc(100vh-200px)]">
            <div className={`p-3 border-b flex items-center justify-between sticky top-0 bg-white/95 rounded-t-xl z-10`}>
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${col.color.replace('text-', 'bg-').replace('100', '100')}`}>
                        <col.icon size={14} className={col.color.split(' ')[1]} />
                    </div>
                    <h3 className="font-semibold text-sm text-gray-700">{col.title}</h3>
                </div>
                <Badge variant="secondary" className="bg-white text-gray-500 shadow-sm border font-mono">
                    {leadsItems.length}
                </Badge>
            </div>

            <SortableContext
                id={col.id}
                items={leadsItems.map(l => String(l.id))}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex-1 p-2 overflow-y-auto overflow-x-hidden">
                    {leadsItems.map((lead) => (
                        <KanbanCard
                            key={lead.id}
                            lead={lead}
                            onClick={onClickCard}
                        />
                    ))}

                    {/* Load More Trigger */}
                    {hasMore && (
                        <div className="py-2 text-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-xs text-gray-500 h-8 hover:bg-gray-100"
                                onClick={onLoadMore}
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                                {isLoading ? "Carregando..." : "Carregar mais"}
                            </Button>
                        </div>
                    )}

                    {leadsItems.length === 0 && !hasMore && (
                        <div className="h-[100px] flex flex-col items-center justify-center text-gray-300 text-xs border-2 border-dashed border-gray-200 m-2 rounded-lg">
                            <span className="mb-1">Vazio</span>
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
});


// --- Scroll Hook ---
function useDraggableScroll() {
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const onMouseDown = (e: React.MouseEvent) => {
        const slider = e.currentTarget as HTMLElement;
        setIsDragging(true);
        setStartX(e.pageX - slider.offsetLeft);
        setScrollLeft(slider.scrollLeft);
        slider.style.cursor = 'grabbing';
    };

    const onMouseLeave = (e: React.MouseEvent) => {
        setIsDragging(false);
        (e.currentTarget as HTMLElement).style.cursor = 'grab';
    };

    const onMouseUp = (e: React.MouseEvent) => {
        setIsDragging(false);
        (e.currentTarget as HTMLElement).style.cursor = 'grab';
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const slider = e.currentTarget as HTMLElement;
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    };

    return { events: { onMouseDown, onMouseLeave, onMouseUp, onMouseMove }, isDragging };
}

// --- Main Board Component ---
export function KanbanBoard({ initialLeads }: KanbanBoardProps) {
    const [leads, setLeads] = useState<Lead[]>(initialLeads);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Board State
    const [activeId, setActiveId] = useState<number | null>(null);
    const router = useRouter();

    // Pagination State
    interface ColumnPagination {
        page: number;
        hasMore: boolean;
        isLoading: boolean;
    }
    const [pagination, setPagination] = useState<Record<string, ColumnPagination>>(() => {
        const state: Record<string, ColumnPagination> = {};
        COLUMNS.forEach(col => {
            state[col.id] = { page: 1, hasMore: true, isLoading: false };
            // We assume hasMore true initially unless initialLeads is empty? 
            // Better heuristic: if initialLeads has < 20 for this column, set hasMore false.
            // But initialLeads is flat.
        });
        return state;
    });

    // Close Deal & Schedule Modal States
    const [closingLead, setClosingLead] = useState<Lead | null>(null);
    const [isCloseDealOpen, setIsCloseDealOpen] = useState(false);
    const [schedulingLead, setSchedulingLead] = useState<Lead | null>(null);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

    const { events: scrollEvents, isDragging: isScrolling } = useDraggableScroll();

    const lastInitLeadsRef = useRef<string>("");

    useEffect(() => {
        // Stability check to prevent infinite loops if initialLeads reference changes but content doesn't
        // We use a simple hash of IDs and Stages
        const idsKey = initialLeads.map(l => `${l.id}-${l.pipelineStage}`).sort().join(',');

        if (lastInitLeadsRef.current === idsKey) return;
        lastInitLeadsRef.current = idsKey;

        // 1. Update Pagination State
        setPagination(prev => {
            const next = { ...prev };
            // Optimistic Pagination: Ensure button is visible initially
            COLUMNS.forEach(col => {
                next[col.id] = { ...next[col.id], hasMore: true };
            });
            return next;
        });

        // 2. Sync Leads
        setLeads(initialLeads);
    }, [initialLeads]);


    // Derived Columns
    const columns = COLUMNS.reduce((acc, col) => {
        acc[col.id] = leads.filter(l => (l.pipelineStage || "Novo") === col.id);
        return acc;
    }, {} as Record<string, Lead[]>);


    const handleCardClick = useCallback((lead: Lead) => {
        if (isScrolling) return;
        setEditingLead(lead);
        setIsEditOpen(true);
    }, [isScrolling]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    const handleLoadMore = async (stageId: string) => {
        const currentPag = pagination[stageId];
        if (!currentPag.hasMore || currentPag.isLoading) return;

        setPagination(prev => ({
            ...prev,
            [stageId]: { ...prev[stageId], isLoading: true }
        }));

        try {
            // Calculate skip. We have page 1 (initial). We want page 2.
            // Page 1 = offset 0, take 20.
            // Page 2 = offset 20, take 20.
            const skip = columns[stageId].length; // More reliable than page math if leads were moved
            const take = 20;

            const result = await fetchLeadsByStage(stageId, skip, take);

            if (result.success && result.data) {
                const newLeads = result.data as Lead[];

                if (newLeads.length < take) {
                    setPagination(prev => ({
                        ...prev,
                        [stageId]: { ...prev[stageId], hasMore: false, isLoading: false }
                    }));
                } else {
                    setPagination(prev => ({
                        ...prev,
                        [stageId]: { ...prev[stageId], isLoading: false, page: prev[stageId].page + 1 }
                    }));
                }

                // Append unique leads
                setLeads(prev => {
                    const existingIds = new Set(prev.map(l => l.id));
                    const uniqueNew = newLeads.filter(l => !existingIds.has(l.id));
                    return [...prev, ...uniqueNew];
                });
            } else {
                setPagination(prev => ({
                    ...prev,
                    [stageId]: { ...prev[stageId], isLoading: false }
                }));
            }

        } catch (error) {
            console.error("Load more failed", error);
            setPagination(prev => ({
                ...prev,
                [stageId]: { ...prev[stageId], isLoading: false }
            }));
        }
    };

    // ... Handle Drag Logic (Optimized)
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(Number(event.active.id));
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;

        const activeId = Number(active.id);
        const overId = over.id;

        const activeLead = leads.find(l => l.id === activeId);
        if (!activeLead) return;

        const sourceStage = activeLead.pipelineStage || "Novo";
        let destStage = overId as string;

        if (activeLead.id !== overId) {
            const overCard = leads.find(l => String(l.id) === String(overId));
            if (overCard) {
                destStage = overCard.pipelineStage;
            }
        }

        if (!COLUMNS.some(c => c.id === destStage)) return;

        if (sourceStage !== destStage) {
            if (destStage === "Fechado") {
                setClosingLead(activeLead);
                setIsCloseDealOpen(true);
                return;
            }
            if (destStage === "Visita") {
                setSchedulingLead(activeLead);
                setIsScheduleOpen(true);
                return;
            }

            const updatedLeads = leads.map(l =>
                l.id === activeId ? { ...l, pipelineStage: destStage } : l
            );
            setLeads(updatedLeads);

            try {
                await updateLeadStage(activeId, destStage);
                router.refresh();
            } catch (error) {
                console.error("Failed to update stage", error);
            }
        }
    };

    // ... Modal Handlers
    const handleScheduleSuccess = async () => {
        if (!schedulingLead) return;
        const destStage = "Visita";
        const updatedLeads = leads.map(l => l.id === schedulingLead.id ? { ...l, pipelineStage: destStage } : l);
        setLeads(updatedLeads);
        try {
            await updateLeadStage(schedulingLead.id, destStage);
            router.refresh();
        } catch (error) { }
        setIsScheduleOpen(false);
        setSchedulingLead(null);
    };


    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    if (!isMounted) return <div className="p-10 text-center">Carregando Board...</div>; // Skeleton placeholder better

    const activeLead = activeId ? leads.find(l => l.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            measuring={{ droppable: { strategy: MeasuringStrategy.WhileDragging } }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {/* 
                Performance Optimization: 
                When dragging, we add a class to the wrapper.
                Global CSS then hides .kanban-secondary-info to reduce paint / layout cost.
                We inject a style tag for this scoped behavior or assume global styles.
                Let's use an inline style block for simplicity and self-containment.
             */}
            {activeId && (
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .kanban-secondary-info { opacity: 0.1 !important; transition: opacity 0.2s; }
                    .kanban-action-btn { display: none !important; }
                `}} />
            )}

            <div
                className={`flex h-full gap-4 overflow-x-auto pb-4 px-2 snap-x cursor-grab active:cursor-grabbing select-none ${activeId ? 'board-is-dragging' : ''}`}
                {...scrollEvents}
                style={{ touchAction: 'pan-x' }}
            >
                {COLUMNS.map((col) => (
                    <KanbanColumn
                        key={col.id}
                        col={col}
                        leadsItems={columns[col.id] || []}
                        onClickCard={handleCardClick}
                        hasMore={pagination[col.id]?.hasMore}
                        isLoading={pagination[col.id]?.isLoading}
                        onLoadMore={() => handleLoadMore(col.id)}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeLead ? (
                    <KanbanCard lead={activeLead} isOverlay />
                ) : null}
            </DragOverlay>

            {/* Modals */}
            {editingLead && <EditLeadModal lead={editingLead} open={isEditOpen} setOpen={setIsEditOpen} />}
            {closingLead && <CloseDealModal isOpen={isCloseDealOpen} onClose={() => setIsCloseDealOpen(false)} leadId={closingLead.id} leadName={closingLead.name} propertyId={undefined} />}
            {schedulingLead && <ScheduleVisitModal leadId={schedulingLead.id} leadName={schedulingLead.name} leadPhone={schedulingLead.phone} open={isScheduleOpen} setOpen={setIsScheduleOpen} onSuccess={handleScheduleSuccess} />}
        </DndContext>
    );
}
