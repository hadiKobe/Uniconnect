import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function useGetUserInfo() {
   const { data: session } = useSession();
   const userId = session?.user?.id;
   const [loading, setLoading] = useState(false);
   const [userInfo, setUserInfo] = useState({});
   const [error, setError] = useState(null);

   useEffect(() => {
      setLoading(true);
      setError(null);

      const userId = session?.user?.id;
      if (!userId) return;

      const path = `/api/user/getInfo/${userId}`
      const fetchData = async () => {
         try {
            const response = await fetch(path, {
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
               joined_in: userInfo.joined_in ? userInfo.joined_in.split("T")[0] : "",
               bio: userInfo.bio || "",
               address: userInfo.address || "",
               phone_number: userInfo.phone_number || "",
               expected_graduation_date: userInfo.expected_graduation_date
                  ? userInfo.expected_graduation_date.split("T")[0]
                  : "",
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

      fetchData();
   }, [userId]);



   return { userInfo, loading, error };
}