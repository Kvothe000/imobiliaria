"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, Briefcase, User, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
    const pathname = usePathname();

    const links = [
        { href: "/dashboard", label: "Home", icon: LayoutDashboard },
        { href: "/dashboard/leads", label: "Leads", icon: Briefcase },
        { href: "/dashboard/analytics", label: "BI", icon: PieChart },
        { href: "/dashboard/settings", label: "Perfil", icon: User },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white dark:bg-gray-900 z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 text-xs font-medium transition-colors",
                                isActive
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon size={20} className={cn(isActive && "fill-current opacity-20")} />
                            <span>{link.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
