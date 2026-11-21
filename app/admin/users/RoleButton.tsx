"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RoleButton({ 
  targetUserId, 
  isAdmin, 
  isSuperAdmin 
}: { 
  targetUserId: string, 
  isAdmin: boolean, 
  isSuperAdmin: boolean 
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // If the target user is a Super Admin, we don't allow downgrading them here
  if (isSuperAdmin) {
    return <span className="text-xs font-bold text-purple-600">Super Admin</span>
  }

  const handleToggle = async () => {
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
      alert("Failed to update role. You might not have permission.")
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`text-xs font-bold px-2 py-1 rounded transition-colors ${
        isAdmin 
          ? "bg-red-100 text-red-800 hover:bg-red-200" 
          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
      } disabled:opacity-50`}
    >
      {loading ? "..." : isAdmin ? "Remove Admin" : "Make Admin"}
    </button>
  )
}