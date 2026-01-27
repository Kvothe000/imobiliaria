import { getProperties } from "@/app/actions/properties";
import { getLeads } from "@/app/actions/leads";
import { notFound } from "next/navigation";
import { SmartMatchClient } from "@/components/smart-match/smart-match-client";

export default async function SmartMatchPage({ params }: { params: Promise<{ leadId: string }> }) {
    const { leadId } = await params;

    // Fetch Data
    const [propertiesResult, leadsResult] = await Promise.all([
        getProperties(),
        getLeads()
    ]);

    const properties = propertiesResult.data || [];
    const leads = leadsResult.data || [];

    const lead = leads.find((l: any) => l.id === parseInt(leadId));

    if (!lead) {
        return notFound();
    }

    // Filter properties only 'Disponível'
    const activeProperties = properties.filter((p: any) => p.status === 'Disponível');

    return (
        <div className="container mx-auto py-6 animate-in fade-in duration-500">
            <SmartMatchClient lead={lead} properties={activeProperties} />
        </div>
    );
}
