'use client'
import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { useSession } from "next-auth/react";
import { useMessageStore } from "@/lib/store/messageStore";

export function SocketProvider() {
  const { data: session } = useSession();
  const incrementUnread = useMessageStore((state) => state.incrementUnread);
  const setUnreadCounts = useMessageStore((state) => state.setUnreadCounts);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/messages/countUnRead");
        if (!res.ok) throw new Error("Unread count fetch failed");
        const data = await res.json();
        setUnreadCounts(data);
      } catch (err) {
        console.error("Failed to fetch unread counts:", err);
      }
    };

    fetchUnread();
  }, [session?.user?.id, setUnreadCounts]);

 useEffect(() => {
  if (!session?.user?.id) return;

  const connectSocket = async () => {
    try {
      const socket = await getSocket();
      if (!socket.connected) socket.connect();


      socket.emit("login", { userId: session.user.id });

      socket.on("connect", () => {
        console.log("🟢 Socket connected:", socket.id);
      });

      socket.on("newMessageNotification", ({ chatId }) => {
      //  console.log("📨 Received newMessageNotification:", chatId);
        incrementUnread(chatId); // This must log, or it’s not firing
      });

    } catch (err) {
      console.error("❌ Socket setup failed:", err);
    }
  };

  connectSocket();

  return () => {
    (async () => {
      try {
        const socket = await getSocket();
        socket.off("newMessageNotification");
        socket.off("connect");
      } catch (err) {
        console.error("❌ Socket cleanup failed:", err);
      }
    })();
  };
}, [session?.user?.id, incrementUnread]);

  return null; // This component doesn't render anything
} 
