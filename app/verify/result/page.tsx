"use client"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

function ResultContent() {
  const searchParams = useSearchParams()
  const reference = searchParams.get("ref")
  const gatewayRef = searchParams.get("gatewayRef")
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [certificateData, setCertificateData] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (!reference || !gatewayRef) {
      setStatus("error")
      setErrorMsg("Missing parameters")
      return
    }

    const checkPayment = async () => {
      try {
        const res = await fetch("/api/paystack/verify-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference, gatewayRef })
        })

        const data = await res.json()

        if (res.ok) {
          setCertificateData(data)
          setStatus("success")
        } else {
          setErrorMsg(data.error || "Payment verification failed")
          setStatus("error")
        }
      } catch (err) {
        setErrorMsg("Network error")
        setStatus("error")
      }
    }

    checkPayment()
  }, [reference, gatewayRef])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl font-bold animate-pulse text-[#4CAF7D]">Verifying Payment...</p>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Verification Failed</h1>
          <p className="text-gray-500">{errorMsg}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-sm border">
        <div className="text-center mb-8 border-b pb-6">
          <h1 className="text-2xl font-bold text-[#4CAF7D]">Verify Certificate</h1>
        </div>

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
        </div>
      </div>
    </div>
  )
}

export default function VerifyResult() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ResultContent />
    </Suspense>
  )
}