import { getSession } from "../lib/session"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "../lib/prisma"
import CopyLinkButton from "./CopyLinkButton" // <-- Import the new component

export const instant = false

export default async function Dashboard() {
  const session = await getSession()

  if (!session?.userId) {
    redirect("/login")
  }

  const transactions = await prisma.transaction.findMany({
    where: { senderId: session.userId },
    orderBy: { createdAt: "desc" },
    include: { recipients: true }
  })

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome, {session.name}</p>
        </div>
        <Link 
          href="/dashboard/new" 
          className="bg-[#4CAF7D] text-white px-4 py-2 rounded font-medium hover:bg-[#3d9c6c]"
        >
          New Transaction
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="border rounded-lg p-8 text-center text-gray-500">
          No transactions yet. Click "New Transaction" to send your first document.
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-bold">{tx.reference}</p>
                <p className="text-sm text-gray-500">To: {tx.recipients[0]?.name} ({tx.recipients[0]?.email})</p>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className={`text-xs font-bold px-2 py-1 rounded block mb-2 ${tx.status === "ACKNOWLEDGED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {tx.status}
                </span>
                
                <a 
                  href={`/api/transactions/${tx.id}/ssr`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#4CAF7D] hover:underline font-medium"
                >
                  View SSR
                </a>

                {tx.status === "ACKNOWLEDGED" && (
                  <a 
                    href={`/api/transactions/${tx.id}/csa`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-700 hover:underline font-medium mt-1"
                  >
                    View CSA
                  </a>
                )}
                
                {/* Use the imported Client Component */}
                <CopyLinkButton token={tx.recipients[0]?.linkTokenHash || ""} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}import { getSession } from "../lib/session"
import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "../lib/prisma"
import CopyLinkButton from "./CopyLinkButton"

export const instant = false

export default async function Dashboard() {
  const session = await getSession()

  if (!session?.userId) {
    redirect("/login")
  }

  const transactions = await prisma.transaction.findMany({
    where: { senderId: session.userId },
    orderBy: { createdAt: "desc" },
    include: { recipients: true }
  })

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome, {session.name}</p>
        </div>
        <Link 
          href="/dashboard/new" 
          className="bg-[#4CAF7D] text-white px-4 py-2 rounded font-medium hover:bg-[#3d9c6c]"
        >
          New Transaction
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="border rounded-lg p-8 text-center text-gray-500">
          No transactions yet. Click "New Transaction" to send your first document.
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="border rounded-lg p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{tx.reference}</p>
                  <p className="text-sm text-gray-500">To: {tx.recipients[0]?.name} ({tx.recipients[0]?.email})</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className={`text-xs font-bold px-2 py-1 rounded block mb-2 ${tx.status === "ACKNOWLEDGED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {tx.status}
                  </span>
                  
                  <a 
                    href={`/api/transactions/${tx.id}/ssr`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#4CAF7D] hover:underline font-medium"
                  >
                    View SSR
                  </a>

                  {tx.status === "ACKNOWLEDGED" && (
                    <a 
                      href={`/api/transactions/${tx.id}/csa`} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-700 hover:underline font-medium mt-1"
                    >
                      View CSA
                    </a>
                  )}
                </div>
              </div>

              {/* Show the link and copy button only if payment is confirmed */}
              {(tx.status === "DISPATCHED" || tx.status === "ACKNOWLEDGED") && (
                <div className="mt-2 pt-3 border-t">
                  <p className="text-xs text-gray-500 mb-1">Secure Document Link:</p>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={`${process.env.APP_URL || "https://proofofservix.com"}/serve/${tx.recipients[0]?.linkTokenHash}?vt=${tx.recipients[0]?.verificationToken}`}
                      className="w-full text-xs p-2 bg-gray-50 border rounded text-gray-600"
                    />
                    <CopyLinkButton token={tx.recipients[0]?.linkTokenHash || ""} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}