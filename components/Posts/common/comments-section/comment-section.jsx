"use client"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronUp } from "lucide-react"
import CommentItem from "./comment-item"
import { useSession } from "next-auth/react"

export default function CommentSection({ commentsInfo }) {
  const { user_id: author_id, comments ,post_id} = commentsInfo;
  const [isExpanded, setIsExpanded] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: session } = useSession()
  const currentUser = {
    id: parseInt(session?.user?.id),
    name: session?.user?.name || `${session?.user?.first_name ?? "User"}`,
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)

    try {
      // Call the onAddComment callback with the new comment
      if (onAddComment) {
        await onAddComment()
      }

      // Clear the input field after successful submission
      setNewComment("")
    } catch (error) {
      console.error("Failed to add comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onAddComment = () => {
    const path = `/api/posts/comment/add`;
    const res = fetch(path, {
      method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ post_id, content: newComment })
    });

    if (res.ok) 
      console.log(`${type} added successfully`);

  }

  return (
    <div className="pt-2 w-full">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 mb-2 text-muted-foreground"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {comments.length > 0 ? (
          <>
            <span>
              {isExpanded ? "Hide" : "View"} {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </>
        ) : (
          <span>No comments yet</span>
        )}
      </Button>

      {isExpanded && comments.length > 0 && (
        <div className="border-l-2 border-muted pl-4 ml-2 mt-2">
          {comments.map((comment, index) => (
            <CommentItem key={index} comment={comment} author_id={author_id} />
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
          <Button type="submit" size="sm" disabled={isSubmitting} className="self-end">

            Send
          </Button>
        </form>
      </div>
    </div>
  )
}
