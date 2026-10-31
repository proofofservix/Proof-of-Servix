import { NextResponse } from "next/server"
import crypto from "crypto"
import { prisma } from "@/app/lib/prisma"
import { sendEmail } from "@/app/lib/email"

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get("x-paystack-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex")

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(body)

    if (event.event === "charge.success") {
      const reference = event.data.reference

      const transaction = await prisma.transaction.findUnique({
        where: { reference },
        include: { recipients: true, documents: true, sender: true }
      })

      if (transaction && transaction.status === "PENDING_PAYMENT") {
        // 1. Update status
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: "DISPATCHED", paidAt: new Date() }
        })

        // 2. Loop through ALL recipients and send an email to each one
        for (const recipient of transaction.recipients) {
          const recipientLink = `${process.env.APP_URL || "https://proofofservix.com"}/serve/${recipient.linkTokenHash}?vt=${recipient.verificationToken}`
          
          await sendEmail({
            to: recipient.email!,
            subject: "You have received a document - Proof of Servix",
            html: `
              <div style="font-family: sans-serif; padding: 20px; max-width: 500px; margin: auto;">
                <h2 style="color: #4CAF7D;">Proof of Servix</h2>
                <p>Hello ${recipient.name},</p>
                <p>You have received a document from <strong>${transaction.sender.name}</strong>.</p>
                <p><strong>Document Title:</strong> ${transaction.documents[0].title}</p>
                <p>Click the button below to view the document:</p>
                <a href="${recipientLink}" style="display: inline-block; background-color: #4CAF7D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Document</a>
                <p style="color: #666; font-size: 12px; margin-top: 20px;">This link is unique to you. Do not forward it.</p>
              </div>
            `,
          })
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}