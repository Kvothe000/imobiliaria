import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function PublicHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <span className="text-emerald-600">Titan</span>Imóveis
                    </Link>
                    <nav className="hidden md:flex gap-6 text-sm font-medium">
                        <Link href="/" className="hover:text-emerald-600 transition-colors">Início</Link>
                        <Link href="/imoveis" className="hover:text-emerald-600 transition-colors">Imóveis</Link>
                        <Link href="/sobre" className="hover:text-emerald-600 transition-colors">Sobre</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {/* <Link href="/login">
                        <Button variant="ghost" size="sm">Área do Corretor</Button>
                    </Link> */}
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                        <MessageCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">Fale Conosco</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
