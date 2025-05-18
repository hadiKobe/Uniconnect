'use client';

import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { useSession } from "next-auth/react";
import { useMessageStore } from "@/lib/store/messageStore"; // Import your Zustand store

export function SocketProvider() {
  const { data: session } = useSession();
  
  const incrementUnread = useMessageStore((state) => state.incrementUnread);
  const setUnreadCounts = useMessageStore((state) => state.setUnreadCounts);

  // ✅ Fetch unread counts once when session is ready
  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/messages/countUnRead");
        if (!res.ok) throw new Error("Unread count fetch failed");


        const data = await res.json();
        setUnreadCounts(data); // { chatId: count }
      } catch (err) {
        console.error("Failed to fetch unread counts:", err);
      }
    };

    fetchUnread();
  }, [session?.user?.id, setUnreadCounts]);

  // ✅ Setup Socket.IO only once
  useEffect(() => {
    const socket = getSocket();

    if (!session?.user?.id) return;

    if (!socket.connected) socket.connect();
    socket.emit("login", { userId: session.user.id });

    socket.on("newMessageNotification", ({ chatId }) => {
      incrementUnread(chatId);
    });

    socket.on("connect", () => {
      console.log("Socket connected with ID:", socket.id);
    });

    return () => {
      socket.off("newMessageNotification");
      socket.off("connect");
    };
  }, [session?.user?.id, incrementUnread]);

  return null;
}