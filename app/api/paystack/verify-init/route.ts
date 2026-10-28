import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { randomUUID } from "crypto"

export async function POST(req: Request) {
  try {
    const { reference } = await req.json()

    if (!reference) {
      return NextResponse.json({ error: "Reference required" }, { status: 400 })
    }

    const transaction = await prisma.transaction.findUnique({
      where: { reference: reference.trim() },
      include: { recipients: true }
    })

    if (!transaction || transaction.recipients[0]?.status !== "ACKNOWLEDGED") {
      return NextResponse.json({ error: "Valid acknowledged certificate not found" }, { status: 404 })
    }

    const gatewayRef = `VERIFY-${randomUUID()}`

    await prisma.payment.create({
      data: {
        purpose: "VERIFICATION",
        gateway: "paystack",
        gatewayRef: gatewayRef,
        amount: 100000, // ₦1,000 in kobo
        status: "PENDING",
        reference: reference.trim(),
      }
    })

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "verifier@proofofservix.com", 
        amount: 100000,
        reference: gatewayRef,
        callback_url: `${process.env.APP_URL}/verify/result?ref=${reference.trim()}&gatewayRef=${gatewayRef}`,
      }),
    })

    const data = await response.json()

    if (!data.status) {
      return NextResponse.json({ error: data.message }, { status: 400 })
    }

    return NextResponse.json({ authorization_url: data.data.authorization_url })

  } catch (error) {
    console.error("Verify Init Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}