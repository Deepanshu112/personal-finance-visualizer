"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CATEGORIES } from "@/lib/server/constants";
import { Transaction } from "@/lib/server/transactions";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#A28DFF", "#FF6B6B", "#4ECDC4", "#FF9FF3"
];

interface CategoryPieChartProps {
  transactions: Transaction[];
}

export function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  // Calculate total spending per category
  const categoryData = CATEGORIES.map(category => {
    const total = transactions
      .filter(t => t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      name: category,
      value: parseFloat(total.toFixed(2)),
    };
  }).filter(item => item.value > 0); // Only show categories with spending

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Spending by Category</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => 
                `${name}: ${(percent ?? 0 * 100).toFixed(0)}%`
              }
            >
              {categoryData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`$${value}`, "Amount"]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}