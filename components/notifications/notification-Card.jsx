"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export function NotificationItem({ link, message, created_at, is_read, name, profile_picture }) {
  return (
    <Link href={link || "#"} className="block">
      <div className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-muted/60",
        !is_read && "bg-muted/50"
      )}>

        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar className="relative h-10 w-10 rounded-full overflow-hidden">
            <AvatarImage src={profile_picture || "/placeholder.svg"} alt={name || "User"} />
            <AvatarFallback>{name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-w-0">

          <p className={cn(
            "text-sm font-medium break-words",  // ✅ break words instead of truncate
            !is_read && "text-foreground"
          )}>
            {name || "User"} {message}
          </p>

          {/* Time */}
          <p className="text-xs text-muted-foreground whitespace-nowrap mt-1">
            {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
          </p>
        </div>

      </div>
    </Link>
  );
}
