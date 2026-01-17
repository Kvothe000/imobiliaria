
import { getPublicProperties } from "@/app/actions/properties";
import { Hero } from "@/components/public/hero";
import { PublicPropertyCard } from "@/components/public/property-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MoveRight } from "lucide-react";

export default async function PublicHomePage() {
    const { data: properties, success } = await getPublicProperties();

    return (
        <div className="flex flex-col gap-16 pb-16">
            <Hero />

            <section className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Destaques Recentes</h2>
                        <p className="text-muted-foreground mt-1">Imóveis selecionados especialmente para você.</p>
                    </div>
                    <Link href="/imoveis">
                        <Button variant="ghost" className="gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                            Ver todos <MoveRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {success && properties && properties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {properties.map((property) => (
                            <PublicPropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed text-muted-foreground">
                        <p>Nenhum imóvel disponível no momento.</p>
                    </div>
                )}
            </section>

            {/* Testimonials Section (Social Proof) */}
            <section className="container mx-auto px-4 md:px-6 py-16">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 text-center mb-12">O que nossos clientes dizem</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { name: "Ana Clara", role: "Comprou no Jardins", text: "A Titan Imóveis encontrou exatamente o que eu buscava. O atendimento foi impecável do início ao fim." },
                        { name: "Roberto Silva", role: "Investidor", text: "A agilidade na negociação e a transparência me deram total segurança. Recomendo para todos os meus parceiros." },
                        { name: "Mariana Costa", role: "Primeiro Imóvel", text: "Eu estava perdida com tanta burocracia, mas a equipe facilitou tudo. Hoje moro no apartamento dos meus sonhos." }
                    ].map((testimonial, idx) => (
                        <div key={idx} className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex gap-1 mb-4 text-emerald-500">
                                {[...Array(5)].map((_, i) => <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.005Z" clipRule="evenodd" /></svg>)}
                            </div>
                            <p className="text-slate-600 mb-6 italic">"{testimonial.text}"</p>
                            <div>
                                <p className="font-semibold text-slate-900">{testimonial.name}</p>
                                <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Lead Capture Section */}
            <section className="container mx-auto px-4 md:px-6">
                <div className="bg-emerald-900 rounded-2xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-4 max-w-xl">
                            <h2 className="text-3xl font-bold text-white">Receba oportunidades exclusivas</h2>
                            <p className="text-emerald-100 text-lg">
                                Cadastre-se em nossa lista VIP e receba em primeira mão os imóveis que acabaram de chegar no mercado, antes de serem anunciados publicamente.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    placeholder="Seu melhor e-mail"
                                    className="flex h-12 w-full rounded-md border border-emerald-700 bg-emerald-950/50 px-3 py-2 text-sm text-white placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-emerald-900"
                                />
                                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold h-12 px-8">
                                    Quero participar
                                </Button>
                            </div>
                            <p className="text-xs text-emerald-300">
                                🔒 Respeitamos sua privacidade. Cancele a qualquer momento.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 transform rotate-3">
                                <div className="space-y-2">
                                    <div className="h-2 w-20 bg-emerald-400 rounded"></div>
                                    <div className="h-2 w-32 bg-emerald-500/50 rounded"></div>
                                </div>
                                <div className="mt-4 flex gap-4">
                                    <div className="h-12 w-12 rounded-full bg-emerald-400/20"></div>
                                    <div className="space-y-2">
                                        <div className="h-2 w-24 bg-white/40 rounded"></div>
                                        <div className="h-2 w-16 bg-white/20 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="bg-emerald-900 text-white py-20">
                <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
                    <h2 className="text-3xl font-bold">Quer vender seu imóvel?</h2>
                    <p className="text-emerald-100 max-w-2xl mx-auto text-lg">
                        Conte com a nossa tecnologia e expertise para vender mais rápido.
                        Temos a melhor vitrine digital da região.
                    </p>
                    <Button size="lg" variant="secondary" className="bg-white text-emerald-900 hover:bg-emerald-50">
                        Anunciar meu imóvel
                    </Button>
                </div>
            </section>
        </div>
    );
}
