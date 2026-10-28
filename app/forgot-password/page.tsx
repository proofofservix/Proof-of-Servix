"use client"
import { useState } from "react"
import Link from "next/link"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })

    const data = await res.json()
    setMessage(data.message || data.error)
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 border rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
        
        {message && <p className="text-green-600 bg-green-50 p-3 rounded mb-4">{message}</p>}
        
        <p className="text-sm text-gray-600 mb-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <input 
          type="email" 
          placeholder="Email" 
          required
          className="w-full p-2 mb-4 border rounded"
          onChange={e => setEmail(e.target.value)} 
        />
          
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#4CAF7D] text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        
        <p className="mt-4 text-center text-sm">
          Remember your password? <Link href="/login" className="text-[#4CAF7D]">Log in</Link>
        </p>
      </form>
    </div>
  )
}