import Link from "next/link";
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";

export function PublicFooter() {
    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Brand & About */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
                            <span className="text-emerald-500">Titan</span>Imóveis
                        </Link>
                        <p className="text-sm leading-relaxed">
                            Transformando a maneira de encontrar o lar dos seus sonhos com tecnologia e atendimento premium.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-white">Acesso Rápido</h3>
                        <nav className="flex flex-col gap-2 text-sm">
                            <Link href="/" className="hover:text-emerald-500 transition-colors">Início</Link>
                            <Link href="/imoveis" className="hover:text-emerald-500 transition-colors">Imóveis</Link>
                            <Link href="/sobre" className="hover:text-emerald-500 transition-colors">Sobre Nós</Link>
                            <Link href="/login" className="hover:text-emerald-500 transition-colors">Área do Corretor</Link>
                        </nav>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-white">Contato</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-emerald-500" />
                                <span>Av. Paulista, 1000 - SP</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-emerald-500" />
                                <span>(11) 99999-9999</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-emerald-500" />
                                <span>contato@titanimoveis.com.br</span>
                            </div>
                        </div>
                    </div>

                    {/* Social */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-white">Redes Sociais</h3>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>&copy; 2026 Titan Imóveis. Todos os direitos reservados.</p>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-slate-400">Termos de Uso</Link>
                        <Link href="#" className="hover:text-slate-400">Privacidade</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
