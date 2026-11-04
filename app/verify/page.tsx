"use client"
import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"

function VerifyForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialRef = searchParams.get("ref") || ""
  
  const [reference, setReference] = useState(initialRef)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")

    try {
      // Check if the transaction exists in the database before redirecting
      const res = await fetch("/api/verify-direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference })
      })

      if (res.ok) {
        // Redirect to the result page with just the reference
        router.push(`/verify/result?ref=${reference}`)
      } else {
        const data = await res.json()
        setErrorMsg(data.error || "Verification failed. Please check the reference number.")
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
          <h1 className="text-2xl font-bold text-[#4CAF7D]">Verify Document</h1>
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

          {errorMsg && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded">{errorMsg}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#4CAF7D] text-white p-3 rounded font-bold disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Document"}
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