"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateBudget, getBudgets } from "@/lib/server/budgets";
import { CATEGORIES } from "@/lib/server/constants";

export function BudgetManager() {
    const [budgets, setBudgets] = useState<Record<string, number>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadBudgets = async () => {
            const budgetData = await getBudgets();
            const budgetMap = budgetData.reduce((acc, { category, amount }) => {
                acc[category] = amount;
                return acc;
            }, {} as Record<string, number>);
            setBudgets(budgetMap);
        };
        loadBudgets();
    }, []);

    const handleBudgetChange = (category: string, value: string) => {
        setBudgets(prev => ({
            ...prev,
            [category]: parseFloat(value) || 0
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            for (const [category, amount] of Object.entries(budgets)) {
                if (CATEGORIES.includes(category as typeof CATEGORIES[number])) {
                    await updateBudget(category as typeof CATEGORIES[number], amount);
                }
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Monthly Budgets</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {CATEGORIES.map(category => (
                    <div key={category} className="space-y-2">
                        <Label htmlFor={`budget-${category}`}>{category}</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm">$</span>
                            <Input
                                id={`budget-${category}`}
                                type="number"
                                value={budgets[category] || 0}
                                onChange={(e) => handleBudgetChange(category, e.target.value)}
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>
                ))}
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Budgets"}
            </Button>
        </div>
    );
}