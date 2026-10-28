import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const secretKey = process.env.AUTH_SECRET || "fallback-secret-change-me"
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    return null
  }
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value
  if (!session) return null
  return await decrypt(session)
}

export async function createSession(userId: string, name: string, email: string) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, name, email, expires })

  ;(await cookies()).set("session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })
}

export async function deleteSession() {
  ;(await cookies()).delete("session")
}