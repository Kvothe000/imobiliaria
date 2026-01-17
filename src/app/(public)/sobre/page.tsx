import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building2, Trophy, ArrowRight, HeartHandshake } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative h-[500px] w-full overflow-hidden bg-slate-900">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
                        alt="Escritório Titan Imóveis"
                        className="w-full h-full object-cover"
                    />
                    {/* Gradient Overlay for Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/50 to-slate-900/90"></div>
                </div>

                {/* Hero Content */}
                <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-lg">
                        Construindo Sonhos, <br className="hidden md:block" /> Concretizando Lares
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-100 max-w-3xl drop-shadow-md font-light">
                        Mais do que vender imóveis, nossa missão é encontrar o cenário perfeito para os próximos capítulos da sua vida.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-32">
                    <Card className="border-none shadow-2xl bg-white backdrop-blur-sm hover:-translate-y-2 transition-transform duration-300">
                        <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                            <div className="p-4 bg-emerald-100 rounded-full mb-2">
                                <Building2 className="h-10 w-10 text-emerald-600" />
                            </div>
                            <span className="text-5xl font-bold text-slate-900 tracking-tight">+500</span>
                            <span className="text-lg text-slate-600 font-medium uppercase tracking-wide">Imóveis Vendidos</span>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-2xl bg-white backdrop-blur-sm hover:-translate-y-2 transition-transform duration-300">
                        <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                            <div className="p-4 bg-emerald-100 rounded-full mb-2">
                                <Users className="h-10 w-10 text-emerald-600" />
                            </div>
                            <span className="text-5xl font-bold text-slate-900 tracking-tight">+1200</span>
                            <span className="text-lg text-slate-600 font-medium uppercase tracking-wide">Famílias Felizes</span>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-2xl bg-white backdrop-blur-sm hover:-translate-y-2 transition-transform duration-300">
                        <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                            <div className="p-4 bg-emerald-100 rounded-full mb-2">
                                <Trophy className="h-10 w-10 text-emerald-600" />
                            </div>
                            <span className="text-5xl font-bold text-slate-900 tracking-tight">15 Anos</span>
                            <span className="text-lg text-slate-600 font-medium uppercase tracking-wide">De Excelência</span>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
                    <div className="space-y-8 order-2 lg:order-1">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold tracking-wider uppercase">
                            <HeartHandshake className="h-4 w-4" /> Nossa História
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                            Uma trajetória marcada pela <span className="text-emerald-600">confiança</span>.
                        </h2>
                        <div className="space-y-6 text-lg text-slate-600 leading-relaxed text-justify">
                            <p>
                                Fundada com o propósito de transformar a experiência de compra e venda de imóveis, a
                                <strong> Titan Imóveis</strong> combina a tradição do atendimento personalizado com a eficiência da tecnologia de ponta.
                            </p>
                            <p>
                                Acreditamos que cada cliente é único e que cada imóvel tem uma história. Nossa equipe de especialistas não apenas mostra casas, mas entende necessidades, alinha expectativas e garante a segurança jurídica de cada negócio.
                            </p>
                            <p>
                                Seja para investir ou morar, estamos prontos para guiar você com transparência, agilidade e, acima de tudo, respeito pelo seu patrimônio.
                            </p>
                        </div>
                        <div className="pt-6">
                            <Link href="/imoveis">
                                <Button size="lg" className="h-14 px-8 text-lg bg-emerald-600 hover:bg-emerald-700 gap-3 shadow-xl hover:shadow-emerald-200/50 transition-all">
                                    Ver Imóveis Disponíveis
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="relative order-1 lg:order-2">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-600/20 to-indigo-600/20 rounded-[2rem] -z-10 rotate-3 blur-sm"></div>
                        <img
                            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                            alt="Equipe Titan Imóveis"
                            className="rounded-2xl shadow-2xl w-full object-cover h-[600px] border-4 border-white"
                        />
                    </div>
                </div>

                {/* CTA Section */}
                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-slate-900">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
                    </div>

                    <div className="relative z-10 p-12 md:p-24 text-center space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold text-white max-w-4xl mx-auto">
                            Pronto para fazer um bom negócio?
                        </h2>
                        <p className="text-slate-300 text-xl max-w-2xl mx-auto font-light">
                            Nossos corretores estão online agora para tirar suas dúvidas e apresentar as melhores oportunidades do mercado.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                            <Link href="/imoveis">
                                <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 transition-all font-semibold">
                                    Encontrar Imóvel
                                </Button>
                            </Link>
                            <Link href="https://wa.me/5511999999999" target="_blank">
                                <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg bg-emerald-600 text-white hover:bg-emerald-500 hover:scale-105 transition-all shadow-lg shadow-emerald-900/20">
                                    Falar no WhatsApp
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
