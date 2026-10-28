"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Register() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", organization: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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
      router.push("/login")
    } else {
      const data = await res.json()
      setError(data.error || "Something went wrong")
      setLoading(false)
    }
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