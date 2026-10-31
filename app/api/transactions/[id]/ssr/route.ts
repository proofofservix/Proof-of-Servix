import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        sender: true,
        recipients: true,
        documents: true
      }
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    const pdfDoc = await PDFDocument.create()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const page = pdfDoc.addPage([600, 800])
    const { width, height } = page.getSize()
    
    let y = height - 50

    // --- HEADER ---
    page.drawText("SERVICE SUBMISSION RECEIPT", { x: 50, y, size: 20, font: boldFont, color: rgb(0.3, 0.68, 0.49) })
    y -= 20
    page.drawText("Obtained from proofofservix.com", { x: 50, y, size: 12, font, color: rgb(0.4, 0.4, 0.4) })
    y -= 40

    // --- TRANSACTION DETAILS ---
    page.drawText("Transaction Details", { x: 50, y, size: 16, font: boldFont })
    y -= 25
    page.drawText(`Reference: ${transaction.reference}`, { x: 50, y, size: 12, font })
    y -= 15
    page.drawText(`Date: ${transaction.createdAt.toISOString()}`, { x: 50, y, size: 12, font })
    y -= 40

    // --- SENDER DETAILS ---
    page.drawText("Sender", { x: 50, y, size: 16, font: boldFont })
    y -= 25
    page.drawText(`Name: ${transaction.sender.name}`, { x: 50, y, size: 12, font })
    y -= 15
    page.drawText(`Organization: ${transaction.sender.organization || "NIL"}`, { x: 50, y, size: 12, font })
    y -= 15
    page.drawText(`Email: ${transaction.sender.email}`, { x: 50, y, size: 12, font })
    y -= 40

    // --- RECIPIENT DETAILS ---
    page.drawText("Recipient", { x: 50, y, size: 16, font: boldFont })
    y -= 25
    page.drawText(`Name: ${transaction.recipients[0]?.name}`, { x: 50, y, size: 12, font })
    y -= 15
    page.drawText(`Organization: ${transaction.recipients[0]?.organization || "NIL"}`, { x: 50, y, size: 12, font })
    y -= 15
    page.drawText(`Email: ${transaction.recipients[0]?.email}`, { x: 50, y, size: 12, font })
    y -= 40

    // --- DOCUMENT DETAILS (NUMBERED) ---
    page.drawText("Document Details", { x: 50, y, size: 16, font: boldFont })
    y -= 25
    
    transaction.documents.forEach((doc, index) => {
      page.drawText(`${index + 1}. ${doc.isMainDocument ? "Main Document" : "Supporting File"}: ${doc.title}`, { x: 50, y, size: 12, font: boldFont })
      y -= 15
      page.drawText(`Original File: ${doc.filename}`, { x: 50, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) })
      y -= 15
      page.drawText(`SHA-256 Hash: ${doc.sha256}`, { x: 50, y, size: 8, font, color: rgb(0.6, 0.6, 0.6) })
      y -= 25
    })

    // --- FOOTER ---
    page.drawText("This receipt proves submission and dispatch initiation. It does not constitute proof of acknowledgement or legal service.", {
      x: 50, y: 50, size: 9, font, color: rgb(0.5, 0.5, 0.5), maxWidth: width - 100
    })

    const pdfBytes = await pdfDoc.save()
    const buffer = Buffer.from(pdfBytes)

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="SSR-${transaction.reference}.pdf"`
      }
    })

  } catch (error) {
    console.error("PDF Generation Error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}