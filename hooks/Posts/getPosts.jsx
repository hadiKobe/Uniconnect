"use client"

import { useState, useEffect, useRef } from "react"

export function useGetPosts(filter = '', section = 'home', specific = '', location = '', page = 1, refetchTrigger = 0) {
   const [posts, setPosts] = useState([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)

   const lastContextRef = useRef({ filter, section, specific, location })

   const isSameContext =
      lastContextRef.current.filter === filter &&
      lastContextRef.current.section === section &&
      lastContextRef.current.specific === specific &&
      lastContextRef.current.location === location

   // 🧠 fetchPosts uses current closure values of filter, section, etc.
   const fetchPosts = async () => {
      setLoading(true)
      setError(null)

      const queryParams = { filter, section, specific, location, page }
      const params = Object.entries(queryParams)
         .map(([key, value]) => value ? `${key}=${encodeURIComponent(value)}` : null)
         .filter(Boolean)
         .join("&")

      const finalPath = `/api/posts/getPost?${params}`
      // console.log("Fetching:", finalPath)

      try {
         const response = await fetch(finalPath)
         if (!response.ok) throw new Error("Failed to fetch posts")
         const data = await response.json()

         setPosts(prev =>
            isSameContext && page > 1 ? [...prev, ...data] : data
         )

         lastContextRef.current = { filter, section, specific, location }
      } catch (err) {
         console.error(err)
         setError(err.message || "Unknown error")
      } finally {
         setLoading(false)
      }
   }

   // 👇 Trigger fetch automatically on state change
   useEffect(() => {
      fetchPosts()
   }, [filter, section, specific, location, page, refetchTrigger])

   const onDeletePost = (postId) => {
      setPosts(prev => prev.filter(post => post.id !== postId))
   }

   return { posts, onDeletePost, loading, error }
}
