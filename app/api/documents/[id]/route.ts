import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getPreviewUrl } from "@/app/lib/r2"

export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const document = await prisma.document.findUnique({ where: { id } })

    if (!document || !document.storageKey) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Generate the signed R2 URL for the file
    const downloadUrl = await getPreviewUrl(document.storageKey)
    
    // Redirect the browser to the R2 URL
    return NextResponse.redirect(downloadUrl)

  } catch (error) {
    console.error("Preview error:", error)
    return NextResponse.json({ error: "Failed to load document" }, { status: 500 })
  }
}