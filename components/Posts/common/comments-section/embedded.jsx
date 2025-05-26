"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import useAddComment from "@/hooks/Posts/Comments/addComment";
import { toast } from "sonner";
import CommentItem from "./comment-item";
import { MessageCircle } from "lucide-react";

export default function EmbeddedCommentSection({ commentsInfo, isLoading }) {
  const { user_id: author_id, comments: initialComments, post_id } = commentsInfo;

  const [commentsArray, setCommentsArray] = useState(initialComments || []);
  const [newComment, setNewComment] = useState("");
  const commentInputRef = useRef(null);
  const firstRender = useRef(true);

  const { fetchAddComment, error, success, loading } = useAddComment();
  const { data: session } = useSession();

  const currentUser = {
    id: Number.parseInt(session?.user?.id, 10),
    name: session?.user?.name || `${session?.user?.first_name ?? "User"}`,
  };

useEffect(() => {
  if (Array.isArray(initialComments)) {
    setCommentsArray(initialComments);
  }
}, [initialComments]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const added = await fetchAddComment(post_id, newComment);
    if (added) {
      setCommentsArray((prev) => [...prev, added[0]]);
      setNewComment("");
      setTimeout(() => commentInputRef.current?.focus(), 100);
    }
  };

  const handleDeleteComment = (commentId) => {
    setCommentsArray((prev) => prev.filter((c) => c.id !== commentId));
  };

  useEffect(() => {
    if (success) toast.success("Comment added successfully");
    if (error) toast.error(error || "Comment was not added.");
  }, [success, error]);

  return (
    <div className="w-full bg-background rounded-xl border mt-6">
      <div className="p-6 font-semibold text-lg flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <span>Comments {isLoading ? "..." : commentsArray.length}</span>
      </div>

      <div className="p-6 space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground text-lg">Loading comments...</p>
          </div>
        ) : commentsArray && commentsArray.length > 0 ? (
          commentsArray.map((comment, index) => (
            <CommentItem
              key={comment.id || index}
              comment={comment}
              author_id={author_id}
              onDeleteComment={handleDeleteComment}
              isLast={index === commentsArray.length - 1}
              setIsDropdownOpen={() => { }}
            />
          ))
        ) : (
          <div className="text-muted-foreground text-center py-8 text-lg">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-start gap-4 p-6 border-t">
        <Avatar className="h-10 w-10">
          <AvatarImage src={null || "/placeholder.svg"} alt={currentUser.name} />
          <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="relative flex-1">
          <Textarea
            ref={commentInputRef}
            placeholder="Add a comment..."
            className="min-h-[50px] resize-none pr-12 text-base"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={2}
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="sm"
            disabled={loading || !newComment.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 px-3"
            variant="ghost"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send comment</span>
          </Button>
        </div>
      </form>
    </div>

  );
}
