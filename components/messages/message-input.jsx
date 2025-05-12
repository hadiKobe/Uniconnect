"use client";

import { useState, useRef } from "react";
import { Send, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (!message.trim() && !image) return;

    // Call the parent handler with message and image
    onSendMessage(message.trim(), image);

    // Reset state after sending
    setMessage("");
    setImage(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div className="space-y-2">
      {image && (
        <div className="relative inline-block">
          <img src={image} alt="Upload preview" className="h-20 rounded-md" />
          <Button
            variant="destructive"
            size="icon"
            className="h-5 w-5 absolute top-1 right-1 rounded-full"
            onClick={() => setImage(null)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full flex-shrink-0"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-5 w-5" />
          <span className="sr-only">Attach image</span>
        </Button>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        <Textarea
          placeholder="Type a message..."
          className="min-h-[40px] resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <Button
          size="icon"
          className="rounded-full flex-shrink-0"
          onClick={handleSend}
          disabled={!message.trim() && !image}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
}
