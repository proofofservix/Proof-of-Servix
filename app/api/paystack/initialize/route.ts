import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"

export async function POST(req: Request) {
  try {
    const { transactionId } = await req.json()

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId }
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    const sender = await prisma.user.findUnique({
      where: { id: transaction.senderId }
    })

    if (!sender) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 })
    }

    // Initialize Paystack Transaction
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: sender.email,
        amount: transaction.feeAmount, // Already in kobo
        reference: transaction.reference, // Use our POS reference!
        callback_url: `${process.env.APP_URL}/dashboard`, // Redirect here after payment
        metadata: {
          transactionId: transaction.id,
          custom_fields: [
            {
              display_name: "Transaction Reference",
              variable_name: "pos_reference",
              value: transaction.reference
            }
          ]
        }
      }),
    })

    const data = await response.json()

    if (!data.status) {
      return NextResponse.json({ error: data.message }, { status: 400 })
    }

    // Return the authorization URL to the frontend
    return NextResponse.json({ authorization_url: data.data.authorization_url })

  } catch (error) {
    console.error("Paystack Init Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}