"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNowStrict, parseISO, isValid } from "date-fns";
import { useMessageStore } from "@/lib/store/messageStore";
export function ConversationItem({ conversation, isActive, onClick }) {
  const participant = conversation.participants?.[0] || {};
  const unreadCounts = useMessageStore((state) => state.unreadCounts);
  const chatId = conversation._id;
  const unreadCount = unreadCounts[chatId] || 0;

  const {
    first_name = "Unknown",
    last_name = "",
    profile_picture,
    id = "",
  } = participant;

  const initials = `${first_name[0] || ""}${last_name[0] || ""}`.toUpperCase();

  const { lastMessageTime = conversation.lastUpdated || "", lastMessage = "" } = conversation;

  // Fallback to placeholder image if profile_picture is null or undefined
  const profilePicUrl = profile_picture || "/placeholder.svg";


let formattedTime = "";
if (lastMessageTime) {
  const date = parseISO(lastMessageTime);
  if (isValid(date)) {
    const full = formatDistanceToNowStrict(date, { addSuffix: false }); // e.g., "5 minutes"
    const [value, unit] = full.split(" "); 

    const unitMap = {
      second: "s",
      seconds: "s",
      minute: "m",
      minutes: "m",
      hour: "h",
      hours: "h",
      day: "d",
      days: "d",
      month: "mo",
      months: "mo",
      year: "y",
      years: "y",
    };

    formattedTime = `${value}${unitMap[unit] || ""}`;
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
