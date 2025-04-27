"use client";

import { useState, useEffect } from "react";

export function useGetFriends(userId) {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return; // Skip if no userId provided

    const fetchFriends = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/Friends/get/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch friends.");
        }
        const data = await response.json();
        setFriends(data.friends || []); // Adjust based on API structure
      } catch (err) {
        console.error("Error fetching friends:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userId]);

  return { friends, loading, error };
}
