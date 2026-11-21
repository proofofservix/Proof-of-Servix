"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function SearchBar({ 
  placeholder = "Search...", 
  sortOptions 
}: { 
  placeholder?: string, 
  sortOptions: { label: string, value: string }[] 
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const currentSort = searchParams.get("sort") || sortOptions[0].value

  // Debounce the search to prevent fetching on every keystroke
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (searchTerm) {
        params.set("search", searchTerm)
      } else {
        params.delete("search")
      }
      
      params.set("sort", currentSort)
      
      router.push(`?${params.toString()}`)
    }, 400) // 400ms delay

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, currentSort, router, searchParams])

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", e.target.value)
    
    if (searchTerm) params.set("search", searchTerm)
    
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <input 
        type="text" 
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
      />
      
      <select 
        value={currentSort}
        onChange={handleSortChange}
        className="p-2 border rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            Sort by: {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}