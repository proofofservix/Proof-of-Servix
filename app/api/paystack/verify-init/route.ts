import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { randomUUID } from "crypto"

export async function POST(req: Request) {
  try {
    const { reference, docType } = await req.json()

    if (!reference || !docType) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const transaction = await prisma.transaction.findUnique({
      where: { reference: reference.trim() },
      include: { recipients: true }
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    const hasCSA = transaction.recipients[0]?.status === "ACKNOWLEDGED"
    
    // Only block if they ask for CSA/BOTH and it doesn't exist
    if ((docType === "CSA" || docType === "BOTH") && !hasCSA) {
      return NextResponse.json({ error: "This document has not been acknowledged yet, so the CSA is not available. You can still verify the SSR." }, { status: 400 })
    }

    let amount = 0
    if (docType === "SSR" || docType === "CSA") amount = 100000
    if (docType === "BOTH") amount = 150000

    const gatewayRef = `VERIFY-${randomUUID()}`

    await prisma.payment.create({
      data: {
        purpose: "VERIFICATION",
        gateway: "paystack",
        gatewayRef: gatewayRef,
        amount: amount,
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
        amount: amount,
        reference: gatewayRef,
        callback_url: `${process.env.APP_URL}/verify/result?ref=${reference.trim()}&gatewayRef=${gatewayRef}&docType=${docType}`,
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