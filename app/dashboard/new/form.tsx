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
  const [successLink, setSuccessLink] = useState("")

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
      // 1. Create the transaction in our DB (Status: PENDING_PAYMENT)
      const res = await fetch("/api/transactions", {
        method: "POST",
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        
        // 2. Initialize Paystack and get the checkout URL
        const paystackRes = await fetch("/api/paystack/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionId: data.transaction.id })
        })

        const paystackData = await paystackRes.json()

        if (paystackData.authorization_url) {
          // 3. Redirect the user to Paystack to pay
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(successLink)
    alert("Link copied to clipboard!")
  }

  if (successLink) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <div className="bg-green-50 text-green-800 p-6 rounded-lg border border-green-200 mb-6">
          <h2 className="text-2xl font-bold mb-2">Transaction Created Successfully</h2>
          <p>An email has been sent to {recipientEmail}.</p>
        </div>
        
        <div className="border p-4 rounded bg-gray-50 mb-6">
          <p className="text-sm text-gray-500 mb-2">Secure Recipient Link:</p>
          <p className="font-mono text-sm break-all mb-4">{successLink}</p>
          <button 
            onClick={copyToClipboard}
            className="bg-[#4CAF7D] text-white px-4 py-2 rounded font-bold hover:bg-[#3d9c6c]"
          >
            Copy Link to Clipboard
          </button>
        </div>

        <button onClick={() => router.push("/dashboard")} className="text-[#4CAF7D] hover:underline">
          Return to Dashboard
        </button>
      </div>
    )
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
          {loading ? "Processing..." : "Create Transaction"}
        </button>
      </form>
    </div>
  )
}