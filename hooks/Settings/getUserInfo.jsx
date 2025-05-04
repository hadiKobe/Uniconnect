import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function useGetUserInfo() {
   const { data: session, status } = useSession();
   const [loading, setLoading] = useState(false);
   const [userInfo, setUserInfo] = useState({});
   const [error, setError] = useState(null);

   const fetchInfo = async (userId) => {
      setLoading(true);
      setError(null);

      try {
         const response = await fetch(`/api/user/getInfo/${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
         });

         if (!response.ok) throw new Error("Failed to fetch user info");

         const data = await response.json();
         const { userInfo } = data;

         setUserInfo({
            first_name: userInfo.first_name || "",
            last_name: userInfo.last_name || "",
            major: userInfo.major || "",
            joined_in: userInfo.joined_in || new Date(),
            bio: userInfo.bio || "",
            address: userInfo.address || "",
            phone_number: userInfo.phone_number || "",
            expected_graduation_date: userInfo.expected_graduation_date || new Date(),
            graduation_progress: userInfo.graduation_progress || 0,
            gpa: userInfo.gpa || "",
            profile_picture: userInfo.profile_picture || null,
         });
      } catch (err) {
         console.error(err);
         setError(err.message || "Unknown error");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      if (status === "authenticated" && session?.user?.id) fetchInfo(session.user.id);
   }, [status, session]);

   return { userInfo, loading, error };
}