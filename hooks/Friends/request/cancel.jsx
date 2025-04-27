"use client";

import { useState } from "react";

export function useCancelFriendRequest() {
  const [loading, setLoading] = useState(false);

  const cancelFriendRequest = async ({ friendId = null, requestId = null } = {}) => {
    setLoading(true);
    try {
      const response = await fetch('/api/Friends/Requests/delete', {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId, requestId }),
      });

      const data = await response.json();

      if (data.message) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || "Failed to cancel request." };
      }
    } catch (error) {
      console.error("Failed to cancel friend request:", error);
      return { success: false, message: "Server error." };
    } finally {
      setLoading(false);
    }
  };

  return { cancelFriendRequest, loading };
}
