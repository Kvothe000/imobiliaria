"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Home,
    Users,
    DollarSign,
    Settings,
    Building2,
    LogOut,
    MessageSquare,
    Globe
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
    },
    {
        label: "Imóveis",
        icon: Home,
        href: "/dashboard/properties",
        color: "text-violet-500",
    },
    {
        label: "Leads & Clientes",
        icon: Users,
        href: "/dashboard/leads",
        color: "text-pink-700",
    },
    {
        label: "Equipe",
        icon: Users,
        href: "/dashboard/team",
        color: "text-orange-500",
    },
    {
        label: "Financeiro",
        icon: DollarSign,
        href: "/dashboard/financial",
        color: "text-emerald-500",
    },
    {
        label: "Automação (Bot)",
        icon: MessageSquare,
        href: "/dashboard/automation",
        color: "text-emerald-500",
    },
    {
        label: "Agenciamento (Captação)",
        icon: Building2,
        href: "/dashboard/agenciamento",
        color: "text-indigo-500",
    },
    {
        label: "Configurações",
        icon: Settings,
        href: "/dashboard/settings",
        color: "text-gray-400",
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white border-r border-white/10 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-0 w-full h-[200px] bg-emerald-500/10 blur-[100px] pointer-events-none" />

            <div className="px-3 py-2 flex-1 relative z-10">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14 group">
                    <div className="relative w-8 h-8 mr-4 transition-transform group-hover:scale-110 duration-500">
                        <Building2 className="w-8 h-8 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                        Titan Imóveis
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-xl transition-all duration-300 relative overflow-hidden",
                                pathname === route.href
                                    ? "text-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5 hover:translate-x-1"
                            )}
                        >
                            <div className="flex items-center flex-1 relative z-10">
                                <route.icon className={cn("h-5 w-5 mr-3 transition-colors duration-300", route.color, pathname === route.href ? "drop-shadow-md" : "")} />
                                {route.label}
                            </div>
                            {pathname === route.href && (
                                <div className="absolute inset-0 bg-emerald-500/5" />
                            )}
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2 space-y-2 relative z-10 glass m-3 rounded-xl border-white/5 bg-black/20">
                <Link
                    href="/"
                    target="_blank"
                    className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                    <div className="flex items-center flex-1">
                        <Globe className="h-5 w-5 mr-3 text-blue-400" />
                        Ver Site Público
                    </div>
                </Link>
                <form action={async () => {
                    const { logout } = await import("@/app/actions-auth");
                    await logout();
                }}>
                    <button
                        type="submit"
                        className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition"
                    >
                        <div className="flex items-center flex-1">
                            <LogOut className="h-5 w-5 mr-3 text-red-500" />
                            Sair
                        </div>
                    </button>
                </form>
                <div className="p-3">
                    <ModeToggle />
                </div>
            </div>
        </div>
    );
}
