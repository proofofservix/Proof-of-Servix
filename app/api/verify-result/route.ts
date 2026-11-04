import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"

export async function POST(req: Request) {
  try {
    const { reference } = await req.json()

    const transaction = await prisma.transaction.findUnique({
      where: { reference: reference.trim() },
      include: { recipients: true, documents: true }
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    const isAcknowledged = transaction.recipients.some(r => r.status === "ACKNOWLEDGED")

    return NextResponse.json({
      valid: true,
      transactionReference: transaction.reference,
      transactionId: transaction.id,
      isAcknowledged
    })

  } catch (error) {
    console.error("Verify Result Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}