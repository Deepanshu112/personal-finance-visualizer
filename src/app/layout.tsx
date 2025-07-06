// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Finance App',
  description: 'Manage your transactions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} container mx-auto py-8`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}

function Navbar() {
  return (
    <nav className="mb-8 bg-gray-100 p-4 rounded-lg">
      <ul className="flex space-x-4">
        <li>
          <Link href="/dashboard" className="hover:underline font-medium">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/transaction" className="hover:underline font-medium">
            Add Transaction
          </Link>
        </li>
        <li>
          <Link href="/budget" className="text-sm font-medium">
            Budget Settings
          </Link>
        </li>
      </ul>
    </nav>
  )
}