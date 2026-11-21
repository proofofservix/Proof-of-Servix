import { prisma } from "@/app/lib/prisma"
import Link from "next/link"
import SearchBar from "@/app/components/SearchBar"
import { getSession } from "@/app/lib/session"

export const instant = false

export default async function UsersDirectory({ 
  searchParams 
}: { 
  searchParams: Promise<{ search?: string, sort?: string }> 
}) {
  const { search, sort } = await searchParams
  const searchTerm = search || ""
  
  // 1. Fetch the current logged-in user to check if they are Super Admin
  const session = await getSession()
  const currentUser = session?.userId 
    ? await prisma.user.findUnique({ where: { id: session.userId } }) 
    : null

  let orderBy = {}
  if (sort === "name") {
    orderBy = { name: "asc" }
  } else if (sort === "oldest") {
    orderBy = { createdAt: "asc" }
  } else {
    orderBy = { createdAt: "desc" }
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
        { organization: { contains: searchTerm, mode: "insensitive" } }
      ]
    },
    orderBy,
    take: 100
  })

  const sortOptions = [
    { label: "Newest Joined", value: "newest" },
    { label: "Oldest Joined", value: "oldest" },
    { label: "Name (A-Z)", value: "name" }
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Directory</h1>
          <p className="text-gray-500">View and manage all registered users</p>
        </div>
        <div className="flex gap-4">
          
          {/* 2. ONLY show the Manage Admin button if currentUser is Super Admin */}
          {currentUser?.isSuperAdmin && (
            <Link 
              href="/admin/manage-admins" 
              className="bg-gray-800 text-white px-4 py-2 rounded font-bold hover:bg-gray-700"
            >
              Manage Admin Roles
            </Link>
          )}

          <Link 
            href="/admin" 
            className="text-sm font-medium text-gray-500 hover:text-gray-900 self-center"
          >
            &larr; Back
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold">All Users ({users.length})</h2>
        </div>
        <div className="p-6">
          <SearchBar 
            placeholder="Search by name, email, or organization..." 
            sortOptions={sortOptions} 
          />

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Organization</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Joined</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 text-sm font-medium">{user.name}</td>
                  <td className="p-4 text-sm">{user.email}</td>
                  <td className="p-4 text-sm text-gray-500">{user.organization || "N/A"}</td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      user.isSuperAdmin ? "bg-purple-100 text-purple-800" :
                      user.isAdmin ? "bg-blue-100 text-blue-800" : 
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {user.isSuperAdmin ? "Super Admin" : user.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Link href={`/admin/users/${user.id}`} className="text-sm text-blue-600 hover:underline">
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}