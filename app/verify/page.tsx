"use client"
import { useState } from "react"

export default function VerifyPage() {
  const [reference, setReference] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    try {
      const res = await fetch("/api/paystack/verify-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference })
      })

      const data = await res.json()

      if (res.ok && data.authorization_url) {
        window.location.href = data.authorization_url
      } else {
        setErrorMsg(data.error || "Failed to initialize payment.")
        setLoading(false)
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-sm border">
        <div className="text-center mb-8 border-b pb-6">
          <h1 className="text-2xl font-bold text-[#4CAF7D]">Verify Certificate</h1>
          <p className="text-gray-500">Obtained from proofofservix.com</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Certificate Reference / ID</label>
            <input 
              type="text" 
              placeholder="e.g., POS-2026-ABC12" 
              required
              className="w-full p-2 border rounded"
              onChange={e => setReference(e.target.value)} 
            />
          </div>

          <div className="bg-yellow-50 text-yellow-800 p-4 rounded border border-yellow-200 text-sm">
            <p className="font-bold">Verification Fee: ₦1,000</p>
            <p>Payment is required to view the verification results.</p>
          </div>

          {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#4CAF7D] text-white p-3 rounded font-bold disabled:opacity-50"
          >
            {loading ? "Initializing..." : "Pay ₦1,000 & Verify"}
          </button>
        </form>
      </div>
    </div>
  )
}