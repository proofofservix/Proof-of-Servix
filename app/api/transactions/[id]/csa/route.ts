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

    if (!transaction || transaction.recipients[0]?.status !== "ACKNOWLEDGED") {
      return NextResponse.json({ error: "Transaction not acknowledged" }, { status: 404 })
    }

    const recipient = transaction.recipients[0]

    const pdfDoc = await PDFDocument.create()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const page = pdfDoc.addPage([600, 800])
    const { width, height } = page.getSize()
    
    let y = height - 70

    // --- CERTIFICATE BORDER ---
    page.drawRectangle({
      x: 20,
      y: 20,
      width: width - 40,
      height: height - 40,
      borderColor: rgb(0.3, 0.68, 0.49),
      borderWidth: 2,
    })

    // --- HEADER ---
    page.drawText("CERTIFICATE OF SERVICE", { x: 50, y, size: 22, font: boldFont, color: rgb(0.3, 0.68, 0.49) })
    y -= 25
    page.drawText("AND ACKNOWLEDGEMENT", { x: 50, y, size: 22, font: boldFont, color: rgb(0.3, 0.68, 0.49) })
    y -= 20
    page.drawText("Obtained from proofofservix.com", { x: 50, y, size: 12, font, color: rgb(0.4, 0.4, 0.4) })
    y -= 40

    // --- TRANSACTION DETAILS ---
    page.drawText("Transaction Details", { x: 50, y, size: 14, font: boldFont })
    y -= 25
    page.drawText(`Reference: ${transaction.reference}`, { x: 50, y, size: 12, font })
    y -= 15
    page.drawText(`Date of Dispatch: ${transaction.createdAt.toISOString()}`, { x: 50, y, size: 12, font })
    y -= 15
    page.drawText(`Date of Acknowledgement: ${recipient.acknowledgedAt?.toISOString()}`, { x: 50, y, size: 12, font })
    y -= 40

    // --- SENDER DETAILS ---
    page.drawText("Sender", { x: 50, y, size: 14, font: boldFont })
    y -= 25
    page.drawText(`Name: ${transaction.sender.name}`, { x: 50, y, size: 12, font })
    y -= 15
    page.drawText(`Organization: ${transaction.sender.organization || "NIL"}`, { x: 50, y, size: 12, font })
    y -= 40

    // --- STATEMENT OF ACKNOWLEDGEMENT ---
    page.drawText("Statement of Acknowledgement", { x: 50, y, size: 14, font: boldFont })
    y -= 25
    
    const text1 = "The document described below was duly delivered to the designated recipient details."
    const text2 = `Recipient Name: ${recipient.name}`
    const text3 = `Organization: ${recipient.organization || "NIL"}`
    const text4 = `Email Address: ${recipient.email}`
    
    page.drawText(text1, { x: 50, y, size: 11, font, color: rgb(0.2, 0.2, 0.2) })
    y -= 20
    page.drawText(text2, { x: 50, y, size: 12, font, color: rgb(0.2, 0.2, 0.2) })
    y -= 15
    page.drawText(text3, { x: 50, y, size: 12, font, color: rgb(0.2, 0.2, 0.2) })
    y -= 15
    page.drawText(text4, { x: 50, y, size: 12, font, color: rgb(0.2, 0.2, 0.2) })
    y -= 30

    page.drawText("The designated recipient successfully verified their access to the document", { x: 50, y, size: 11, font, color: rgb(0.2, 0.2, 0.2) })
    y -= 15
    page.drawText("and expressly acknowledged receipt and access thereof.", { x: 50, y, size: 11, font, color: rgb(0.2, 0.2, 0.2) })
    y -= 40

    // --- DOCUMENT DETAILS ---
    page.drawText("Document Details", { x: 50, y, size: 14, font: boldFont })
    y -= 25
    
    transaction.documents.forEach(doc => {
      page.drawText(`${doc.isMainDocument ? "Main Document" : "Supporting File"}: ${doc.title}`, { x: 50, y, size: 11, font: boldFont })
      y -= 15
      page.drawText(`Original File: ${doc.filename}`, { x: 50, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) })
      y -= 15
      page.drawText(`SHA-256 Hash: ${doc.sha256}`, { x: 50, y, size: 8, font, color: rgb(0.6, 0.6, 0.6) })
      y -= 25
    })

    // --- FOOTER ---
    page.drawText("This certificate confirms that the recipient verified their access and expressly acknowledged receipt of the document. It does not constitute agreement with the document's contents.", {
      x: 50, y: 45, size: 9, font, color: rgb(0.5, 0.5, 0.5), maxWidth: width - 100
    })

    const pdfBytes = await pdfDoc.save()
    const buffer = Buffer.from(pdfBytes)

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="CSA-${transaction.reference}.pdf"`
      }
    })

  } catch (error) {
    console.error("CSA Generation Error:", error)
    return NextResponse.json({ error: "Failed to generate CSA" }, { status: 500 })
  }
}