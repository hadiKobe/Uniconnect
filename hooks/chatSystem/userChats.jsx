import { useState, useEffect } from "react";

export function useUserChats(userId) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchChats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/chats/getUserChats?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch user chats");
        const data = await res.json();
        setChats(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userId]);

  return { chats, loading, error };
}
