"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Moon, Sun, Monitor, Bell, Shield, User, Palette, Zap } from "lucide-react";

export default function SettingsPage() {
    const { setTheme, theme } = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [reducedMotion, setReducedMotion] = useState(false);

    // Mock User Data
    const [user, setUser] = useState({
        name: "Matheus Titan",
        email: "matheus@titan.com",
        role: "Administrador"
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100">Configurações</h2>
                <p className="text-gray-500">Gerencie suas preferências e o comportamento do sistema.</p>
            </div>

            <Tabs defaultValue="appearance" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="appearance" className="gap-2"><Palette size={16} /> Aparência</TabsTrigger>
                    <TabsTrigger value="account" className="gap-2"><User size={16} /> Conta</TabsTrigger>
                    <TabsTrigger value="system" className="gap-2"><Zap size={16} /> Sistema</TabsTrigger>
                </TabsList>

                {/* --- Appearance Tab --- */}
                <TabsContent value="appearance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tema</CardTitle>
                            <CardDescription>
                                Escolha como você quer ver o Titan CRM.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid grid-cols-3 gap-4">
                                <Button
                                    variant={theme === 'light' ? 'default' : 'outline'}
                                    className="flex flex-col h-24 gap-2"
                                    onClick={() => setTheme('light')}
                                >
                                    <Sun className="h-6 w-6" />
                                    <span>Claro</span>
                                </Button>
                                <Button
                                    variant={theme === 'dark' ? 'default' : 'outline'}
                                    className="flex flex-col h-24 gap-2"
                                    onClick={() => setTheme('dark')}
                                >
                                    <Moon className="h-6 w-6" />
                                    <span>Escuro</span>
                                </Button>
                                <Button
                                    variant={theme === 'system' ? 'default' : 'outline'}
                                    className="flex flex-col h-24 gap-2"
                                    onClick={() => setTheme('system')}
                                >
                                    <Monitor className="h-6 w-6" />
                                    <span>Sistema</span>
                                </Button>
                            </div>

                            <div className="flex items-center justify-between space-x-2 border-t pt-4">
                                <div className="space-y-1">
                                    <Label>Movimento Reduzido</Label>
                                    <p className="text-sm text-gray-500">
                                        Desativar animações complexas para melhor performance ou acessibilidade.
                                    </p>
                                </div>
                                <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- Account Tab --- */}
                <TabsContent value="account" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Perfil</CardTitle>
                            <CardDescription>
                                Suas informações pessoais e de acesso.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src="/avatar-placeholder.png" />
                                    <AvatarFallback>MT</AvatarFallback>
                                </Avatar>
                                <Button variant="outline">Alterar Foto</Button>
                            </div>

                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nome Completo</Label>
                                    <Input id="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" value={user.email} disabled />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Função</Label>
                                    <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-800">
                                        <Shield className="h-4 w-4 text-emerald-600" />
                                        <span className="text-sm font-medium">{user.role}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- System Tab --- */}
                <TabsContent value="system" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notificações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Notificações de Leads</Label>
                                    <p className="text-sm text-gray-500">Receber alerta quando entrar novo lead.</p>
                                </div>
                                <Switch checked={notifications} onCheckedChange={setNotifications} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Sons do Sistema</Label>
                                    <p className="text-sm text-gray-500">Tocar som ao mover cards ou concluir tarefas.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-red-100 dark:border-red-900/30">
                        <CardHeader>
                            <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive" size="sm">Resetar Cache do Sistema</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
