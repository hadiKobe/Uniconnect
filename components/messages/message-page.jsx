'use client';
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useChat } from "@/hooks/chatSystem/chat";
import { useUserChats } from "@/hooks/chatSystem/userChats";
import { useGetMessages } from "@/hooks/chatSystem/getMassages";
import { ConversationList } from "./coversation-list";
import { MessageThread } from "./message-thread";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getSocket } from "@/lib/socket";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useMessageStore } from "@/lib/store/messageStore";



export function MessagesPage() {
  const router = useRouter();

  const socketRef = useRef(null);// to store the socket instance

  const { data: session } = useSession();

  const searchParams = useSearchParams();// to gt the query params
  const userA = searchParams.get("userA");
  const userB = searchParams.get("userB");
  const { chat, loading: chatLoading } = useChat(userA, userB);
  const userId = session?.user?.id;
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [showConversationList, setShowConversationList] = useState(!isMobile);
  const [messagesMap, setMessagesMap] = useState({});
  const { messages: fetchedMessages, hasMore, loadMore } = useGetMessages(activeConversationId);
  const resetUnread = useMessageStore.getState().resetUnread;
  const setActiveChatId = useMessageStore((state) => state.setActiveChatId);
  const { chats = [], loading } = useUserChats(userId);
  const [conversations, setConversations] = useState([]);

  // Sync fetched chats to local state
  useEffect(() => {
    setConversations(chats);
  }, [chats]);

  useEffect(() => {
    if (chat && !conversations.some((c) => c._id === chat._id)) {
      setConversations((prev) => [...prev, chat]);
    }

    if (chat && !messagesMap[chat._id]) {
      setActiveConversationId(chat._id); // Optionally auto-open it
    }
    const url = new URL(window.location.href);
    url.searchParams.delete("userA");
    url.searchParams.delete("userB");
    router.replace(url.pathname);
  }, [chat, conversations, messagesMap]);


  useEffect(() => {
    if (!userId || socketRef.current) return;


    const setupSocket = async () => {
      const socket = await getSocket();
      if (!socket.connected) socket.connect();
      socketRef.current = socket;



      socket.on("receivePrivateMessage", (data) => {
        const { chatId, toUserId } = data;

        const isMessageForCurrentUser = toUserId == userId;
        const isActiveChat = chatId == activeConversationId;

        setMessagesMap((prev) => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), { ...data, isRead: isActiveChat && isMessageForCurrentUser }],
        }));

        if (isActiveChat && isMessageForCurrentUser) {
          socket.emit("markMessagesAsRead", { chatId, userId });
        }

        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === chatId
              ? {
                ...conv,
                lastMessage: data.message || "Media",
                lastUpdated: data.timestamp,
              }
              : conv
          )
        );
      });

      // ✅ Edit: Handle 'messagesMarkedAsRead' globally for sender
      socket.on("messagesMarkedAsRead", ({ chatId }) => {
        setMessagesMap((prev) => ({
          ...prev,
          [chatId]: prev[chatId]?.map((msg) => ({ ...msg, isRead: true })),
        }));
      });
      resetUnread(activeConversationId);

    };

    setupSocket();

    return () => {
      (async () => {
        const socket = await getSocket();
        socket.off("receivePrivateMessage");
        socket.off("messagesMarkedAsRead");
      })();
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
  useEffect(() => {
    if (!activeConversationId || !userId) return;

    const unreadExists = messagesMap[activeConversationId]?.some(
      (msg) => msg.toUserId == userId && !msg.isRead
    );

    if (unreadExists) {
      socketRef.current?.emit("markMessagesAsRead", {
        chatId: activeConversationId,
        userId,
      });
    }
  }, [activeConversationId, messagesMap, userId]);

  const handleSelectConversation = (id) => {
    setActiveChatId(id);
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
    resetUnread(id);

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
    setConversations((prev) =>
      prev.map((conv) =>
        conv._id === activeConversationId
          ? {
            ...conv,
            lastMessage: newMessage.message || "Media",
            lastUpdated: newMessage.timestamp,
          }
          : conv
      )
    );

  };
  useEffect(() => { // Runs when the component is unmounted (i.e., when leaving the page)
    return () => {
      setActiveChatId(null);

    };
  }, []);


  const activeConversation = conversations.find((c) => c._id === activeConversationId);
  const activeMessages = activeConversationId ? messagesMap[activeConversationId] || [] : [];



  return (
    <div className="flex h-[calc(100vh-64px)] w-full ">
      {/* LEFT - Conversation List */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        showConversationList ? "block w-full md:w-1/3 h-full border-r" : "hidden md:block md:w-1/3 h-full border-r"
      )}>
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          loading={loading}
        />
      </div>

      {/* RIGHT - Chat Thread */}
      <div className={cn(
        "transition-all duration-300 ease-in-out flex-1 h-full",
        showConversationList && isMobile ? "hidden" : "block"
      )}>
        {activeConversation ? (
          <MessageThread
            conversation={activeConversation}
            messages={activeMessages}
            onSendMessage={handleSendMessage}
            onBack={() => {
              setShowConversationList(true);
              setActiveConversationId(null);
              setActiveChatId(null);
            }}
            onLoadMoreMessages={loadMore}
            hasMore={hasMore}

            loading={!fetchedMessages}
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
