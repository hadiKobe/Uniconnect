"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Search, User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

export default function DropdownMenu({ suggestions, loading, onClose, searchQuery }) {
   const dropdownRef = useRef(null)

   // Close dropdown when clicking outside
   useEffect(() => {
      function handleClickOutside(event) {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            onClose()
         }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
         document.removeEventListener("mousedown", handleClickOutside)
      }
   }, [onClose])

   return (
      <div
         ref={dropdownRef}
         className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-[300px] "
      >
         {/* Search link as first item - always visible */}
         <Link
            href={`/Search?term=${encodeURIComponent(searchQuery)}`}
            className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors border-b"
            onClick={onClose}
         >
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted">
               <Search className="h-4 w-4" />
            </div>
            <div>
               <p className="text-sm font-medium">Search for "{searchQuery}"</p>
            </div>
         </Link>

         {loading ? (
            <div className="p-3">
               {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 py-2">
                     <Skeleton className="h-8 w-8 rounded-full" />
                     <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                     </div>
                  </div>
               ))}
            </div>
         ) : suggestions.length > 0 ? (
            <div className="p-1">
               {suggestions.map((suggestion) => (
                  <Link
                     key={suggestion.id}
                     href={`/Profile/${suggestion.id}`}
                     className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors"
                     onClick={onClose}
                  >
                     <Avatar className="relative h-8 w-8 rounded-full overflow-hidden">

                        <AvatarImage src={suggestion.profile_picture || null} alt={suggestion.name} />
                        <AvatarFallback>
                           <User className="h-4 w-4" />
                        </AvatarFallback>
                     </Avatar>
                     <div>
                        <p className="text-sm font-medium">{suggestion.name}</p>
                        {suggestion.mutualFriendsCount !== undefined && (
                           <p className="text-xs text-muted-foreground">
                              {suggestion.mutualFriendsCount} mutual friend{suggestion.mutualFriendsCount !== 1 ? 's' : ''}
                           </p>
                        )}
                     </div>
                  </Link>
               ))}
            </div>
         ) : null}
      </div>
   )
}