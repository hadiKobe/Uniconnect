"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import { useUser } from "../context/user-context"

export function CommentsSection({ postId, comments, postAuthorId }) {
  const { currentUser } = useUser()
  const [commentText, setCommentText] = useState("")
  const [postComments, setPostComments] = useState(comments || [])

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    const newComment = {
      id: `comment-${Date.now()}`,
      authorId: currentUser.id,
      author: {
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      content: commentText,
      createdAt: "Just now",
    }

    setPostComments([...postComments, newComment])
    setCommentText("")
  }

  const handleDeleteComment = (commentId) => {
    setPostComments(postComments.filter((comment) => comment.id !== commentId))
  }

  const canDeleteComment = (comment) => {
    // User can delete their own comments or any comment on their post
    return comment.authorId === currentUser.id || postAuthorId === currentUser.id
  }

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="font-medium mb-3">Comments ({postComments.length})</h3>

      <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
        {postComments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
        ) : (
          postComments.map((comment) => (
            <div key={comment.id} className="flex gap-2 group">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-sm">{comment.author.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{comment.createdAt}</span>
                  </div>
                  {canDeleteComment(comment) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  )}
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddComment} className="flex gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
          <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <Input
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={!commentText.trim()}>
          Post
        </Button>
      </form>
    </div>
  )
}
