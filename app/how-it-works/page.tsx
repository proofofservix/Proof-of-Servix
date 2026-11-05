import Link from "next/link"
import Navbar from "../components/PublicNavbar"

export const instant = false

export default function HowItWorks() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-extrabold mb-6">How It Works</h1>
        <p className="text-lg text-gray-600 mb-16">
          Serving documents has never been this secure, verifiable, or fast. Here is a breakdown of the process.
        </p>

        <div className="space-y-12 text-left">
          <div className="bg-gray-50 p-8 rounded-xl border">
            <h2 className="text-2xl font-bold mb-4 text-[#4CAF7D]">1. Upload & Dispatch</h2>
            <p className="text-gray-600 leading-relaxed">
              Log in to your dashboard and upload the documents you want to serve. Add the recipient's details and click "Send Document". Our system instantly generates a secure link and sends an email notification to the recipient.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl border">
            <h2 className="text-2xl font-bold mb-4 text-[#F07A35]">2. Recipient Verification</h2>
            <p className="text-gray-600 leading-relaxed">
              The recipient clicks the secure link in their email. To ensure the document is delivered to the right person, they must verify their identity using a One-Time Password (OTP) sent to their email or phone.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl border">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">3. Download Your Proof</h2>
            <p className="text-gray-600 leading-relaxed">
              Once the recipient verifies their identity and accesses the document, they acknowledge receipt. At this point, the sender gets a Certificate of Service and Acknowledgement (CSA) while the initial upload generated a Service Submission Receipt (SSR). Both documents are cryptographically secured and legally defensible.
            </p>
          </div>
        </div>
        
        <div className="mt-16">
          <Link href="/register" className="bg-[#4CAF7D] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#3d9c6c] shadow-lg shadow-green-100 transition-all">
            Start Serving Documents for Free
          </Link>
        </div>
      </main>

      <footer className="py-12 border-t border-gray-200 bg-white text-center text-sm text-gray-500">
        <p>&copy; 2026 ABIMARS INVENTIONS LIMITED. All rights reserved.</p>
      </footer>
    </div>
  )
}