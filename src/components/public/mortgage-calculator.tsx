"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Calculator, DollarSign, Calendar } from "lucide-react";

interface MortgageCalculatorProps {
    propertyPrice: number;
}

export function MortgageCalculator({ propertyPrice }: MortgageCalculatorProps) {
    const [loanAmount, setLoanAmount] = useState(propertyPrice * 0.8); // Default 80% financing
    const [downPayment, setDownPayment] = useState(propertyPrice * 0.2);
    const [interestRate, setInterestRate] = useState(10.5); // Annual rate %
    const [years, setYears] = useState(30);
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    useEffect(() => {
        calculateMortgage();
    }, [loanAmount, interestRate, years]);

    const calculateMortgage = () => {
        const principal = loanAmount;
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = years * 12;

        if (monthlyRate === 0) {
            setMonthlyPayment(principal / numberOfPayments);
            return;
        }

        const mortgage =
            (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        setMonthlyPayment(mortgage);
    };

    const handleDownPaymentChange = (value: number) => {
        setDownPayment(value);
        setLoanAmount(propertyPrice - value);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <Card className="shadow-md border-slate-200 bg-slate-50">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Calculator className="h-5 w-5 text-emerald-600" />
                    Simulador de Financiamento
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <Label>Valor da Entrada (20% mín)</Label>
                        <span className="font-semibold text-emerald-700">{formatCurrency(downPayment)}</span>
                    </div>
                    <Slider
                        value={[downPayment]}
                        min={propertyPrice * 0.1}
                        max={propertyPrice * 0.9}
                        step={1000}
                        onValueChange={(val: number[]) => handleDownPaymentChange(val[0])}
                        className="py-2"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-1 text-xs text-muted-foreground">
                            <DollarSign className="h-3 w-3" /> Juros Anuais (%)
                        </Label>
                        <Input
                            type="number"
                            value={interestRate}
                            onChange={(e) => setInterestRate(Number(e.target.value))}
                            step="0.1"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" /> Prazo (Anos)
                        </Label>
                        <Input
                            type="number"
                            value={years}
                            onChange={(e) => setYears(Number(e.target.value))}
                            max={35}
                        />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border flex flex-col items-center justify-center text-center space-y-1">
                    <span className="text-muted-foreground text-sm">Parcela Estimada</span>
                    <span className="text-3xl font-bold text-slate-900">{formatCurrency(monthlyPayment)}</span>
                </div>

                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 font-semibold h-12">
                    Obter Aprovação no Banco
                </Button>
            </CardContent>
        </Card>
    );
}
