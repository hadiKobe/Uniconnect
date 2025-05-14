'use client';
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useUserChats } from "@/hooks/chatSystem/userChats";
import { useGetMessages } from "@/hooks/chatSystem/getMassages";
import { ConversationList } from "./coversation-list";
import { MessageThread } from "./message-thread";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getSocket } from "@/lib/socket";
import { cn } from "@/lib/utils";

export function MessagesPage() {

const socketRef = useRef(null);


  const { data: session } = useSession();
  const userId = session?.user?.id;

  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [showConversationList, setShowConversationList] = useState(!isMobile);
  const [messagesMap, setMessagesMap] = useState({});

  const { chats: conversations = [] } = useUserChats(userId);
  const { messages: fetchedMessages } = useGetMessages(activeConversationId);


   useEffect(() => {
    if (!userId || socketRef.current) return;

    const socket = getSocket();

    // ✅ Edit: Only connect if not already connected
    if (!socket.connected) socket.connect();

    socket.emit("login", { userId });
    socketRef.current = socket;

    socket.on("receivePrivateMessage", (data) => {
      const { chatId } = data;
      setMessagesMap((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), { ...data }],
      }));
    });

    // ✅ Edit: Handle 'messagesMarkedAsRead' globally for sender
    socket.on("messagesMarkedAsRead", ({ chatId }) => {
      setMessagesMap((prev) => ({
        ...prev,
        [chatId]: prev[chatId]?.map((msg) => ({ ...msg, isRead: true })),
      }));
    });

    return () => {
      socket.off("receivePrivateMessage");
      socket.off("messagesMarkedAsRead");
    };
  }, [userId]);

  // ✅ Keep messages in sync when fetched
  useEffect(() => {
    if (activeConversationId && fetchedMessages) {
      setMessagesMap((prev) => ({
        ...prev,
        [activeConversationId]: fetchedMessages,
      }));
    }
  }, [activeConversationId, fetchedMessages]);

  // ✅ Auto-mark messages as read when user views a chat and there are unread messages
  useEffect(() => {
    if (!activeConversationId || !userId) return;

    const unreadExists = messagesMap[activeConversationId]?.some(
      (msg) => msg.toUserId === userId && !msg.isRead
    );

    if (unreadExists) {
      socketRef.current?.emit("markMessagesAsRead", {
        chatId: activeConversationId,
        userId,
      });
    }
  }, [activeConversationId, messagesMap, userId]);

  const handleSelectConversation = (id) => {
    setActiveConversationId(id);

    if (socketRef.current && userId) {
      socketRef.current.emit("markMessagesAsRead", { chatId: id, userId });
    }

    // ✅ Optimistic UI: Mark all messages in this chat as read immediately
    if (messagesMap[id]) {
      setMessagesMap((prev) => ({
        ...prev,
        [id]: prev[id].map((msg) =>
          msg.toUserId === userId ? { ...msg, isRead: true } : msg
        ),
      }));
    }

    if (isMobile) setShowConversationList(false);
  };

  const handleSendMessage = (text, image) => {
    if (!activeConversationId) return;

    const newMessage = {
      _id: `${activeConversationId}-${Date.now()}`,
      fromUserId: userId,
      toUserId: activeConversation?.participants[0]?.id,
      chatId: activeConversationId,
      message: text.trim() || null,
      media: image ? [{ url: image, type: "image" }] : [],
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    socketRef.current?.emit("sendPrivateMessage", newMessage);

    // ✅ Optimistic UI update
    setMessagesMap((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMessage],
    }));
  };

  const activeConversation = conversations.find((c) => c._id === activeConversationId);
  const activeMessages = activeConversationId ? messagesMap[activeConversationId] || [] : [];

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden">
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        showConversationList ? "block w-full md:w-1/3 h-full border-r" : "hidden md:block md:w-1/3 h-full border-r"
      )}>
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      <div className={cn(
        "transition-all duration-300 ease-in-out flex-1 h-full",
        showConversationList && isMobile ? "hidden" : "block"
      )}>
        {activeConversation ? (
          <MessageThread
            conversation={activeConversation}
            messages={activeMessages}
            onSendMessage={handleSendMessage}
            onBack={() => setShowConversationList(true)}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
