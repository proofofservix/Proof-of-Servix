import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { createHash, randomUUID } from "crypto"

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

    // Process files once (hash and base64)
    const documentData = await Promise.all(files.map(async (file, index) => {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const sha256 = createHash("sha256").update(buffer).digest("hex")
      const base64Data = buffer.toString("base64")
      return {
        title: documentMeta[index].title,
        filename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        storageKey: `data:${file.type};base64,${base64Data}`,
        sha256,
        isMainDocument: index === 0 // First file is the main document
      }
    }))

    const transactionIds: string[] = []
    const batchReference = `BATCH-${Date.now()}` // Group identifier

    // Loop through each recipient and create a separate transaction
    for (const recipient of recipients) {
      const reference = `POS-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, "0")}`
      const rawToken = randomUUID()
      const verificationToken = randomUUID()

      const transaction = await prisma.transaction.create({
        data: {
          reference,
          senderId,
          feeAmount: 150000, // We'll update this properly in the Paystack step
          status: "PENDING_PAYMENT",
          // Note: We are not using batchReference yet, but we could add it to the schema later to group them
          documents: {
            create: documentData // All files are attached to every transaction
          },
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
    }

    return NextResponse.json({ 
      message: "Transactions created", 
      transactionIds 
    }, { status: 201 })

  } catch (error) {
    console.error("Transaction error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}