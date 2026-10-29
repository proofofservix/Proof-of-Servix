import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { compare, hash } from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { userId, name, organization, profilePicture, currentPassword, newPassword } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const updateData: any = {
      name: name || user.name,
      organization: organization || null,
    }

    if (profilePicture) {
      updateData.profilePicture = profilePicture
    }

    if (newPassword) {
      // If the user already has a password, they MUST provide the current one
      if (user.passwordHash) {
        if (!currentPassword) {
          return NextResponse.json({ error: "Current password is required to change your password" }, { status: 400 })
        }
        const isValid = await compare(currentPassword, user.passwordHash)
        if (!isValid) {
          return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
        }
      }
      
      // If they don't have a password (Google user), we just hash and save the new one
      updateData.passwordHash = await hash(newPassword, 10)
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}