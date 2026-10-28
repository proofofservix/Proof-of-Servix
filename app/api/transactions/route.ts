import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { sendEmail } from "@/app/lib/email"
import { createHash, randomUUID } from "crypto"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const recipientName = formData.get("recipientName") as string
    const recipientOrganization = formData.get("recipientOrganization") as string
    const recipientEmail = formData.get("recipientEmail") as string
    const recipientPhone = formData.get("recipientPhone") as string
    const senderId = formData.get("senderId") as string
    const documentTitle = formData.get("documentTitle") as string

    if (!file || !recipientName || !recipientEmail || !senderId || !documentTitle) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // Get the sender's name for the email
    const sender = await prisma.user.findUnique({ where: { id: senderId } })
    const senderName = sender?.name || "A sender"

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const sha256 = createHash("sha256").update(buffer).digest("hex")

    const uploadDir = path.join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }
    const uniqueFilename = `${randomUUID()}-${file.name}`
    const filePath = path.join(uploadDir, uniqueFilename)
    await writeFile(filePath, buffer)

    const reference = `POS-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, "0")}`
    
    const rawToken = randomUUID()

    const transaction = await prisma.transaction.create({
      data: {
        reference,
        senderId: senderId,
        feeAmount: 250000,
        status: "PENDING_PAYMENT",
        documents: {
          create: {
            title: documentTitle,
            filename: file.name,
            mimeType: file.type,
            sizeBytes: file.size,
            storageKey: `/uploads/${uniqueFilename}`,
            sha256
          }
        },
        recipients: {
          create: {
            name: recipientName,
            organization: recipientOrganization || null,
            email: recipientEmail,
            whatsapp: recipientPhone || null,
            linkTokenHash: rawToken,
            linkExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
          }
        }
      }
    })

const recipientLink = `https://proof-of-servix.vercel.app/serve/${rawToken}`    
    // ACTUALLY SEND THE EMAIL
    await sendEmail({
      to: recipientEmail,
      subject: "You have received a document - Proof of Servix",
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 500px; margin: auto;">
          <h2 style="color: #4CAF7D;">Proof of Servix</h2>
          <p>Hello ${recipientName},</p>
          <p>You have received a document from <strong>${senderName}</strong>.</p>
          <p><strong>Document Title:</strong> ${documentTitle}</p>
          <p>Click the button below to view the document:</p>
          <a href="${recipientLink}" style="display: inline-block; background-color: #4CAF7D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Document</a>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">This link is unique to you. Do not forward it.</p>
        </div>
      `,
    })

    console.log("\n=============================================")
    console.log(`📧 ATTEMPTED TO SEND EMAIL TO: ${recipientEmail}`)
    console.log(`🔗 SECURE LINK: ${recipientLink}`)
    console.log("=============================================\n")

    return NextResponse.json({ 
      message: "Transaction created", 
      transaction,
      recipientLink
    }, { status: 201 })
  } catch (error) {
    console.error("Transaction error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}