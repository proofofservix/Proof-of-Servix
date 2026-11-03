import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { deleteFromR2 } from "@/app/lib/r2"

export async function GET(req: Request) {
  // Security: Only allow Vercel Cron to call this
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Find documents older than 2 years
    const twoYearsAgo = new Date()
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)

    const oldDocuments = await prisma.document.findMany({
      where: {
        createdAt: { lt: twoYearsAgo },
        storageKey: { not: { startsWith: "DELETED_" } } // Avoid re-deleting
      }
    })

    let deletedCount = 0
    for (const doc of oldDocuments) {
      try {
        await deleteFromR2(doc.storageKey)
        // Update DB record to mark as deleted, but keep the hash/audit trail
        await prisma.document.update({
          where: { id: doc.id },
          data: { storageKey: `DELETED_${doc.id}` }
        })
        deletedCount++
      } catch (err) {
        console.error(`Failed to delete R2 file: ${doc.storageKey}`, err)
      }
    }

    return NextResponse.json({ success: true, deletedCount })
  } catch (error) {
    console.error("Cleanup error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}