"use client"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router = useRouter()
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setErrorMsg("No verification token found in the URL.")
      return
    }

    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        })

        const data = await res.json()

        if (res.ok) {
          setStatus("success")
          setTimeout(() => router.push("/login"), 3000)
        } else {
          setErrorMsg(data.error || "Verification failed")
          setStatus("error")
        }
      } catch (err) {
        setErrorMsg("Network error")
        setStatus("error")
      }
    }

    verify()
  }, [token, router])

  if (status === "loading") {
    return <p className="text-xl font-bold animate-pulse text-[#4CAF7D]">Verifying your email...</p>
  }

  if (status === "error") {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-2">Verification Failed</h1>
        <p className="text-gray-500 mb-6">{errorMsg}</p>
        <Link href="/login" className="text-[#4CAF7D] hover:underline">Go to Login</Link>
      </div>
    )
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-green-600 mb-2">Email Verified Successfully</h1>
      <p className="text-gray-500 mb-6">Redirecting you to the login page...</p>
    </div>
  )
}

export default function VerifyEmail() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<p>Loading...</p>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
}