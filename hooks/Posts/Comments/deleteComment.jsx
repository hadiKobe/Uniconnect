"use client";

import { useState } from "react";

export default function useDeleteComment() {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(false);

   const fetchDeleteComment = async (comment_id) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const path = `/api/posts/comment/delete/${comment_id}`;
      try {
         const res = await fetch(path, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
         });

         if (!res.ok) throw new Error("Failed to Delete Comment");
         setSuccess(true);
         
      } catch (error) { setError(error.message || "Unknown error"); }
      finally { setLoading(false); }
   }
   return { loading, error, success, fetchDeleteComment };
} 