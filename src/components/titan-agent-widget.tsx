"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, X, Send, MessageCircle, Sparkles, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";

export function TitanAgentWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
    } as any) as any;
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="w-[350px] sm:w-[380px] shadow-2xl"
                    >
                        <Card className="border-0 shadow-2xl overflow-hidden glass rounded-2xl flex flex-col h-[500px]">
                            <CardHeader className="p-4 border-b bg-gradient-to-r from-gray-900 to-gray-800 text-white flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                                        <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center border border-white/20 relative z-10">
                                            <Sparkles className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-gray-900 z-20"></div>
                                    </div>
                                    <div>
                                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                                            Titan Agent
                                            <span className="text-[10px] bg-blue-500/30 px-1.5 py-0.5 rounded text-blue-200 uppercase tracking-wide">Beta</span>
                                        </CardTitle>
                                        <p className="text-xs text-blue-200/70">Online • 24/7 Concierge</p>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10" onClick={() => setIsOpen(false)}>
                                    <X size={18} />
                                </Button>
                            </CardHeader>

                            <CardContent className="flex-1 p-0 overflow-hidden bg-gray-50/50 dark:bg-black/40 backdrop-blur-sm">
                                <ScrollArea ref={scrollRef} className="h-full p-4 overflow-y-auto">
                                    {(!messages || messages.length === 0) && (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-4 text-gray-400 space-y-3 opacity-80">
                                            <Bot size={40} className="mb-2 text-primary/40" />
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Olá! Sou a IA da Titan.</p>
                                            <p className="text-xs">Posso ajudar a encontrar o imóvel perfeito ou avaliar sua propriedade.</p>
                                            <div className="grid grid-cols-1 gap-2 w-full mt-4">
                                                <Button variant="outline" size="sm" className="text-xs h-auto py-2 justify-start font-normal bg-white/50" onClick={() => handleInputChange({ target: { value: "Estou buscando um imóvel de luxo" } } as any)}>
                                                    💎 Busco imóvel de luxo
                                                </Button>
                                                <Button variant="outline" size="sm" className="text-xs h-auto py-2 justify-start font-normal bg-white/50" onClick={() => handleInputChange({ target: { value: "Quero vender meu imóvel" } } as any)}>
                                                    🏡 Quero vender meu imóvel
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {(messages || []).map((m: any) => (
                                            <div
                                                key={m.id}
                                                className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                                        }`}
                                                >
                                                    {m.role === 'assistant' && (
                                                        <Avatar className="h-8 w-8 border border-white/20 shadow-sm mt-1">
                                                            <AvatarImage src="/titan-bot.png" />
                                                            <AvatarFallback className="bg-gray-900 text-blue-400 text-xs">AI</AvatarFallback>
                                                        </Avatar>
                                                    )}

                                                    <div
                                                        className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${m.role === 'user'
                                                            ? 'bg-blue-600 text-white rounded-tr-sm'
                                                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-sm'
                                                            }`}
                                                    >
                                                        {m.content}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {isLoading && (
                                            <div className="flex justify-start w-full">
                                                <div className="flex gap-2 max-w-[85%] flex-row">
                                                    <Avatar className="h-8 w-8 border border-white/20 shadow-sm mt-1">
                                                        <AvatarFallback className="bg-gray-900 text-blue-400 text-xs">AI</AvatarFallback>
                                                    </Avatar>
                                                    <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700">
                                                        <div className="flex gap-1">
                                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>

                            <CardFooter className="p-3 bg-white dark:bg-gray-900 border-t">
                                <form onSubmit={handleSubmit} className="flex gap-2 w-full items-center relative">
                                    <Input
                                        value={input}
                                        onChange={handleInputChange}
                                        placeholder="Digite sua mensagem..."
                                        className="pr-10 bg-gray-50 dark:bg-gray-800 border-0 focus-visible:ring-1 focus-visible:ring-blue-500"
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        className="absolute right-1 top-1 h-8 w-8 bg-blue-600 hover:bg-blue-700 rounded-lg transition-transform hover:scale-105 active:scale-95"
                                        disabled={isLoading || !input.trim()}
                                    >
                                        <Send size={14} className="text-white ml-0.5" />
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                    <Button
                        onClick={() => setIsOpen(true)}
                        size="icon"
                        className="h-14 w-14 rounded-full shadow-lg bg-gray-900 hover:bg-black text-white border-2 border-blue-500/50 relative group transition-all hover:scale-110"
                    >
                        <MessageCircle size={28} className="group-hover:rotate-12 transition-transform duration-300" />
                        <span className="absolute top-0 right-0 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
