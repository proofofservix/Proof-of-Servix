import { prisma } from "@/app/lib/prisma"
import { redirect } from "next/navigation"

export const instant = false

export default async function ShortLinkRedirect({ 
  params 
}: { 
  params: Promise<{ shortLink: string }> 
}) {
  const { shortLink } = await params

  const recipient = await prisma.transactionRecipient.findUnique({
    where: { shortLink }
  })

  if (!recipient) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Link Expired or Invalid</h1>
          <p className="text-gray-500">Please contact the sender to request a new link.</p>
        </div>
      </div>
    )
  }

  // Use the absolute URL for the redirect to handle the query parameter correctly
  const baseUrl = process.env.APP_URL || "https://proofofservix.com"
  redirect(`${baseUrl}/serve/${recipient.linkTokenHash}?vt=${recipient.verificationToken}`)
}