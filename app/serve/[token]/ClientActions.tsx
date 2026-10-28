"use client"
import { useState } from "react"

export default function ClientActions({ 
  token, 
  hasEmail, 
  hasPhone, 
  documentUrl 
}: { 
  token: string, 
  hasEmail: boolean, 
  hasPhone: boolean, 
  documentUrl: string 
}) {
  const [step, setStep] = useState<"start" | "choose" | "otp" | "verified">("start")
  const [channel, setChannel] = useState<"email" | "sms">("email")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasConsented, setHasConsented] = useState(false)

  const handleSendOtp = async (selectedChannel: "email" | "sms") => {
    setLoading(true)
    setError("")
    setChannel(selectedChannel)
    
    await fetch("/api/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "send", token, channel: selectedChannel })
    })
    
    setLoading(false)
    setStep("otp")
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify", token, code })
    })

    if (res.ok) {
      setStep("verified")
    } else {
      setError("Invalid code. Please check your terminal.")
    }
    setLoading(false)
  }

  const handleAcknowledge = async () => {
    setLoading(true)
    await fetch("/api/acknowledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    })
    setLoading(false)
    window.open(documentUrl, "_blank")
    window.location.reload() 
  }

  if (step === "verified") {
    return (
      <div className="text-center space-y-6">
        <div className="bg-green-50 text-green-700 p-4 rounded border border-green-200">
          <p className="font-bold">Verification Complete</p>
        </div>

        <a 
          href={documentUrl} 
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-gray-100 text-gray-800 border border-gray-300 p-3 rounded font-bold hover:bg-gray-200"
        >
          Preview Document
        </a>

        <hr className="border-gray-200" />

        <div className="text-left bg-gray-50 p-4 rounded border">
          <p className="font-semibold mb-3">Acknowledge Receipt</p>
          
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              className="mt-1 w-5 h-5 accent-[#4CAF7D]"
              checked={hasConsented}
              onChange={(e) => setHasConsented(e.target.checked)}
            />
            <span className="text-sm text-gray-600">
              I confirm that I have accessed and taken delivery of this document. I understand this does not constitute agreement with its contents.
            </span>
          </label>

          <button 
            onClick={handleAcknowledge}
            disabled={!hasConsented || loading}
            className="mt-4 w-full bg-[#4CAF7D] text-white p-3 rounded font-bold hover:bg-[#3d9c6c] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Processing..." : "Acknowledge & Download"}
          </button>
        </div>
      </div>
    )
  }

  if (step === "otp") {
    return (
      <form onSubmit={handleVerify} className="space-y-4">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <p className="text-sm text-center text-gray-600">
          Enter the 4-digit code sent via {channel === "email" ? "Email" : "SMS"}. (Check VS Code Terminal)
        </p>
        <input 
          type="text" 
          maxLength={4}
          placeholder="0000"
          required
          className="w-full text-center text-2xl tracking-widest p-3 border rounded font-bold"
          onChange={e => setCode(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#4CAF7D] text-white p-3 rounded font-bold hover:bg-[#3d9c6c] disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>
      </form>
    )
  }

  if (step === "choose") {
    return (
      <div className="space-y-4">
        <p className="text-center text-gray-700 mb-4">Where should we send your verification code?</p>
        
        <button 
          onClick={() => handleSendOtp("email")}
          disabled={loading || !hasEmail}
          className="w-full bg-[#4CAF7D] text-white p-3 rounded font-bold hover:bg-[#3d9c6c] disabled:opacity-50"
        >
          Send to Email
        </button>

        <button 
          onClick={() => handleSendOtp("sms")}
          disabled={loading || !hasPhone}
          className="w-full bg-white text-[#4CAF7D] border-2 border-[#4CAF7D] p-3 rounded font-bold hover:bg-gray-50 disabled:opacity-50"
        >
          Send via SMS
        </button>

        {!hasPhone && <p className="text-xs text-center text-gray-400">SMS is not available for this document.</p>}
      </div>
    )
  }

  return (
    <div className="text-center">
      <button 
        onClick={() => setStep("choose")}
        className="w-full bg-[#4CAF7D] text-white p-3 rounded font-bold hover:bg-[#3d9c6c]"
      >
        Verify to View
      </button>
      <p className="text-xs text-gray-400 mt-4">
        This link is unique to you. Do not forward it.
      </p>
    </div>
  )
}