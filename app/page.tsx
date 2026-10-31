import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900">
      
      {/* NAV BAR */}
      <header className="w-full border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* Clickable Logo & Text */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/pos_logo.png" alt="Proof of Servix" className="h-10 w-auto" />
            <span className="text-2xl font-bold text-[#4CAF7D]">Proof of Servix</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-[#4CAF7D]">Log In</Link>
            <Link href="/register" className="text-sm font-bold bg-[#4CAF7D] text-white px-5 py-2.5 rounded-lg hover:bg-[#3d9c6c] transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center text-center px-6 pt-24 pb-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="inline-block bg-orange-50 text-[#F07A35] px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-orange-100">
          The Standard for Electronic Document Service
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight max-w-4xl">
          Send It. Prove It. <br />
          <span className="text-[#4CAF7D]">Defend It.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
          Stop relying on screenshots or read receipts. Generate legally defensible Service Submission Receipts (SSR) and Certificates of Acknowledgement (CSA) for documents served via Email or WhatsApp. Built for businesses, organisations, and legal practitioners.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/register" className="bg-[#4CAF7D] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#3d9c6c] shadow-lg shadow-green-100 transition-all">
            Start Serving Documents
          </Link>
          <Link href="/verify" className="bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-lg font-bold text-lg hover:border-[#F07A35] hover:text-[#F07A35] transition-all">
            Verify a Certificate
          </Link>
        </div>
      </main>

      {/* WHO IS IT FOR */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Built for Anyone Who Needs Proof</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 border rounded-lg bg-gray-50">
              <h3 className="font-bold text-lg mb-2">Legal Practitioners</h3>
              <p className="text-sm text-gray-600">Serve court processes, notices, and demands with court-defensible proof.</p>
            </div>
            <div className="p-6 border rounded-lg bg-gray-50">
              <h3 className="font-bold text-lg mb-2">Corporate Organisations</h3>
              <p className="text-sm text-gray-600">Deliver official notices, HR letters, and compliance documents to staff or partners.</p>
            </div>
            <div className="p-6 border rounded-lg bg-gray-50">
              <h3 className="font-bold text-lg mb-2">Real Estate & Finance</h3>
              <p className="text-sm text-gray-600">Send tenancy agreements, demand notices, and account statements without ambiguity.</p>
            </div>
            <div className="p-6 border rounded-lg bg-gray-50">
              <h3 className="font-bold text-lg mb-2">Individuals</h3>
              <p className="text-sm text-gray-600">Send personal petitions, notices, or formal correspondence and prove it was received.</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM SECTION */}
      <section className="py-20 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">The End of "I Never Received It"</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Sending documents via email or WhatsApp is fast, but proving it in a dispute is a nightmare. The other party claims they never got the message, the WhatsApp "read" receipt isn't enough, and you have no way to prove the identity of the person who opened the file.
          </p>
          <p className="text-lg font-semibold text-[#4CAF7D]">
            Proof of Servix solves this by providing an independent, auditable timeline of delivery.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 text-center relative">
              <div className="w-12 h-12 bg-[#4CAF7D] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">1</div>
              <h3 className="font-bold text-xl mb-3">Upload & Dispatch</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Upload your document, enter the recipient's details, and pay the service fee. Dispatch is initiated instantly.</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 text-center relative">
              <div className="w-12 h-12 bg-[#F07A35] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">2</div>
              <h3 className="font-bold text-xl mb-3">Recipient Verifies</h3>
              <p className="text-gray-600 text-sm leading-relaxed">The recipient clicks your secure link. They verify their identity via Email OTP to view the document.</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 text-center relative">
              <div className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">3</div>
              <h3 className="font-bold text-xl mb-3">Download Your Proof</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Download your cryptographically hashed SSR and the CSA with the recipient's timestamp and IP logs.</p>
            </div>

          </div>
        </div>
      </section>

      {/* TRUST / AUTHORITY */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Legal-Grade Security for Everyone</h2>
          <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              "We built Proof of Servix to meet the strict evidentiary standards of the Nigerian legal system. That means whether you are a law firm serving a court process or a business sending a final demand notice, every document is secured with SHA-256 cryptographic hashing and detailed access logs."
            </p>
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-[#4CAF7D] rounded-full flex items-center justify-center text-white font-bold text-xl mb-3">
                PA
              </div>
              <p className="font-bold text-gray-900">Barr. Precious Abisam</p>
              <p className="text-sm text-gray-500">Co-Founder & CEO (Notary Public)</p>
            </div>
          </div>
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
            <Link href="/features" className="hover:text-[#4CAF7D]">Features</Link>
            <Link href="/pricing" className="hover:text-[#4CAF7D]">Pricing</Link>
            <Link href="/verify" className="hover:text-[#4CAF7D]">Verify</Link>
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