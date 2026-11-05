import Navbar from "../components/DashboardNavbar" // Ensure this points to your renamed Dashboard Navbar
import { getSession } from "../lib/session"
import { prisma } from "../lib/prisma"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  
  if (!session?.userId) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } })

  if (!user?.isAdmin) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Pass the profile picture and admin status just like in the dashboard layout */}
      <Navbar isAdmin={true} profilePicture={user?.profilePicture} />
      <main>{children}</main>
    </div>
  )
}