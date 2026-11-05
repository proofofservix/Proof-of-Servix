import Navbar from "../components/PublicNavbar"
import VerifyForm from "./VerifyForm"
import { Suspense } from "react"

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Suspense fallback={<p className="text-xl font-bold animate-pulse text-[#4CAF7D]">Loading...</p>}>
          <VerifyForm />
        </Suspense>
      </div>
    </div>
  )
}