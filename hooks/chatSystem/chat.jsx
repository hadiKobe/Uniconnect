import { useState, useEffect } from "react";

export function useChat(userA, userB) {
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userA || !userB) return;

    async function fetchChat() {
      try {
        const res = await fetch(`/api/chats/ChatId?userA=${userA}&userB=${userB}`);
        if (!res.ok) throw new Error("Failed to get chat");
        const data = await res.json();
        setChat(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchChat();
  }, [userA, userB]);

  return { chat, loading, error };
}
