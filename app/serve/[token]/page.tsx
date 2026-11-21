import { prisma } from "@/app/lib/prisma"
import ClientActions from "./ClientActions"
import Navbar from "../../components/PublicNavbar"
import Link from "next/link"

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
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-2">Link Expired or Invalid</h1>
            <p className="text-gray-500">Please contact the sender to request a new link.</p>
          </div>
        </div>
      </div>
    )
  }

  // Check if the vt parameter is present and matches the database
  const isValidVerificationToken = !!vt && vt === recipient.verificationToken

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

  // ONLY auto-verify if the valid vt parameter is in the URL
  const isVerified = isValidVerificationToken

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4 py-12">
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

          {/* PROMO BANNER */}
          <div className="bg-gradient-to-r from-[#4CAF7D] to-[#3d9c6c] p-6 rounded-lg mb-8 text-white shadow-md">
            <h3 className="text-lg font-bold mb-2">Need to serve your own documents?</h3>
            <p className="text-sm mb-4 text-white/90">
              Join Proof of Servix and generate legally defensible proof of delivery for free.
            </p>
            <Link 
              href="/register" 
              className="inline-block bg-white text-[#4CAF7D] px-4 py-2 rounded font-bold text-sm hover:bg-gray-100 transition-colors"
            >
              Get Started for Free
            </Link>
          </div>

          {recipient.status === "ACKNOWLEDGED" ? (
            <div className="bg-green-50 text-green-700 p-4 rounded border border-green-200 text-center">
              <p className="font-bold">This document has already been accessed and acknowledged.</p>
              <a 
                href={`/api/documents/${recipient.transaction.documents[0]?.id}`} 
                target="_blank"
                className="block w-full mt-4 bg-gray-100 text-gray-800 border border-gray-300 p-3 rounded font-bold hover:bg-gray-200"
              >
                Download Document Again
              </a>
            </div>
          ) : (
            <ClientActions 
              token={token} 
              hasEmail={!!recipient.email} 
              hasPhone={!!recipient.whatsapp}
              documentId={recipient.transaction.documents[0]?.id || ""} 
              isVerified={isVerified}
            />
          )}

        </div>
      </div>
    </div>
  )
}