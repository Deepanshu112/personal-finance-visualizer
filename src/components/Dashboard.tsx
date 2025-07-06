"use client";

import { useEffect, useState } from "react";
import { DollarSign, Utensils, Home, List } from "lucide-react";
import { SummaryCard } from "@/components/SummaryCard";
import { Transaction } from "@/lib/server/transactions";
import { getCategoryTotals } from "@/lib/server/constants";
import { TransactionsTable } from "./TransactionsTable";
import { getBudgets, Budget } from "@/lib/server/budgets";
import { BudgetChart } from "@/components/BudgetChart";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";

interface DashboardProps {
    transactions: Transaction[];
}

export function Dashboard({ transactions }: DashboardProps) {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    // Calculate totals

    useEffect(() => {
        const loadBudgets = async () => {
            const budgetData = await getBudgets();
            setBudgets(budgetData);
        };
        loadBudgets();
    }, []);

    const totalExpenses = transactions
        .reduce((sum, t) => sum + t.amount, 0)
        .toFixed(2);

    const categoryTotals = getCategoryTotals(transactions);
    const topCategory = categoryTotals.reduce(
        (max, item) => (item.total > max.total ? item : max),
        { category: "None", total: 0 }
    );

    const recentTransactions = transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    const budgetCards = budgets.map(budget => {
        const spent = transactions
            .filter(t => t.category === budget.category)
            .reduce((sum, t) => sum + t.amount, 0);
        const remaining = budget.amount - spent;
        const percentage = (spent / budget.amount) * 100;

        return (
            <Card key={budget.category}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{budget.category}</CardTitle>
                    <span className="text-xs text-muted-foreground">
                        ${budget.amount.toFixed(2)} budget
                    </span>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${spent.toFixed(2)}</div>
                    <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${percentage > 90 ? 'bg-red-500' :
                                    percentage > 75 ? 'bg-orange-500' : 'bg-green-500'
                                    }`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {percentage.toFixed(0)}%
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        ${remaining.toFixed(2)} remaining
                    </p>
                </CardContent>
            </Card>
        );
    });

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                    title="Total Expenses"
                    value={`$${totalExpenses}`}
                    description="All time spending"
                    icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                />
                <SummaryCard
                    title="Top Category"
                    value={topCategory.category}
                    description={`$${topCategory.total.toFixed(2)} spent`}
                    icon={<Utensils className="h-4 w-4 text-muted-foreground" />}
                />
                <SummaryCard
                    title="Transactions"
                    value={transactions.length}
                    description="Total recorded"
                    icon={<List className="h-4 w-4 text-muted-foreground" />}
                />
                <SummaryCard
                    title="Average Expense"
                    value={`$${(transactions.length > 0
                        ? (Number(totalExpenses) / transactions.length).toFixed(2) : "0.00")}`}
                    description="Per transaction"
                    icon={<Home className="h-4 w-4 text-muted-foreground" />}
                />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {budgetCards}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TransactionsTable
                            transactions={recentTransactions}
                            onEdit={() => { }}
                            onDelete={() => { }}
                            hideActions
                        />
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Category Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {categoryTotals.map((item) => (
                                <div key={item.category} className="flex items-center">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {item.category}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {((item.total / Number(totalExpenses)) * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        ${item.total.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                

                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle>Budget Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BudgetChart transactions={transactions} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}