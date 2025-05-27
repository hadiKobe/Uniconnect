"use client"

import { useState, useEffect } from "react"

export default function useGetComments(post_id) {
   const [loadingComments, setLoadingComments] = useState(false);
   const [comments, setComments] = useState([]);
   const [errorComments, setErrorComments] = useState(null);

   const fetchComments = async () => {
      setLoadingComments(true);
      setErrorComments(null);
      const path = `/api/posts/getPost/${post_id}/comments`;

      try {
         const res = await fetch(path, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
         });

         if (!res.ok) throw new Error("Failed to fetch comments");

         const data = await res.json();
         setComments(data);

      } catch (err) {
         console.error(err);
         setErrorComments(err.message || "Unknown error");
      } finally { setLoadingComments(false); }

   }

   const onDeleteComment = (comment_id) => {
      setComments((prev) => prev.filter((comment) => comment.id !== comment_id));
   }
   return { comments, onDeleteComment, loadingComments, errorComments, fetchComments };
}