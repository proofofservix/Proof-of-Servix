"use client"
import { useEffect } from "react"

export default function Redirector({ 
  longToken, 
  verificationToken 
}: { 
  longToken: string, 
  verificationToken: string 
}) {
  useEffect(() => {
    const finalUrl = `/serve/${longToken}?vt=${verificationToken}`
    window.location.href = finalUrl
  }, [longToken, verificationToken])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-xl font-bold animate-pulse text-[#4CAF7D]">Redirecting...</p>
    </div>
  )
}