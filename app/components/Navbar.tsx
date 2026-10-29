"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Navbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/login"
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center print:hidden">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="text-xl font-bold text-[#4CAF7D]">
          Proof of Servix
        </Link>
        <div className="hidden md:flex gap-6">
          <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          {isAdmin && (
            <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Admin Panel
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={handleLogout}
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          Log out
        </button>
      </div>
    </nav>
  )
}