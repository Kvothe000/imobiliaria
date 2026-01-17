"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, RefreshCw, Smartphone } from "lucide-react";

type Message = {
    id: number;
    text: string;
    sender: "bot" | "user";
};

export function ChatSimulator() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Olá! Tudo bem? Qual seu nome?", sender: "bot" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // User Message
        const userMsg: Message = { id: Date.now(), text: inputValue, sender: "user" };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");

        // Simulated Bot Response (Delay)
        setTimeout(() => {
            const botMsg: Message = {
                id: Date.now() + 1,
                text: "Entendi! (Esta é uma resposta simulada do fluxo configurado)",
                sender: "bot"
            };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-3xl border-4 border-gray-800 shadow-2xl overflow-hidden relative" style={{ aspectRatio: '9/19', maxHeight: '750px' }}>
            {/* Notch / Header */}
            <div className="bg-emerald-600 p-4 text-white flex items-center gap-3 shadow-md z-10">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-sm font-bold">WhatsApp Beta</h3>
                    <p className="text-[10px] opacity-80">Online agora</p>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto text-white hover:bg-white/20" onClick={() => setMessages([{ id: 1, text: "Olá! Tudo bem? Qual seu nome?", sender: "bot" }])}>
                    <RefreshCw className="w-4 h-4" />
                </Button>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[#e5ddd5] opacity-50 z-0 pointer-events-none"
                style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d986a26d1e.png')", backgroundSize: "400px" }}
            />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 z-10 relative">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg p-2 text-sm shadow-sm ${msg.sender === "user"
                                    ? "bg-[#d9fdd3] text-gray-800 rounded-tr-none"
                                    : "bg-white text-gray-800 rounded-tl-none"
                                }`}
                        >
                            {msg.text}
                            <div className={`text-[9px] text-right mt-1 ${msg.sender === "user" ? "text-green-800/60" : "text-gray-400"}`}>
                                11:42
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-[#f0f2f5] p-3 flex gap-2 items-center z-10 relative">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Digite uma mensagem"
                    className="bg-white border-none rounded-full h-10 shadow-sm focus-visible:ring-0"
                />
                <Button
                    onClick={handleSend}
                    size="icon"
                    className="rounded-full bg-emerald-600 hover:bg-emerald-700 h-10 w-10 shrink-0"
                >
                    <Send className="w-5 h-5 ml-0.5" />
                </Button>
            </div>
        </div>
    );
}
