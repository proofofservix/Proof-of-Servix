import { getSession } from "../lib/session"
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
          <p className="text-gray-500">Welcome back, {session.name}</p>
        </div>
        <Link 
          href="/dashboard/new" 
          className="bg-[#4CAF7D] text-white px-5 py-2.5 rounded font-medium hover:bg-[#3d9c6c] shadow-sm"
        >
          + New Transaction
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center text-gray-500 bg-white">
          <p className="text-lg font-medium text-gray-800 mb-2">No transactions yet</p>
          <p>Click "New Transaction" to serve your first document.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white border rounded-lg p-5 flex flex-col gap-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg">{tx.reference}</p>
                  
                  <div className="text-sm text-gray-500 mt-2">
                    <span className="font-medium">Recipients:</span>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {tx.recipients.map((r) => (
                        <li key={r.id}>
                          {r.name} ({r.email}) 
                          <span className={`ml-2 text-xs font-bold ${
                            r.status === "ACKNOWLEDGED" ? "text-green-600" : 
                            r.status === "VERIFIED" ? "text-blue-600" : 
                            "text-yellow-600"
                          }`}>
                            [{r.status}]
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded block mb-2 ${
                    tx.status === "ACKNOWLEDGED" ? "bg-green-100 text-green-800" : 
                    tx.status === "DISPATCHED" ? "bg-blue-100 text-blue-800" : 
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {tx.status.replace("_", " ")}
                  </span>
                  
                  <div className="flex gap-3 mt-1">
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
                        className="text-sm text-green-700 hover:underline font-medium"
                      >
                        View CSA
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {(tx.status === "DISPATCHED" || tx.status === "ACKNOWLEDGED") && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-2 font-medium">Secure Document Links:</p>
                  
                  <div className="space-y-2">
                    {tx.recipients.map((r) => (
                      <div key={r.id} className="flex items-center gap-2">
                        <span className="text-xs font-semibold w-24 truncate">{r.name}:</span>
                        <input 
                          type="text" 
                          readOnly 
                          value={`${process.env.APP_URL || "https://proofofservix.com"}/serve/${r.linkTokenHash}?vt=${r.verificationToken}`}
                          className="w-full text-xs p-2 bg-gray-50 border rounded text-gray-600"
                        />
                        <CopyLinkButton token={r.linkTokenHash || ""} />
                      </div>
                    ))}
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