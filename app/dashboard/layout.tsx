import DashboardNavbar from "../components/DashboardNavbar" // The one with the logout button
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
      <DashboardNavbar isAdmin={user?.isAdmin} profilePicture={user?.profilePicture} />
      <main>{children}</main>
    </div>
  )
}