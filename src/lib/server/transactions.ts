"use server"
import { promises as fs } from 'fs';
import path from 'path';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
}

const filePath = path.join(process.cwd(), 'data/transactions.json');

export async function readTransactions(): Promise<Transaction[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function writeTransactions(transactions: Transaction[]) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(transactions, null, 2));
}

export async function getTransactions(): Promise<Transaction[]> {
  return await readTransactions();
}

export async function addTransaction(transaction: Omit<Transaction, 'id'>) {
  const transactions = await readTransactions();
  const newTransaction = { ...transaction, id: Date.now().toString() };
  await writeTransactions([...transactions, newTransaction]);
  return newTransaction;
}

export async function deleteTransaction(id: string) {
  const transactions = await readTransactions();
  await writeTransactions(transactions.filter(t => t.id !== id));
}

export async function updateTransaction(id: string, data: Omit<Transaction, 'id'>) {
  const transactions = await readTransactions();
  const updatedTransactions = transactions.map(t =>
    t.id === id ? { ...t, ...data } : t
  );
  await writeTransactions(updatedTransactions);
}


export async function getTotalExpenses(transactions: Transaction[]) {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}

export async function getRecentTransactions(transactions: Transaction[], count = 5) {
  return [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}