"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { useState, useEffect } from "react";


// Quick Debounce Hook Implementation inside file if simpler
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export function PropertyFilters() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [filters, setFilters] = useState({
        search: searchParams.get("search") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        bedrooms: searchParams.get("bedrooms") || "",
        type: searchParams.get("type") || "todos"
    });

    const [isOpen, setIsOpen] = useState(false); // Mobile toggle

    const debouncedFilters = useDebounceValue(filters, 500);

    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedFilters.search) params.set("search", debouncedFilters.search);
        if (debouncedFilters.minPrice) params.set("minPrice", debouncedFilters.minPrice);
        if (debouncedFilters.maxPrice) params.set("maxPrice", debouncedFilters.maxPrice);
        if (debouncedFilters.bedrooms) params.set("bedrooms", debouncedFilters.bedrooms);
        if (debouncedFilters.type && debouncedFilters.type !== "todos") params.set("type", debouncedFilters.type);

        router.push(`${pathname}?${params.toString()}`);
    }, [debouncedFilters, router, pathname]);

    const handleClear = () => {
        setFilters({
            search: "",
            minPrice: "",
            maxPrice: "",
            bedrooms: "",
            type: "todos"
        });
    };

    return (
        <div className="bg-white p-4 rounded-xl border shadow-sm">
            <div className="flex items-center justify-between mb-4 md:hidden">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Filter className="w-5 h-5" /> Filtros
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? "Ocultar" : "Mostrar"}
                </Button>
            </div>

            <div className={`space-y-4 ${isOpen ? 'block' : 'hidden md:block'}`}>
                {/* Search Term */}
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por bairro, condomínio..."
                        className="pl-9"
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Property Type */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Tipo de Imóvel</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={filters.type}
                            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                        >
                            <option value="todos">Todos os Tipos</option>
                            <option value="Apartamento">Apartamento</option>
                            <option value="Casa">Casa</option>
                            <option value="Cobertura">Cobertura</option>
                            <option value="Studio">Studio</option>
                            <option value="Terreno">Terreno</option>
                            <option value="Comercial">Comercial</option>
                        </select>
                    </div>

                    {/* Bedrooms */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Quartos (Mín)</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={filters.bedrooms}
                            onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
                        >
                            <option value="">Qualquer</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                        </select>
                    </div>

                    {/* Price Min */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Preço Mín (R$)</label>
                        <Input
                            type="number"
                            placeholder="0"
                            value={filters.minPrice}
                            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                        />
                    </div>

                    {/* Price Max */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Preço Máx (R$)</label>
                        <Input
                            type="number"
                            placeholder="Ilimitado"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground hover:text-red-500 text-xs gap-1">
                        <X className="w-3 h-3" /> Limpar Filtros
                    </Button>
                </div>
            </div>
        </div>
    );
}
