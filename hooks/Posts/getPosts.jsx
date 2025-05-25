"use client"

import { useState, useEffect, useRef } from "react"

export function useGetPosts(filter = '', section = 'home', specific = '', location = '', page = 1) {
   const [posts, setPosts] = useState([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)

   const lastContextRef = useRef({ filter, section, specific, location })

   const isSameContext = (
      lastContextRef.current.filter === filter &&
      lastContextRef.current.section === section &&
      lastContextRef.current.specific === specific &&
      lastContextRef.current.location === location
   )

   useEffect(() => {
      const fetchPosts = async () => {
         setLoading(true)
         setError(null)

         const path = `/api/posts/getPost?`
         const queryParams = { filter, section, specific, location, page }
         const params = Object.entries(queryParams)
            .map(([key, value]) => value ? `${key}=${value}` : null)
            .filter(Boolean)
         const finalPath = path + params.join("&")

         try {
            const response = await fetch(finalPath)
            if (!response.ok) throw new Error("Failed to fetch posts")
            const data = await response.json()

            setPosts(prev =>
               isSameContext && page > 1
                  ? [...prev, ...data] // ✅ append
                  : data               // ✅ reset
            )

            // update the last context
            lastContextRef.current = { filter, section, specific, location }

         } catch (err) {
            console.error(err)
            setError(err.message || "Unknown error")
         } finally {
            setLoading(false)
         }
      }

      fetchPosts()
   }, [filter, section, specific, location, page])

   const onDeletePost = (postId) => {
      setPosts(prev => prev.filter(post => post.id !== postId))
   }

   useEffect(() => {console.log(posts);},[posts]);

   return { posts, onDeletePost, loading, error }
}
