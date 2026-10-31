"use client"
import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

function VerifyForm() {
  const searchParams = useSearchParams()
  const initialRef = searchParams.get("ref") || ""
  
  const [reference, setReference] = useState(initialRef)
  const [docType, setDocType] = useState<"SSR" | "CSA" | "BOTH">("SSR")
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
        body: JSON.stringify({ reference, docType })
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
            <label className="text-sm font-semibold">Transaction Reference</label>
            <input 
              type="text" 
              placeholder="e.g., POS-2026-ABC12" 
              required
              defaultValue={initialRef}
              className="w-full p-2 border rounded"
              onChange={e => setReference(e.target.value)} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">What would you like to verify?</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className={`p-3 border rounded cursor-pointer text-center text-sm font-medium ${docType === "SSR" ? "border-[#4CAF7D] bg-green-50" : ""}`}>
                <input type="radio" name="docType" value="SSR" className="hidden" checked={docType === "SSR"} onChange={() => setDocType("SSR")} />
                SSR Only <br/> ₦1,000
              </label>
              <label className={`p-3 border rounded cursor-pointer text-center text-sm font-medium ${docType === "CSA" ? "border-[#4CAF7D] bg-green-50" : ""}`}>
                <input type="radio" name="docType" value="CSA" className="hidden" checked={docType === "CSA"} onChange={() => setDocType("CSA")} />
                CSA Only <br/> ₦1,000
              </label>
              <label className={`p-3 border rounded cursor-pointer text-center text-sm font-medium ${docType === "BOTH" ? "border-[#F07A35] bg-orange-50 text-[#F07A35]" : ""}`}>
                <input type="radio" name="docType" value="BOTH" className="hidden" checked={docType === "BOTH"} onChange={() => setDocType("BOTH")} />
                Both Documents <br/> ₦1,500
              </label>
            </div>
          </div>

          {errorMsg && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded">{errorMsg}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#4CAF7D] text-white p-3 rounded font-bold disabled:opacity-50"
          >
            {loading ? "Initializing..." : `Pay & Verify`}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerifyForm />
    </Suspense>
  )
}