"use client"

import { createContext, useContext, useState } from "react"

// Create a context for the current user
const UserContext = createContext(null)

export function UserProvider({ children }) {
  // This would typically come from your authentication system
  const [currentUser, setCurrentUser] = useState({
    id: "user123",
    name: "Current User",
    avatar: "/placeholder.svg?height=32&width=32",
  })

  return <UserContext.Provider value={{ currentUser, setCurrentUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
