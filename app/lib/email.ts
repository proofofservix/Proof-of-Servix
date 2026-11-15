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
    const apiKey = process.env.MAILGUN_API_KEY
    const domain = process.env.MAILGUN_DOMAIN

    if (!apiKey || !domain) {
      throw new Error("Mailgun credentials missing from environment variables")
    }

    // Use the EU endpoint since your Mailgun domain is in the EU region
    const url = `https://api.eu.mailgun.net/v3/${domain}/messages`

    const formData = new URLSearchParams()
    // CHANGED: Use the verified subdomain here
    formData.append("from", "Proof of Servix <noreply@mail.proofofservix.com>")
    formData.append("to", to)
    formData.append("subject", subject)
    formData.append("html", html)
    formData.append("h:Reply-To", "support@mails.proofofservix.com")

    console.log(`Attempting to send email via Mailgun to: ${to}`)

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`api:${apiKey}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Mailgun Error:", errorText)
      return { success: false, error: errorText }
    }

    const data = await response.json()
    console.log("Email sent successfully via Mailgun:", data.id)
    return { success: true, id: data.id }

  } catch (err) {
    console.error("Email sending failed:", err)
    return { success: false, error: err }
  }
}