import { prisma } from "@/app/lib/prisma"
import DocumentViewer from "./DocumentViewer"
import ClientActions from "./ClientActions"

export const instant = false

export default async function ServePage({ 
  params,
  searchParams
}: { 
  params: Promise<{ token: string }>,
  searchParams: Promise<{ vt?: string }>
}) {
  const { token } = await params
  const { vt } = await searchParams

  const recipient = await prisma.transactionRecipient.findUnique({
    where: { linkTokenHash: token },
    include: {
      transaction: {
        include: { sender: true, documents: true }
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

  const isValidVerificationToken = vt && vt === recipient.verificationToken

  // Auto-verify if the URL has the correct magic token
  if (isValidVerificationToken && recipient.status === "PENDING") {
    await prisma.transactionRecipient.update({
      where: { id: recipient.id },
      data: {
        status: "VERIFIED",
        verifiedAt: new Date(),
        verificationMethod: "EMAIL_LINK"
      }
    })
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
          </div>
          
          <div className="bg-gray-50 p-4 rounded border">
            <p className="font-bold text-sm mb-1">Document:</p>
            <p>{recipient.transaction.documents[0]?.title}</p>
          </div>
        </div>

        {recipient.status === "ACKNOWLEDGED" ? (
          <div className="bg-green-50 text-green-700 p-4 rounded border border-green-200 text-center">
            <p className="font-bold">This document has already been acknowledged.</p>
            <a 
              href={`/api/documents/${recipient.transaction.documents[0]?.id}`} 
              target="_blank"
              className="block w-full mt-4 bg-gray-100 text-gray-800 border border-gray-300 p-3 rounded font-bold hover:bg-gray-200"
            >
              View Document Again
            </a>
          </div>
        ) : isValidVerificationToken || recipient.status === "VERIFIED" ? (
          <DocumentViewer 
            token={token} 
            documentId={recipient.transaction.documents[0]?.id || ""} 
          />
        ) : (
          <ClientActions 
            token={token} 
            hasEmail={!!recipient.email} 
            hasPhone={!!recipient.whatsapp}
            documentId={recipient.transaction.documents[0]?.id || ""} 
          />
        )}

      </div>
    </div>
  )
}