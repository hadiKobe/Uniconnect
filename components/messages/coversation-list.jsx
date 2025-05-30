"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConversationItem } from "./conversation-item";

export function ConversationList({ conversations = [], activeConversationId, onSelectConversation, loading }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conversation) => {
    const participant = conversation.participants?.[0];
    const fullName = `${participant?.first_name || ""} ${participant?.last_name || ""}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="h-6 w-6 border-2 border-t-transparent border-primary animate-spin rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-r">
      {/* Search Bar */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 ">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation._id}
              conversation={conversation}
              isActive={activeConversationId == conversation._id}
              onClick={() => onSelectConversation(conversation._id)}
            />
          ))
        ) : (
          <div className="p-4 text-center text-muted-foreground">No conversations found</div>
        )}
      </div>
    </div>
  );
}
