import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import QRCode from "qrcode"
import { formatInTimeZone } from 'date-fns-tz'
import fs from "fs"
import path from "path"

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
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)

    const page = pdfDoc.addPage([600, 800])
    const { width, height } = page.getSize()
    
    let y = height - 80

    // --- OUTER BORDER ---
    page.drawRectangle({
      x: 25, y: 25, width: width - 50, height: height - 50,
      borderColor: rgb(0.3, 0.68, 0.49), borderWidth: 3,
    })

    // --- INNER BORDER (Subtle) ---
    page.drawRectangle({
      x: 30, y: 30, width: width - 60, height: height - 60,
      borderColor: rgb(0.8, 0.8, 0.8), borderWidth: 1,
    })

    // --- LOGO WATERMARK (Faint, Center) ---
    const logoPath = path.join(process.cwd(), "public", "pos_logo.png")
    const logoBytes = fs.readFileSync(logoPath)
    const logoImage = await pdfDoc.embedPng(logoBytes)
    const watermarkWidth = width * 0.4
    const watermarkHeight = (logoImage.height / logoImage.width) * watermarkWidth
    page.drawImage(logoImage, { 
      x: (width - watermarkWidth) / 2, y: (height - watermarkHeight) / 2, 
      width: watermarkWidth, height: watermarkHeight, opacity: 0.04
    })

    // --- CENTRALIZED TITLE ---
    const title = "CERTIFICATE OF SERVICE AND ACKNOWLEDGEMENT"
    const titleWidth = boldFont.widthOfTextAtSize(title, 18)
    page.drawText(title, { x: (width - titleWidth) / 2, y, size: 18, font: boldFont, color: rgb(0.3, 0.68, 0.49) })
    y -= 25
    
    const subtitle = "Official Proof of Delivery and Acknowledgement"
    const subtitleWidth = italicFont.widthOfTextAtSize(subtitle, 11)
    page.drawText(subtitle, { x: (width - subtitleWidth) / 2, y, size: 11, font: italicFont, color: rgb(0.5, 0.5, 0.5) })
    
    y -= 5

    // --- CUSTOM SEAL IMAGE ---
    try {
      const sealPath = path.join(process.cwd(), "public", "cos-seal.png")
      const sealBytes = fs.readFileSync(sealPath)
      const sealImage = await pdfDoc.embedPng(sealBytes)
      
      const sealWidth = 120
      const sealHeight = (sealImage.height / sealImage.width) * sealWidth
      
      page.drawImage(sealImage, { 
        x: (width - sealWidth) / 2, 
        y: y - sealHeight, 
        width: sealWidth, 
        height: sealHeight 
      })
      
      y -= (sealHeight + 10) 
    } catch (err) {
      console.error("Seal image not found, skipping...", err)
      y -= 20 
    }

    // --- HELPER FUNCTION FOR DRAWING BOXES ---
    const drawBox = (x: number, boxY: number, w: number, h: number) => {
      page.drawRectangle({
        x, y: boxY, width: w, height: h,
        color: rgb(0.97, 0.97, 0.97),
        borderColor: rgb(0.85, 0.85, 0.85),
        borderWidth: 1,
      })
    }

    // --- TRANSACTION DETAILS ROW ---
    const boxWidth = (width - 120) / 2
    drawBox(50, y - 80, boxWidth, 80)
    drawBox(width - 50 - boxWidth, y - 80, boxWidth, 80)

    page.drawText("TRANSACTION REFERENCE", { x: 60, y: y - 15, size: 9, font: boldFont, color: rgb(0.4, 0.4, 0.4) })
    page.drawText(transaction.reference, { x: 60, y: y - 35, size: 14, font: boldFont, color: rgb(0.1, 0.1, 0.1) })

    page.drawText("DATE OF DISPATCH", { x: width - 50 - boxWidth + 10, y: y - 15, size: 9, font: boldFont, color: rgb(0.4, 0.4, 0.4) })
    page.drawText(formatInTimeZone(transaction.createdAt, 'Africa/Lagos', 'MMM dd, yyyy HH:mm zzz'), { x: width - 50 - boxWidth + 10, y: y - 35, size: 11, font: boldFont, color: rgb(0.1, 0.1, 0.1) })
    
    y -= 100

    // --- SENDER & RECIPIENT SIDE-BY-SIDE ---
    drawBox(50, y - 100, boxWidth, 100)
    drawBox(width - 50 - boxWidth, y - 100, boxWidth, 100)

    page.drawText("SENDER DETAILS", { x: 60, y: y - 15, size: 9, font: boldFont, color: rgb(0.4, 0.4, 0.4) })
    page.drawText(transaction.sender.name, { x: 60, y: y - 35, size: 12, font: boldFont, color: rgb(0.1, 0.1, 0.1) })
    page.drawText(`Org: ${transaction.sender.organization || "NIL"}`, { x: 60, y: y - 55, size: 10, font: font, color: rgb(0.3, 0.3, 0.3) })
    page.drawText(`Email: ${transaction.sender.email}`, { x: 60, y: y - 75, size: 9, font: font, color: rgb(0.3, 0.3, 0.3) })

    const rightX = width - 50 - boxWidth + 10
    page.drawText("RECIPIENT DETAILS", { x: rightX, y: y - 15, size: 9, font: boldFont, color: rgb(0.4, 0.4, 0.4) })
    page.drawText(recipient.name, { x: rightX, y: y - 35, size: 12, font: boldFont, color: rgb(0.1, 0.1, 0.1) })
    page.drawText(`Org: ${recipient.organization || "NIL"}`, { x: rightX, y: y - 55, size: 10, font: font, color: rgb(0.3, 0.3, 0.3) })
    page.drawText(`Email: ${recipient.email}`, { x: rightX, y: y - 75, size: 9, font: font, color: rgb(0.3, 0.3, 0.3) })
    
    y -= 120

    // --- ACKNOWLEDGEMENT BOX (Centralized) ---
    page.drawRectangle({
      x: 50, y: y - 70, width: width - 100, height: 70,
      color: rgb(0.93, 0.98, 0.94),
      borderColor: rgb(0.3, 0.68, 0.49),
      borderWidth: 1,
    })
    
    const ackTitle = "DATE OF ACKNOWLEDGEMENT"
    const ackTitleWidth = boldFont.widthOfTextAtSize(ackTitle, 9)
    page.drawText(ackTitle, { x: (width - ackTitleWidth) / 2, y: y - 15, size: 9, font: boldFont, color: rgb(0.3, 0.68, 0.49) })

    const ackDate = recipient.acknowledgedAt ? formatInTimeZone(recipient.acknowledgedAt, 'Africa/Lagos', 'MMMM dd, yyyy HH:mm:ss zzz') : 'N/A'
    const ackDateWidth = boldFont.widthOfTextAtSize(ackDate, 14)
    page.drawText(ackDate, { x: (width - ackDateWidth) / 2, y: y - 35, size: 14, font: boldFont, color: rgb(0.1, 0.1, 0.1) })

    const ackText = "The recipient has successfully verified access and acknowledged receipt of the document(s) listed below."
    const ackTextWidth = italicFont.widthOfTextAtSize(ackText, 9)
    page.drawText(ackText, { x: (width - ackTextWidth) / 2, y: y - 55, size: 9, font: italicFont, color: rgb(0.4, 0.4, 0.4) })

    y -= 90

    // --- DOCUMENTS LIST ---
    page.drawText("ACKNOWLEDGED DOCUMENTS", { x: 50, y: y, size: 9, font: boldFont, color: rgb(0.4, 0.4, 0.4) })
    y -= 15

    transaction.documents.forEach((doc, index) => {
      page.drawText(`${index + 1}. ${doc.isMainDocument ? "Main Document" : "Supporting File"}: ${doc.title}`, { x: 50, y, size: 10, font: boldFont, color: rgb(0.2, 0.2, 0.2) })
      y -= 12
      page.drawText(`File: ${doc.filename}`, { x: 60, y, size: 8, font: font, color: rgb(0.5, 0.5, 0.5) })
      y -= 18
    })

    // --- QR CODE (Bottom Right, Bigger) ---
    const verifyUrl = `${process.env.APP_URL || "https://proofofservix.com"}/verify?ref=${transaction.reference}`
    const qrDataUrl = await QRCode.toDataURL(verifyUrl)
    const qrImage = await pdfDoc.embedPng(qrDataUrl)
    
    const qrSize = 140 
    
    page.drawImage(qrImage, { 
      x: width - 60 - qrSize, 
      y: 70, // Moved slightly up to leave room for the text below
      width: qrSize, 
      height: qrSize 
    })

    // --- FOOTER TEXT (Below QR Code, Single Line) ---
    page.drawText("Scan the QR code to verify this document, or visit proofofservix.com/verify and enter the reference number.", { 
      x: 50, 
      y: 40, // Placed below the QR code (which ends at y:70)
      size: 9, 
      font: font, 
      color: rgb(0.3, 0.3, 0.3), 
      maxWidth: width - 100 // Full width to keep it on one line
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