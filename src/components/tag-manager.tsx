"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, Plus, Tag as TagIcon, X } from "lucide-react";
import { useState } from "react";

export type Tag = {
    id: number;
    name: string;
    color: string;
    category?: string;
};

// Mock tags if not fetched yet, or pass as props
const AVAILABLE_TAGS: Tag[] = [
    { id: 1, name: "Investidor", color: "#f59e0b", category: "Perfil" },
    { id: 2, name: "Primeiro Imóvel", color: "#3b82f6", category: "Motivação" },
    { id: 3, name: "Urgente", color: "#ef4444", category: "Tempo" },
    { id: 4, name: "Permuta", color: "#8b5cf6", category: "Condição" },
    { id: 5, name: "À Vista", color: "#10b981", category: "Condição" },
];

interface TagManagerProps {
    selectedTags: number[];
    onTagsChange: (tags: number[]) => void;
}

export function TagManager({ selectedTags, onTagsChange }: TagManagerProps) {
    const [open, setOpen] = useState(false);

    const toggleTag = (tagId: number) => {
        if (selectedTags.includes(tagId)) {
            onTagsChange(selectedTags.filter(id => id !== tagId));
        } else {
            onTagsChange([...selectedTags, tagId]);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map(tagId => {
                    const tag = AVAILABLE_TAGS.find(t => t.id === tagId);
                    if (!tag) return null;
                    return (
                        <Badge
                            key={tag.id}
                            style={{ backgroundColor: tag.color + '20', color: tag.color, borderColor: tag.color + '50' }}
                            variant="outline"
                            className="pl-2 pr-1 py-1 gap-1"
                        >
                            {tag.name}
                            <div
                                role="button"
                                onClick={() => toggleTag(tag.id)}
                                className="hover:bg-black/10 rounded-full p-0.5 cursor-pointer"
                            >
                                <X className="w-3 h-3" />
                            </div>
                        </Badge>
                    );
                })}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 border-dashed border-gray-300 text-gray-500">
                            <Plus className="w-3 h-3 mr-1" /> Adicionar Tag
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[200px]" align="start">
                        <Command>
                            <CommandInput placeholder="Buscar tag..." />
                            <CommandList>
                                <CommandEmpty>Nenhuma tag encontrada.</CommandEmpty>
                                <CommandGroup>
                                    {AVAILABLE_TAGS.map((tag) => (
                                        <CommandItem
                                            key={tag.id}
                                            value={tag.name}
                                            onSelect={() => toggleTag(tag.id)}
                                        >
                                            <div
                                                className="w-2 h-2 rounded-full mr-2"
                                                style={{ backgroundColor: tag.color }}
                                            />
                                            {tag.name}
                                            <Check
                                                className={cn(
                                                    "ml-auto h-4 w-4",
                                                    selectedTags.includes(tag.id) ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            <input type="hidden" name="tags" value={JSON.stringify(selectedTags)} />
        </div>
    );
}
