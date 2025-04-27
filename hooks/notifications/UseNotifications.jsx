"use client";

import { useState, useEffect } from "react";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications/getByUser", {
          method: "GET",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch notifications.");
        }

        if (data.notifications) {
          setNotifications(data.notifications);
        } else {
          setNotifications([]);
        }

      } catch (err) {
        console.error("Fetching notifications error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  return { notifications, loading, error };
}
