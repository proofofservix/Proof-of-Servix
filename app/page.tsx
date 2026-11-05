import Link from "next/link"
import Navbar from "./components/PublicNavbar"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900">
      
      {/* GLOBAL NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center text-center px-6 pt-24 pb-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="inline-block bg-orange-50 text-[#F07A35] px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-orange-100">
          The Standard for Electronic Document Service
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight max-w-4xl">
          Send It. Prove It. <br />
          <span className="text-gray-900">For </span>
          <span className="text-[#4CAF7D]">FREE.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
          The secure platform for electronic document service. Easily serve documents and obtain your proof of service with just a few clicks. Built for businesses, organisations, and legal practitioners.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/register" className="bg-[#4CAF7D] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#3d9c6c] shadow-lg shadow-green-100 transition-all">
            Upload Your Document
          </Link>
          <Link href="/verify" className="bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-lg font-bold text-lg hover:border-[#F07A35] hover:text-[#F07A35] transition-all">
            Verify a Certificate
          </Link>
        </div>
      </main>

      {/* HOW IT WORKS (Moved Up) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 text-center relative">
              <div className="w-12 h-12 bg-[#4CAF7D] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">1</div>
              <h3 className="font-bold text-xl mb-3">Upload & Dispatch</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Upload your document, and enter the recipient's details. Dispatch is initiated instantly.</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 text-center relative">
              <div className="w-12 h-12 bg-[#F07A35] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">2</div>
              <h3 className="font-bold text-xl mb-3">Recipient Verifies</h3>
              <p className="text-gray-600 text-sm leading-relaxed">The recipient clicks your secure link. They verify their identity via Email or SMS to view the document.</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 text-center relative">
              <div className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">3</div>
              <h3 className="font-bold text-xl mb-3">Download Your Proof</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Download your proof of service with the recipient's timestamp and evidence logs.</p>
            </div>

          </div>
        </div>
      </section>

      {/* WHO IS IT FOR (3 Columns, Real Estate removed) */}
      <section className="py-20 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Built for Anyone Who Needs Proof</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg bg-white shadow-sm">
              <h3 className="font-bold text-lg mb-2">Legal Practitioners</h3>
              <p className="text-sm text-gray-600">Serve court processes, notices, and demands with court-defensible proof.</p>
            </div>
            <div className="p-6 border rounded-lg bg-white shadow-sm">
              <h3 className="font-bold text-lg mb-2">Corporate Organisations</h3>
              <p className="text-sm text-gray-600">Deliver official notices, HR letters, and compliance documents to staff or partners.</p>
            </div>
            <div className="p-6 border rounded-lg bg-white shadow-sm">
              <h3 className="font-bold text-lg mb-2">Individuals</h3>
              <p className="text-sm text-gray-600">Send personal petitions, notices, or formal correspondence and prove it was received.</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM SECTION (Security Focus) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">A Chain of Custody You Can Prove</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Every action is logged with a tamper-evident timestamp and device signature, tracking the journey of each document from upload by the sender to download by the recipient. Files are retained for up to 90 days and automatically purged thereafter, while the cryptographic trail of evidence is preserved permanently.
          </p>
          <p className="text-lg font-semibold text-[#4CAF7D]">
            Secure by design. Verifiable by default.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto py-12 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="text-xl font-bold text-[#4CAF7D]">Proof of Servix</span>
            <p className="text-sm text-gray-500 mt-2">Send It. Prove It.</p>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/how-it-works" className="hover:text-[#4CAF7D]">How It Works</Link>
            <Link href="/verify" className="hover:text-[#4CAF7D]">Verify</Link>
            <Link href="/contact" className="hover:text-[#4CAF7D]">Contact Us</Link>
            <Link href="/terms" className="hover:text-[#4CAF7D]">Terms</Link>
            <Link href="/privacy" className="hover:text-[#4CAF7D]">Privacy</Link>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-8">
          &copy; 2026 ABIMARS INVENTIONS LIMITED. All rights reserved.
        </div>
      </footer>
    </div>
  )
}