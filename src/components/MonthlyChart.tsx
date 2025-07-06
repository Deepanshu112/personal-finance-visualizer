"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, eachMonthOfInterval, parseISO } from "date-fns";
import { Transaction } from "@/lib/server/transactions";

interface MonthlyChartProps {
    transactions: Transaction[];
}

export function MonthlyChart({ transactions }: MonthlyChartProps) {
    // Process data to group by month
    const getMonthlyData = () => {
        // const currentYear = new Date().getFullYear();
        const allMonths = transactions.map(t => parseISO(t.date));
        const dateRange = {
            start: Math.min(...allMonths.map(d => d.getTime())),
            end: Math.max(...allMonths.map(d => d.getTime()))
        };
        const months = eachMonthOfInterval({
            start: new Date(dateRange.start),
            end: new Date(dateRange.end)
        });

        const monthlyExpenses = months.map(month => {
            const monthKey = format(month, 'yyyy-MM');
            const monthName = format(month, 'MMM');

            const monthlyTransactions = transactions.filter(transaction => {
                const transactionDate = parseISO(transaction.date);
                return format(transactionDate, 'yyyy-MM') === monthKey;
            });

            const totalAmount = monthlyTransactions.reduce(
                (sum, transaction) => sum + transaction.amount,
                0
            );

            return {
                name: monthName,
                total: parseFloat(totalAmount.toFixed(2)),
            };
        });

        return monthlyExpenses;
    };

    const data = getMonthlyData();

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Monthly Expenses</h2>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                            formatter={(value) => [`$${value}`, "Total"]}
                            labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Bar
                            dataKey="total"
                            name="Total"
                            fill="#4f46e5"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}