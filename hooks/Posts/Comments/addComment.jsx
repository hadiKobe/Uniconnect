import { useState } from "react"

export default function useAddComment() {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(false);

   const path = `/api/posts/comment/add`;
   const fetchAddComment = async (post_id, content) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
         const res = await fetch(path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ post_id, content }),
         });
         if (!res.ok) throw new Error("Failed to add comment");
         const newComment = await res.json();
         setSuccess(true);
         return newComment;
      } catch (error) { setError(error.message || "Unknown error"); }
      finally { setLoading(false); }
   }
   return { loading, error, success, fetchAddComment };
}