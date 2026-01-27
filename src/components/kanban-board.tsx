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
import { Virtuoso } from "react-virtuoso";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, GripVertical, CheckCircle2, DollarSign, Calendar, Target, User, Instagram, Globe, Phone as PhoneIcon, Users, Loader2, ArrowDown, AlertTriangle } from "lucide-react";
import { updateLeadStage, fetchLeadsByStage } from "@/app/actions/leads";
import { useRouter } from "next/navigation";
import { EditLeadModal } from "@/components/edit-lead-modal";
import { CloseDealModal } from "@/components/dashboard/close-deal-modal";
import { ScheduleVisitModal } from "@/components/schedule-visit-modal";
import { LostDealModal } from "@/components/dashboard/lost-deal-modal";

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
    updatedAt: string | Date; // Added for Stagnation Calc
}

interface Stage {
    id: number;
    name: string;
    order: number;
}

interface KanbanBoardProps {
    initialLeads: Lead[];
    stages: Stage[]; // Dynamic Stages
}

// Fallback if stages fail to load
const DEFAULT_STAGES = [
    { id: 1, name: "Novo", order: 1 },
    { id: 2, name: "Em Atendimento", order: 2 },
    { id: 3, name: "Visita Agendada", order: 3 },
    { id: 4, name: "Proposta", order: 4 },
    { id: 5, name: "Fechado", order: 5 },
];

const SOURCE_CONFIG: Record<string, { color: string, icon: any, label: string }> = {
    "Site": { color: "border-l-blue-500", icon: Globe, label: "Site" },
    "Instagram": { color: "border-l-pink-500", icon: Instagram, label: "Instagram" },
    "WhatsApp": { color: "border-l-green-500", icon: PhoneIcon, label: "WhatsApp" },
    "Indicação": { color: "border-l-yellow-500", icon: Users, label: "Indicação" },
    "Manual": { color: "border-l-gray-400", icon: User, label: "Manual" }
};

