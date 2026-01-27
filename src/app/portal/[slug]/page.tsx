"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, MapPin, DollarSign, Clock, MessageSquare, Heart, ThumbsDown, Star, ArrowRight } from "lucide-react";
import { fetchLeadsByStage } from "@/app/actions/leads"; // Mock, real app would fetch specific lead by ID

// Mock Data for the Portal
const MOCK_SUGGESTIONS = [
    {
        id: 101,
        title: "Cobertura Duplex no Leblon",
        price: "R$ 4.500.000",
        location: "Leblon, Rio de Janeiro",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
        matchScore: 98,
        status: "Disponível"
    },
    {
        id: 102,
        title: "Mansão em Condomínio Fechado",
        price: "R$ 12.000.000",
        location: "Barra da Tijuca, RJ",
        image: "https://images.unsplash.com/photo-1600596542815-22b4899975d6?auto=format&fit=crop&q=80",
        matchScore: 92,
        status: "Novidade"
    },
    {
        id: 103,
        title: "Apartamento Vista Mar",
        price: "R$ 3.200.000",
        location: "Ipanema, RJ",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80",
        matchScore: 88,
        status: "Oportunidade"
    }
];

export default function TitanSpacePortal() {
    const params = useParams();
    // In a real app, params.id would be a secure hash confirming the user identity
    const leadName = "Matheus"; // Personalized greeting
    const [activeTab, setActiveTab] = useState("matches");

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                <div className="container flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                        <div className="bg-black text-white p-1 rounded-md">
                            <Star size={18} fill="currentColor" />
                        </div>
                        Titan<span className="text-blue-600">Space</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-medium">Bem-vindo, {leadName}</span>
                            <span className="text-xs text-muted-foreground">Cliente VIP</span>
                        </div>
                        <Avatar>
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-blue-100 text-blue-700">M</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            <main className="container px-4 py-8 max-w-6xl mx-auto space-y-8">

                {/* Welcome Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row gap-6 items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl"
                >
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold">Sua Jornada para o Extraordinário.</h1>
                        <p className="text-blue-100 max-w-lg">
                            Nós selecionamos algumas propriedades exclusivas que combinam perfeitamente com o seu perfil.
                        </p>
                        <Button className="bg-white text-blue-700 hover:bg-white/90 font-semibold gap-2">
                            <MessageSquare size={16} /> Falar com Consultor
                        </Button>
                    </div>
                    <div className="hidden md:block">
                        {/* Abstract 3D shape or illustration could go here */}
                        <div className="w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                    </div>
                </motion.div>

                {/* Dashboard Tabs */}
                <Tabs defaultValue="matches" className="space-y-6" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                        <TabsTrigger value="matches">Meus Matches</TabsTrigger>
                        <TabsTrigger value="timeline">Minha Timeline</TabsTrigger>
                    </TabsList>

                    {/* --- Matches Tab --- */}
                    <TabsContent value="matches" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {MOCK_SUGGESTIONS.map((property, idx) => (
                                <motion.div
                                    key={property.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Card className="overflow-hidden border-0 shadow-lg group hover:shadow-2xl transition-all duration-300">
                                        <div className="relative h-64 overflow-hidden">
                                            <div className="absolute top-4 left-4 z-10 flex gap-2">
                                                <Badge className="bg-black/70 backdrop-blur-md text-white hover:bg-black/80">{property.status}</Badge>
                                                <Badge className="bg-green-500/90 backdrop-blur-md text-white border-0">{property.matchScore}% Match</Badge>
                                            </div>
                                            <img
                                                src={property.image}
                                                alt={property.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                        </div>
                                        <CardContent className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold text-lg leading-tight">{property.title}</h3>
                                                    <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                                                        <MapPin size={12} /> {property.location}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-baseline gap-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                {property.price}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-5 pt-0 flex gap-3">
                                            <Button variant="outline" className="flex-1 gap-2 hover:text-red-500 hover:border-red-200">
                                                <ThumbsDown size={16} /> Não gostei
                                            </Button>
                                            <Button className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                                                <Heart size={16} fill="currentColor" className="text-white/30" /> Amei!
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>

                    {/* --- Timeline Tab --- */}
                    <TabsContent value="timeline">
                        <Card>
                            <CardHeader>
                                <CardTitle>Progresso da Negociação</CardTitle>
                                <CardDescription>Acompanhe cada passo da sua jornada de compra.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-gray-800 p-4 rounded-xl border border-slate-200 dark:border-gray-700 shadow font-medium text-gray-800 dark:text-gray-200">
                                            <div className="flex items-center justify-between space-x-2 mb-1">
                                                <div className="font-bold text-slate-900 dark:text-slate-100">Primeiro Contato</div>
                                                <time className="font-mono italic text-xs text-slate-500">27 Jan</time>
                                            </div>
                                            <div className="text-slate-500 text-sm">Você se cadastrou na Titan Real Estate.</div>
                                        </div>
                                    </div>

                                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-gray-800 p-4 rounded-xl border border-slate-200 dark:border-gray-700 shadow font-medium text-gray-800 dark:text-gray-200">
                                            <div className="flex items-center justify-between space-x-2 mb-1">
                                                <div className="font-bold text-slate-900 dark:text-slate-100">Perfil Analisado</div>
                                                <time className="font-mono italic text-xs text-slate-500">Hoje</time>
                                            </div>
                                            <div className="text-slate-500 text-sm">Nossa IA selecionou as melhores opções para você.</div>
                                        </div>
                                    </div>

                                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                            <Clock size={20} />
                                        </div>
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-gray-800 p-4 rounded-xl border border-slate-200 dark:border-gray-700 shadow font-medium text-gray-800 dark:text-gray-200">
                                            <div className="flex items-center justify-between space-x-2 mb-1">
                                                <div className="font-bold text-slate-900 dark:text-slate-100">Visita</div>
                                                <time className="font-mono italic text-xs text-slate-500">Pendente</time>
                                            </div>
                                            <div className="text-slate-500 text-sm">Agende uma visita aos imóveis selecionados.</div>
                                            <Button variant="link" className="px-0 text-blue-500 text-xs">Agendar agora <ArrowRight size={10} className="ml-1" /></Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
