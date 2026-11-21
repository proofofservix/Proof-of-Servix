"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RoleAction({ 
  targetUserId, 
  isAdmin,
  name
}: { 
  targetUserId: string, 
  isAdmin: boolean,
  name: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    const action = isAdmin ? "remove admin status from" : "make"
    const confirmMessage = `Are you sure you want to ${action} ${name}?`
    
    if (!window.confirm(confirmMessage)) {
      return
    }

    setLoading(true)
    const res = await fetch("/api/admin/toggle-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        targetUserId, 
        makeAdmin: !isAdmin 
      })
    })

    if (res.ok) {
      router.refresh()
    } else {
      alert("Failed to update role.")
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-4 py-2 rounded font-bold text-sm transition-colors ${
        isAdmin 
          ? "bg-red-100 text-red-800 hover:bg-red-200" 
          : "bg-[#4CAF7D] text-white hover:bg-[#3d9c6c]"
      } disabled:opacity-50`}
    >
      {loading ? "Processing..." : isAdmin ? "Remove Admin" : "Make Admin"}
    </button>
  )
}