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

    // Get the signed URL from R2
    const signedUrl = await getPreviewUrl(document.storageKey)

    // Fetch the file from R2 on the server
    const fileResponse = await fetch(signedUrl)

    if (!fileResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch document" }, { status: 500 })
    }

    // Stream it back to the browser with the inline header
    return new NextResponse(fileResponse.body, {
      headers: {
        "Content-Type": document.mimeType || "application/pdf",
        "Content-Disposition": `inline; filename="${document.filename}"`,
      },
    })

  } catch (error) {
    console.error("Preview error:", error)
    return NextResponse.json({ error: "Failed to load document" }, { status: 500 })
  }
}