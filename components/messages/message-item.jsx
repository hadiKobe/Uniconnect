"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function MessageItem({ message, isOwnMessage }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const {
    message: text = "",
    media = [],
    timestamp,
    isRead = false, 
  } = message;

  const formattedTime = timestamp ? format(new Date(timestamp), "p, MMM d") : "";

  return (
    <div className={cn("flex", isOwnMessage ? "justify-end" : "justify-start")}>
      
      <div
        className={cn(
          "max-w-[75%] rounded-lg px-3 py-2 mb-1",
          isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {text && <p className="break-words">{text}</p>}

        {media.length > 0 && (
          <div className="mt-2 space-y-2">
            {media.map((item, index) => (
              <img
                key={index}
                src={item.url || "/placeholder.svg"}
                alt="Message attachment"
                className={cn(
                  "rounded-md max-h-60 w-auto transition-opacity",
                  !imageLoaded && "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
              />
            ))}
            {!imageLoaded && (
              <div className="h-40 w-40 bg-muted-foreground/20 rounded-md animate-pulse"></div>
            )}
          </div>
        )}

        <div
          className={cn(
            "flex items-center gap-1 text-xs mt-1",
            isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          <span>{formattedTime}</span>
          {isOwnMessage && (isRead ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
        </div>
      </div>
    </div>
  );
}
