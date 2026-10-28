import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import { compare } from "bcryptjs"

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials")
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          })

          if (!user || !user.passwordHash) {
            console.log("User not found or no password")
            return null
          }

          const isValid = await compare(
            credentials.password as string,
            user.passwordHash
          )

          if (!isValid) {
            console.log("Invalid password")
            return null
          }

          console.log("Login successful for:", user.email)
          return { id: user.id, name: user.name, email: user.email }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  }
})