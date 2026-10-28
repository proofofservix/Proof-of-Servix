import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { sendEmail } from "@/app/lib/email"

// Store OTPs with their expiration time
const otpStore = new Map<string, { code: string, expiresAt: number }>()

export async function POST(req: Request) {
  try {
    const { action, token, code, channel } = await req.json()

    if (action === "send") {
      const otp = Math.floor(1000 + Math.random() * 9000).toString()
      
      // Save OTP with a 10-minute expiration (600,000 milliseconds)
      otpStore.set(token, { 
        code: otp, 
        expiresAt: Date.now() + 10 * 60 * 1000 
      })

      const recipient = await prisma.transactionRecipient.findUnique({
        where: { linkTokenHash: token }
      })

      if (!recipient || !recipient.email) {
        return NextResponse.json({ error: "No email found for recipient" }, { status: 400 })
      }

      if (channel === "email") {
        const emailResult = await sendEmail({
          to: recipient.email,
          subject: "Your Verification Code - Proof of Servix",
          html: `
            <div style="font-family: sans-serif; padding: 20px; max-width: 500px; margin: auto;">
              <h2 style="color: #4CAF7D;">Proof of Servix Verification</h2>
              <p>Hello ${recipient.name},</p>
              <p>Your verification code is:</p>
              <h1 style="color: #4CAF7D; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
              <p style="color: #666;">This code will expire in <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
            </div>
          `,
        })

        if (!emailResult.success) {
          return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
        }
      } else {
        console.log("\n=============================================")
        console.log(`📱 SMS OTP SENT TO: ${recipient.whatsapp}`)
        console.log(`🔑 CODE: ${otp}`)
        console.log("=============================================\n")
      }

      return NextResponse.json({ message: "OTP sent" })
    }

    if (action === "verify") {
      const storedData = otpStore.get(token)

      if (!storedData) {
        return NextResponse.json({ error: "No OTP requested for this link" }, { status: 400 })
      }

      // Check if it has expired
      if (Date.now() > storedData.expiresAt) {
        otpStore.delete(token)
        return NextResponse.json({ error: "Code has expired. Please request a new one." }, { status: 400 })
      }

      if (storedData.code === code) {
        otpStore.delete(token) // Clear after successful use
        return NextResponse.json({ success: true })
      } else {
        return NextResponse.json({ error: "Invalid code" }, { status: 400 })
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("OTP error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}