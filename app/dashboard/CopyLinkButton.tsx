"use client"

export default function CopyLinkButton({ link }: { link: string }) {
  const handleCopy = () => {
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