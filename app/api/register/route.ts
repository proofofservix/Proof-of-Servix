import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "../../lib/prisma"
import { sendEmail } from "../../lib/email"
import { randomUUID } from "crypto"

export async function POST(req: Request) {
  try {
    const { name, organization, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const passwordHash = await hash(password, 10)
    const verificationToken = randomUUID()
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    const user = await prisma.user.create({
      data: { 
        name, 
        organization: organization || null,
        email, 
        passwordHash,
        verificationToken,
        verificationExpiry
      }
    })

    const verifyLink = `${process.env.APP_URL || "https://proofofservix.com"}/verify-email?token=${verificationToken}`

    await sendEmail({
      to: email,
      subject: "Verify your email - Proof of Servix",
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 500px; margin: auto;">
          <h2 style="color: #4CAF7D;">Welcome to Proof of Servix</h2>
          <p>Hello ${name},</p>
          <p>Please verify your email address to complete your registration.</p>
          <a href="${verifyLink}" style="display: inline-block; background-color: #4CAF7D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Verify Email</a>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">This link will expire in 24 hours.</p>
        </div>
      `,
    })

    return NextResponse.json({ message: "User created. Please check your email to verify." }, { status: 201 })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}