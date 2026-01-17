import { getSelection } from "@/app/actions/leads";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { MapPin, Bed, Bath, Car, Maximize, Phone, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function SharedSelectionPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const result = await getSelection(slug);

    if (!result.success || !result.data) {
        notFound();
    }

    const properties = result.data;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <header className="bg-white border-b shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                            T
                        </div>
                        <span className="font-semibold text-gray-800">Titan Imóveis</span>
                    </div>
                    <Button variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                        <Phone className="w-4 h-4 mr-2" />
                        Falar com Corretor
                    </Button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-emerald-900 text-white py-16 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=20')] opacity-10 bg-cover bg-center"></div>
                <div className="relative z-10 max-w-2xl mx-auto">
                    <Badge className="mb-4 bg-emerald-500 hover:bg-emerald-600 text-white border-none">Exclusivo</Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Seleção Especial para Você</h1>
                    <p className="text-emerald-100 text-lg">
                        Separamos essas oportunidades com base no seu perfil. Confira os detalhes abaixo.
                    </p>
                </div>
            </section>

            {/* Properties Grid */}
            <main className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map((property) => (
                        <div key={property.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow flex flex-col group">
                            {/* Image */}
                            <div className="relative h-64 bg-gray-200 overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={property.image || '/placeholder.png'}
                                    alt={property.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4">
                                    <span className="bg-white/90 backdrop-blur text-emerald-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(property.price)}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="text-sm text-emerald-600 font-medium mb-1">{property.type}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                                <div className="flex items-center text-gray-500 text-sm mb-4">
                                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                    {property.address}
                                </div>

                                {/* Features */}
                                <div className="grid grid-cols-4 gap-2 border-y py-4 mb-4">
                                    <div className="text-center">
                                        <Bed className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                        <span className="text-sm font-semibold">{property.bedrooms}</span>
                                    </div>
                                    <div className="text-center">
                                        <Bath className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                        <span className="text-sm font-semibold">{property.bathrooms}</span>
                                    </div>
                                    <div className="text-center">
                                        <Car className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                        <span className="text-sm font-semibold">{property.garage}</span>
                                    </div>
                                    <div className="text-center">
                                        <Maximize className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                        <span className="text-sm font-semibold">{property.area}</span>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4">
                                    <a
                                        href={`https://wa.me/5511999999999?text=${encodeURIComponent(`Olá! Tenho interesse no imóvel da seleção exclusiva: *${property.title}* (Ref: ${property.id}). \n\nVi no site: ${property.address}. \nValor: R$ ${property.price}`)}`}
                                        target="_blank"
                                        className="w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white h-12 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                                    >
                                        <MessageCircle className="w-5 h-5 mr-2" />
                                        Chamar no WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="bg-gray-900 text-white py-8 text-center mt-12">
                <p className="text-gray-500">© 2024 Titan Imóveis Soluções Imobiliárias</p>
            </footer>
        </div>
    );
}
