import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-8 prose prose-sm">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-500 mb-8">Last Updated: October 29, 2026</p>

      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>
            Proof of Servix ("PoS", "we", "us", "our") is a product of ABIMARS INVENTIONS LIMITED, a company registered under the laws of the Federal Republic of Nigeria. We are committed to protecting the privacy of our users and the recipients of documents served through our platform. This Privacy Policy explains how we collect, use, and safeguard your personal data in compliance with the Nigeria Data Protection Act, 2023 (NDPA).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
          <p>We collect information to provide secure electronic document service and verification. This includes:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Sender Data:</strong> Name, email address, organization, and password (hashed) when you create an account.</li>
            <li><strong>Recipient Data:</strong> Name, email address, phone number, and organization provided by the sender.</li>
            <li><strong>Transaction Data:</strong> Documents uploaded, SHA-256 hashes, timestamps, IP addresses, and device information (User-Agent) when a document is accessed.</li>
            <li><strong>Payment Data:</strong> We use Paystack to process payments. We do not store your full card details on our servers.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
          <p>We use the data to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Facilitate the electronic service of documents and generate proof of submission and acknowledgement.</li>
            <li>Verify the identity of recipients (via OTP) to ensure the integrity of the acknowledgement.</li>
            <li>Process payments for services rendered.</li>
            <li>Maintain audit logs and technical evidence for dispute resolution.</li>
            <li>Comply with legal obligations and respond to lawful requests from authorities.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Data Retention</h2>
          <p>
            We retain transaction records, including the Service Submission Receipt (SSR) and Certificate of Service and Acknowledgement (CSA), for a period of <strong>7 years</strong> to support the evidentiary needs of our users. Data is stored securely and access is restricted to authorized personnel.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Sharing of Information</h2>
          <p>
            We do not sell your personal data. We share information only with service providers necessary to operate the platform (e.g., Paystack for payments, Notix for email delivery) and where required by law. We may also disclose transaction records to courts or parties in a legal proceeding where the record is relevant and upon lawful request.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
          <p>
            Under the NDPA, you have the right to access, rectify, or erase your personal data. To exercise these rights, please contact us at <strong>privacy@proofofservix.com</strong>. Note that erasure requests may be limited by our legal obligation to retain transaction evidence.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">7. Contact</h2>
          <p>For any privacy-related inquiries, please contact our Data Protection Officer at privacy@proofofservix.com.</p>
        </section>
      </div>
      
      <div className="mt-12 pt-6 border-t">
        <Link href="/" className="text-[#4CAF7D] hover:underline">&larr; Back to Home</Link>
      </div>
    </div>
  )
}