// Agenciamento Page
import { AgenciamentoBoard } from "@/components/dashboard/agenciamento-board";
import { getListings } from "@/app/actions/listings";
import { CreateListingButton } from "@/components/dashboard/create-listing-button"; // New component

export default async function AgenciamentoPage() {
    const res = await getListings();
    const listings = res.success && res.data ? res.data : [];

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col">
            <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">Agenciamento e Captação 🕵️‍♂️</h1>
                    <p className="text-muted-foreground">Gerencie proprietários e transforme leads em imóveis.</p>
                </div>
                <CreateListingButton />
            </header>

            <main className="flex-1 overflow-hidden p-6 bg-slate-50/50">
                <AgenciamentoBoard initialListings={listings as any} />
            </main>
        </div>
    );
}
