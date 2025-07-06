"use client";

import { useState, useEffect } from "react";
import { getTransactions, Transaction } from "@/lib/server/transactions";
import { MonthlyChart } from "@/components/MonthlyChart";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { Dashboard } from "@/components/Dashboard";


export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  // const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  // editingTransaction;
  const fetchTransactions = async () => {
    const data = await getTransactions();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // const handleSuccess = () => {
  //   fetchTransactions();
  //   setEditingTransaction(null);
  // };

  return (
    <main className="container mx-auto py-8 space-y-8">
      <Dashboard transactions={transactions} />
      <MonthlyChart transactions={transactions} />
      <CategoryPieChart transactions={transactions} />
    </main>
  );
}