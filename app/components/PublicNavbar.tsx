import Link from "next/link"
import { getSession } from "../lib/session"

export default async function PublicNavbar({ forceLoggedOut = false }: { forceLoggedOut?: boolean }) {
  const session = forceLoggedOut ? null : await getSession()
  const logoHref = session ? "/dashboard" : "/"

  return (
    <header className="w-full border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link href={logoHref} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src="/pos_logo.png" alt="Proof of Servix" className="h-10 w-auto" />
          <span className="text-2xl font-bold text-[#4CAF7D]">Proof of Servix</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/how-it-works" className="hover:text-[#4CAF7D] transition-colors">How It Works</Link>
          <Link href="/verify" className="hover:text-[#4CAF7D] transition-colors">Verify</Link>
          <Link href="/contact" className="hover:text-[#4CAF7D] transition-colors">Contact Us</Link>
        </div>

        <div className="flex items-center gap-6">
          {session ? (
            <Link href="/dashboard" className="text-sm font-bold bg-[#4CAF7D] text-white px-5 py-2.5 rounded-lg hover:bg-[#3d9c6c] transition-colors">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-[#4CAF7D]">Log In</Link>
              <Link href="/register" className="text-sm font-bold bg-[#4CAF7D] text-white px-5 py-2.5 rounded-lg hover:bg-[#3d9c6c] transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}