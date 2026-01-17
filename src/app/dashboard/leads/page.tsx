import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getLeads } from "@/app/actions/leads";
import { KanbanBoard } from "@/components/kanban-board";
import { CreateLeadModal } from "@/components/create-lead-modal";

export default async function LeadsPage() {
    const result = await getLeads();

    // Ensure pipelineStage is present, strictly typing for the component
    const leads = result.success && result.data ? result.data.map(l => ({
        ...l,
        pipelineStage: (l as any).pipelineStage || 'Novo'
    })) : [];

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-100px)]">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100">Pipeline de Leads</h2>
                    <p className="text-gray-500">Gerencie o funil de vendas dos seus clientes em estilo Kanban.</p>
                </div>
                <CreateLeadModal />
            </div>

            <div className="flex-1 min-h-0">
                <KanbanBoard initialLeads={leads as any} />
            </div>
        </div>
    );
}