// --- Stagnation Logic ---
function isStagnant(lead: Lead): boolean {
    if (!lead.updatedAt) return false;
    const days = (new Date().getTime() - new Date(lead.updatedAt).getTime()) / (1000 * 3600 * 24);

    // Rule: "Novo" > 24h (1 day)
    if (lead.pipelineStage === "Novo" && days > 1) return true;

    // Rule: Others > 5 days (except Closed/Lost)
    if (!["Fechado", "Perdido"].includes(lead.pipelineStage) && days > 5) return true;

    return false;
}

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
        willChange: 'transform, opacity',
    };

    const sourceConfig = SOURCE_CONFIG[lead.source] || SOURCE_CONFIG["Manual"];
    const SourceIcon = sourceConfig.icon;
    const stagnant = isStagnant(lead);

    return (
        <div ref={setNodeRef} style={style} className="mb-3 kanban-item-wrapper dropdown-menu-container">
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
                            <span className="font-semibold text-sm truncate text-gray-800 cursor-pointer" title={lead.name}>
                                {lead.name}
                            </span>
                            {stagnant && !isOverlay && (
                                <div className="animate-pulse" title="Lead estagnado: Sem interação recente!">
                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                </div>
                            )}
                        </div>

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

// --- Droppable Column Component (Virtualized) ---
const KanbanColumn = memo(function KanbanColumn({
    stage,
    leadsItems,
    onClickCard,
    hasMore,
    isLoading,
    onLoadMore
}: {
    stage: Stage,
    leadsItems: Lead[],
    onClickCard: (l: Lead) => void,
    hasMore: boolean,
    isLoading: boolean,
    onLoadMore: () => void
}) {
    const { setNodeRef } = useDroppable({
        id: stage.name,
    });

    const getIcon = (stageName: string) => {
        if (stageName.includes("Novo")) return User;
        if (stageName.includes("Qualificação") || stageName.includes("Atendimento")) return Target;
        if (stageName.includes("Visita")) return Calendar;
        if (stageName.includes("Proposta")) return DollarSign;
        if (stageName.includes("Fechado")) return CheckCircle2;
        return User;
    };

    // Dynamic Colors based on Order (heuristic)
    const getColors = (order: number) => {
        const colors = [
            "bg-blue-100/50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-200 border-blue-200 dark:border-blue-800",
            "bg-purple-100/50 text-purple-900 dark:bg-purple-900/20 dark:text-purple-200 border-purple-200 dark:border-purple-800",
            "bg-orange-100/50 text-orange-900 dark:bg-orange-900/20 dark:text-orange-200 border-orange-200 dark:border-orange-800",
            "bg-yellow-100/50 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
            "bg-green-100/50 text-green-900 dark:bg-green-900/20 dark:text-green-200 border-green-200 dark:border-green-800",
            "bg-gray-100/50 text-gray-900 dark:bg-gray-800/40 dark:text-gray-300 border-gray-200 dark:border-gray-700"
        ];
        return colors[(order - 1) % colors.length];
    }

    const Icon = getIcon(stage.name);
    const colorClass = getColors(stage.order);

    return (
        <div ref={setNodeRef} className="min-w-[300px] w-[300px] md:w-[340px] flex-shrink-0 bg-gray-50/80 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col h-full max-h-[calc(100vh-180px)] shadow-sm">
            <div className={`p-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 rounded-t-xl z-10 backdrop-blur-sm ${colorClass.split('border')[0]}`}>
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md bg-white/50 dark:bg-black/20`}>
                        <Icon size={14} className="opacity-80" />
                    </div>
                    <h3 className="font-bold text-sm">{stage.name}</h3>
                </div>
                <Badge variant="secondary" className="bg-white/70 dark:bg-black/30 border-0 font-mono text-xs">
                    {leadsItems.length}
                </Badge>
            </div>

            <SortableContext
                id={stage.name}
                items={leadsItems.map(l => String(l.id))}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
                    <Virtuoso
                        style={{ height: '100%' }}
                        data={leadsItems}
                        endReached={() => hasMore && !isLoading && onLoadMore()}
                        itemContent={(index, lead) => (
                            <div className="px-2 pt-2 last:pb-2">
                                <KanbanCard
                                    key={lead.id}
                                    lead={lead}
                                    onClick={onClickCard}
                                />
                            </div>
                        )}
                        components={{
                            Footer: () => (
                                <div className="py-2 text-center">
                                    {isLoading && <Loader2 className="w-4 h-4 animate-spin mx-auto text-primary" />}
                                    {!isLoading && hasMore && (
                                        <div className="h-6" /> // Trigger area
                                    )}
                                    {!hasMore && leadsItems.length > 5 && (
                                        <span className="text-xs text-muted-foreground">Fim da lista</span>
                                    )}
                                </div>
                            ),
                            EmptyPlaceholder: () => (
                                leadsItems.length === 0 && !isLoading ? (
                                    <div className="h-[150px] flex flex-col items-center justify-center text-muted-foreground text-xs m-2 border-2 border-dashed rounded-lg">
                                        Vazio
                                    </div>
                                ) : null
                            )
                        }}
                    />
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
export function KanbanBoard({ initialLeads, stages = [] }: KanbanBoardProps) {
    const [leads, setLeads] = useState<Lead[]>(initialLeads);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Board State
    const [activeId, setActiveId] = useState<number | null>(null);
    const router = useRouter();

    // Sort stages by order
    const activeStages = (stages.length > 0 ? stages : DEFAULT_STAGES).sort((a, b) => a.order - b.order);

    // Pagination State
    interface ColumnPagination {
        page: number;
        hasMore: boolean;
        isLoading: boolean;
    }

    // Initialize Pagination safely
    const [pagination, setPagination] = useState<Record<string, ColumnPagination>>(() => {
        const state: Record<string, ColumnPagination> = {};
        activeStages.forEach(st => {
            state[st.name] = { page: 1, hasMore: true, isLoading: false };
        });
        return state;
    });

    // Close Deal & Schedule Modal States
    const [closingLead, setClosingLead] = useState<Lead | null>(null);
    const [isCloseDealOpen, setIsCloseDealOpen] = useState(false);
    const [schedulingLead, setSchedulingLead] = useState<Lead | null>(null);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [lostLead, setLostLead] = useState<Lead | null>(null);
    const [isLostOpen, setIsLostOpen] = useState(false);

    const { events: scrollEvents, isDragging: isScrolling } = useDraggableScroll();
    const lastInitLeadsRef = useRef<string>("");

    useEffect(() => {
        const idsKey = initialLeads.map(l => `${l.id}-${l.pipelineStage}`).sort().join(',');

        if (lastInitLeadsRef.current === idsKey) return;
        lastInitLeadsRef.current = idsKey;

        setPagination(prev => {
            const next = { ...prev };
            // Ensure all stages have pagination keys
            activeStages.forEach(st => {
                next[st.name] = { page: 1, hasMore: true, isLoading: false }; // Always reset pagination on stage/leads change
            });
            return next;
        });

        setLeads(initialLeads);
    }, [initialLeads, activeStages]);


    const columns = activeStages.reduce((acc, st) => {
        acc[st.name] = leads.filter(l => (l.pipelineStage || "Novo") === st.name);
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

    const handleLoadMore = async (stageName: string) => {
        const currentPag = pagination[stageName];
        if (!currentPag?.hasMore || currentPag.isLoading) return;

        setPagination(prev => ({
            ...prev,
            [stageName]: { ...prev[stageName], isLoading: true }
        }));

        try {
            const skip = columns[stageName].length;
            const take = 20;

            const result = await fetchLeadsByStage(stageName, skip, take);

            if (result.success && result.data) {
                const newLeads = result.data as Lead[];

                if (newLeads.length < take) {
                    setPagination(prev => ({
                        ...prev,
                        [stageName]: { ...prev[stageName], hasMore: false, isLoading: false }
                    }));
                } else {
                    setPagination(prev => ({
                        ...prev,
                        [stageName]: { ...prev[stageName], isLoading: false, page: prev[stageName].page + 1 }
                    }));
                }

                setLeads(prev => {
                    const existingIds = new Set(prev.map(l => l.id));
                    const uniqueNew = newLeads.filter(l => !existingIds.has(l.id));
                    return [...prev, ...uniqueNew];
                });
            } else {
                setPagination(prev => ({
                    ...prev,
                    [stageName]: { ...prev[stageName], isLoading: false }
                }));
            }

        } catch (error) {
            console.error("Load more failed", error);
            setPagination(prev => ({
                ...prev,
                [stageName]: { ...prev[stageName], isLoading: false }
            }));
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(Number(event.active.id));
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;

        const activeId = Number(active.id);
        const overId = over.id; // Could be Stage Name or Lead ID

        const activeLead = leads.find(l => l.id === activeId);
        if (!activeLead) return;

        const sourceStage = activeLead.pipelineStage || "Novo";
        let destStage = overId as string;

        // If dropped on a card, take its stage
        if (activeLead.id !== overId) {
            // Check if overId is a stage name
            if (activeStages.some(s => s.name === overId)) {
                destStage = overId as string;
            } else {
                const overCard = leads.find(l => String(l.id) === String(overId));
                if (overCard) {
                    destStage = overCard.pipelineStage;
                }
            }
        }

        if (!activeStages.some(c => c.name === destStage)) return;

        if (sourceStage !== destStage) {
            if (destStage === "Fechado") {
                setClosingLead(activeLead);
                setIsCloseDealOpen(true);
                return;
            }
            if (destStage === "Visita" || destStage.includes("Visita")) {
                setSchedulingLead(activeLead);
                setIsScheduleOpen(true);
                return;
            }
            if (destStage === "Perdido") {
                setLostLead(activeLead);
                setIsLostOpen(true);
                return;
            }

            const updatedLeads = leads.map(l =>
                l.id === activeId ? { ...l, pipelineStage: destStage, updatedAt: new Date() } : l
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

    const handleScheduleSuccess = async () => {
        if (!schedulingLead) return;
        const destStage = activeStages.find(s => s.name.includes("Visita"))?.name || "Visita Agendada";

        const updatedLeads = leads.map(l => l.id === schedulingLead.id ? { ...l, pipelineStage: destStage, updatedAt: new Date() } : l);
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

    if (!isMounted) return <div className="p-10 text-center">Carregando Board...</div>;

    const activeLead = activeId ? leads.find(l => l.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            measuring={{ droppable: { strategy: MeasuringStrategy.WhileDragging } }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
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
                {activeStages.map((stage) => (
                    <KanbanColumn
                        key={stage.id}
                        stage={stage}
                        leadsItems={columns[stage.name] || []}
                        onClickCard={handleCardClick}
                        hasMore={pagination[stage.name]?.hasMore}
                        isLoading={pagination[stage.name]?.isLoading}
                        onLoadMore={() => handleLoadMore(stage.name)}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeLead ? (
                    <KanbanCard lead={activeLead} isOverlay />
                ) : null}
            </DragOverlay>

            {editingLead && <EditLeadModal lead={editingLead} open={isEditOpen} setOpen={setIsEditOpen} />}
            {closingLead && <CloseDealModal isOpen={isCloseDealOpen} onClose={() => setIsCloseDealOpen(false)} leadId={closingLead.id} leadName={closingLead.name} propertyId={undefined} />}
            {schedulingLead && <ScheduleVisitModal leadId={schedulingLead.id} leadName={schedulingLead.name} leadPhone={schedulingLead.phone} open={isScheduleOpen} setOpen={setIsScheduleOpen} onSuccess={handleScheduleSuccess} />}
            {lostLead && <LostDealModal isOpen={isLostOpen} onClose={() => setIsLostOpen(false)} leadId={lostLead.id} leadName={lostLead.name} onSuccess={() => router.refresh()} />}
        </DndContext>
    );
}
