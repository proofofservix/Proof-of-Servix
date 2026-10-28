"use client"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function ResetForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password })
    })

    if (res.ok) {
      setMessage("Password reset successfully. Redirecting to login...")
      setTimeout(() => router.push("/login"), 2000)
    } else {
      const data = await res.json()
      setError(data.error || "Something went wrong")
    }
    setLoading(false)
  }

  if (!token) return <p className="text-center text-red-500">Invalid reset link.</p>

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md p-8 border rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Set New Password</h1>
      
      {error && <p className="text-red-500 bg-red-50 p-3 rounded mb-4">{error}</p>}
      {message && <p className="text-green-600 bg-green-50 p-3 rounded mb-4">{message}</p>}

      <input 
        type="password" 
        placeholder="New Password" 
        required
        className="w-full p-2 mb-4 border rounded"
        onChange={e => setPassword(e.target.value)} 
      />
        
      <button 
        type="submit" 
        disabled={loading || !!message}
        className="w-full bg-[#4CAF7D] text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  )
}

export default function ResetPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<p>Loading...</p>}>
        <ResetForm />
      </Suspense>
    </div>
  )
}