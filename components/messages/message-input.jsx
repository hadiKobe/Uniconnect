"use client";

import { useState, useRef } from "react";
import { Send, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { uploadMedia } from "@/lib/supaBase/storage";

export function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null); // Store the File object
  const [imagePreview, setImagePreview] = useState(null); // For preview URL
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

 const handleSend = async () => {
  if (!message.trim() && !imageFile) return;

  setUploading(true);
  let imageUrl = null;

  if (imageFile) {
    const res = await uploadMedia(imageFile, "messages");
    if (res?.publicUrl) {
      imageUrl = res.publicUrl;
    }
  }

  onSendMessage(message.trim(), imageUrl);

  // Reset state after sending
  setMessage("");
  setImageFile(null);
  setImagePreview(null);
  setUploading(false);
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
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-2">
      {imagePreview && (
        <div className="relative inline-block">
          <img src={imagePreview} alt="Upload preview" className="h-20 rounded-md" />
          <Button
            variant="destructive"
            size="icon"
            className="h-5 w-5 absolute top-1 right-1 rounded-full"
            onClick={() => {
              setImageFile(null);
              setImagePreview(null);
            }}
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
          disabled={(!message.trim() && !imageFile) || uploading}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
}
