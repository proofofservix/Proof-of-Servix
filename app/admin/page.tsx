import { getSession } from "../lib/session"
import { redirect } from "next/navigation"
import { prisma } from "../lib/prisma"
import Link from "next/link"

export const instant = false

export default async function AdminDashboard() {
  const session = await getSession()

  // Fetch user to check if they are an admin
  const user = session?.userId 
    ? await prisma.user.findUnique({ where: { id: session.userId } }) 
    : null

  if (!user || !user.isAdmin) {
    redirect("/dashboard") // Kick non-admins out
  }

  // Fetch platform data
  const totalUsers = await prisma.user.count()
  const totalTransactions = await prisma.transaction.count()
  
  const successfulTransactions = await prisma.transaction.count({
    where: { status: { in: ["DISPATCHED", "ACKNOWLEDGED"] } }
  })

  const acknowledgedTransactions = await prisma.transaction.count({
    where: { status: "ACKNOWLEDGED" }
  })

  // Calculate Revenue (Service Fees + Verification Fees)
  const servicePayments = await prisma.payment.aggregate({
    where: { purpose: "SERVICE", status: "SUCCESSFUL" },
    _sum: { amount: true }
  })
  
  const verificationPayments = await prisma.payment.aggregate({
    where: { purpose: "VERIFICATION", status: "SUCCESSFUL" },
    _sum: { amount: true }
  })

  const serviceRevenue = (servicePayments._sum.amount || 0) / 100
  const verificationRevenue = (verificationPayments._sum.amount || 0) / 100
  const totalRevenue = serviceRevenue + verificationRevenue

  // Fetch recent transactions
  const recentTransactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { sender: true, recipients: true }
  })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Platform overview for ABIMARS INVENTIONS LIMITED</p>
        </div>
        <Link href="/dashboard" className="text-[#4CAF7D] hover:underline font-medium">
          &larr; Back to User Dashboard
        </Link>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500 font-medium">Total Users</p>
          <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500 font-medium">Total Revenue (₦)</p>
          <p className="text-3xl font-bold text-green-600">₦{totalRevenue.toLocaleString()}</p>
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

      {/* RECENT TRANSACTIONS TABLE */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold">Recent Transactions</h2>
        </div>
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
            {recentTransactions.map((tx) => (
              <tr key={tx.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 font-mono text-sm">{tx.reference}</td>
                <td className="p-4 text-sm">
                  <p className="font-medium">{tx.sender.name}</p>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}