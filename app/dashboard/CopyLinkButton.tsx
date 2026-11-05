"use client"

export default function CopyLinkButton({ 
  shortLink, 
  longLink 
}: { 
  shortLink: string | null, 
  longLink: string 
}) {
  const handleCopy = () => {
    const link = shortLink 
      ? `${process.env.NEXT_PUBLIC_APP_URL || "https://proofofservix.com"}/s/${shortLink}`
      : longLink
      
    navigator.clipboard.writeText(link)
    alert("Link copied to clipboard!")
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