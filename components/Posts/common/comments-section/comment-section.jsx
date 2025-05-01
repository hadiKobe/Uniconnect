"use client";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp } from "lucide-react";
import CommentItem from "./comment-item";
import { useSession } from "next-auth/react";
import useAddComment from "@/hooks/Posts/Comments/addComment";
import { toast } from "sonner";

export default function CommentSection({ commentsInfo }) {
  const { user_id: author_id, comments: initialComments, post_id } = commentsInfo;

  const [commentsArray, setCommentsArray] = useState(initialComments);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");

  const { fetchAddComment, error, success, loading } = useAddComment();
  const { data: session } = useSession();

  const currentUser = {
    id: parseInt(session?.user?.id),
    name: session?.user?.name || `${session?.user?.first_name ?? "User"}`,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const added = await fetchAddComment(post_id, newComment);
    console.log(added[0]);
    if (added) {
      setCommentsArray((prev) => [...prev, added[0]]); // ✅ no need to manually build it
      setNewComment("");
      setIsExpanded(true);
      console.log(commentsArray);
    }
  };


  const handleDeleteComment = (commentId) => {
    setCommentsArray((prev) => prev.filter((c) => c.id !== commentId));
  };

  useEffect(() => {
    if (success) toast.success("Comment added successfully");
    else if (error) toast.error(error || "Comment was not added.");
  }, [success, error]);

  return (
    <div className="pt-2 w-full">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 mb-2 text-muted-foreground"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {commentsArray.length > 0 ? (
          <>
            <span>
              {isExpanded ? "Hide" : "View"} {commentsArray.length}{" "}
              {commentsArray.length === 1 ? "comment" : "comments"}
            </span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </>
        ) : (
          <span>No comments yet</span>
        )}
      </Button>

      {isExpanded && commentsArray.length > 0 && (
        <div className="border-l-2 border-muted pl-4 ml-2 mt-2">
          {commentsArray.map((comment,index) => (
            <CommentItem
              key={index}
              comment={comment}
              author_id={author_id}
              onDeleteComment={handleDeleteComment}
            />
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={null || "/placeholder.svg"} alt={currentUser.name} />
          <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <form className="flex-1 flex gap-2 w-full" onSubmit={handleSubmit}>
          <Textarea
            placeholder="Add a comment..."
            className="min-h-[40px] flex-1 resize-none"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button type="submit" size="sm" disabled={loading} className="self-end">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
