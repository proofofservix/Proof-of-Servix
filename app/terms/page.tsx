import Link from "next/link"

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto p-8 prose prose-sm">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-gray-500 mb-8">Last Updated: October 29, 2026</p>

      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Proof of Servix (the "Platform"), operated by ABIMARS INVENTIONS LIMITED, you agree to be bound by these Terms of Service. If you do not agree, you must not use the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Description of Service</h2>
          <p>
            Proof of Servix is a web-based electronic document service and verification platform. It facilitates the electronic dispatch of documents and generates records of submission and acknowledgement. <strong>PoS does not provide legal advice.</strong> The platform provides technical evidence; whether such evidence constitutes valid legal service is determined by the applicable court or tribunal.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>You must be at least 18 years old and legally capable of entering into contracts.</li>
            <li>You are responsible for the accuracy of the recipient details you provide.</li>
            <li>You agree not to use the platform to serve unlawful, harassing, or fraudulent documents.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Payments and Refunds</h2>
          <p>
            Service fees are charged per transaction and are payable in Nigerian Naira (₦) via our payment processor, Paystack. Verification fees are non-refundable once the verification result has been disclosed. Service fees are non-refundable once the document has been dispatched.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, ABIMARS INVENTIONS LIMITED shall not be liable for any indirect, incidental, or consequential damages arising from the use of the platform. We do not guarantee that the records generated will be accepted as proof of service in any specific legal proceeding. Our total liability shall not exceed the amount paid by you for the specific transaction in dispute.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">6. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising shall be subject to the exclusive jurisdiction of the courts of Nigeria.
          </p>
        </section>
      </div>
      
      <div className="mt-12 pt-6 border-t">
        <Link href="/" className="text-[#4CAF7D] hover:underline">&larr; Back to Home</Link>
      </div>
    </div>
  )
}