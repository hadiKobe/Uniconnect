"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, X, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import useAddComment from "@/hooks/Posts/Comments/addComment";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import CommentItem from "./comment-item";
import { useUserStore } from "@/lib/store/userStore";

export default function InstagramStyleCommentSection({
  commentsInfo,
  isOpen,
  onClose,
  isLoading,
  onManageComment
}) {
  const { user_id: author_id, comments: initialComments, post_id } = commentsInfo;
const{userInfo}= useUserStore();
  const [commentsArray, setCommentsArray] = useState(initialComments || []);
  const [newComment, setNewComment] = useState("");
  const commentInputRef = useRef(null);
  const modalRef = useRef(null);
  const firstRender = useRef(true);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { fetchAddComment, error, success, loading } = useAddComment();
  const { data: session } = useSession();
  const userImage= userInfo?.profile_picture || null;

  const currentUser = {
    id: Number.parseInt(session?.user?.id, 10),
    name: session?.user?.name || `${session?.user?.first_name ?? "User"}`,
  };

  useEffect(() => {
    if (!firstRender.current || initialComments?.length > 0) {
      setCommentsArray(initialComments || []);
    }
    firstRender.current = false;
  }, [initialComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const added = await fetchAddComment(post_id, newComment);
    if (added) {
      setCommentsArray((prev) => [...prev, added[0]]);
      setNewComment("");
      setTimeout(() => {
        commentInputRef.current?.focus();
      }, 100);
      onManageComment(prev => prev + 1)
    }
  };

  const handleDeleteComment = (commentId) => {
    setCommentsArray((prev) => prev.filter((c) => c.id !== commentId));
    onManageComment(prev => prev - 1)
  };

  const closeComments = () => {
    if (onClose) onClose();
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closeComments();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (success) toast.success("Comment added successfully");
    if (error) toast.error(error || "Comment was not added.");
  }, [success, error]);

  useEffect(() => {
    if (isOpen && !isLoading) {
      setTimeout(() => {
        commentInputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isLoading]);

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[1001] bg-black/50 transition-opacity duration-200",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      style={{ isolation: "isolate" }}
    >
      <div
        ref={modalRef}
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-background rounded-t-xl flex flex-col transition-transform duration-300 ease-out max-h-[85vh] md:max-w-3xl md:mx-auto",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-medium">
            Comments ({isLoading ? "..." : commentsArray?.length || 0})
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeComments}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Comments */}
        <div className="flex-1  p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading comments...</p>
            </div>
          ) : commentsArray && commentsArray.length > 0 ? (
            <div>
              {commentsArray.map((comment, index) => (
                <CommentItem
                  key={comment.id || index}
                  comment={comment}
                  author_id={author_id}
                  onDeleteComment={handleDeleteComment}
                  isLast={index === commentsArray.length - 1}
                  setIsDropdownOpen={setIsDropdownOpen} // 👈 Pass the setter!
                />

              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t p-3 bg-background sticky bottom-0">
          <form className="flex items-center gap-2" onSubmit={handleSubmit}>
            <Avatar className="relative h-8 w-8 flex-shrink-0 rounded-full overflow-hidden">
              <AvatarImage src={userImage || null} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="relative flex-1">
              <Textarea
                ref={commentInputRef}
                placeholder="Add a comment..."
                className="min-h-[40px] pr-10 resize-none py-2"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={1}
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="sm"
                disabled={loading || !newComment.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-2"
                variant="ghost"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send comment</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Pull bar */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-muted-foreground/30 rounded-full" />
      </div>
    </div>
  );
}
