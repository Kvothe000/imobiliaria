
import { getAdvancedStats } from "@/app/actions/dashboard";
import { AdvancedFinancialDashboard } from "@/components/financial-dashboard-advanced";

export default async function FinancialPage() {
    const { success, data } = await getAdvancedStats();

    if (!success || !data) {
        return (
            <div className="p-8 text-center text-red-500">
                Erro ao carregar dados financeiros.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-gray-100">
                        Central de Performance
                    </h2>
                    <p className="text-slate-500 dark:text-gray-400">
                        Monitoramento de metas, ranking e receita da agência.
                    </p>
                </div>
            </div>

            <AdvancedFinancialDashboard stats={data} />
        </div>
    );
}
