"use client"

export default function CopyLinkButton({ token }: { token: string }) {
  return (
    <button
      onClick={() => {
        const link = `${process.env.APP_URL || "https://proofofservix.com"}/serve/${token}`
        navigator.clipboard.writeText(link)
        alert("Link copied! (Recipient will be required to verify via OTP)")
      }}
      className="text-sm text-blue-600 hover:underline font-medium mt-1 block"
    >
      Copy Link (Requires OTP)
    </button>
  )
}