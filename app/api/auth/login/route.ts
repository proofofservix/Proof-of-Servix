import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
import { compare } from "bcryptjs"
import { createSession } from "../../../lib/session"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const user = await prisma.user.findUnique({ where: { email } })
    
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (!user.emailVerifiedAt) {
      return NextResponse.json({ error: "Please verify your email address before logging in." }, { status: 403 })
    }

    const isValid = await compare(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    await createSession(user.id, user.name, user.email || "")

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}