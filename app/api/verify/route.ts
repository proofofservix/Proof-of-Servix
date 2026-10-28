import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"

export async function POST(req: Request) {
  try {
    const { reference } = await req.json()

    if (!reference) {
      return NextResponse.json({ error: "Reference is required" }, { status: 400 })
    }

    // Look up the transaction by its reference
    const transaction = await prisma.transaction.findUnique({
      where: { reference: reference.trim() },
      include: {
        recipients: true,
        documents: true
      }
    })

    if (!transaction) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    const recipient = transaction.recipients[0]

    if (recipient?.status !== "ACKNOWLEDGED") {
      return NextResponse.json({ error: "This document has not been acknowledged" }, { status: 400 })
    }

    // In a real app, you would verify the payment here via Paystack webhook.
    // For now, we assume payment is successful.

    return NextResponse.json({
      valid: true,
      transactionReference: transaction.reference,
      acknowledgedAt: recipient.acknowledgedAt,
      recipientName: recipient.name,
      documentTitle: transaction.documents[0]?.title,
      documentHash: transaction.documents[0]?.sha256
    })

  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}