"use server";

import { promises as fs } from 'fs';
import path from 'path';
import { CATEGORIES } from './constants';

export type Budget = {
  category: typeof CATEGORIES[number];
  amount: number;
};

const filePath = path.join(process.cwd(), 'data/budgets.json');

async function readBudgets(): Promise<Budget[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch{
    return CATEGORIES.map(category => ({
      category,
      amount: category === 'Rent' ? 1000 : category === 'Food' ? 400 : 200
    }));
  }
}

async function writeBudgets(budgets: Budget[]) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(budgets, null, 2));
}

export async function getBudgets() {
  return await readBudgets();
}

export async function updateBudget(category: typeof CATEGORIES[number], amount: number) {
  const budgets = await readBudgets();
  const updated = budgets.some(b => b.category === category)
    ? budgets.map(b => b.category === category ? { ...b, amount } : b)
    : [...budgets, { category, amount }];
  await writeBudgets(updated);
  return updated;
}