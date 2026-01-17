"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, CheckCircle2, MessageSquare } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea"; // Assuming text area exists or use input
import { createAppointment } from "@/app/actions/leads";

interface ScheduleVisitModalProps {
    lead: { id: number; name: string; phone: string; pipelineStage: string };
    open: boolean;
    setOpen: (open: boolean) => void;
    propertyTitle?: string; // Optional pre-selected property
    propertyId?: number;
    onSuccess?: () => void;
}

const TIME_SLOTS = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00"
];

export function ScheduleVisitModal({ leadId, leadName, leadPhone = "", open, setOpen, propertyTitle, propertyId, onSuccess }: {
    leadId: number;
    leadName: string;
    leadPhone?: string;
    open: boolean;
    setOpen: (open: boolean) => void;
    propertyTitle?: string;
    propertyId?: number;
    onSuccess?: () => void;
}) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [whatsappLink, setWhatsappLink] = useState("");

    const handleConfirm = async () => {
        if (!date || !selectedTime) return;

        setIsSubmitting(true);
        try {
            // Constuct full date object
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            const [hours, minutes] = selectedTime.split(':').map(Number);

            const appointmentDate = new Date(year, month, day, hours, minutes);

            // Save to DB
            await createAppointment(leadId, appointmentDate, notes, propertyId);

            // Generate WhatsApp Link
            const formattedDate = format(appointmentDate, "dd/MM 'às' HH:mm", { locale: ptBR });
            const message = `Olá *${leadName}*! Tudo bem? \n\nGostaria de confirmar nossa visita${propertyTitle ? ` ao imóvel *${propertyTitle}*` : ""} para *${formattedDate}*.\n\nPodemos confirmar? 📍`;

            // Use a sanitary default if phone is missing
            const phone = leadPhone.replace(/\D/g, '') || "00000000000";
            const link = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
            setWhatsappLink(link);
            setConfirmed(true);

        } catch (error) {
            console.error("Failed to schedule", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        // Reset state after transition
        setTimeout(() => {
            setConfirmed(false);
            setDate(new Date());
            setSelectedTime(null);
            setNotes("");
        }, 300);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                {!confirmed ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Agendar Visita</DialogTitle>
                            <DialogDescription>
                                Agende uma visita para {leadName}. Um link de confirmação será gerado.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-4">
                            <div className="grid gap-3">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-emerald-500" />
                                    Data da Visita
                                </label>
                                <Popover modal={true}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal h-12 rounded-xl border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
                                            {date ? <span className="text-gray-900 font-medium">{format(date, "PPP", { locale: ptBR })}</span> : <span>Selecione uma data</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 rounded-xl shadow-xl border-gray-100" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                            locale={ptBR}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="grid gap-3">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-emerald-500" />
                                    Horário
                                </label>
                                <div className="grid grid-cols-4 gap-2 max-h-[140px] overflow-y-auto p-1">
                                    {TIME_SLOTS.map((time) => (
                                        <Button
                                            key={time}
                                            variant={selectedTime === time ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedTime(time)}
                                            className={cn(
                                                "text-xs h-9 rounded-lg border-gray-200 transition-all",
                                                selectedTime === time
                                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transform scale-105"
                                                    : "hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50"
                                            )}
                                        >
                                            {time}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Optional formatting for property display if available */}
                            {propertyTitle && (
                                <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded border">
                                    Imóvel: <span className="font-medium text-gray-900">{propertyTitle}</span>
                                </div>
                            )}

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Notas (Opcional)</label>
                                <textarea
                                    className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Ex: Cliente quer ver a área de lazer..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={handleClose}>Cancelar</Button>
                            <Button onClick={handleConfirm} disabled={!date || !selectedTime || isSubmitting}>
                                {isSubmitting ? "Agendando..." : "Confirmar Agendamento"}
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <div className="mx-auto bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                                <CheckCircle2 className="text-green-600 w-6 h-6" />
                            </div>
                            <DialogTitle className="text-center">Visita Agendada!</DialogTitle>
                            <DialogDescription className="text-center">
                                O agendamento foi salvo. Envie a confirmação agora.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-6 flex flex-col items-center gap-4">
                            <Button
                                className="w-full bg-green-500 hover:bg-green-600 text-white"
                                size="lg"
                                onClick={() => window.open(whatsappLink, '_blank')}
                            >
                                <MessageSquare className="mr-2 h-5 w-5" />
                                Enviar Confirmação por WhatsApp
                            </Button>
                            <Button variant="ghost" onClick={() => {
                                if (onSuccess) onSuccess();
                                handleClose();
                            }}>
                                Concluir (Mover Card)
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
