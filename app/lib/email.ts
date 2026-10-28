import { Notix } from "notix-js"

console.log("NOTIX KEY STATUS:", process.env.NOTIX_API_KEY ? "✅ LOADED" : "❌ MISSING")

const notix = new Notix(process.env.NOTIX_API_KEY!)

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    console.log(`Attempting to send email to: ${to}`)
    
    const { data, error } = await notix.emails.send({
      from: "Proof of Servix <noreply@mail.proofofservix.com>",
      to,
      subject,
      html,
    })

    if (error) {
      console.error("Notix Email Error:", error)
      return { success: false, error }
    }

    console.log("Email sent successfully:", data?.emailId)
    return { success: true, id: data?.emailId }
  } catch (err) {
    console.error("Email sending failed:", err)
    return { success: false, error: err }
  }
}