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

    // Handle password update if requested
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required to set a new one" }, { status: 400 })
      }
      
      if (!user.passwordHash) {
         return NextResponse.json({ error: "Google users cannot change password here" }, { status: 400 })
      }

      const isValid = await compare(currentPassword, user.passwordHash)
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
      }

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