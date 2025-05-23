"use client"

import { useState, useEffect } from "react"

export function useGetPosts(filter = '', section = 'home', specific = '', location = '') {
   const [loading, setLoading] = useState(true);
   const [posts, setPosts] = useState([]);
   const [error, setError] = useState(null);

   const filters = { filter, section, specific, location }

   const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      const path = `/api/posts/getPost?`; // Adjusted path to include section
      const params = Object.entries(filters).map(([key, value]) => { return value ? `${key}=${value}` : null; }).filter(Boolean); // removes null or undefined
      let filteredPath = `${path}${params.join('&')}`;
      // console.log(filteredPath);

      try {
         const response = await fetch(filteredPath, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
         });

         if (!response.ok) throw new Error("Failed to fetch posts");

         const data = await response.json();
         setPosts(data);

      } catch (err) {
         console.error(err);
         setError(err.message || "Unknown error");

      } finally { setLoading(false); }
   }

   const onDeletePost = (post_id) => {
      setPosts((prev) => prev.filter((post) => post.id !== post_id));
   }

   useEffect(() => {
      fetchPosts();
   }, [filter, section, specific, location]);

   return { posts, onDeletePost, loading, error };
}