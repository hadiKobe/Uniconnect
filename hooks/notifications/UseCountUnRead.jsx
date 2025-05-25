"use client";

import { useState, useEffect } from "react";

export function useUnreadNotifications(pollingInterval = 10000, enabled = true) {
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);

  const fetchCount = async () => {
    try {
      const res = await fetch("/api/notifications/countUnRead", {
        method: "GET",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch unread notifications.");
      }

      setCount(data.count ?? 0);
    } catch (err) {
      console.error("Fetching unread notifications error:", err);
      setError(err.message || "Unknown error");
    }
  };

  useEffect(() => {
    if (!enabled) return;

    fetchCount(); // Fetch once on mount

    const interval = setInterval(fetchCount, pollingInterval);
    return () => clearInterval(interval); // Cleanup
  }, [pollingInterval, enabled]);

  return { count, error, refetch: fetchCount };
}
