"use client";

import { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageItem } from "./message-item";
import { MessageInput } from "./message-input";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery"
export function MessageThread({ conversation = {}, messages = [], onSendMessage, onBack }) {
//     setShowConversationList(false);
  const messagesEndRef = useRef(null);
const { data: session } = useSession();
  const userId = session?.user?.id;
    const isMobile = useMediaQuery("(max-width: 768px)");
  const {
    participants = [],
 
  } = conversation;

  // Assuming 1-on-1 chat, safely get the participant info
  const participant = participants[0] || {};
  const {
    first_name = "Unknown",
    last_name = "",
    profile_picture,
    online = false,
  } = participant;

  const initials = `${first_name[0] || ""}${last_name[0] || ""}`.toUpperCase();
  const profilePicUrl = profile_picture || "/placeholder.svg";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
  <div className="flex items-center justify-between gap-3 p-3 border-b">
  {isMobile && (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1"
      onClick={onBack}
    >
      <ArrowLeft className="h-4 w-4" />
      
    </Button>
  )}

  <div className="flex items-center gap-3 flex-1">
    <div className="relative">
      <Avatar>
        <AvatarImage src={profilePicUrl} alt={`${first_name} ${last_name}`} />
        <AvatarFallback>{initials || "?"}</AvatarFallback>
      </Avatar>
      {online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
      )}
    </div>

    <div>
      <p className="font-medium">{`${first_name} ${last_name}`}</p>
      
    </div>
  </div>
</div>


      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageItem 
            key={message._id } 
            message={message} 
            isOwnMessage={Number(message.fromUserId) === Number(userId)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t">
        <MessageInput 
        onSendMessage={onSendMessage}
       userId={userId} 
        chatId={conversation._id} 
        toUserId={participant.id} 
      />

      </div>
    </div>
  );
}
