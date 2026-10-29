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

      const data = await res.json()

      if (res.ok) {
        window.location.href = "/dashboard"
      } else {
        setError(data.error || "Invalid email or password")
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
        
        <a 
          href="/api/auth/google"
          className="flex items-center justify-center gap-2 w-full border border-gray-300 text-gray-700 p-2 rounded mb-6 hover:bg-gray-50 font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </a>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>

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
          
        <button type="submit" disabled={loading} className="w-full bg-[#4CAF7D] text-white p-2 rounded disabled:opacity-50 font-bold">
          {loading ? "Logging in..." : "Log In"}
        </button>
        <p className="mt-4 text-center text-sm">
          Don't have an account? <Link href="/register" className="text-[#4CAF7D]">Register</Link>
        </p>
      </form>
    </div>
  )
}