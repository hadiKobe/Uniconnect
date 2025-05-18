import { useState, useEffect } from "react";


export function useGetMessages(chatId, limit = 20) {
  const [messages, setMessages] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0); // For pagination

  const fetchMessages = async (newSkip = 0) => {
    if (!chatId) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/messages/get?chatId=${chatId}&limit=${limit}&skip=${newSkip}`);
      if (!res.ok) throw new Error("Failed to fetch messages");

      const data = await res.json();
      setMessages((prev) => (newSkip === 0 ? data.messages : [...prev, ...data.messages]));
      setTotalCount(data.totalCount);
      setSkip(newSkip + limit);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when chatId changes
  useEffect(() => {
    setMessages([]);
    setSkip(0);
    if (chatId) fetchMessages(0);
  }, [chatId]);

  return {
    messages,
    loading,
    error,
    hasMore: messages.length < totalCount,
    loadMore: () => fetchMessages(skip),
  };
}
