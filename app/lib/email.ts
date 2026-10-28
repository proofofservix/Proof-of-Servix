import { Notix } from "notix-js"

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
    const apiKey = process.env.NOTIX_API_KEY
    if (!apiKey) {
      throw new Error("NOTIX_API_KEY is missing from environment variables")
    }
    
    const notix = new Notix(apiKey)

    console.log(`Attempting to send email to: ${to}`)
    
    const { data, error } = await notix.emails.send({
      // Simplified: No display name, just the raw email on the verified domain
      from: "noreply@mail.proofofservix.com", 
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