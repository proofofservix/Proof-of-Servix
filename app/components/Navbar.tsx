"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Navbar({ isAdmin = false, profilePicture }: { isAdmin?: boolean, profilePicture?: string | null }) {
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
          <Link href="/dashboard/settings" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Settings
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/dashboard/settings">
          {profilePicture ? (
            <img src={profilePicture} alt="Profile" className="w-9 h-9 rounded-full object-cover border hover:ring-2 hover:ring-[#4CAF7D] transition-all" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-100 border flex items-center justify-center text-gray-500 hover:ring-2 hover:ring-[#4CAF7D] transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
          )}
        </Link>
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