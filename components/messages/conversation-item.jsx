"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNowStrict, parseISO, isValid } from "date-fns";

export function ConversationItem({ conversation, isActive, onClick }) {
  const participant = conversation.participants?.[0] || {};

  const {
    first_name = "Unknown",
    last_name = "",
    profile_picture,
    id = "",
  } = participant;

  const initials = `${first_name[0] || ""}${last_name[0] || ""}`.toUpperCase();

  const { lastMessageTime = conversation.lastUpdated || "", lastMessage = "", unreadCount = 0 } = conversation;

  // Fallback to placeholder image if profile_picture is null or undefined
  const profilePicUrl = profile_picture || "/placeholder.svg";

  // Format time using date-fns
  let formattedTime = "";
  if (lastMessageTime) {
    const date = parseISO(lastMessageTime);
    if (isValid(date)) {
      formattedTime = formatDistanceToNowStrict(date, { addSuffix: true }); // Example: "5 minutes ago"
    }
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 cursor-pointer rounded-lg transition-colors",
        isActive ? "bg-muted" : "hover:bg-muted/50"
      )}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar>
          <AvatarImage src={profilePicUrl} alt={`${first_name} ${last_name}`} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-medium truncate">{`${first_name} ${last_name}`}</p>
          <p className="text-xs text-muted-foreground whitespace-nowrap">{formattedTime}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground truncate">{lastMessage}</p>
          {unreadCount > 0 && (
            <span className="flex-shrink-0 h-5 w-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
