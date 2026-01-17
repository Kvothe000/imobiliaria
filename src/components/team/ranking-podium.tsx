import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Star } from "lucide-react";

interface Agent {
    id: string;
    name: string | null;
    image: string | null;
    salesCount: number;
    volume: number;
    badges?: string[];
}

export function RankingPodium({ agents }: { agents: Agent[] }) {
    if (agents.length < 3) return null; // Need at least 3 for podium

    const [first, second, third] = agents;

    return (
        <div className="w-full mb-12 mt-4">
            <h2 className="text-2xl font-bold text-center mb-10 flex items-center justify-center gap-2 relative z-0">
                <Trophy className="w-8 h-8 text-yellow-500" />
                Ranking do Mês
            </h2>

            <div className="flex justify-center items-end gap-4 h-[350px]">
                {/* 2nd Place */}
                <div className="flex flex-col items-center w-32 animate-in slide-in-from-bottom-10 duration-700 delay-100">
                    <Avatar className="w-20 h-20 border-4 border-slate-300 shadow-xl mb-[-20px] z-10">
                        <AvatarImage src={second.image || undefined} />
                        <AvatarFallback>2</AvatarFallback>
                    </Avatar>
                    <div className="bg-gradient-to-t from-slate-300 to-slate-100 w-full h-[180px] rounded-t-lg flex flex-col items-center justify-start pt-8 pb-4 border-x border-t border-slate-300 shadow-inner">
                        <div className="text-4xl font-black text-slate-400 mb-2">2</div>
                        <div className="text-center px-1">
                            <div className="font-bold text-sm truncate w-full">{second.name?.split(' ')[0]}</div>
                            <div className="text-xs text-slate-500">{second.salesCount} Vendas</div>
                        </div>
                    </div>
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center w-40 animate-in slide-in-from-bottom-20 duration-700">
                    <div className="relative">
                        <Trophy className="w-12 h-12 text-yellow-500 absolute -top-16 left-1/2 -translate-x-1/2 drop-shadow-lg animate-bounce" />
                        <Avatar className="w-28 h-28 border-4 border-yellow-400 shadow-2xl mb-[-25px] z-20 ring-4 ring-yellow-400/30">
                            <AvatarImage src={first.image || undefined} />
                            <AvatarFallback>1</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="bg-gradient-to-t from-yellow-400 to-yellow-100 w-full h-[240px] rounded-t-lg flex flex-col items-center justify-start pt-10 pb-4 border-x border-t border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)]">
                        <div className="text-6xl font-black text-yellow-600/80 mb-2">1</div>
                        <div className="text-center px-2">
                            <div className="font-bold text-lg truncate w-full">{first.name}</div>
                            <div className="text-sm font-semibold text-yellow-800">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(first.volume)}
                            </div>
                            <Badge className="mt-2 bg-yellow-500 hover:bg-yellow-600 border-yellow-600">MVP</Badge>
                        </div>
                    </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center w-32 animate-in slide-in-from-bottom-10 duration-700 delay-200">
                    <Avatar className="w-20 h-20 border-4 border-orange-300 shadow-xl mb-[-20px] z-10">
                        <AvatarImage src={third.image || undefined} />
                        <AvatarFallback>3</AvatarFallback>
                    </Avatar>
                    <div className="bg-gradient-to-t from-orange-300 to-orange-100 w-full h-[140px] rounded-t-lg flex flex-col items-center justify-start pt-8 pb-4 border-x border-t border-orange-300 shadow-inner">
                        <div className="text-4xl font-black text-orange-400 mb-2">3</div>
                        <div className="text-center px-1">
                            <div className="font-bold text-sm truncate w-full">{third.name?.split(' ')[0]}</div>
                            <div className="text-xs text-orange-700">{third.salesCount} Vendas</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
