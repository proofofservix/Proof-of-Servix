import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"

export async function POST(req: Request) {
  try {
    const { reference } = await req.json()

    if (!reference) {
      return NextResponse.json({ error: "Reference required" }, { status: 400 })
    }

    const transaction = await prisma.transaction.findUnique({
      where: { reference: reference.trim() },
      include: { recipients: true, documents: true }
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({
      valid: true,
      transactionReference: transaction.reference,
      transactionId: transaction.id,
    })

  } catch (error) {
    console.error("Direct Verify Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}