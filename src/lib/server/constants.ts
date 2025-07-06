// src/lib/constants.ts
import { Transaction } from "@/lib/server/transactions";
export const CATEGORIES = [
  "Food",
  "Travel",
  "Bills",
  "Shopping",
  "Health",
  "Rent",
  "Other"
] as const;

export function getCategoryTotals(transactions: Transaction[]) {
  return CATEGORIES.map(category => {
    const total = transactions
      .filter((t) => t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      category,
      total: parseFloat(total.toFixed(2)),
    };
  }).filter(item => item.total > 0);
}
