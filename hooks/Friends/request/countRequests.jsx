import { useEffect, useState } from "react";

export function useFriendRequestsCount(pollingInterval = 10000, enabled = true) {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    try {
      const res = await fetch("/api/Friends/Requests/count");
      if (res.ok) {
        const data = await res.json();
        setCount(data.count || 0);
      }
    } catch (err) {
      console.error("Failed to fetch friend requests", err);
    }
  };

  useEffect(() => {
    if (!enabled) return;
    fetchCount(); // initial fetch

    const interval = setInterval(fetchCount, pollingInterval);
    return () => clearInterval(interval);
  }, [pollingInterval, enabled]);

  return { count, refetch: fetchCount };
}
