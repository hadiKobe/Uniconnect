'use client';

import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { useSession } from "next-auth/react";
import { useMessageStore } from "@/lib/store/messageStore"; // Import your Zustand store

export function SocketProvider() {
  const { data: session } = useSession();
  const incrementUnread = useMessageStore((state) => state.incrementUnread);

  useEffect(() => {
    const socket = getSocket();

    if (session?.user?.id) {
      if (!socket.connected) socket.connect();

      socket.emit("login", { userId: session.user.id });

      socket.on("newMessageNotification", ({ chatId }) => {
        incrementUnread(chatId);
      });

      socket.on("connect", () => {
        console.log("Socket connected with ID:", socket.id);
      });
    }

    return () => {
      // ✅ Clean up events on unmount to prevent duplicates
      socket.off("newMessageNotification");
      socket.off("connect");
    };
  }, [session, incrementUnread]);

  return null; // Only for side effects
}
