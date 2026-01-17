"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save, Play, MessageSquare, Settings, Zap } from "lucide-react";
import { BotConfigurator } from "@/components/automation/bot-configurator";
import { ChatSimulator } from "../../../components/automation/chat-simulator";
import { ScoreRules } from "../../../components/automation/score-rules";

export default function AutomationPage() {
    const [activeTab, setActiveTab] = useState("flow");
    const [isSimulating, setIsSimulating] = useState(false);

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] gap-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Automação & Chatbot 🤖</h1>
                    <p className="text-gray-500">Configure seu assistente virtual 24/7 e defina regras de qualificação.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsSimulating(!isSimulating)}>
                        <Play className="w-4 h-4 mr-2 text-emerald-600" />
                        {isSimulating ? "Ocultar Simulador" : "Testar Bot"}
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Alterações
                    </Button>
                </div>
            </div>

            <div className="flex gap-6 h-full items-start">
                {/* Main Configuration Area */}
                <div className="flex-1 h-full overflow-hidden flex flex-col">
                    <Tabs defaultValue="flow" className="h-full flex flex-col" onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-3 max-w-[400px] mb-4">
                            <TabsTrigger value="flow">
                                <MessageSquare className="w-4 h-4 mr-2" /> Fluxo de Conversa
                            </TabsTrigger>
                            <TabsTrigger value="scoring">
                                <Zap className="w-4 h-4 mr-2" /> Regras de Score
                            </TabsTrigger>
                            <TabsTrigger value="settings">
                                <Settings className="w-4 h-4 mr-2" /> Ajustes
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex-1 overflow-y-auto pr-2 pb-10">
                            <TabsContent value="flow" className="mt-0 h-full">
                                <Card className="h-full border-gray-200">
                                    <CardHeader>
                                        <CardTitle>Fluxo de Qualificação</CardTitle>
                                        <CardDescription>Defina as perguntas que o bot fará para novos leads.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <BotConfigurator />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="scoring" className="mt-0">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Pontuação Automática (Lead Score)</CardTitle>
                                        <CardDescription>Atribua pontos baseados nas respostas do cliente.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ScoreRules />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="settings" className="mt-0">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Configurações Gerais</CardTitle>
                                        <CardDescription>Horário de atendimento e mensagens de erro.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center py-10 text-gray-500">
                                            🚧 Em breve: Horários e Fallbacks.
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                {/* Simulator Sidebar */}
                {isSimulating && (
                    <div className="w-[380px] h-full animate-in slide-in-from-right duration-300 border-l pl-6">
                        <ChatSimulator />
                    </div>
                )}
            </div>
        </div>
    );
}
