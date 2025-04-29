import { useState } from "react";

export function useUpdateFriendRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateFriendRequest = async (id, status) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/Friends/Requests/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId: id, status }), // status = "accepted" or "declined"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to update friend request to ${status}`);
      }

      return data; // ✅ return server response if needed
    } catch (err) {
      console.error("Update Friend Request Error:", err);
      setError(err.message || "Something went wrong");
      throw err; // Optional: rethrow to let caller handle it
    } finally {
      setLoading(false);
    }
  };

  return {
    updateFriendRequest,
    loading,
    error,
  };
}
