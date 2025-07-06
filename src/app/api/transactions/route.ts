import { NextResponse } from "next/server";
import type { Transaction } from "@/lib/server/transactions";
// import path from "path";
import { readTransactions, writeTransactions } from "@/lib/server/transactions";

// const filePath = path.join(process.cwd(), "data/transactions.json");

// async function readTransactions() {
//   try {
//     const data = await fs.readFile(filePath, "utf-8");
//     return JSON.parse(data);
//   } catch {
//     return [];
//   }
// }

// async function writeTransactions(transactions: any[]) {
//   await fs.mkdir(path.dirname(filePath), { recursive: true });
//   await fs.writeFile(filePath, JSON.stringify(transactions, null, 2));
// }

export async function GET() {
  const transactions = await readTransactions();
  return NextResponse.json(transactions);
}

export async function POST(request: Request) {
  const body = await request.json();
  const transactions = await readTransactions();

  const newTransaction = {
    ...body,
    id: Date.now().toString(),
  };

  await writeTransactions([...transactions, newTransaction]);

  return NextResponse.json(newTransaction);
}


export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updatedData } = body;

    const transactions: Transaction[] = await readTransactions();

    const updated = transactions.map((txn) =>
      txn.id === id ? { ...txn, ...updatedData } : txn
    );

    await writeTransactions(updated);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update transaction:", err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
