
import db from "@/lib/db";
import { PublicHeader } from "@/components/public/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BedDouble, Bath, Car, Maximize, MapPin, ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyGallery } from "@/components/public/property-gallery";
import { HeroCarousel } from "@/components/public/hero-carousel";
import { FloatingWhatsApp } from "@/components/public/floating-whatsapp";
import { SmartContactButton } from "@/components/public/smart-contact-button";
import { getSimilarProperties } from "@/app/actions/properties";
import { ShareButton } from "@/components/public/share-button";
import { PublicPropertyCard } from "@/components/public/property-card";
import { MortgageCalculator } from "@/components/public/mortgage-calculator";
import { Flame } from "lucide-react";

// Directly accessing DB here since it's a Server Component
async function getProperty(id: number) {
    return await db.property.findUnique({
        where: { id },
    });
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = parseInt(params.id);
    if (isNaN(id)) return { title: "Imóvel não encontrado" };

    const property = await getProperty(id);
    if (!property) return { title: "Imóvel não encontrado" };

    const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price);

    return {
        title: `${property.title} - ${price} | Titan Imóveis`,
        description: property.description?.slice(0, 160) || "Confira este imóvel incrível!",
        openGraph: {
            title: `${property.title} | ${property.type} em ${property.neighborhood || 'Destaque'}`,
            description: `${property.bedrooms} Quartos • ${property.area}m² • ${price}. Clique para ver fotos e detalhes.`,
            images: [property.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80"],
            type: "website",
        },
    };
}

export default async function PropertyDetailsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = parseInt(params.id);
    if (isNaN(id)) return notFound();

    const property = await getProperty(id);
    if (!property) return notFound();

    if (property.status !== 'Disponível' || !property.publishOnPortals) {
        return notFound();
    }

    // Use property.gallery directly. If empty, component handles it or we pass a constructed array.
    // Ideally, if gallery is empty, HeroCarousel uses the main image.
    // If gallery is present, HeroCarousel uses gallery images (where the first one is likely the cover).
    // Use property.gallery directly.
    // Deduplicate images to prevent carousel/gallery issues.
    // If gallery is present, merge with cover but remove duplicates.
    const rawImages = property.gallery && property.gallery.length > 0
        ? [property.image, ...property.gallery].filter(Boolean) as string[]
        : [property.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80"];

    const images = Array.from(new Set(rawImages));

    // Fetch Similar Properties
    const { data: similarProperties } = await getSimilarProperties(id, property.type);

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const whatsappMessage = encodeURIComponent(`Olá, vi o imóvel "${property.title}" (Ref: ${property.code || id}) no site e gostaria de mais informações.`);
    const whatsappLink = `https://wa.me/5511999999999?text=${whatsappMessage}`;

    // Simulated View Count (Random number between 12 and 45)
    const viewCount = Math.floor(Math.random() * (45 - 12 + 1)) + 12;

    return (
        <div className="min-h-screen bg-slate-50 relative">
            <FloatingWhatsApp />

            <main className="pb-16">
                {/* Hero Carousel */}
                <HeroCarousel
                    images={images}
                    title={property.title}
                    type={property.type}
                    address={property.address}
                    price={formatPrice(property.price)}
                />

                <div className="container mx-auto px-4 md:px-6 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">


                        {/* Scarcity Badge */}
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <div className="bg-amber-100 p-2 rounded-full">
                                <Flame className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">Alta Procura!</p>
                                <p className="text-xs text-amber-700">
                                    <span className="font-bold">{viewCount} pessoas</span> visualizaram este imóvel nas últimas 24h.
                                </p>
                            </div>
                        </div>

                        {/* Gallery Grid (Secondary View) */}
                        <PropertyGallery
                            title={property.title}
                            images={images.slice(1)}
                        />

                        {/* Features Grid */}
                        <Card>
                            <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
                                    <BedDouble className="h-6 w-6 text-emerald-600 mb-2" />
                                    <span className="font-bold text-xl">{property.bedrooms}</span>
                                    <span className="text-sm text-muted-foreground">Quartos</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
                                    <Bath className="h-6 w-6 text-emerald-600 mb-2" />
                                    <span className="font-bold text-xl">{property.bathrooms}</span>
                                    <span className="text-sm text-muted-foreground">Banheiros</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
                                    <Car className="h-6 w-6 text-emerald-600 mb-2" />
                                    <span className="font-bold text-xl">{property.garage}</span>
                                    <span className="text-sm text-muted-foreground">Vagas</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
                                    <Maximize className="h-6 w-6 text-emerald-600 mb-2" />
                                    <span className="font-bold text-xl">{property.area}</span>
                                    <span className="text-sm text-muted-foreground">m² Úteis</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <div className="prose max-w-none">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Sobre o imóvel</h2>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                {property.description || "Descrição não informada pelo corretor."}
                            </p>
                        </div>

                        {/* Mortgage Calculator Integration */}
                        <div className="pt-8 border-t">
                            <MortgageCalculator propertyPrice={property.price} />
                        </div>
                    </div>

                    {/* Sidebar / CTA */}
                    <div className="space-y-6">
                        <Card className="sticky top-24 border-emerald-100 shadow-lg">
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Valor Venda</p>
                                    <p className="text-3xl font-bold text-emerald-700">{formatPrice(property.price)}</p>
                                </div>

                                {property.iptuPrice > 0 && (
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-slate-600">IPTU</span>
                                        <span className="font-medium">{formatPrice(property.iptuPrice)}</span>
                                    </div>
                                )}
                                {property.condoPrice > 0 && (
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-slate-600">Condomínio</span>
                                        <span className="font-medium">{formatPrice(property.condoPrice)}</span>
                                    </div>
                                )}

                                <div className="pt-4">
                                    <div className="pt-4 space-y-3">
                                        <ShareButton
                                            title="Titan Imóveis"
                                            text={`Confira este imóvel: ${property.title}`}
                                        />
                                        <SmartContactButton
                                            propertyTitle={property.title}
                                            propertyCode={property.code || id}
                                        />
                                        <p className="text-xs text-center text-muted-foreground mt-2">
                                            Fale diretamente com o corretor responsável e agende sua visita.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Similar Properties Section */}
                {similarProperties && similarProperties.length > 0 && (
                    <div className="container mx-auto px-4 md:px-6 mt-16 border-t pt-16">
                        <h2 className="text-2xl font-bold mb-6">Imóveis Semelhantes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {similarProperties.map((prop) => (
                                <PublicPropertyCard key={prop.id} property={prop} />
                            ))}
                        </div>
                    </div>
                )}
            </main>
            {/* Mobile Sticky Action Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex gap-3 items-center">
                <div className="flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Valor de Venda</p>
                    <p className="font-bold text-emerald-700 text-lg">
                        {formatPrice(property.price)}
                    </p>
                </div>
                <a
                    href={whatsappLink}
                    target="_blank"
                    className="flex-1"
                >
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-md h-12 text-base">
                        Chamar no WhatsApp
                    </Button>
                </a>
            </div>
        </div>
    );
}
