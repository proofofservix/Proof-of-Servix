import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"

export async function POST(req: Request) {
  try {
    const { reference, gatewayRef } = await req.json()

    const payment = await prisma.payment.findUnique({
      where: { gatewayRef }
    })

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    if (payment.status === "PENDING") {
      const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${gatewayRef}`, {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
      })
      const paystackData = await paystackRes.json()

      if (paystackData.status && paystackData.data.status === "success") {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "SUCCESSFUL" }
        })
      } else {
        return NextResponse.json({ error: "Payment not successful" }, { status: 400 })
      }
    }

    const transaction = await prisma.transaction.findUnique({
      where: { reference }
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    return NextResponse.json({
      valid: true,
      transactionReference: transaction.reference,
      transactionId: transaction.id // Added so the frontend can link to the PDFs
    })

  } catch (error) {
    console.error("Verify Result Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}