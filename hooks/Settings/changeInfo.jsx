import { useState } from "react";
import { useUserStore } from "@/lib/store/userStore"; // ✅ This is the correct store
export function useChangeInfo() {

   const setUserInfo = useUserStore((state) => state.setUserInfo); // ✅ Correct store
   const [loadingChange, setLoadingChange] = useState(false);
   const [errorChange, setErrorChange] = useState(null);
   const path = '/api/settings/info';

   const fetchChangeInfo = async (info) => {
      setLoadingChange(true);
      setErrorChange(null);

      let result;
      const isChanged = { msg: null, infoChanged: true };
      try {
         result = await fetch(path, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ info })
         });

         const msg = await result.json();
         isChanged.msg = msg;

         if (!result.ok) {
            isChanged.infoChanged = false;
            if (msg?.notAllowedChangeMajor !== undefined) isChanged.notAllowedChangeMajor = true;
         }
         if(result.ok) {
            isChanged.infoChanged = true;
             setUserInfo(msg.updatedUser); // <-- this should be full user data from backend

            
         }

      } catch (error) {
         setErrorChange(error.message || 'unknown errorChange');
         isChanged.msg = 'Unexpected error';
         isChanged.infoChanged = false;
         isChanged.error = error.message;

      } finally {
         setLoadingChange(false);
         return isChanged;
      }
   }

   return { loadingChange, errorChange, fetchChangeInfo }
}