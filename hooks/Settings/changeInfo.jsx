import { useState } from "react";

export  function useChangeInfo() {
   const [loadingChange, setLoadingChange] = useState(false);
   const [errorChange, setErrorChange] = useState(null);
   const path = '/api/settings/info';

   const fetchChangeInfo = async (info) => {
      console.log(path);
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
            if (!(msg?.isAllowedToChangeMajor)) isChanged.isAllowedToChangeMajor = false;
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