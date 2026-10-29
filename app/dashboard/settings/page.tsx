import { getSession } from "../../lib/session"
import { redirect } from "next/navigation"
import { prisma } from "../../lib/prisma"
import ProfileSettings from "../ProfileSettings"

export const instant = false

export default async function SettingsPage() {
  const session = await getSession()

  if (!session?.userId) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage your account details and preferences</p>
      </div>

      <ProfileSettings 
        userId={session.userId} 
        initialName={user.name || ""}
        initialOrg={user.organization || ""} 
        initialPic={user.profilePicture || null}
        hasPassword={!!user.passwordHash}
      />
    </div>
  )
}