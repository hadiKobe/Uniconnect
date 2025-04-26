"use client"

import { useState, useEffect } from "react"

export function useIsFriend(friendId) {
  const [isFriend, setIsFriend] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!friendId) return

    const fetchFriendStatus = async () => {
      try {
        const res = await fetch(`/api/Friends/isFriend?userId=${friendId}`)
        const data = await res.json()
        setIsFriend(data.isFriend || false)
      } catch (err) {
        console.error("Failed to check friend status:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFriendStatus()
  }, [friendId])

  return { isFriend, loading }
}
