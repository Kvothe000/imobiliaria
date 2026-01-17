import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function Hero() {
    return (
        <section className="relative h-[500px] flex items-center justify-center bg-slate-900 text-white overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1600596542815-e32c21216af3?q=80&w=2000&auto=format&fit=crop"
                    alt="Luxury Home"
                    className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center space-y-8">
                <div className="space-y-4 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                        Encontre o imóvel dos seus <span className="text-emerald-500">sonhos</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-200 text-shadow">
                        Ajudamos você a encontrar o lugar perfeito para viver novas histórias.
                    </p>
                </div>

                {/* Search Box */}
                <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20 shadow-2xl flex gap-2">
                    <Input
                        placeholder="Digite o bairro, cidade ou código..."
                        className="bg-transparent border-none text-white placeholder:text-slate-300 focus-visible:ring-0 h-12 px-6"
                    />
                    <Button size="lg" className="rounded-full bg-emerald-600 hover:bg-emerald-700 h-12 w-12 p-0 shrink-0">
                        <Search className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </section>
    );
}
