import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const document = await prisma.document.findUnique({
      where: { id }
    })

    if (!document || !document.storageKey) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // The storageKey is a Base64 string like: data:application/pdf;base64,JVBER...
    // We need to extract the raw Base64 data
    const base64Data = document.storageKey.split(",")[1]
    
    if (!base64Data) {
      return NextResponse.json({ error: "Invalid document format" }, { status: 500 })
    }

    const buffer = Buffer.from(base64Data, "base64")

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": document.mimeType,
        "Content-Disposition": `inline; filename="${document.filename}"`,
      },
    })
  } catch (error) {
    console.error("Document fetch error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}