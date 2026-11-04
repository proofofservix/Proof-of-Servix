import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { createHash, randomUUID } from "crypto"
import { uploadToR2 } from "@/app/lib/r2"
import { sendEmail } from "@/app/lib/email"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const senderId = formData.get("senderId") as string
    const recipientsJson = formData.get("recipientsJson") as string
    const documentsJson = formData.get("documentsJson") as string
    
    const recipients = JSON.parse(recipientsJson)
    const documentMeta = JSON.parse(documentsJson)
    const files = formData.getAll("files") as File[]

    if (!senderId || recipients.length === 0 || files.length === 0) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const sender = await prisma.user.findUnique({ where: { id: senderId } })
    const senderName = sender?.name || "A sender"

    // Process files and upload to R2
    const documentData = await Promise.all(files.map(async (file, index) => {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const sha256 = createHash("sha256").update(buffer).digest("hex")
      
      const r2Key = `documents/${randomUUID()}-${file.name}`
      await uploadToR2(r2Key, buffer, file.type)

      return {
        title: documentMeta[index].title,
        filename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        storageKey: r2Key,
        sha256,
        isMainDocument: index === 0
      }
    }))

    const transactionIds: string[] = []

    for (const recipient of recipients) {
      const reference = `POS-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, "0")}`
      const rawToken = randomUUID()
      const verificationToken = randomUUID()

      // Create transaction as DISPATCHED immediately (No payment required)
      const transaction = await prisma.transaction.create({
        data: {
          reference,
          senderId,
          feeAmount: 0, // Free
          status: "DISPATCHED", // Skip PENDING_PAYMENT
          paidAt: new Date(),
          dispatchedAt: new Date(),
          documents: { create: documentData },
          recipients: {
            create: {
              name: recipient.name,
              organization: recipient.organization || null,
              email: recipient.email,
              whatsapp: recipient.phone || null,
              linkTokenHash: rawToken,
              verificationToken: verificationToken,
              linkExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            }
          }
        }
      })
      transactionIds.push(transaction.id)

      // Send the email immediately
      const recipientLink = `${process.env.APP_URL || "https://proofofservix.com"}/serve/${rawToken}?vt=${verificationToken}`
      
      await sendEmail({
        to: recipient.email,
        subject: "You have received a document - Proof of Servix",
        html: `
          <div style="font-family: sans-serif; padding: 20px; max-width: 500px; margin: auto;">
            <h2 style="color: #4CAF7D;">Proof of Servix</h2>
            <p>Hello ${recipient.name},</p>
            <p>You have received a document from <strong>${senderName}</strong>.</p>
            <p><strong>Document Title:</strong> ${documentMeta[0].title}</p>
            <p>Click the button below to view the document:</p>
            <a href="${recipientLink}" style="display: inline-block; background-color: #4CAF7D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Document</a>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">This link is unique to you. Do not forward it.</p>
          </div>
        `,
      })
    }

    return NextResponse.json({ message: "Transactions dispatched", transactionIds }, { status: 201 })
  } catch (error) {
    console.error("Transaction error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}