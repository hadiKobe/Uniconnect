"use client";

import { useState } from "react";

export function useMarkNotificationsAsRead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function markAllAsRead() {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/notifications/markAsRead", {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to mark notifications as read.");
      }

      setSuccess(true);
      return data; 
    } catch (err) {
      console.error("Error marking notifications as read:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { markAllAsRead, loading, error, success };
}
