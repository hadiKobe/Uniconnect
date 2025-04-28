// hooks/Friends/useSendFriendRequest.ts

"use client";

import { useState } from "react";

export function useSendFriendRequest() {
  const [loading, setLoading] = useState(false);

  const sendFriendRequest = async (friendId) => {   // ✅ rename here
    setLoading(true);
    try {
      const response = await fetch(`/api/Friends/Requests/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId }),
      });

      const data = await response.json();

      if (data.message) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: "Failed to send friend request." };
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      return { success: false, message: "Something went wrong." };
    } finally {
      setLoading(false);
    }
  };

  return { sendFriendRequest, loading }; // ✅
}
