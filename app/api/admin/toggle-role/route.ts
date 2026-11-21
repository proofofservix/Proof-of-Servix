import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getSession } from "@/app/lib/session"

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the requester is a Super Admin
    const requester = await prisma.user.findUnique({
      where: { id: session.userId }
    })

    if (!requester?.isSuperAdmin) {
      return NextResponse.json({ error: "Only Super Admins can change roles" }, { status: 403 })
    }

    const { targetUserId, makeAdmin } = await req.json()

    await prisma.user.update({
      where: { id: targetUserId },
      data: { 
        isAdmin: makeAdmin 
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Role toggle error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}