"use client"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

function ResultContent() {
  const searchParams = useSearchParams()
  const reference = searchParams.get("ref")
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [data, setData] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (!reference) {
      setStatus("error")
      setErrorMsg("Missing reference.")
      return
    }

    const checkCertificate = async () => {
      try {
        const res = await fetch("/api/verify-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference })
        })

        const result = await res.json()

        if (res.ok) {
          setData(result)
          setStatus("success")
        } else {
          setErrorMsg(result.error || "Certificate not found.")
          setStatus("error")
        }
      } catch (err) {
        setErrorMsg("Network error.")
        setStatus("error")
      }
    }

    checkCertificate()
  }, [reference])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl font-bold animate-pulse text-[#4CAF7D]">Verifying Certificate...</p>
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
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-sm border">
        
        <div className="text-center mb-8 border-b pb-6">
          <h1 className="text-2xl font-bold text-[#4CAF7D]">Certificate Verification</h1>
          <p className="text-gray-500">Official Proof of Service Lookup</p>
        </div>

        <div className="space-y-6">
          {/* Status Banner */}
          <div className={`p-4 rounded border text-center ${
            data.status === "Acknowledged" 
              ? "bg-green-50 text-green-700 border-green-200" 
              : "bg-blue-50 text-blue-700 border-blue-200"
          }`}>
            <h2 className="text-xl font-bold mb-1">Valid {data.status} Record</h2>
            <p className="text-sm">This document was processed through Proof of Servix.</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Transaction Info */}
            <div className="bg-gray-50 p-4 rounded border space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Transaction Info</p>
              <div>
                <p className="text-sm text-gray-500">Reference</p>
                <p className="font-mono font-bold text-gray-900">{data.reference}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-bold text-gray-900">{data.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date Dispatched</p>
                <p className="font-medium text-gray-900">{new Date(data.dispatchedAt).toLocaleString()}</p>
              </div>
              {data.acknowledgedAt && (
                <div>
                  <p className="text-sm text-gray-500">Date Acknowledged</p>
                  <p className="font-medium text-gray-900">{new Date(data.acknowledgedAt).toLocaleString()}</p>
                </div>
              )}
            </div>

            {/* Document Info */}
            <div className="bg-gray-50 p-4 rounded border space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Document Info</p>
              <div>
                <p className="text-sm text-gray-500">Document Title</p>
                <p className="font-bold text-gray-900">{data.documentTitle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cryptographic Hash (SHA-256)</p>
                <p className="font-mono text-xs break-all text-gray-700">{data.sha256}</p>
              </div>
            </div>

            {/* Sender Info */}
            <div className="bg-gray-50 p-4 rounded border space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Sender</p>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-bold text-gray-900">{data.senderName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Organization</p>
                <p className="text-gray-900">{data.senderOrg}</p>
              </div>
            </div>

            {/* Recipient Info */}
            <div className="bg-gray-50 p-4 rounded border space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Recipient</p>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-bold text-gray-900">{data.recipientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Organization</p>
                <p className="text-gray-900">{data.recipientOrg}</p>
              </div>
            </div>

          </div>

          <div className="text-center pt-4">
            <p className="text-xs text-gray-400">
              This verification portal is for lookup purposes only. To obtain a physical copy of the certificate, please contact the sender.
            </p>
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