import { useState } from "react";

export default function useAddReport() {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(false);

   const fetchAddReport = async (postId, reason, details) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const path = `/api/posts/report/add`;
      try {
         const res = await fetch(path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId, reason, details }),
         });
         if (!res.ok) throw new Error("Failed to Report post");
         setSuccess(true);
         
      } catch (error) { setError(error.message || "Unknown error"); }
      finally { setLoading(false); }
   }
   return { loading, error, success, fetchAddReport };
}