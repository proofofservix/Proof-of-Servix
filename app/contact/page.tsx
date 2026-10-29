import Link from "next/link"

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        If you have any questions about Proof of Servix, or need support with a transaction, please reach out to us.
      </p>

      <div className="space-y-4 bg-gray-50 p-6 rounded-lg border">
        <div>
          <p className="font-semibold">General Support</p>
          <p className="text-gray-700">support@proofofservix.com</p>
        </div>
        <div>
          <p className="font-semibold">Legal & Privacy</p>
          <p className="text-gray-700">privacy@proofofservix.com</p>
        </div>
        <div>
          <p className="font-semibold">Company Address</p>
          <p className="text-gray-700">ABIMARS INVENTIONS LIMITED<br />Nigeria</p>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-[#4CAF7D] hover:underline">&larr; Back to Home</Link>
      </div>
    </div>
  )
}