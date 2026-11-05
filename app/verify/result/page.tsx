import Navbar from "../../../components/PublicNavbar"
import ResultView from "./ResultView"
import { Suspense } from "react"

export default function VerifyResultPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center py-20">
          <p className="text-xl font-bold animate-pulse text-[#4CAF7D]">Loading...</p>
        </div>
      }>
        <ResultView />
      </Suspense>
    </div>
  )
}