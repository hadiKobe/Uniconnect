import { useState } from "react";

export default function useChangePassowrd() {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const path = '/api/settings/password';

   const fetchChangePassword = async (old_password, new_password) => {
      setLoading(true);
      setError(null);

      let result;
      const isChanged = { success: false, msg: "" };

      try {
         result = await fetch(path, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ new_password, old_password })
         });

         const data = await result.json();

         if (result.ok && data.changed) {
            isChanged.success = true;
            isChanged.msg = "Password Updated Successfully";
         }
         else isChanged.msg = data.error;

      } catch (error) {
         setError(error.message || 'unknown error');
         isChanged.msg = "Unexpected error";
         isChanged.success = false;
      } finally {
         setLoading(false);
         return isChanged;
      }

   }

   return { loading, error, fetchChangePassword }
}