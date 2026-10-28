import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "../../lib/prisma"

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

    const user = await prisma.user.create({
      data: { 
        name, 
        organization: organization || null,
        email, 
        passwordHash 
      }
    })

    return NextResponse.json({ message: "User created", userId: user.id }, { status: 201 })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}