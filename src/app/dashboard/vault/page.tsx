"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, Eye, EyeOff, Shield, Share2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// Mock Data for Vault Properties (Simulating Off-Market Inventory)
const INITIAL_VAULT_ITEMS = [
    {
        id: "v1",
        title: "Mansão Secreta no Joá",
        address: "Joatinga, RJ",
        price: "R$ 25.000.000",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80",
        views: 12,
        requests: 5,
        status: "LOCKED" // LOCKED, UNLOCKED_FOR_LEADS
    },
    {
        id: "v2",
        title: "Cobertura Off-Market Leblon",
        address: "Av. Delfim Moreira, Leblon",
        price: "R$ 55.000.000",
        image: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&q=80",
        views: 45,
        requests: 18,
        status: "LOCKED"
    }
];

export default function TheVaultPage() {
    const [vaultItems, setVaultItems] = useState(INITIAL_VAULT_ITEMS);

    const toggleLock = (id: string) => {
        setVaultItems(prev => prev.map(item =>
            item.id === id ? { ...item, status: item.status === "LOCKED" ? "UNLOCKED_FOR_LEADS" : "LOCKED" } : item
        ));
        toast.success("Status de privacidade atualizado!");
    };

    const copySecretLink = (id: string) => {
        navigator.clipboard.writeText(`https://titancrm.com/vault/${id}?token=secret_123`);
        toast.success("Link secreto copiado!");
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent flex items-center gap-2">
                        <Lock className="text-amber-400" size={28} /> The Vault
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gerencie propiedades exclusivas "Off-Market". Apenas convidados podem ver.
                    </p>
                </div>
                <Button className="bg-amber-500 hover:bg-amber-600 text-black font-bold border border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                    <Shield size={16} className="mr-2" /> Nova Propriedade Secreta
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Education Card */}
                <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-gray-900 border-amber-900/50 pb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-amber-500/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
                    <CardHeader>
                        <CardTitle className="text-amber-500 flex items-center gap-2"><EyeOff size={20} /> Estratégia de Escassez</CardTitle>
                        <CardDescription className="text-gray-400">
                            Propriedades no "Vault" aparecem borradas no site público.
                            Isso gera curiosidade e força o cadastro de leads qualificados (High Net Worth).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                        <div className="bg-black/40 p-4 rounded-lg border border-amber-500/20">
                            <h4 className="text-amber-400 font-bold text-lg">1. Blur Effect</h4>
                            <p className="text-xs text-gray-500 mt-1">Visitantes veem apenas a silhueta e bairro aproximado.</p>
                        </div>
                        <div className="bg-black/40 p-4 rounded-lg border border-amber-500/20">
                            <h4 className="text-amber-400 font-bold text-lg">2. Access Request</h4>
                            <p className="text-xs text-gray-500 mt-1">Lead solicita "Destrancar". Titan Agent qualifica antes de liberar.</p>
                        </div>
                        <div className="bg-black/40 p-4 rounded-lg border border-amber-500/20">
                            <h4 className="text-amber-400 font-bold text-lg">3. Exclusive Timer</h4>
                            <p className="text-xs text-gray-500 mt-1">Links gerados expiram em 24h, criando urgência real.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Vault Items */}
                {vaultItems.map((item) => (
                    <motion.div layout key={item.id}>
                        <Card className={`border-l-4 ${item.status === 'LOCKED' ? 'border-l-amber-500 border-amber-500/20' : 'border-l-green-500 border-green-500/20'} overflow-hidden relative group`}>
                            {item.status === 'LOCKED' && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Button variant="outline" className="text-white border-white bg-black/50 hover:bg-white hover:text-black" onClick={() => toggleLock(item.id)}>
                                        <Unlock size={16} className="mr-2" /> Destrancar
                                    </Button>
                                </div>
                            )}

                            <div className="relative h-48">
                                <img
                                    src={item.image}
                                    className={`w-full h-full object-cover transition-all duration-500 ${item.status === 'LOCKED' ? 'blur-sm grayscale-[50%]' : ''}`}
                                />
                                <Badge className={`absolute top-3 right-3 ${item.status === 'LOCKED' ? 'bg-amber-500 text-black' : 'bg-green-500 text-white'}`}>
                                    {item.status === 'LOCKED' ? <Lock size={12} className="mr-1" /> : <Unlock size={12} className="mr-1" />}
                                    {item.status === 'LOCKED' ? 'PRIVADO' : 'VISÍVEL'}
                                </Badge>
                            </div>

                            <CardContent className="p-4">
                                <h3 className="font-bold text-lg truncate">{item.status === 'LOCKED' ? '•••••••••••••••••' : item.title}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{item.address}</p>
                                <div className="text-xl font-mono font-bold text-amber-600 dark:text-amber-400">{item.price}</div>

                                <div className="flex gap-4 mt-4 text-xs text-muted-foreground border-t pt-3">
                                    <div className="flex items-center gap-1"><Eye size={12} /> {item.views} views</div>
                                    <div className="flex items-center gap-1"><Shield size={12} /> {item.requests} requests</div>
                                </div>
                            </CardContent>

                            <CardFooter className="p-4 pt-0 bg-gray-50/50 dark:bg-black/20 flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => toggleLock(item.id)}>
                                    {item.status === 'LOCKED' ? 'Liberar Acesso' : 'Trancar'}
                                </Button>
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white flex-1 text-xs" onClick={() => copySecretLink(item.id)}>
                                    <Copy size={12} className="mr-2" /> Link
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
