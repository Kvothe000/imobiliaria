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
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        <Building2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        Titan Imóveis
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2 space-y-2">
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
                    // Dynamic import to avoid client-side bundling issues with server actions if needed, 
                    // but here we can just call the imported function if we pass it as a prop or import it.
                    // Since Sidebar is client, we need to be careful.
                    // Actually, easiest way is to use a simple button and onClick handler that calls the Server Action? 
                    // No, for Server Actions in Client Components, we can just import it.
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
