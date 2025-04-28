"use client";

import { useState, useEffect } from "react";

export function useUnreadNotifications() {
  const [count, setCount] = useState(0); // count is a number
  const [error, setError] = useState(null); // optional if you still want error handling

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch("/api/notifications/countUnRead", {
          method: "GET",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch unread notifications.");
        }

        if (data.count !== undefined) {
          setCount(data.count);
        } else {
          setCount(0);
        }

      } catch (err) {
        console.error("Fetching unread notifications error:", err);
        setError(err.message);
      }
    }

    fetchCount(); // call once on mount
  }, []);

  return { count, error }; // no loading
}
