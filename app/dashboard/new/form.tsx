"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

type Recipient = { name: string, organization: string, email: string, phone: string }

export default function Form({ senderId }: { senderId: string }) {
  const router = useRouter()
  const [documentTitle, setDocumentTitle] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [recipients, setRecipients] = useState<Recipient[]>([{ name: "", organization: "", email: "", phone: "" }])
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const BASE_FEE = 2500

  const handleAddRecipient = () => {
    setRecipients([...recipients, { name: "", organization: "", email: "", phone: "" }])
  }

  const handleRemoveRecipient = (index: number) => {
    const newRecipients = [...recipients]
    newRecipients.splice(index, 1)
    setRecipients(newRecipients)
  }

  const handleRecipientChange = (index: number, field: keyof Recipient, value: string) => {
    const newRecipients = [...recipients]
    newRecipients[index][field] = value
    setRecipients(newRecipients)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const totalPrice = BASE_FEE * recipients.length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) return setError("Please upload at least one document")
    if (!documentTitle) return setError("Please provide a document title")
    
    // Validate all recipients have a name and email
    for (const r of recipients) {
      if (!r.name || !r.email) return setError("Please fill in name and email for all recipients")
    }

    setLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("documentTitle", documentTitle)
    formData.append("senderId", senderId)
    formData.append("recipientsJson", JSON.stringify(recipients))
    
    files.forEach(file => {
      formData.append("files", file) // Append all files
    })

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        
        // Initialize Paystack
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
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">New Transaction</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && <p className="text-red-500 bg-red-50 p-4 rounded border border-red-200">{error}</p>}

        {/* DOCUMENT DETAILS */}
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
          <h2 className="font-bold text-lg border-b pb-2">1. Document Details</h2>
          <div>
            <label className="text-sm font-semibold block mb-1">Document Title</label>
            <input 
              type="text" 
              placeholder="e.g., Letter of Demand, Notice of Hearing" 
              required
              className="w-full p-3 border rounded"
              onChange={e => setDocumentTitle(e.target.value)} 
            />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">Upload Document(s)</label>
            <input 
              type="file" 
              multiple
              required
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#4CAF7D] file:text-white hover:file:bg-[#3d9c6c]"
              onChange={handleFileChange} 
            />
            <p className="text-xs text-gray-500 mt-2">You can select multiple files (e.g., Main Document + Exhibits). Max 10MB per file.</p>
          </div>
        </div>

        {/* RECIPIENTS DETAILS */}
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="font-bold text-lg">2. Recipients</h2>
            <button type="button" onClick={handleAddRecipient} className="text-sm font-bold text-[#4CAF7D] hover:underline">
              + Add Another Recipient
            </button>
          </div>
          
          {recipients.map((recipient, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded border relative">
              {recipients.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => handleRemoveRecipient(index)}
                  className="absolute top-2 right-2 text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              )}
              <h3 className="font-semibold mb-3">Recipient {index + 1}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input type="text" placeholder="Recipient Name" required className="p-2 border rounded" onChange={e => handleRecipientChange(index, "name", e.target.value)} />
                <input type="text" placeholder="Organization (Optional)" className="p-2 border rounded" onChange={e => handleRecipientChange(index, "organization", e.target.value)} />
                <input type="email" placeholder="Email Address" required className="p-2 border rounded" onChange={e => handleRecipientChange(index, "email", e.target.value)} />
                <input type="tel" placeholder="Phone Number (Optional)" className="p-2 border rounded" onChange={e => handleRecipientChange(index, "phone", e.target.value)} />
              </div>
            </div>
          ))}
        </div>

        {/* PRICE PREVIEW & SUBMIT */}
        <div className="bg-gray-800 text-white p-6 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-gray-400 text-sm">Total Fee ({recipients.length} {recipients.length === 1 ? 'Recipient' : 'Recipients'})</p>
            <p className="text-3xl font-bold text-[#4CAF7D]">₦{totalPrice.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">₦{BASE_FEE.toLocaleString()} per recipient</p>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto bg-[#F07A35] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#d96b2c] disabled:opacity-50 transition-colors"
          >
            {loading ? "Processing..." : `Pay ₦${totalPrice.toLocaleString()} & Send`}
          </button>
        </div>
      </form>
    </div>
  )
}