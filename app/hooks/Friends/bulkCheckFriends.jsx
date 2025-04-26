"use client";

import { useState, useEffect } from "react";

export function useBulkFriendCheck(friendIds) {
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!friendIds || friendIds.length === 0) {
      setStatuses({});
      setLoading(false);
      return;
    }

    const fetchStatuses = async () => {
      try {
        const res = await fetch('/api/Friends/bulkCheck', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ friendIds }),
        });

        const data = await res.json();
        setStatuses(data.statuses || {});

      } catch (error) {
        console.error('Failed to fetch friend statuses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, [friendIds.join(",")]); // ✅ important! join to prevent infinite loops!

  return { statuses, setStatuses, loading };
}
