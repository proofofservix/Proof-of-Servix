"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Login() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      if (res.ok) {
        window.location.href = "/dashboard"
      } else {
        setError("Invalid email or password")
        setLoading(false)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 border rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Log In</h1>
        {error && <p className="text-red-500 mb-4 bg-red-50 p-2 rounded">{error}</p>}
        
        <input type="email" placeholder="Email" required
          className="w-full p-2 mb-4 border rounded"
          onChange={e => setForm({...form, email: e.target.value})} />
          
        <input type="password" placeholder="Password" required
          className="w-full p-2 mb-2 border rounded"
          onChange={e => setForm({...form, password: e.target.value})} />
          
        <div className="flex justify-end mb-4">
          <Link href="/forgot-password" className="text-sm text-[#4CAF7D] hover:underline">
            Forgot Password?
          </Link>
        </div>
          
        <button type="submit" disabled={loading} className="w-full bg-[#4CAF7D] text-white p-2 rounded disabled:opacity-50">
          {loading ? "Logging in..." : "Log In"}
        </button>
        <p className="mt-4 text-center text-sm">
          Don't have an account? <Link href="/register" className="text-[#4CAF7D]">Register</Link>
        </p>
      </form>
    </div>
  )
}