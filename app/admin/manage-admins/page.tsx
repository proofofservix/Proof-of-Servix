import { prisma } from "@/app/lib/prisma"
import Link from "next/link"
import SearchBar from "@/app/components/SearchBar"
import RoleAction from "./RoleAction"
import { getSession } from "@/app/lib/session"

export const instant = false

export default async function ManageAdmins({ 
  searchParams 
}: { 
  searchParams: Promise<{ search?: string, sort?: string }> 
}) {
  const { search } = await searchParams
  const searchTerm = search || ""
  
  const session = await getSession()
  const currentUser = session?.userId 
    ? await prisma.user.findUnique({ where: { id: session.userId } }) 
    : null

  if (!currentUser?.isSuperAdmin) {
    return (
      <div className="p-8 text-center mt-20">
        <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
        <p className="text-gray-500">Only Super Admins can manage roles.</p>
      </div>
    )
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } }
      ]
    },
    orderBy: { name: "asc" },
    take: 20 // Limit search results to 20 to force specific searching
  })

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Admin Roles</h1>
          <p className="text-gray-500">Safely promote or demote users</p>
        </div>
        <Link href="/admin/users" className="text-sm font-medium text-gray-500 hover:text-gray-900">
          &larr; Back to Directory
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <SearchBar 
          placeholder="Search for a specific user by name or email..." 
          sortOptions={[{ label: "Name (A-Z)", value: "name" }]} 
        />

        <div className="mt-6 space-y-4">
          {users.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No users found. Try a different search.</p>
          ) : (
            users.map((user) => (
              <div key={user.id} className="flex justify-between items-center p-4 border rounded-lg bg-gray-50">
                <div>
                  <p className="font-bold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Current Role: <span className="font-bold uppercase">{user.isSuperAdmin ? "Super Admin" : user.isAdmin ? "Admin" : "User"}</span>
                  </p>
                </div>
                
                {!user.isSuperAdmin && (
                  <RoleAction targetUserId={user.id} isAdmin={user.isAdmin} name={user.name} />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}