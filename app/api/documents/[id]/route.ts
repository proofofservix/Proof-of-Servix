import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { getPreviewUrl } from "@/app/lib/r2"

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

    // Generate a secure, temporary link that tells the browser to preview inline
    const previewUrl = await getPreviewUrl(document.storageKey)
    
    // Redirect the browser to the R2 file
    return NextResponse.redirect(previewUrl)
  } catch (error) {
    console.error("Preview error:", error)
    return NextResponse.json({ error: "Failed to load document" }, { status: 500 })
  }
}