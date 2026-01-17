import { getAllAppointments } from "@/app/actions/leads";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Calendar, Clock, MapPin, Phone, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AppointmentsPage() {
    const result = await getAllAppointments();
    const appointments = result.data || [];

    // Group appointments by date
    const groupedAppointments: Record<string, typeof appointments> = {};

    appointments.forEach(apt => {
        // Use a consistent key for grouping
        const dateKey = format(new Date(apt.date), 'yyyy-MM-dd');
        if (!groupedAppointments[dateKey]) {
            groupedAppointments[dateKey] = [];
        }
        groupedAppointments[dateKey].push(apt);
    });

    // Sort keys just in case
    const sortedDates = Object.keys(groupedAppointments).sort();

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500 max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard" className="text-muted-foreground hover:text-gray-900">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-800">Minha Agenda 📅</h2>
                    </div>
                    <p className="text-gray-500 pl-7">Gerencie suas visitas e compromissos imobiliários.</p>
                </div>
                <Button>
                    <Link href="/dashboard/leads">Novo Agendamento</Link>
                </Button>
            </div>

            {sortedDates.length > 0 ? (
                <div className="space-y-8">
                    {sortedDates.map(dateKey => {
                        const dateObj = new Date(dateKey + 'T00:00:00'); // Append time to parse correctly in local if needed, or better use the first apt date
                        // Actually, taking the first valid appt date object is safer to avoid timezone mixups with string parsing
                        const displayDateObj = new Date(groupedAppointments[dateKey][0].date);

                        const isToday = new Date().toDateString() === displayDateObj.toDateString();

                        return (
                            <div key={dateKey} className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <h3 className={`text-xl font-bold capitalize ${isToday ? 'text-emerald-600' : 'text-gray-700'}`}>
                                        {isToday ? 'Hoje, ' : ''}{format(displayDateObj, "EEEE, d 'de' MMMM", { locale: ptBR })}
                                    </h3>
                                    <div className="h-[1px] flex-1 bg-gray-200"></div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    {groupedAppointments[dateKey].map(apt => (
                                        <Card key={apt.id} className="hover:shadow-md transition-shadow border-l-4 border-l-emerald-500">
                                            <CardContent className="p-5 flex gap-4">
                                                {/* Time Box */}
                                                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg h-16 w-16 min-w-[64px] border">
                                                    <Clock className="w-4 h-4 text-emerald-600 mb-1" />
                                                    <span className="font-bold text-gray-800 text-sm">{format(new Date(apt.date), 'HH:mm')}</span>
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 space-y-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-bold text-gray-900 truncate">{apt.lead.name}</h4>
                                                        <Badge variant={apt.status === 'Agendado' ? 'default' : 'secondary'} className={apt.status === 'Agendado' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : ''}>
                                                            {apt.status}
                                                        </Badge>
                                                    </div>

                                                    {apt.property ? (
                                                        <p className="text-sm text-gray-600 flex items-center gap-1 truncate" title={apt.property.title}>
                                                            <HomeIcon className="w-3 h-3 text-gray-400" />
                                                            {apt.property.title}
                                                        </p>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 italic">Nenhum imóvel vinculado</p>
                                                    )}

                                                    {apt.notes && (
                                                        <p className="text-xs text-gray-500 line-clamp-1 bg-yellow-50 p-1 rounded">
                                                            📝 {apt.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </CardContent>

                                            {/* Action Footer (WhatsApp) */}
                                            <div className="bg-gray-50/50 p-2 border-t flex justify-end gap-2 px-4">
                                                <Button variant="ghost" size="sm" className="h-8 text-xs text-green-600 hover:text-green-700 hover:bg-green-50" asChild>
                                                    <a
                                                        href={`https://wa.me/55${apt.lead.phone.replace(/\D/g, '')}?text=Olá ${apt.lead.name}, confirmando nossa visita para hoje às ${format(new Date(apt.date), 'HH:mm')}.`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <MessageSquare className="w-3 h-3 mr-1.5" />
                                                        Confirmar
                                                    </a>
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-8 text-xs text-gray-500 hover:text-gray-900" asChild>
                                                    <Link href={`/dashboard/leads`}>
                                                        Ver Lead
                                                    </Link>
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Agenda Vazia</h3>
                    <p className="text-gray-500 mb-6">Você não tem visitas agendadas para os próximos dias.</p>
                    <Button asChild>
                        <Link href="/dashboard/leads">Agendar no Pipeline</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}

function HomeIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    )
}
