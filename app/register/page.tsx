"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Register() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", organization: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })

    if (res.ok) {
      setSuccess(true)
    } else {
      const data = await res.json()
      setError(data.error || "Something went wrong")
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md p-8 border rounded-lg shadow-sm text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">Registration Successful</h1>
          <p className="text-gray-600 mb-6">
            We have sent a verification link to your email address. Please check your inbox and click the link to activate your account.
          </p>
          <Link href="/login" className="text-[#4CAF7D] hover:underline">Go to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 border rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Create Account</h1>
        {error && <p className="text-red-500 mb-4 bg-red-50 p-2 rounded">{error}</p>}
        
        <input type="text" placeholder="Name" required
          className="w-full p-2 mb-4 border rounded"
          onChange={e => setForm({...form, name: e.target.value})} />

        <input type="text" placeholder="Organization / Chambers (Optional)"
          className="w-full p-2 mb-4 border rounded"
          onChange={e => setForm({...form, organization: e.target.value})} />
          
        <input type="email" placeholder="Email" required
          className="w-full p-2 mb-4 border rounded"
          onChange={e => setForm({...form, email: e.target.value})} />
          
        <input type="password" placeholder="Password" required
          className="w-full p-2 mb-4 border rounded"
          onChange={e => setForm({...form, password: e.target.value})} />
          
        <button type="submit" disabled={loading} className="w-full bg-[#4CAF7D] text-white p-2 rounded disabled:opacity-50">
          {loading ? "Creating..." : "Register"}
        </button>
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link href="/login" className="text-[#4CAF7D]">Log in</Link>
        </p>
      </form>
    </div>
  )
}