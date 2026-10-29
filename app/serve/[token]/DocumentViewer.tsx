"use client"
import { useState } from "react"

export default function DocumentViewer({ 
  token, 
  documentId 
}: { 
  token: string, 
  documentId: string 
}) {
  const [hasConsented, setHasConsented] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAcknowledge = async () => {
    setLoading(true)
    await fetch("/api/acknowledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    })
    setLoading(false)
    window.open(`/api/documents/${documentId}`, "_blank")
    window.location.reload() 
  }

  return (
    <div className="text-center space-y-6">
      <div className="bg-green-50 text-green-700 p-4 rounded border border-green-200">
        <p className="font-bold">Verification Complete (Email Link)</p>
      </div>

      <a 
        href={`/api/documents/${documentId}`} 
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