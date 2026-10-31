import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"

export async function POST(req: Request) {
  try {
    const { transactionIds, totalAmount } = await req.json()

    if (!transactionIds || transactionIds.length === 0) {
      return NextResponse.json({ error: "No transactions provided" }, { status: 400 })
    }

    const firstTransaction = await prisma.transaction.findUnique({
      where: { id: transactionIds[0] },
      include: { sender: true }
    })

    if (!firstTransaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    const reference = `PAY-${Date.now()}` // Use a unique payment reference

    // Initialize Paystack
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: firstTransaction.sender.email,
        amount: totalAmount * 100, // Convert to kobo
        reference: reference,
        callback_url: `${process.env.APP_URL}/dashboard`,
        metadata: {
          transactionIds: transactionIds // Store the array of IDs in metadata
        }
      }),
    })

    const data = await response.json()

    if (!data.status) {
      return NextResponse.json({ error: data.message }, { status: 400 })
    }

    return NextResponse.json({ authorization_url: data.data.authorization_url })

  } catch (error) {
    console.error("Paystack Init Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}