import { useState } from "react"

export default function useAddPost() {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(false);

   const path = `/api/posts/add`;
   const fetchAddPost = async (payload) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
         const res = await fetch(path, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
         });

         if (!res.ok) throw new Error("Failed to add Post");
         setSuccess(true);
         return true;
      } catch (error) { setError(error.message || "Unknown error"); return false; }
      finally { setLoading(false); }
   }
   return { loading, error, success, fetchAddPost };
}