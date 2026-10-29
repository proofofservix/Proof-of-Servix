import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Proof of Servix | Electronic Document Service & Proof",
  description: "The secure, auditable platform for Nigerian lawyers to serve documents electronically and generate court-defensible proof of delivery and acknowledgement.",
  keywords: [
    "Electronic Service", 
    "Proof of Service", 
    "Legal Tech Nigeria", 
    "Certificate of Service", 
    "Electronic Document Service",
    "Serve documents online Nigeria",
    "Court defensible proof of delivery"
  ],
  authors: [{ name: "ABIMARS INVENTIONS LIMITED" }],
  openGraph: {
    title: "Proof of Servix | Send It. Prove It.",
    description: "Generate court-defensible Service Submission Receipts and Certificates of Acknowledgement for documents served electronically.",
    url: "https://proofofservix.com",
    siteName: "Proof of Servix",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Proof of Servix | Send It. Prove It.",
    description: "Generate court-defensible proof of electronic document service.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}