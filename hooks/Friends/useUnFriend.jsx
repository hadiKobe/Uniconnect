import { useState } from "react";

export function useUnFriend() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const removeFriend = async (friendId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/Friends/unFriend`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove friend.");
      }

      return data; 
    } catch (err) {
      console.error("Remove friend error:", err);
      setError(err.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { removeFriend, loading, error };
}
