"use client";

import { useState, useEffect } from "react";
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
import { MapPin, Phone, User, Home, FileText, CheckCircle2 } from "lucide-react";
import { updateListingStatus, promoteListingToProperty } from "@/app/actions/listings";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Confetti from "react-confetti";

// --- Types ---
interface Listing {
    id: number;
    ownerName: string;
    ownerPhone: string;
    address: string;
    status: string;
    expectedValue: number;
    notes: string | null;
    user: { name: string | null, avatar: string | null };
}

interface AgenciamentoBoardProps {
    initialListings: Listing[];
}

const COLUMNS = [
    { id: "Novo", title: "Novos", color: "bg-blue-100 text-blue-800", icon: User },
    { id: "Avaliação", title: "Em Avaliação", color: "bg-purple-100 text-purple-800", icon: Home },
    { id: "Contrato", title: "Contrato Enviado", color: "bg-orange-100 text-orange-800", icon: FileText },
    { id: "Captado", title: "Captado (Pronto)", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
    { id: "Perdido", title: "Perdido", color: "bg-red-100 text-red-800", icon: User },
];

function ListingCard({ listing, onClick }: { listing: Listing, onClick: (l: Listing) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: listing.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="mb-3">
            <Card
                className={`group cursor-default hover:shadow-md transition-all border-l-4 border-l-indigo-500 box-content ${isDragging ? "shadow-xl ring-2 ring-primary/20" : ""}`}
                style={{ touchAction: 'pan-y' }}
                onClick={() => onClick(listing)}
            >
                <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 max-w-[85%]" >
                            <div
                                {...attributes}
                                {...listeners}
                                className="text-gray-400 hover:text-gray-600 p-2 -ml-2 rounded cursor-grab active:cursor-grabbing touch-none"
                            >
                                <Home size={16} />
                            </div>
                            <div>
                                <span className="font-semibold text-sm truncate block text-gray-800">{listing.address}</span>
                                <span className="text-xs text-gray-500">{listing.ownerName}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                        <Phone size={10} />
                        <span>{listing.ownerPhone}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function KanbanColumn({ col, items, onClickCard }: { col: any, items: Listing[], onClickCard: (l: Listing) => void }) {
    const { setNodeRef } = useDroppable({ id: col.id });

    return (
        <div ref={setNodeRef} className="min-w-[280px] w-[280px] md:w-[320px] flex-shrink-0 bg-gray-50/50 rounded-xl border border-gray-100 flex flex-col h-full max-h-[calc(100vh-200px)]">
            <div className={`p-3 border-b flex items-center justify-between sticky top-0 bg-white/50 backdrop-blur rounded-t-xl z-10`}>
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${col.color.replace('text-', 'bg-').replace('100', '100')}`}>
                        <col.icon size={14} className={col.color.split(' ')[1]} />
                    </div>
                    <h3 className="font-semibold text-sm text-gray-700">{col.title}</h3>
                </div>
                <Badge variant="secondary" className="bg-white text-gray-500 shadow-sm border font-mono">
                    {items.length}
                </Badge>
            </div>

            <SortableContext id={col.id} items={items.map(l => l.id)} strategy={verticalListSortingStrategy}>
                <div className="flex-1 p-2 overflow-y-auto">
                    {items.map((item) => (
                        <ListingCard key={item.id} listing={item} onClick={onClickCard} />
                    ))}
                    {items.length === 0 && (
                        <div className="h-full min-h-[100px] flex flex-col items-center justify-center text-gray-300 text-xs border-2 border-dashed border-gray-200 m-2 rounded-lg">
                            <span className="mb-1">Vazio</span>
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}

export function AgenciamentoBoard({ initialListings }: AgenciamentoBoardProps) {
    const [listings, setListings] = useState<Listing[]>(initialListings);
    const [activeId, setActiveId] = useState<number | null>(null);
    const router = useRouter();

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

    // Grouping
    const [columns, setColumns] = useState<Record<string, Listing[]>>(() => {
        const grouped: Record<string, Listing[]> = {};
        COLUMNS.forEach(col => grouped[col.id] = []);
        initialListings.forEach(l => {
            const stage = COLUMNS.find(c => c.id === l.status) ? l.status : "Novo";
            if (!grouped[stage]) grouped[stage] = [];
            grouped[stage].push(l);
        });
        return grouped;
    });

    useEffect(() => {
        const grouped: Record<string, Listing[]> = {};
        COLUMNS.forEach(col => grouped[col.id] = []);
        initialListings.forEach(l => {
            const stage = COLUMNS.find(c => c.id === l.status) ? l.status : "Novo";
            if (!grouped[stage]) grouped[stage] = [];
            grouped[stage].push(l);
        });
        setColumns(grouped);
        setListings(initialListings);
    }, [initialListings]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as number);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;

        const activeId = active.id as number;
        const overId = over.id;
        const activeItem = listings.find(l => l.id === activeId);
        if (!activeItem) return;

        const sourceStage = activeItem.status;
        let destStage = overId as string;

        // If dropped over card
        if (activeItem.id !== overId) {
            const overCard = listings.find(l => l.id == overId);
            if (overCard) destStage = overCard.status;
        }

        if (sourceStage === destStage) return;

        // Optimistic Update
        const updatedListings = listings.map(l => l.id === activeId ? { ...l, status: destStage } : l);
        setListings(updatedListings);

        const newColumns = { ...columns };
        newColumns[sourceStage] = newColumns[sourceStage].filter(l => l.id !== activeId);
        const movedItem = { ...activeItem, status: destStage };
        newColumns[destStage] = [...newColumns[destStage], movedItem];
        setColumns(newColumns);

        // Server Action
        const res = await updateListingStatus(activeId, destStage);
        if (!res.success) toast.error("Erro ao atualizar status.");

        // Special: Promote to Property if moving to 'Captado'
        if (destStage === "Captado" && sourceStage !== "Captado") {
            toast.promise(promoteListingToProperty(activeId), {
                loading: 'Criando imóvel no sistema...',
                success: 'Imóvel criado e publicado com sucesso! 🎉',
                error: 'Erro ao criar imóvel.'
            });
        }
    };

    const activeItem = activeId ? listings.find(l => l.id === activeId) : null;

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex h-full gap-4 overflow-x-auto pb-4 px-2 snap-x">
                {COLUMNS.map(col => (
                    <KanbanColumn key={col.id} col={col} items={columns[col.id] || []} onClickCard={() => { }} />
                ))}
            </div>
            <DragOverlay>
                {activeItem ? (
                    <Card className="cursor-grabbing shadow-2xl rotate-2 w-[280px] border-l-4 border-l-indigo-500">
                        <CardContent className="p-3">
                            <span className="font-semibold text-sm">{activeItem.address}</span>
                        </CardContent>
                    </Card>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
