import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { headers } from "next/headers"

export async function POST(req: Request) {
  try {
    const { token } = await req.json()

    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "Unknown IP"
    const userAgent = headersList.get("user-agent") || "Unknown Device"

    const recipient = await prisma.transactionRecipient.findUnique({
      where: { linkTokenHash: token }
    })

    if (!recipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 })
    }

    await prisma.transactionRecipient.update({
      where: { id: recipient.id },
      data: {
        status: "ACKNOWLEDGED",
        acknowledgedAt: new Date(),
        accessIp: ip,
        accessDevice: userAgent
      }
    })

    await prisma.transaction.update({
      where: { id: recipient.transactionId },
      data: { status: "ACKNOWLEDGED" }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Acknowledge error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}