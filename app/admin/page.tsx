import { prisma } from "../lib/prisma"
import Link from "next/link"
import SearchBar from "../components/SearchBar"

export const instant = false

export default async function AdminDashboard({ 
  searchParams 
}: { 
  searchParams: Promise<{ search?: string, sort?: string }> 
}) {
  const { search, sort } = await searchParams
  const searchTerm = search || ""
  const sortOrder = sort === "oldest" ? "asc" : "desc"

  // Fetch stats
  const totalUsers = await prisma.user.count()
  const successfulTransactions = await prisma.transaction.count({
    where: { status: { in: ["DISPATCHED", "ACKNOWLEDGED"] } }
  })
  const acknowledgedTransactions = await prisma.transaction.count({
    where: { status: "ACKNOWLEDGED" }
  })

  // Fetch filtered transactions (Now searches recipients too)
  const recentTransactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { reference: { contains: searchTerm, mode: "insensitive" } },
        { sender: { name: { contains: searchTerm, mode: "insensitive" } } },
        { sender: { email: { contains: searchTerm, mode: "insensitive" } } },
        { recipients: { some: { name: { contains: searchTerm, mode: "insensitive" } } } },
        { recipients: { some: { email: { contains: searchTerm, mode: "insensitive" } } } }
      ]
    },
    orderBy: { createdAt: sortOrder },
    take: 50, // Limit to 50 for performance
    include: { sender: true, recipients: true }
  })

  const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" }
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Platform overview for ABIMARS INVENTIONS LIMITED</p>
        </div>
        <Link 
          href="/admin/users" 
          className="bg-[#4CAF7D] text-white px-4 py-2 rounded font-bold hover:bg-[#3d9c6c]"
        >
          Manage Users
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500 font-medium">Total Users</p>
          <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500 font-medium">Total Sent</p>
          <p className="text-3xl font-bold text-gray-900">{successfulTransactions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500 font-medium">Acknowledged</p>
          <p className="text-3xl font-bold text-blue-600">{acknowledgedTransactions}</p>
        </div>
      </div>

      {/* TRANSACTION TABLE */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold">Recent Transactions</h2>
        </div>
        <div className="p-6">
          <SearchBar 
            placeholder="Search by reference, sender, or recipient..." 
            sortOptions={sortOptions} 
          />
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Reference</th>
                <th className="p-4 font-semibold">Sender</th>
                <th className="p-4 font-semibold">Recipient</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4 font-mono text-sm">{tx.reference}</td>
                    <td className="p-4 text-sm">
                      <Link href={`/admin/users/${tx.sender.id}`} className="font-medium text-blue-600 hover:underline">
                        {tx.sender.name}
                      </Link>
                      <p className="text-gray-500 text-xs">{tx.sender.email}</p>
                    </td>
                    <td className="p-4 text-sm">
                      <p className="font-medium">{tx.recipients[0]?.name}</p>
                      <p className="text-gray-500 text-xs">{tx.recipients[0]?.email}</p>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        tx.status === "ACKNOWLEDGED" ? "bg-green-100 text-green-800" : 
                        tx.status === "DISPATCHED" ? "bg-blue-100 text-blue-800" : 
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}