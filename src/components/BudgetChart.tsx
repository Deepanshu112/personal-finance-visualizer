"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { getBudgets } from "@/lib/server/budgets";
import { Transaction } from "@/lib/server/transactions";
import { CATEGORIES } from "@/lib/server/constants";

type BudgetChartData = {
  name: string;
  budget: number;
  actual: number;
  difference: number;
};

export function BudgetChart({ transactions }: { transactions: Transaction[] }) {
  const [data, setData] = useState<BudgetChartData[]>([]);
  useEffect(() => {
    const prepareData = async () => {
      const budgets = await getBudgets();      
      const chartData = CATEGORIES.map(category => {
        const budget = budgets.find(b => b.category === category)?.amount || 0;
        const actual = transactions
          .filter(t => t.category === category)
          .reduce((sum, t) => sum + t.amount, 0);
        return {
          name: category,
          budget,
          actual,
          difference: budget - actual
        };
      }).filter(item => item.budget > 0); // Only show categories with budgets
      setData(chartData);
    };
    prepareData();
  }, [transactions]);
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Budget vs Actual Spending</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'Difference') {
                  const num = Number(value);
                  return [`$${Math.abs(num).toFixed(2)} ${num >= 0 ? 'under' : 'over'}`, name];
                }
                return [`$${value}`, name];
              }}
            />
            <Legend />
            <ReferenceLine y={0} stroke="#000" />
            <Bar dataKey="budget" fill="#8884d8" name="Budget" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" fill="#82ca9d" name="Actual" radius={[4, 4, 0, 0]} />
            <Bar 
              dataKey="difference" 
              fill="#ffc658" 
              name="Difference" 
              radius={[4, 4, 0, 0]}
              label={({ x, y, width, value }) => {
                const num = Number(value);
                return (
                  <text 
                    x={x + width / 2} 
                    y={y} 
                    fill={num >= 0 ? '#4CAF50' : '#F44336'}
                    textAnchor="middle" 
                    dy={-6}
                  >
                    {num >= 0 ? 'Under' : 'Over'}
                  </text>
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}