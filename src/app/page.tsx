// "use client";

// import { useState, useEffect } from "react";
// import { TransactionForm } from "@/components/TransactionForm";
// import { TransactionsTable } from "@/components/TransactionsTable";
// import { getTransactions, Transaction } from "@/lib/server/transactions";
// import { MonthlyChart } from "@/components/MonthlyChart";
// import { CategoryPieChart } from "@/components/CategoryPieChart";
// import { Dashboard } from "@/components/Dashboard";


// export default function Home() {
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

//   const fetchTransactions = async () => {
//     const data = await getTransactions();
//     setTransactions(data);
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   const handleSuccess = () => {
//     fetchTransactions();
//     setEditingTransaction(null);
//   };

//   return (
//     <main className="container mx-auto py-8 space-y-8">
//       <Dashboard transactions={transactions} />
//       <div className="max-w-md mx-auto">
//         <h1 className="text-2xl font-bold mb-6">
//           {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
//         </h1>
//         <TransactionForm 
//           key={editingTransaction?.id || "create"}
//           initialData={editingTransaction}
//           onSuccess={handleSuccess}
//         />
//       </div>
//       <MonthlyChart transactions={transactions} />
//       <CategoryPieChart transactions={transactions} />

//       <div className="mt-8">
//         <h2 className="text-xl font-bold mb-4">Transaction History</h2>
//         {transactions.length > 0 ? (
//           <TransactionsTable
//             transactions={transactions}
//             onEdit={setEditingTransaction}
//             onDelete={fetchTransactions}
//           />
//         ) : (
//           <p className="text-gray-500">No transactions yet.</p>
//         )}
//       </div>
//     </main>
//   );
// }


// app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold mb-4">Welcome to Finance App</h1>
      <p className="text-lg mb-6">Manage your transactions easily</p>
      <div className="flex justify-center space-x-4">
        <Link href="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Go to Dashboard
        </Link>
        <Link href="/transaction" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Add Transaction
        </Link>
      </div>
    </div>
  )
}