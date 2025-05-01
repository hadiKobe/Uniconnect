import { useState } from "react";

export default function useHandleReaction() {
   const [loadingReaction, setLoadingReaction] = useState(false);
   const [errorReaction, setErrorReaction] = useState(null);
   const [successReaction, setSuccessReaction] = useState(false);
   const path = `/api/posts/reaction`;

   const addPath = `${path}/add`;
   const fetchAddReaction = async (post_id, type) => {
      setLoadingReaction(true);
      setErrorReaction(null);
      setSuccessReaction(false);

      try {
         const add = await fetch(addPath, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ post_id, reaction: type === 'like' ? 1 : 0 })
         });

         if (!add.ok) throw new Error("Failed to add reaction");
         setSuccessReaction(true);
      } catch (error) { setErrorReaction(error.message || "Unknown errorReaction"); }
      finally { setLoadingReaction(false); }
   }

   const delPath = `${path}/delete`;
   const fetchDeleteReaction = async (post_id) => {
      setLoadingReaction(true);
      setErrorReaction(null);
      setSuccessReaction(false);

      try {
         const del = await fetch(`${delPath}/${post_id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
         });

         if (!del.ok) throw new Error("Failed to remove reaction");
         setSuccessReaction(true);
      } catch (error) { setErrorReaction(error.message || "Unknown errorReaction"); }
      finally { setLoadingReaction(false); }
   }
   return { loadingReaction, errorReaction, successReaction, fetchAddReaction, fetchDeleteReaction };
}