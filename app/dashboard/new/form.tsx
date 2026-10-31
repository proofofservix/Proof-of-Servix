"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

type Recipient = { name: string, organization: string, email: string, phone: string }
type DocumentFile = { file: File, title: string }

export default function Form({ senderId }: { senderId: string }) {
  const router = useRouter()
  
  const [recipients, setRecipients] = useState<Recipient[]>([{ name: "", organization: "", email: "", phone: "" }])
  const [documents, setDocuments] = useState<DocumentFile[]>([])
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const BASE_FEE = 1500 // ₦1,500 base covers up to 3 files
  const EXTRA_FILE_FEE = 500 // ₦500 per extra file
  const FREE_FILES = 3

  const handleAddRecipient = () => {
    setRecipients([...recipients, { name: "", organization: "", email: "", phone: "" }])
  }

  const handleRemoveRecipient = (index: number) => {
    if (recipients.length === 1) return
    const newRecipients = [...recipients]
    newRecipients.splice(index, 1)
    setRecipients(newRecipients)
  }

  const handleRecipientChange = (index: number, field: keyof Recipient, value: string) => {
    const newRecipients = [...recipients]
    newRecipients[index][field] = value
    setRecipients(newRecipients)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      return setError("File must be less than 10MB")
    }
    setDocuments([...documents, { file, title: "" }])
    e.target.value = "" // Reset input
  }

  const handleRemoveFile = (index: number) => {
    const newDocs = [...documents]
    newDocs.splice(index, 1)
    setDocuments(newDocs)
  }

  const handleDocumentTitleChange = (index: number, title: string) => {
    const newDocs = [...documents]
    newDocs[index].title = title
    setDocuments(newDocs)
  }

  // Calculate Total Price
  const extraFiles = Math.max(0, documents.length - FREE_FILES)
  const fileFee = extraFiles * EXTRA_FILE_FEE
  const totalPerRecipient = BASE_FEE + fileFee
  const totalPrice = totalPerRecipient * recipients.length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (documents.length === 0) return setError("Please upload at least one document")
    if (documents.some(d => !d.title)) return setError("Please provide a title for every uploaded file")
    
    for (const r of recipients) {
      if (!r.name || !r.email) return setError("Please fill in name and email for all recipients")
    }

    setLoading(true)

    const formData = new FormData()
    formData.append("senderId", senderId)
    formData.append("recipientsJson", JSON.stringify(recipients))
    formData.append("documentsJson", JSON.stringify(documents.map(d => ({ title: d.title }))))
    
    documents.forEach(doc => {
      formData.append("files", doc.file)
    })

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
          body: JSON.stringify({ 
            transactionIds: data.transactionIds, 
            totalAmount: totalPrice 
          })
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

        {/* DOCUMENTS SECTION */}
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="font-bold text-lg">1. Documents (Base fee covers first 3)</h2>
          </div>

          <div className="space-y-4">
            {documents.map((doc, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-gray-50 p-3 rounded border">
                <div className="flex-1 w-full">
                  <input 
                    type="text" 
                    placeholder="Enter document title (e.g., Motion, Exhibit A)" 
                    required
                    className="w-full p-2 border rounded text-sm"
                    value={doc.title}
                    onChange={e => handleDocumentTitleChange(index, e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1 truncate">File: {doc.file.name} ({Math.round(doc.file.size / 1024 / 1024 * 10) / 10} MB)</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload} 
            />
            <p className="font-semibold text-[#4CAF7D]">+ Click to add a file</p>
            <p className="text-xs text-gray-500 mt-1">Max 10MB per file. Add the main document and any supporting files.</p>
          </div>

          {documents.length > 3 && (
            <p className="text-sm text-[#F07A35] font-semibold bg-orange-50 p-2 rounded">
              Note: Adding more than 3 files costs ₦{EXTRA_FILE_FEE} per extra file.
            </p>
          )}
        </div>

        {/* RECIPIENTS SECTION */}
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="font-bold text-lg">2. Recipients (₦{BASE_FEE} each)</h2>
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
            <p className="text-gray-400 text-sm mb-1">Breakdown:</p>
            <ul className="text-xs text-gray-400 mb-2 space-y-1">
              <li>{recipients.length} Recipient(s) × ₦{BASE_FEE} = ₦{(recipients.length * BASE_FEE).toLocaleString()}</li>
              {extraFiles > 0 && <li>{extraFiles} Extra File(s) × ₦{EXTRA_FILE_FEE} = ₦{fileFee.toLocaleString()}</li>}
            </ul>
            <p className="text-3xl font-bold text-[#4CAF7D]">₦{totalPrice.toLocaleString()}</p>
          </div>
          <button 
            type="submit" 
            disabled={loading || documents.length === 0}
            className="w-full md:w-auto bg-[#F07A35] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#d96b2c] disabled:opacity-50 transition-colors"
          >
            {loading ? "Processing..." : `Pay ₦${totalPrice.toLocaleString()} & Send`}
          </button>
        </div>
      </form>
    </div>
  )
}