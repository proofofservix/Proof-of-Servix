"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ProfileSettings({ 
  userId, 
  initialName, 
  initialOrg, 
  initialPic,
  hasPassword
}: { 
  userId: string, 
  initialName: string, 
  initialOrg: string, 
  initialPic: string | null,
  hasPassword: boolean
}) {
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [organization, setOrganization] = useState(initialOrg)
  const [profilePicture, setProfilePicture] = useState<string | null>(initialPic)
  
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      return setMessage({ type: "error", text: "Image must be less than 2MB" })
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setProfilePicture(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage({ type: "", text: "" })

    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        userId, 
        name, 
        organization, 
        profilePicture,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined
      })
    })

    const data = await res.json()
    setSaving(false)

    if (res.ok) {
      setMessage({ type: "success", text: "Profile updated successfully!" })
      setCurrentPassword("")
      setNewPassword("")
      router.refresh()
    } else {
      setMessage({ type: "error", text: data.error || "Failed to update profile" })
    }
  }

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm mt-8">
      <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
      
      {message.text && (
        <div className={`p-3 rounded mb-6 ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6 max-w-xl">
        <div>
          <label className="text-sm font-semibold block mb-2">Profile Picture</label>
          <div className="flex items-center gap-4">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-16 h-16 rounded-full object-cover border" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 border flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1">Full Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1">Organization / Chambers</label>
          <input 
            type="text" 
            value={organization} 
            onChange={e => setOrganization(e.target.value)}
            placeholder="e.g. Aria Books, Winning Prime Consulting"
            className="w-full p-2 border rounded"
          />
          <p className="text-xs text-gray-500 mt-1">This will appear on your SSR and CSA documents.</p>
        </div>

        {hasPassword ? (
          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold mb-4 text-gray-800">Change Password</h3>
            <div className="space-y-3">
              <input 
                type="password" 
                placeholder="Current Password" 
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input 
                type="password" 
                placeholder="New Password (leave blank to keep current)" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        ) : (
          <div className="pt-4 border-t text-sm text-gray-500">
            You signed up with Google. Password management is handled by your Google account.
          </div>
        )}

        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-[#4CAF7D] text-white px-6 py-2 rounded font-bold hover:bg-[#3d9c6c] disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  )
}