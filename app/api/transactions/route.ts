import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { sendEmail } from "@/app/lib/email"
import { createHash, randomUUID } from "crypto"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const senderId = formData.get("senderId") as string
    const documentTitle = formData.get("documentTitle") as string
    const recipientsJson = formData.get("recipientsJson") as string
    
    const recipients = JSON.parse(recipientsJson)
    const files = formData.getAll("files") as File[]

    if (!senderId || !documentTitle || !recipients || recipients.length === 0 || files.length === 0) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const sender = await prisma.user.findUnique({ where: { id: senderId } })
    const senderName = sender?.name || "A sender"

    // Calculate fee based on number of recipients
    const feePerRecipient = 250000 // ₦2,500 in kobo
    const totalFee = feePerRecipient * recipients.length

    const reference = `POS-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, "0")}`
    
    // Process files
    const documentData = await Promise.all(files.map(async (file) => {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const sha256 = createHash("sha256").update(buffer).digest("hex")
      const base64Data = buffer.toString("base64")
      return {
        title: documentTitle,
        filename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        storageKey: `data:${file.type};base64,${base64Data}`,
        sha256
      }
    }))

    // Process recipients
    const recipientData = recipients.map((r: any) => ({
      name: r.name,
      organization: r.organization || null,
      email: r.email,
      whatsapp: r.phone || null,
      linkTokenHash: randomUUID(),
      verificationToken: randomUUID(),
      linkExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    }))

    const transaction = await prisma.transaction.create({
      data: {
        reference,
        senderId,
        feeAmount: totalFee,
        status: "PENDING_PAYMENT",
        documents: { create: documentData },
        recipients: { create: recipientData }
      }
    })

    return NextResponse.json({ message: "Transaction created", transaction }, { status: 201 })
  } catch (error) {
    console.error("Transaction error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}