import { prisma } from "@/app/lib/prisma"
import ClientActions from "./ClientActions"
import Navbar from "../../components/PublicNavbar"
import Link from "next/link"
import type { Metadata } from "next"

export const instant = false

// ─────────────────────────────────────────────
// WHATSAPP PREVIEW METADATA
// ─────────────────────────────────────────────
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ token: string }> 
}): Promise<Metadata> {
  const { token } = await params

  const recipient = await prisma.transactionRecipient.findUnique({
    where: { linkTokenHash: token },
    include: {
      transaction: {
        include: { sender: true, documents: true }
      }
    }
  })

  if (!recipient) {
    return {
      title: "Document Not Found — Proof of Servix",
      description: "This document link is invalid or has expired.",
    }
  }

  const docTitle = recipient.transaction.documents[0]?.title || "Document"
  const senderName = recipient.transaction.sender.name

  return {
    title: `${docTitle} — Proof of Servix`,
    description: `You have received a secure document from ${senderName}. Click to verify and view.`,
    openGraph: {
      title: `${docTitle} — Proof of Servix`,
      description: `Secure document delivery from ${senderName}.`,
      url: `https://proofofservix.com/serve/${token}`,
      siteName: "Proof of Servix",
      images: [
        {
          url: "https://proofofservix.com/og-document.png",
          width: 1200,
          height: 630,
          alt: "Proof of Servix Document",
        }
      ],
      locale: "en_NG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${docTitle} — Proof of Servix`,
      description: `Secure document delivery from ${senderName}.`,
      images: ["https://proofofservix.com/og-document.png"],
    }
  }
}

// ─────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────
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
            
            <div className="bg-gray-50 p-4 rounded border space-y-3">
              <p className="font-bold text-sm">Documents included in this delivery:</p>
              <ul className="list-disc pl-5 space-y-1">
                {recipient.transaction.documents.map((doc) => (
                  <li key={doc.id} className="text-gray-700 text-sm">
                    {doc.title} <span className="text-gray-400 text-xs">({doc.filename})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {recipient.status === "ACKNOWLEDGED" ? (
            <div className="bg-green-50 text-green-700 p-4 rounded border border-green-200 text-center">
              <p className="font-bold">This document bundle has already been accessed and acknowledged.</p>
              <div className="flex flex-col gap-2 mt-4">
                {recipient.transaction.documents.map((doc) => (
                  <a 
                    key={doc.id}
                    href={`/api/documents/${doc.id}`} 
                    target="_blank"
                    className="block w-full bg-gray-100 text-gray-800 border border-gray-300 p-2 rounded font-bold hover:bg-gray-200 text-sm"
                  >
                    Download: {doc.title}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <ClientActions 
              token={token} 
              hasEmail={!!recipient.email} 
              hasPhone={!!recipient.whatsapp}
              documents={recipient.transaction.documents.map(d => ({ id: d.id, title: d.title }))}
              isVerified={isVerified}
            />
          )}

          {/* PROMO BANNER - Moved to the bottom */}
          <div className="mt-10 pt-8 border-t text-center">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Need to serve your own documents?
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Join Proof of Servix and generate legally defensible proof of delivery for free.
            </p>
            <Link 
              href="/register" 
              className="inline-block bg-gray-100 text-[#4CAF7D] px-4 py-2 rounded font-bold text-sm hover:bg-gray-200 transition-colors border border-gray-200"
            >
              Get Started for Free
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}