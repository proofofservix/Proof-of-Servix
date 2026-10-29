"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Form({ senderId }: { senderId: string }) {
  const router = useRouter()
  const [documentTitle, setDocumentTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [recipientName, setRecipientName] = useState("")
  const [recipientOrganization, setRecipientOrganization] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [recipientPhone, setRecipientPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return setError("Please select a file")
    if (!documentTitle) return setError("Please provide a document title")
    
    setLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("documentTitle", documentTitle)
    formData.append("file", file)
    formData.append("recipientName", recipientName)
    formData.append("recipientOrganization", recipientOrganization)
    formData.append("recipientEmail", recipientEmail)
    formData.append("recipientPhone", recipientPhone)
    formData.append("senderId", senderId)

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        
        const paystackRes = await fetch("/api/paystack/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionId: data.transaction.id })
        })

        const paystackData = await paystackRes.json()

        if (paystackData.authorization_url) {
          window.location.href = paystackData.authorization_url
        } else {
          setError(paystackData.error || "Failed to initialize payment")
          setLoading(false)
        }
      } else {
        const data = await res.json()
        setError(data.error || "Something went wrong")
        setLoading(false)
      }
    } catch (err) {
      setError("Network error. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Transaction</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500 bg-red-50 p-3 rounded">{error}</p>}

        <div className="space-y-2">
          <label className="text-sm font-semibold">Document Title</label>
          <input 
            type="text" 
            placeholder="e.g., Letter of Demand, Notice of Hearing" 
            required
            className="w-full p-2 border rounded"
            onChange={e => setDocumentTitle(e.target.value)} 
          />
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input 
            type="file" 
            required
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#4CAF7D] file:text-white hover:file:bg-[#3d9c6c]"
            onChange={e => setFile(e.target.files?.[0] || null)} 
          />
          <p className="text-xs text-gray-400 mt-2">Max 25MB. PDF, DOCX, or Images.</p>
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-lg border-b pb-2">Recipient Details</h2>
          <input 
            type="text" 
            placeholder="Recipient Name" 
            required
            className="w-full p-2 border rounded"
            onChange={e => setRecipientName(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Recipient Organization / Chambers (Optional)" 
            className="w-full p-2 border rounded"
            onChange={e => setRecipientOrganization(e.target.value)} 
          />
          <input 
            type="email" 
            placeholder="Recipient Email Address" 
            required
            className="w-full p-2 border rounded"
            onChange={e => setRecipientEmail(e.target.value)} 
          />
          <input 
            type="tel" 
            placeholder="Recipient Phone Number (Optional for SMS OTP)" 
            className="w-full p-2 border rounded"
            onChange={e => setRecipientPhone(e.target.value)} 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#4CAF7D] text-white p-3 rounded font-bold disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay & Create Transaction"}
        </button>
      </form>
    </div>
  )
}