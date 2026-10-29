import Navbar from "../components/Navbar"
import { getSession } from "../lib/session"
import { prisma } from "../lib/prisma"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  
  if (!session?.userId) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAdmin={user?.isAdmin} />
      <main>{children}</main>
    </div>
  )
}