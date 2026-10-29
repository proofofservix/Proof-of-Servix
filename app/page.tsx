import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* NAV BAR */}
      <header className="w-full border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#4CAF7D]">Proof of Servix</span>
          </div>
          <div className="space-x-4">
            <Link href="/login" className="text-sm font-medium hover:text-[#4CAF7D]">Log In</Link>
            <Link href="/register" className="text-sm font-medium bg-[#4CAF7D] text-white px-4 py-2 rounded hover:bg-[#3d9c6c]">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 bg-gray-50">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
          Send It. <span className="text-[#4CAF7D]">Prove It.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-10">
          The secure, auditable platform for electronic document service. 
          Generate legally defensible proof of delivery and acknowledgement with just a few clicks.
        </p>
        <div className="flex gap-4">
          <Link href="/register" className="bg-[#4CAF7D] text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#3d9c6c]">
            Create an Account
          </Link>
          <Link href="/verify" className="bg-white text-gray-800 border-2 border-gray-200 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-50">
            Verify a Certificate
          </Link>
        </div>
      </main>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 border rounded-lg">
            <div className="w-12 h-12 bg-[#4CAF7D] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
            <h3 className="font-bold text-xl mb-2">Upload & Send</h3>
            <p className="text-gray-600">Upload your document and enter the recipient's details. Pay the service fee to dispatch instantly.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <div className="w-12 h-12 bg-[#4CAF7D] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
            <h3 className="font-bold text-xl mb-2">Recipient Verifies</h3>
            <p className="text-gray-600">The recipient receives a secure link. Our system verifies their access and logs the timestamp.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <div className="w-12 h-12 bg-[#4CAF7D] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
            <h3 className="font-bold text-xl mb-2">Get Your Proof</h3>
            <p className="text-gray-600">Download your Service Submission Receipt and Certificate of Service & Acknowledgement.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto py-8 border-t text-center text-sm text-gray-500 bg-white">
        <div className="space-x-4 mb-4">
          <Link href="/terms" className="hover:text-gray-800">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-gray-800">Privacy Policy</Link>
          <Link href="/contact" className="hover:text-gray-800">Contact</Link>
          <Link href="/verify" className="hover:text-gray-800">Verify Certificate</Link>
        </div>
<p>&copy; 2026 ABIMARS INVENTIONS LIMITED. All rights reserved.</p>
      </footer>
    </div>
  )
}