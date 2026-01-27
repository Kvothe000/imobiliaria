import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getLeads, getPipelineStages } from "@/app/actions/leads";
import { KanbanBoard } from "@/components/kanban-board";
import { CreateLeadModal } from "@/components/create-lead-modal";

export default async function LeadsPage() {
    const [leadsResult, stagesResult] = await Promise.all([
        getLeads(),
        getPipelineStages(1) // Default to Buy Pipeline
    ]);

    const stages = stagesResult.success && stagesResult.data ? stagesResult.data : [];

    // Ensure pipelineStage is present (Map from relation or fallback)
    const leads = leadsResult.success && leadsResult.data ? leadsResult.data.map(l => ({
        ...l,
        pipelineStage: l.stage?.name || 'Novo' // Use dynamic stage name
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
                <KanbanBoard initialLeads={leads as any} stages={stages} />
            </div>
        </div>
    );
}
