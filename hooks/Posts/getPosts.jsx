"use client"

import { useState, useEffect } from "react"

export function useGetPosts(filter = '', section = 'home') {
   const [loading, setLoading] = useState(false);
   const [posts, setPosts] = useState([]);
   const [error, setError] = useState(null);


   const fetchPosts = async () => {
      const path = `/api/posts/getPost?section=${section}`; // Adjusted path to include section
      let filteredPath = filter ? `${path}&filter=${filter}` : path;

      setLoading(true);
      setError(null);

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
   }, [filter, section]);

   return { posts, onDeletePost, loading, error };
}