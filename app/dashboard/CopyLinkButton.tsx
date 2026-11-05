"use client"

export default function CopyLinkButton({ 
  shortLink, 
  longLink 
}: { 
  shortLink: string | null, 
  longLink: string 
}) {
  const handleCopy = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://proofofservix.com"
    const link = shortLink ? `${baseUrl}/s/${shortLink}` : longLink
    
    // Add a custom message to the copied text
    const message = `You have received a document. Click the link below to view it:\n\n${link}\n\nThis link is unique to you. Do not forward it.`

    navigator.clipboard.writeText(message)
    alert("Link copied with a message!")
  }

  return (
    <button
      onClick={handleCopy}
      className="text-sm text-blue-600 hover:underline font-medium whitespace-nowrap"
    >
      Copy Link
    </button>
  )
}