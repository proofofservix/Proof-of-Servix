import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { sendEmail } from "@/app/lib/email"
import { randomUUID } from "crypto"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    // Security best practice: Don't reveal if the email exists or not
    if (!user) {
      return NextResponse.json({ message: "If an account exists, a reset link has been sent." })
    }

    // Generate a secure token that expires in 15 minutes
    const resetToken = randomUUID()
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry }
    })

    // Send the email
    const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`
    
    await sendEmail({
      to: user.email,
      subject: "Reset Your Password - Proof of Servix",
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 500px; margin: auto;">
          <h2 style="color: #4CAF7D;">Proof of Servix</h2>
          <p>Hello ${user.name},</p>
          <p>You requested to reset your password. Click the button below to set a new one:</p>
          <a href="${resetLink}" style="display: inline-block; background-color: #4CAF7D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Reset Password</a>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">This link will expire in 15 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    })

    return NextResponse.json({ message: "If an account exists, a reset link has been sent." })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}