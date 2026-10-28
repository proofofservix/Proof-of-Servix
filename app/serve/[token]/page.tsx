import { prisma } from "@/app/lib/prisma"
import ClientActions from "./ClientActions"
export const instant = false
export default async function ServePage({ 
  params 
}: { 
  params: Promise<{ token: string }> 
}) {
  const { token } = await params

  const recipient = await prisma.transactionRecipient.findUnique({
    where: { linkTokenHash: token },
    include: {
      transaction: {
        include: {
          sender: true,
          documents: true
        }
      }
    }
  })

  if (!recipient || recipient.linkExpiresAt < new Date()) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Link Expired or Invalid</h1>
          <p className="text-gray-500">Please contact the sender to request a new link.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-sm border">
        <div className="text-center mb-8 border-b pb-6">
          <h1 className="text-2xl font-bold text-[#4CAF7D]">Document Delivery</h1>
          <p className="text-gray-500">Obtained from proofofservix.com</p>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-gray-700">You have received a document from:</p>
          <div className="bg-gray-50 p-4 rounded border">
            <p className="font-bold">{recipient.transaction.sender.name}</p>
            <p className="text-sm text-gray-500">{recipient.transaction.sender.organization || "NIL"}</p>
            <p className="text-sm text-gray-500">{recipient.transaction.sender.email}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded border">
            <p className="font-bold text-sm mb-1">Document:</p>
            <p>{recipient.transaction.documents[0]?.title}</p>
          </div>
        </div>

        <ClientActions 
          token={token} 
          hasEmail={!!recipient.email} 
          hasPhone={!!recipient.whatsapp}
          documentUrl={recipient.transaction.documents[0]?.storageKey || "#"}
        />

      </div>
    </div>
  )
}