import { auth } from "@/auth";
import { getProperty } from "@/app/actions/properties";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bed, Bath, Car, Maximize, MapPin, Heart, MessageSquare } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SocialShareCard } from "@/components/properties/social-share-card";
import { EditPropertyModal } from "@/components/edit-property-modal";
import { InstagramCardModal } from "@/components/properties/instagram-card-modal";

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth(); // Get current user (Agent)

    // ... (rest of code)

    const result = await getProperty(parseInt(id));
    if (!result.success || !result.data) notFound();
    const property = result.data;

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between">
                <Link href="/dashboard/properties">
                    <Button variant="ghost" className="hover:bg-gray-100">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar para Imóveis
                    </Button>
                </Link>
                <div className="flex gap-2">
                    <SocialShareCard
                        property={property}
                        agent={{
                            name: session?.user?.name || "Titan Imóveis",
                            image: session?.user?.image || null,
                            email: session?.user?.email || ""
                        }}
                    />
                    <Button variant="outline" size="icon">
                        <Heart className="w-4 h-4" />
                    </Button>
                    <InstagramCardModal property={property} />
                    <EditPropertyModal property={property as any}>
                        <Button>
                            Editar Imóvel
                        </Button>
                    </EditPropertyModal>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Gallery & Description */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Main Image */}
                    <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100 h-[400px] bg-gray-100 relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={property.image || '/placeholder.png'}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                            <Badge className={property.status === 'Disponível' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'}>
                                {property.status}
                            </Badge>
                        </div>
                    </div>

                    {/* Description Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Sobre este imóvel</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {property.description || "Nenhuma descrição fornecida para este imóvel."}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Info & Value */}
                <div className="space-y-6">
                    <Card className="border-emerald-100 shadow-md">
                        <CardContent className="p-6">
                            <div className="space-y-1 mb-4">
                                <span className="text-sm text-gray-500 font-medium">{property.type}</span>
                                <h1 className="text-2xl font-bold text-gray-900 leading-tight">{property.title}</h1>
                                <div className="flex items-center text-gray-500 text-sm">
                                    <MapPin className="w-4 h-4 mr-1 text-emerald-600" />
                                    {property.address}
                                </div>
                            </div>

                            <div className="my-6 pt-6 border-t border-gray-100">
                                <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Valor de Venda</div>
                                <div className="text-4xl font-bold text-emerald-600">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                                    <Bed className="w-5 h-5 text-gray-400 mb-1" />
                                    <span className="font-bold text-gray-900">{property.bedrooms}</span>
                                    <span className="text-xs text-gray-500">Quartos</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                                    <Bath className="w-5 h-5 text-gray-400 mb-1" />
                                    <span className="font-bold text-gray-900">{property.bathrooms}</span>
                                    <span className="text-xs text-gray-500">Banheiros</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                                    <Car className="w-5 h-5 text-gray-400 mb-1" />
                                    <span className="font-bold text-gray-900">{property.garage}</span>
                                    <span className="text-xs text-gray-500">Vagas</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                                    <Maximize className="w-5 h-5 text-gray-400 mb-1" />
                                    <span className="font-bold text-gray-900">{property.area}</span>
                                    <span className="text-xs text-gray-500">m²</span>
                                </div>
                            </div>

                            <Link
                                href={`https://wa.me/5511999999999?text=${encodeURIComponent(`Olá! Tenho interesse no imóvel *${property.title}* (Ref: ${property.id}). \n\nVi no Dashboard: ${property.address}. \nValor: R$ ${property.price}`)}`}
                                target="_blank"
                                className="w-full mt-6"
                            >
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg shadow-lg hover:shadow-xl transition-all">
                                    <MessageSquare className="w-5 h-5 mr-2" />
                                    Chamar no WhatsApp
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
