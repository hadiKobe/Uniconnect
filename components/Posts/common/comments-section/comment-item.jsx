import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { useEffect } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash } from 'lucide-react'
import useDeleteComment from "@/hooks/Posts/Comments/deleteComment"

export default function CommentItem({ comment, author_id, onDeleteComment }) {
  const { data: session } = useSession()
  const currentUserId = parseInt(session?.user?.id);
  const { content, created_at, user } = comment;
  const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true });

  const { loading, error, success, fetchDeleteComment } = useDeleteComment();

  const handleDeleteComment = () => fetchDeleteComment(comment.id);
  
  useEffect(() => {
    if (success) {
      console.log(onDeleteComment);
      onDeleteComment(comment.id);
      toast.success("Comment Deleted successfully");
    }
    else if (error) {
      toast.error(error || "Comment was not deleted.");
    }
  }, [success, error]);

  // Check if current user can delete this comment (either comment author or post author)
  const canDelete = currentUserId === user.id || currentUserId === author_id;
  const isCommentAuthorId = currentUserId === user.id;
  return (
    <div className="flex gap-3 py-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={null || "/placeholder.svg"} alt={user.first_name} />
        <AvatarFallback>{ user?.first_name?.charAt(0) ?? "?"}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{isCommentAuthorId ? "You" : `${user.first_name} ${user.last_name}`}</span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>

          {canDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleDeleteComment}
                  disabled={loading}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  {loading ? "Deleting..." : "Delete comment"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <p className="text-sm mt-1">{content}</p>
      </div>
    </div>
  )
}

