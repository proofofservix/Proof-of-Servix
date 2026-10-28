"use client"
import { useState } from "react"

export default function VerifyPage() {
  const [reference, setReference] = useState("")
  const [status, setStatus] = useState<"idle" | "paying" | "verified" | "error">("idle")
  const [certificateData, setCertificateData] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState("")

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("paying")
    setErrorMsg("")

    // Simulate Payment Gateway (Paystack integration comes later)
    setTimeout(async () => {
      try {
        const res = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference })
        })

        if (res.ok) {
          const data = await res.json()
          setCertificateData(data)
          setStatus("verified")
        } else {
          const data = await res.json()
          setErrorMsg(data.error || "Certificate not found or invalid.")
          setStatus("error")
        }
      } catch (err) {
        setErrorMsg("Network error. Please try again.")
        setStatus("error")
      }
    }, 2000) // 2-second delay to simulate payment processing
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-sm border">
        <div className="text-center mb-8 border-b pb-6">
          <h1 className="text-2xl font-bold text-[#4CAF7D]">Verify Certificate</h1>
          <p className="text-gray-500">Obtained from proofofservix.com</p>
        </div>

        {status === "verified" && certificateData ? (
          <div className="space-y-6">
            <div className="bg-green-50 text-green-700 p-4 rounded border border-green-200 text-center">
              <h2 className="text-xl font-bold mb-1">Certificate is Valid</h2>
              <p className="text-sm">This certificate was issued by Proof of Servix.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded border space-y-2 text-sm">
              <p><strong>Transaction Reference:</strong> {certificateData.transactionReference}</p>
              <p><strong>Date of Acknowledgement:</strong> {new Date(certificateData.acknowledgedAt).toLocaleString()}</p>
              <p><strong>Recipient:</strong> {certificateData.recipientName}</p>
              <p><strong>Document Title:</strong> {certificateData.documentTitle}</p>
              <p><strong>Document Hash:</strong> <span className="font-mono text-xs break-all">{certificateData.documentHash}</span></p>
            </div>

            <button onClick={() => setStatus("idle")} className="w-full bg-[#4CAF7D] text-white p-3 rounded font-bold">
              Verify Another Certificate
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Certificate Reference / ID</label>
              <input 
                type="text" 
                placeholder="e.g., CSA-2026-ABC12" 
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
              disabled={status === "paying"}
              className="w-full bg-[#4CAF7D] text-white p-3 rounded font-bold disabled:opacity-50"
            >
              {status === "paying" ? "Processing Payment..." : "Pay ₦1,000 & Verify"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}