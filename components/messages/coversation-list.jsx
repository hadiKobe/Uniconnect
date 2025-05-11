"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ConversationItem } from "./conversation-item"



export function ConversationList({ conversations, activeConversationId, onSelectConversation }) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-full border-r">
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

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={activeConversationId === conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
            />
          ))
        ) : (
          <div className="p-4 text-center text-muted-foreground">No conversations found</div>
        )}
      </div>
    </div>
  )
}
