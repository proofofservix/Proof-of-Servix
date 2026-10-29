import { NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import { createSession } from "@/app/lib/session"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state") || "/dashboard"

  if (!code) {
    return NextResponse.redirect(`${process.env.APP_URL}/login?error=GoogleAuthFailed`)
  }

  try {
    // 1. Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.APP_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      throw new Error("No access token")
    }

    // 2. Fetch user profile
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const googleUser = await userResponse.json()

    if (!googleUser.email) {
      throw new Error("No email from Google")
    }

    // 3. Find or create user in DB
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          emailVerifiedAt: new Date(), // Google emails are already verified
          // passwordHash is null
        },
      })
    }

    // 4. Create our custom session
    await createSession(user.id, user.name, user.email || "")

    // 5. Redirect to dashboard
    return NextResponse.redirect(`${process.env.APP_URL}${state}`)
  } catch (error) {
    console.error("Google Auth Error:", error)
    return NextResponse.redirect(`${process.env.APP_URL}/login?error=GoogleAuthFailed`)
  }
}