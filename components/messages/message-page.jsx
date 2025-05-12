"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useUserChats } from "@/hooks/chatSystem/userChats";
import { useGetMessages } from "@/hooks/chatSystem/getMassages";
import { ConversationList } from "./coversation-list";
import { MessageThread } from "./message-thread";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery"; // Assuming you have this
import { io } from "socket.io-client";
export function MessagesPage() {
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ;
const socket = io(SOCKET_URL);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [showConversationList, setShowConversationList] = useState(!isMobile);
  const [messagesMap, setMessagesMap] = useState({});

  const { chats: conversations = [], loading, error } = useUserChats(userId);
  const { messages: fetchedMessages, loading: loadingMessages } = useGetMessages(activeConversationId);

  useEffect(() => {
  if (!userId) return;

  socket.emit("login", { userId }); // Register user on server

  socket.on("receivePrivateMessage", (data) => {
    const { chatId, fromUserId, message, media } = data;

    setMessagesMap((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), { ...data }],
    }));
  });

  return () => {
    socket.off("receivePrivateMessage");
  };
}, [userId]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversationId && fetchedMessages) {
      setMessagesMap((prev) => ({
        ...prev,
        [activeConversationId]: fetchedMessages,
      }));
    }
  }, [activeConversationId, fetchedMessages]);

const handleSelectConversation = (id) => {
  setActiveConversationId(id);
    if (messagesMap[id]) {
      setMessagesMap((prev) => ({
        ...prev,
        [id]: prev[id].map((message) => ({ ...message, read: true })),
      }));
    }
    if (isMobile) setShowConversationList(false);
  };

 const handleSendMessage = (text, image) => {
  if (!activeConversationId) return;

const newMessage = {
  _id: `${activeConversationId}-${Date.now()}`, // Temporary ID for React key
  fromUserId: userId,
  toUserId: activeConversation?.participants[0]?.id,
  chatId: activeConversationId,
  message: text.trim(),
  media: image ? [{ url: image, type: "image" }] : [],
  timestamp: new Date().toISOString(), // Add a timestamp for UI rendering
  isRead: false,
};


  socket.emit("sendPrivateMessage", newMessage);

  // Optimistically update UI
  setMessagesMap((prev) => ({
    ...prev,
    [activeConversationId]: [...(prev[activeConversationId] || []), newMessage],
  }));
};


  const activeConversation = conversations.find((c) => c._id === activeConversationId);
  const activeMessages = activeConversationId ? messagesMap[activeConversationId] || [] : [];

  return (
    <div className="container max-w-6xl mx-auto h-[calc(100vh-2rem)] my-4 border rounded-lg overflow-hidden">
      <div className="flex h-full">
        {(showConversationList || !isMobile) && (
          <div className={`${isMobile ? "w-full" : "w-1/3"} h-full`}>
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={handleSelectConversation}
            />
          </div>
        )}

        {(!showConversationList || !isMobile) && (
          <div className={`${isMobile ? "w-full" : "w-2/3"} h-full`}>
            {activeConversation ? (
              <>
                {isMobile && (
                  <div className="p-2 border-b">
                    <Button variant="ghost" size="sm" className="gap-1" onClick={() => setShowConversationList(true)}>
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back</span>
                    </Button>
                  </div>
                )}
                <MessageThread
                  conversation={activeConversation}
                  messages={activeMessages}
                  onSendMessage={handleSendMessage}
                />
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
