'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/actions-auth'; // We need to create this action
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Lock, User, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 px-4 sm:px-0">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600">
                        <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
                        Titan Imóveis
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Acesse o sistema de gestão imobiliária
                    </p>
                </div>

                <div className="bg-white py-8 px-6 shadow-xl rounded-2xl ring-1 ring-gray-900/5 sm:px-10">
                    <form action={dispatch} className="mb-0 space-y-6">
                        <div>
                            <Label htmlFor="email">E-mail</Label>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="admin@titan.com"
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="password">Senha</Label>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    placeholder="******"
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
                                <AlertCircle className="h-4 w-4" />
                                <p>{errorMessage}</p>
                            </div>
                        )}

                        <div>
                            <Button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                disabled={isPending}
                            >
                                {isPending ? 'Entrando...' : 'Entrar na Plataforma'}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">Credenciais Demo</span>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-center text-xs text-gray-400">
                            admin@titan.com / admin123
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
