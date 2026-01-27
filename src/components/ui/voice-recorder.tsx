"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
    onTranscriptionComplete: (text: string) => void;
}

export function VoiceRecorder({ onTranscriptionComplete }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState("");
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = "pt-BR";

            recognitionRef.current.onresult = (event: any) => {
                let interimTranscript = "";
                let finalTranscript = "";

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                if (finalTranscript) {
                    setTranscription((prev) => prev + " " + finalTranscript);
                    onTranscriptionComplete(finalTranscript); // Callback with the chunk
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                if (isRecording) stopRecording();
                toast.error("Erro na gravação de voz.");
            };
        }
    }, [onTranscriptionComplete, isRecording]);

    const startRecording = () => {
        if (recognitionRef.current) {
            setTranscription("");
            recognitionRef.current.start();
            setIsRecording(true);
            toast.info("Gravação iniciada. Fale agora...");
        } else {
            toast.error("Seu navegador não suporta reconhecimento de voz.");
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsRecording(false);
            toast.success("Gravação convertida em texto!");
        }
    };

    return (
        <div className="flex flex-col items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2 w-full">
                <Button
                    type="button"
                    variant={isRecording ? "destructive" : "secondary"}
                    size="icon"
                    className="h-10 w-10 rounded-full shrink-0 transition-all duration-300"
                    onClick={isRecording ? stopRecording : startRecording}
                >
                    {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-5 h-5" />}
                </Button>

                <div className="flex-1 min-w-0">
                    {isRecording ? (
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <div className="h-4 flex gap-0.5 items-end overflow-hidden">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-1 bg-red-400 rounded-full animate-[music-bar_1s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.1}s`, height: '100%' }} />
                                ))}
                            </div>
                            <span className="text-xs text-red-500 font-semibold animate-pulse">Gravando...</span>
                        </div>
                    ) : (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Volume2 className="w-3 h-3" />
                            Clique para falar
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
