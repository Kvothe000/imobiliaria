"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Instagram, Palette, Layout, Wand2, Copy } from "lucide-react";
import { toPng } from "html-to-image";
import { generateInstagramCaption } from "@/app/actions/ai";
import { toast } from "sonner"; // Assuming sonner is installed/used, if not use alert

interface SocialShareCardProps {
    property: {
        title: string;
        price: number;
        image: string | null;
        address: string;
        bedrooms: number;
        area: number;
        bathrooms?: number;
        garage?: number;
        transactions?: any[];
    };
    agent: {
        name: string;
        image: string | null;
        email: string;
    };
}

export function SocialShareCard({ property, agent }: SocialShareCardProps) {
    // ... existing hooks
    const cardRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [template, setTemplate] = useState<"modern" | "elegant" | "bold">("modern");

    // ... existing AI state
    const [caption, setCaption] = useState("");
    const [generatingCaption, setGeneratingCaption] = useState(false);

    // ... existing handlers (lines 35-74)
    // ... copy them or keep them if I use "replace" carefully. 
    // Wait, "replace_file_content" replaces a chunk. I should be careful not to delete logic.
    // I will replace the Interface and the Function signature, and then the JSX manually.
    // Let's do it in chunks.

    // Chunk 1: Interface & Signature (already defined above in ReplacementContent)

    // Chunk 2: The Render Logic. I'll define a helper for the footer.
    const renderAgentFooter = (textColor: string, subTextColor: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto', borderTop: `1px solid ${subTextColor}40`, paddingTop: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: `2px solid ${textColor}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={agent.image || 'https://ui-avatars.com/api/?name=' + agent.name}
                    alt={agent.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    crossOrigin="anonymous"
                />
            </div>
            <div>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: textColor, lineHeight: '1.2' }}>{agent.name}</p>
                <p style={{ fontSize: '9px', color: subTextColor, textTransform: 'uppercase' }}>Corretor(a) Titan Imóveis</p>
            </div>
            {/* Logo Placeholder */}
            <div style={{ marginLeft: 'auto', opacity: 0.8 }}>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: textColor, border: `1px solid ${textColor}`, padding: '2px 6px', borderRadius: '4px' }}>TITAN</span>
            </div>
        </div>
    );
    // ... handlers
    const handleGenerateCaption = async () => {
        setGeneratingCaption(true);
        const result = await generateInstagramCaption(property.title, property.address, template);
        if (result.success && result.data) {
            setCaption(result.data);
        } else {
            console.error("Failed to generate caption");
        }
        setGeneratingCaption(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(caption);
        toast.success("Legenda copiada para a área de transferência!");
    };

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                canvasWidth: 1080,
                canvasHeight: 1350,
                pixelRatio: 1,
            });

            const link = document.createElement("a");
            link.download = `imovel-${property.title.replace(/\s+/g, '-').toLowerCase()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error: any) {
            console.error("Erro detalhado ao gerar imagem:", error);
            alert(`Erro: ${error?.message || "Falha ao gerar o card."}`);
        } finally {
            setLoading(false);
        }
    };

    // Helper to render icons/text safely with inline styles
    const renderFeature = (value: number | undefined, label: string, color: string, labelColor: string) => {
        if (value === undefined) return null;
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ display: 'block', fontSize: '24px', fontWeight: 'bold', color: color }}>
                    {value}
                </span>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: labelColor, opacity: 0.9 }}>
                    {label}
                </span>
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 text-pink-600 border-pink-200 hover:bg-pink-50 hover:text-pink-700">
                    <Instagram className="w-4 h-4" />
                    Gerar Post
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl bg-gray-50 h-[90vh] md:h-auto overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Gerador de Instagram Pro 📸</DialogTitle>
                    <DialogDescription>
                        Escolha o estilo que mais combina com este imóvel.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col md:flex-row gap-6 py-4">
                    {/* Controls Column */}
                    <div className="w-full md:w-5/12 space-y-5">
                        {/* ... Controls (Layout same) ... */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                                <Palette className="w-4 h-4" /> Estilo Visual
                            </label>
                            <Tabs defaultValue="modern" className="w-full" onValueChange={(v) => setTemplate(v as any)}>
                                <TabsList className="w-full grid grid-cols-3 h-auto p-1 bg-gray-100 border border-gray-200">
                                    <TabsTrigger value="modern" className="text-xs sm:text-sm py-2">Moderno</TabsTrigger>
                                    <TabsTrigger value="elegant" className="text-xs sm:text-sm py-2">Elegante</TabsTrigger>
                                    <TabsTrigger value="bold" className="text-xs sm:text-sm py-2">Oferta</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm space-y-3">
                            <p className="font-semibold text-slate-800 flex items-center gap-2">
                                <Layout className="w-4 h-4" /> Dados no Card:
                            </p>
                            <ul className="grid grid-cols-1 gap-1.5 pl-1 text-slate-600 text-xs">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Foto Principal HD</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Preço & Detalhes</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> <b>Seus dados de Corretor</b></li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Legenda com IA</li>
                            </ul>
                        </div>

                        <Button
                            onClick={handleDownload}
                            disabled={loading}
                            className="w-full h-11 text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md transition-all active:scale-95"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {loading ? "Gerando..." : "Baixar para Instagram"}
                        </Button>

                        {/* AI Caption Section */}
                        <div className="border-t border-gray-200 pt-4 mt-2">
                            {/* ... (Keep existing caption UI) ... */}
                            <label className="text-sm font-medium flex items-center gap-2 text-purple-700 mb-3">
                                <Wand2 className="w-4 h-4" /> Legenda Automática (IA)
                            </label>

                            {!caption ? (
                                <Button
                                    variant="secondary"
                                    className="w-full bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
                                    onClick={handleGenerateCaption}
                                    disabled={generatingCaption}
                                >
                                    {generatingCaption ? "A IA está escrevendo..." : "✨ Gerar Legenda Atraente"}
                                </Button>
                            ) : (
                                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                                    <textarea
                                        className="w-full text-xs p-3 border border-gray-200 rounded-lg h-32 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white resize-none"
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        placeholder="A legenda aparecerá aqui..."
                                    />
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="flex-1 gap-2 border-dashed" onClick={() => setCaption("")}>
                                            Limpar
                                        </Button>
                                        <Button size="sm" className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700 text-white" onClick={copyToClipboard}>
                                            <Copy className="w-3 h-3" /> Copiar
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preview Column */}
                    <div className="w-full md:w-7/12 flex items-center justify-center bg-gray-100/50 rounded-xl border border-gray-200 min-h-[460px] p-4 overflow-hidden">
                        <div
                            ref={cardRef}
                            style={{
                                width: '350px',
                                height: '437.5px', // Aspect 4:5
                                position: 'relative',
                                overflow: 'hidden',
                                borderRadius: '0px',
                                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
                                backgroundColor: template === 'elegant' ? '#ffffff' : '#000000',
                                fontFamily: 'sans-serif',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            {/* --- TEMPLATE 1: MODERN DARK --- */}
                            {template === 'modern' && (
                                <>
                                    {/* Image (Top 60%) */}
                                    <div style={{ height: '60%', position: 'relative', overflow: 'hidden' }}>
                                        {property.image && (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={property.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
                                        )}
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #111827, transparent)' }} />
                                    </div>

                                    {/* Content (Bottom 40%) */}
                                    <div style={{ flex: 1, backgroundColor: '#111827', padding: '16px 24px', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ marginBottom: 'auto' }}>
                                            <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', lineHeight: '1.2', marginBottom: '4px' }}>{property.title}</h2>
                                            <p style={{ color: '#9CA3AF', fontSize: '12px' }}>{property.address.split(',')[1] || property.address}</p>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', margin: '12px 0' }}>
                                            {renderFeature(property.bedrooms, 'Quartos', 'white', '#10B981')}
                                            {renderFeature(property.bathrooms, 'Banhos', 'white', '#10B981')}
                                            {renderFeature(property.garage, 'Vagas', 'white', '#10B981')}
                                            {renderFeature(property.area, 'm²', 'white', '#10B981')}
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                            <p style={{ color: '#34D399', fontSize: '20px', fontWeight: 'bold' }}>
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}
                                            </p>
                                        </div>

                                        {renderAgentFooter('white', '#9CA3AF')}
                                    </div>
                                </>
                            )}

                            {/* --- TEMPLATE 2: ELEGANT LIGHT --- */}
                            {template === 'elegant' && (
                                <>
                                    <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', border: '12px solid #F3F4F6' }}>
                                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                            <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '8px', color: '#6B7280' }}>Coleção Exclusiva</p>
                                            <h2 style={{ fontSize: '20px', fontFamily: 'serif', color: '#111827', margin: '4px 0' }}>{property.title}</h2>
                                        </div>

                                        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: '2px', marginBottom: '16px' }}>
                                            {property.image && (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <img src={property.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
                                            )}
                                        </div>

                                        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                <div style={{ textAlign: 'center' }}>
                                                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>{property.bedrooms}</span>
                                                    <span style={{ fontSize: '8px', color: '#9CA3AF', display: 'block' }}>BEDS</span>
                                                </div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>{property.area}</span>
                                                    <span style={{ fontSize: '8px', color: '#9CA3AF', display: 'block' }}>M²</span>
                                                </div>
                                            </div>
                                            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', fontFamily: 'serif' }}>
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}
                                            </p>
                                        </div>

                                        {renderAgentFooter('#111827', '#6B7280')}
                                    </div>
                                </>
                            )}

                            {/* --- TEMPLATE 3: BOLD OPPORTUNITY --- */}
                            {template === 'bold' && (
                                <>
                                    <div style={{ position: 'absolute', inset: 0 }}>
                                        {property.image && (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={property.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
                                        )}
                                        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(220, 38, 38, 0.85)', mixBlendMode: 'multiply' }} />
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #7f1d1d)' }} />
                                    </div>

                                    <div style={{ position: 'relative', height: '100%', padding: '24px', display: 'flex', flexDirection: 'column', color: 'white' }}>
                                        <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                                            <div style={{ border: '2px solid white', display: 'inline-block', padding: '6px 12px', marginBottom: '16px', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.1em', fontSize: '10px' }}>
                                                Oportunidade Única
                                            </div>
                                            <h2 style={{ fontSize: '24px', fontWeight: 'bold', lineHeight: '1.1', marginBottom: '8px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                                                {property.title}
                                            </h2>
                                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FEF08A', marginBottom: '24px' }}>
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}
                                            </div>
                                        </div>

                                        {renderAgentFooter('white', 'rgba(255,255,255,0.7)')}
                                    </div>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
