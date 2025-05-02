"use client"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Send, X } from "lucide-react"
import { useSession } from "next-auth/react"
import useAddComment from "@/hooks/Posts/Comments/addComment"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import useDeleteComment from "@/hooks/Posts/Comments/deleteComment"

export default function InstagramStyleCommentSection({ commentsInfo }) {
  const { user_id: author_id, comments: initialComments, post_id } = commentsInfo

  const [commentsArray, setCommentsArray] = useState(initialComments)
  const [isOpen, setIsOpen] = useState(false)
  const [newComment, setNewComment] = useState("")
  const commentInputRef = useRef(null)
  const modalRef = useRef(null)

  const { fetchAddComment, error, success, loading } = useAddComment()
  const { data: session } = useSession()

  const currentUser = {
    id: Number.parseInt(session?.user?.id),
    name: session?.user?.name || `${session?.user?.first_name ?? "User"}`,
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const added = await fetchAddComment(post_id, newComment)
    if (added) {
      setCommentsArray((prev) => [...prev, added[0]])
      setNewComment("")
      // Focus back on input after sending
      setTimeout(() => {
        commentInputRef.current?.focus()
      }, 100)
    }
  }

  const handleDeleteComment = (commentId) => setCommentsArray((prev) => prev.filter((c) => c.id !== commentId))

  const openComments = () => {
    setIsOpen(true)
    document.body.style.overflow = "hidden" // Prevent background scrolling
  }

  const closeComments = () => {
    setIsOpen(false)
    document.body.style.overflow = "" // Restore scrolling
  }

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeComments()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closeComments()
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEscape)
    }

    return () => {
      window.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  useEffect(() => {
    if (success) toast.success("Comment added successfully")
    if (error) toast.error(error || "Comment was not added.")
  }, [success, error])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        commentInputRef.current?.focus()
      }, 300) // Wait for animation to complete
    }
  }, [isOpen])

  return (
    <>
      {/* Comment Button Trigger */}
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
        onClick={openComments}
      >
        <MessageCircle className="h-4 w-4" />
        <span>
          {commentsArray.length} {commentsArray.length === 1 ? "comment" : "comments"}
        </span>
      </Button>

      {/* Instagram-style Comment Modal */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <div
          ref={modalRef}
          className={cn(
            "fixed bottom-0 left-0 right-0 bg-background rounded-t-xl flex flex-col transition-transform duration-300 ease-out max-h-[85vh] md:max-w-md md:left-auto md:right-4 md:top-4 md:bottom-auto md:rounded-xl",
            isOpen ? "translate-y-0" : "translate-y-full md:translate-y-0 md:translate-x-full",
          )}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="font-medium">Comments</div>
            <Button variant="ghost" size="icon" onClick={closeComments} className="h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {commentsArray.length > 0 ? (
              commentsArray.map((comment, index) => (
                <CommentItem
                  key={index}
                  comment={comment}
                  author_id={author_id}
                  onDeleteComment={handleDeleteComment}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">No comments yet. Be the first to comment!</div>
            )}
          </div>

          {/* Comment Input */}
          <div className="border-t p-3 bg-background sticky bottom-0">
            <form className="flex items-center gap-2" onSubmit={handleSubmit}>
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={null || "/placeholder.svg"} alt={currentUser.name} />
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
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={loading || !newComment.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-2"
                  variant="ghost"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send comment</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Pull indicator for mobile */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-muted-foreground/30 rounded-full md:hidden" />
        </div>
      </div>
    </>
  )
}

// Comment Item Component
function CommentItem({ comment, author_id, onDeleteComment }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { data: session } = useSession()
  const { fetchDeleteComment } = useDeleteComment()

  const currentUserId = Number.parseInt(session?.user?.id)
  const isAuthor = currentUserId === comment.user_id
  const isPostAuthor = currentUserId === author_id
  const canDelete = isAuthor || isPostAuthor

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await fetchDeleteComment(comment.id)
      onDeleteComment(comment.id)
      toast.success("Comment deleted successfully")
    } catch (error) {
      toast.error("Failed to delete comment")
    } finally {
      setIsDeleting(false)
    }
  }

  // Format the date
  const formattedDate = comment.created_at
    ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })
    : "just now"

  return (
    <div className="flex gap-3 group">
      <Avatar className="h-8 w-8 mt-0.5 flex-shrink-0">
        <AvatarImage src={comment.user_avatar || "/placeholder.svg"} alt={comment.user_name} />
        <AvatarFallback>{comment.user_name?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-medium text-sm">{comment.user_name}</span>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
        <p className="text-sm mt-0.5">{comment.content}</p>
      </div>

      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity self-start flex-shrink-0"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      )}
    </div>
  )
}
