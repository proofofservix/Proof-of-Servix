import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { sendEmail } from "@/app/lib/email"
import { headers } from "next/headers"

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "Unknown IP"
    const userAgent = headersList.get("user-agent") || "Unknown Device"

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

    if (!recipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 })
    }

    // 1. Update recipient status
    await prisma.transactionRecipient.update({
      where: { id: recipient.id },
      data: {
        status: "ACKNOWLEDGED",
        acknowledgedAt: new Date(),
        accessIp: ip,
        accessDevice: userAgent
      }
    })

    // 2. Update transaction status
    await prisma.transaction.update({
      where: { id: recipient.transactionId },
      data: { status: "ACKNOWLEDGED" }
    })

    // 3. Send notification email to the Sender
    const sender = recipient.transaction.sender
    const documentTitle = recipient.transaction.documents[0]?.title || "Document"
    const csaLink = `${process.env.APP_URL || "https://proofofservix.com"}/api/transactions/${recipient.transactionId}/csa`

    await sendEmail({
      to: sender.email,
      subject: `Document Acknowledged: ${documentTitle}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 500px; margin: auto;">
          <h2 style="color: #4CAF7D;">Document Acknowledged</h2>
          <p>Hello ${sender.name},</p>
          <p>Great news. <strong>${recipient.name}</strong> has successfully verified their identity and acknowledged receipt of the following document:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF7D; margin: 20px 0;">
            <p style="margin: 0;"><strong>Document:</strong> ${documentTitle}</p>
            <p style="margin: 5px 0 0 0;"><strong>Acknowledged By:</strong> ${recipient.name} (${recipient.email})</p>
            <p style="margin: 5px 0 0 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <p>You can now download the official Certificate of Service and Acknowledgement (CSA) to add to your records.</p>
          
          <a href="${csaLink}" style="display: inline-block; background-color: #4CAF7D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Download CSA</a>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">Log in to your dashboard at any time to view the full transaction history.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Acknowledge error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}