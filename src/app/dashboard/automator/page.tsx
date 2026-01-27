import { AutomatorClient } from "@/components/automator/automator-client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Titan Automator | Dashboard",
    description: "Automação inteligente de fluxos para corretores.",
};

export default function AutomatorPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Titan Automator 🤖
                </h2>
                <div className="flex items-center space-x-2">
                    {/* Future: Add 'New Flow' button here if needed globally */}
                </div>
            </div>
            <p className="text-muted-foreground">
                Crie fluxos inteligentes para automatizar sua rotina. "Se X acontecer, faça Y".
            </p>

            <AutomatorClient />
        </div>
    );
}
