import Navbar from "../components/PublicNavbar"
import Link from "next/link"

export const instant = false

export default function TermsOfUse() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full">
        <h1 className="text-4xl font-bold mb-2">Terms of Use</h1>
        <p className="text-sm text-gray-500 mb-10">Last Updated: November 16, 2026</p>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
          <p>
            Proof of Servix is a product of ABIMARS INVENTIONS LIMITED, a company registered under the laws of the Federal Republic of Nigeria.
          </p>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Acceptance of these Terms</h2>
            <p>
              By using Proof of Servix ("PoS", "we", "us", or "our") sites, services, and web applications (together, "PoS"), whether as a guest or a registered user, you accept and agree to be bound by these Terms. Please read these Terms carefully before you start to use PoS, as well as the PoS Privacy Policy. If you do not agree to these Terms or the PoS Privacy Policy, you must not access or use PoS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Changes to the Terms</h2>
            <p>
              We may revise and update these Terms from time to time at our sole discretion. Any changes are effective when we post them. Your continued use of PoS following the posting of revised Terms means that you accept and agree to the changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Changes to PoS</h2>
            <p>
              While we hope to always offer PoS and all of its features, we reserve the right to change or cease offering PoS or any part, portion, or functionality of PoS without notice. We will not be liable if for any reason all or any part of PoS is unavailable at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Information About You and Your Access of PoS</h2>
            <p>
              All information we collect on or through PoS is subject to our Privacy Policy. By using PoS, you consent to all actions taken by us in compliance with the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Permitted and Unpermitted Use</h2>
            <p>
              You may use PoS in accordance with these Terms for your personal, professional, or internal business use. All rights not expressly granted to you are reserved by ABIMARS INVENTIONS LIMITED. You agree you are not permitted and will not use PoS:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>in any way that violates any federal, state, local, or international law or regulation;</li>
              <li>to serve documents that you do not have the legal right to serve;</li>
              <li>to impersonate or attempt to impersonate any company or person, including ABIMARS INVENTIONS LIMITED or another PoS user;</li>
              <li>to engage in any other conduct which, as determined by us, may harm ABIMARS INVENTIONS LIMITED or users of PoS or expose them to liability;</li>
              <li>in any manner that could disable, overburden, damage, or impair PoS or interfere with any other person's use of PoS;</li>
              <li>to introduce any viruses, Trojan horses, worms, logic bombs, or other material which is malicious or technologically harmful;</li>
              <li>to attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of PoS or any server, computer, or database connected to PoS;</li>
              <li>to attack PoS via a denial-of-service attack or a distributed denial-of-service attack; and</li>
              <li>otherwise attempt to interfere with the working of PoS.</li>
            </ul>
            <p className="mt-4">
              You also agree that you will not send, knowingly receive, upload, download, use, or re-use any material which:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>contains any material which is defamatory, obscene, indecent, abusive, offensive, harassing, violent, hateful, inflammatory, or otherwise objectionable;</li>
              <li>promotes sexually explicit or pornographic material, violence, or discrimination on any basis;</li>
              <li>infringes any patent, trademark, trade secret, copyright, or other intellectual property or other rights of any other person;</li>
              <li>violates the legal rights (including the rights of publicity and privacy) of others;</li>
              <li>promotes any illegal activity, or advocates, promotes, or assists any unlawful act; and/or</li>
              <li>gives the impression that the material emanates from or is endorsed by ABIMARS INVENTIONS LIMITED or any other person or entity, if this is not the case.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Document Storage and Retention</h2>
            <p>
              Proof of Servix is designed to serve and verify documents, not to act as a permanent document storage facility.
            </p>
            <p className="mt-2 font-semibold">You acknowledge and agree that:</p>
            <ol className="list-decimal pl-6 space-y-1 mt-2">
              <li>Your uploaded documents will be automatically and permanently deleted from our storage servers ninety (90) days after the date of upload.</li>
              <li>The cryptographic proof of delivery (the Service Submission Receipt and Certificate of Service and Acknowledgement) will remain permanently recorded in our database, but the underlying document file itself will no longer be available for download after this 90-day period.</li>
              <li>It is your sole responsibility to download and retain copies of your documents, SSR, and CSA. We shall not be liable for any loss of data resulting from the expiration of the 90-day retention period.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Recipient Contact Information</h2>
            <p>
              You are solely responsible for providing accurate and valid contact details for the recipient, including email addresses and phone numbers. Proof of Servix transmits documents to the exact email address or phone number provided by you. We shall not be liable for any failure of delivery, misdelivery, or unauthorized access resulting from inaccurate contact information provided by the sender.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Unacknowledged Documents</h2>
            <p>
              Proof of Servix records the dispatch of a document and its subsequent acknowledgement by a recipient. However, we cannot compel a recipient to open, view, or acknowledge a document. If a recipient chooses to ignore, reject, or fail to acknowledge a document, Proof of Servix will record the available events (such as dispatch, delivery, link access, or refusal), but we shall not be liable for the recipient's refusal or failure to act. The sender retains the Service Submission Receipt as evidence of dispatch in such cases.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Evidentiary Support and Witness Testimony</h2>
            <p>
              Proof of Servix acts as an independent, neutral witness to the electronic service of documents.
            </p>
            <p className="mt-2 font-semibold">You acknowledge and agree that:</p>
            <ol className="list-decimal pl-6 space-y-1 mt-2">
              <li>We shall, where necessary and upon written request, provide technical explanations, system records, or testimony (whether by affidavit, written statement, or in-person appearance) to support the authenticity and integrity of the records generated by our platform.</li>
              <li>Such assistance will be provided at our discretion, subject to our availability and any legal obligations.</li>
              <li>All costs, logistics, and expenses associated with providing such testimony or support (including but not limited to travel, accommodation, and administrative fees) shall be borne entirely by you, the user. We will provide a cost estimate prior to undertaking any such obligation.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">User Contributions</h2>
            <p>
              PoS may contain interactive features that allow users to post, submit, publish, display, or transmit to other users content or materials (collectively, "User Contributions"). We do not undertake to review User Contributions before they are posted and cannot ensure prompt removal of objectionable material after it has been posted. By providing any User Contribution, you grant us the right to use, reproduce, modify, and disclose such material to third parties in order to offer PoS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Account Security</h2>
            <p>
              PoS allows users ("Participants") to create an account. You agree to treat your login credentials as confidential and agree to notify us immediately of any unauthorized access to or use of your username or password. We have the right to disable any account at any time if, in our opinion, you have violated any provision of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Monitoring and Enforcement; Termination</h2>
            <p>
              We have the right to take any action with respect to any user, account, or User Contribution that we deem necessary or appropriate in our sole discretion, if we believe there to be a violation of these Terms. We reserve the right to terminate or suspend your access to all or part of PoS for any or no reason, including without limitation, any violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Your Reliance on Information</h2>
            <p>
              The information presented on or through PoS is made available solely for general information purposes. We do not warrant the accuracy, completeness, or usefulness of this information. Any reliance you place on such information is strictly at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Disclaimer of Legal Advice and Service Validity</h2>
            <p>
              Proof of Servix is a technical tool and does not provide legal advice. The platform provides technical evidence of submission and acknowledgement. Whether such records constitute valid legal service in any specific proceeding is determined solely by the applicable rules of court or tribunal. We make no representation or warranty that the use of PoS satisfies any specific legal requirement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Intellectual Property Rights</h2>
            <p>
              PoS and its contents, features, and functionality are owned by ABIMARS INVENTIONS LIMITED, its licensors, or other providers of such material and are protected by Nigerian and international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Third Party Links and Services</h2>
            <p>
              PoS may include content or links to other sites or resources provided by third parties (such as payment gateways like Paystack or email providers like Mailgun). We have no control over the contents of those sites or resources and accept no responsibility for them or for any loss or damage that may arise from your use of them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Geographic Restrictions</h2>
            <p>
              ABIMARS INVENTIONS LIMITED is based in Nigeria. Access to PoS may not be legal by certain persons or in certain countries. If you access PoS from outside Nigeria, you do so on your own initiative and are responsible for compliance with local laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Disclaimer of Warranties</h2>
            <p>
              Your use of PoS is at your own risk. PoS is provided on an "as is" and "as available" basis, without any warranties of any kind, either express or implied. We do not warrant that PoS will be accurate, reliable, error-free, or uninterrupted, or that defects will be corrected.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Limitation on Liability</h2>
            <p>
              In no event will ABIMARS INVENTIONS LIMITED, its licensors, service providers, or any of their employees be liable for damages of any kind arising out of or in connection with your use or inability to use PoS, including any direct, indirect, special, incidental, consequential, or punitive damages.
            </p>
            <p className="mt-2">
              This includes, but is not limited to, any loss of data, loss of revenue, loss of profits, or loss of business. <strong>We shall not be liable for any legal outcome, ruling, or judgment arising from the use of our platform or the admission of our certificates as evidence in any court of law.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless ABIMARS INVENTIONS LIMITED, its affiliates, licensors, and service providers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees arising out of or relating to your violation of these Terms or your use of PoS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Governing Law and Jurisdiction</h2>
            <p>
              All matters, disputes, or claims relating to PoS and these Terms shall be governed by and construed in accordance with the internal laws of the Federal Republic of Nigeria. Any legal suit, action, or proceeding arising out of or related to these Terms or PoS shall be instituted exclusively in the Nigerian courts of competent jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Entire Agreement</h2>
            <p>
              These Terms and our Privacy Policy constitute the sole and entire agreement between you and ABIMARS INVENTIONS LIMITED with respect to PoS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Your Comments and Concerns</h2>
            <p>
              Proof of Servix is operated by ABIMARS INVENTIONS LIMITED. All feedback, comments, requests for technical support, and other communications relating to PoS should be directed to: <a href="mailto:legal@mails.proofofservix.com" className="text-[#4CAF7D] hover:underline">legal@mails.proofofservix.com</a>.
            </p>
          </section>
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