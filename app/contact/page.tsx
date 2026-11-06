import Link from "next/link"
import Navbar from "../components/PublicNavbar"

export const instant = false

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-6 py-20 w-full">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <p className="text-gray-600 mb-10 text-lg">
          If you have any questions about Proof of Servix, or need support with a transaction, please reach out to us.
        </p>

        <div className="space-y-6 bg-gray-50 p-8 rounded-lg border">
          <div>
            <p className="font-bold text-gray-900">General Support</p>
            <p className="text-gray-700">support@mails.proofofservix.com</p>
            <p className="text-sm text-gray-500 mt-1">We typically respond within 24 hours.</p>
          </div>
          <div>
            <p className="font-bold text-gray-900">Legal & Privacy</p>
            <p className="text-gray-700">legal@mails.proofofservix.com</p>
          </div>
        </div>

        <div className="mt-12">
          <Link href="/" className="text-[#4CAF7D] hover:underline">&larr; Back to Home</Link>
        </div>
      </main>

      <footer className="py-8 border-t border-gray-200 bg-white text-center text-sm text-gray-500">
        <p>&copy; 2026 ABIMARS INVENTIONS LIMITED. All rights reserved.</p>
      </footer>
    </div>
  )
}