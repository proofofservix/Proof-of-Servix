import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"

export async function POST(req: Request) {
  try {
    const { reference } = await req.json()

    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 })
    }

    const transaction = await prisma.transaction.findUnique({
      where: { reference: reference.trim() },
      include: {
        sender: true,
        recipients: true,
        documents: true
      }
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    const recipient = transaction.recipients[0]
    const isAcknowledged = transaction.recipients.some(r => r.status === "ACKNOWLEDGED")

    return NextResponse.json({
      valid: true,
      reference: transaction.reference,
      status: isAcknowledged ? "Acknowledged" : "Delivered",
      senderName: transaction.sender.name,
      senderOrg: transaction.sender.organization || "NIL",
      recipientName: recipient?.name || "N/A",
      recipientOrg: recipient?.organization || "NIL",
      documentTitle: transaction.documents[0]?.title || "N/A",
      dispatchedAt: transaction.createdAt,
      acknowledgedAt: isAcknowledged ? recipient?.acknowledgedAt : null,
      sha256: transaction.documents[0]?.sha256 || "N/A"
    })

  } catch (error) {
    console.error("Verify Result Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}