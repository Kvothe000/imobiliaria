import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getProperties } from "@/app/actions/properties";
import { CreatePropertyModal } from "@/components/create-property-modal";
import { EditPropertyModal } from "@/components/edit-property-modal";
import Link from "next/link";

export default async function PropertiesPage() {
    const result = await getProperties();
    const properties = result.success && result.data ? result.data : [];

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100">Meus Imóveis</h2>
                    <p className="text-gray-500">Gerencie seu portfólio de vendas e locação.</p>
                </div>
                <CreatePropertyModal />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input placeholder="Buscar por título, endereço..." className="pl-9" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Imagem</TableHead>
                                <TableHead>Título</TableHead>
                                <TableHead>Preço</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {properties.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                        Nenhum imóvel encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : properties.map((property) => (
                                <TableRow key={property.id}>
                                    <TableCell>
                                        <Link href={`/dashboard/properties/${property.id}`} className="block w-16 h-16 rounded-md overflow-hidden bg-gray-100 relative hover:ring-2 ring-emerald-500 transition-all">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={property.image || '/placeholder.png'} alt={property.title} className="w-full h-full object-cover" />
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/dashboard/properties/${property.id}`} className="group">
                                            <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 transition-colors">{property.title}</div>
                                            <div className="text-sm text-gray-500 flex items-center mt-1">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {property.address}
                                            </div>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="font-semibold text-emerald-600">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${property.status === 'Disponível' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {property.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <EditPropertyModal property={property} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
