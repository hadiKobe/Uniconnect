"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash } from "lucide-react";
import useDeleteComment from "@/hooks/Posts/Comments/deleteComment";

export default function CommentItem({
  comment,
  author_id,
  onDeleteComment,
  isLast,
  setIsDropdownOpen, // ✅ receive the state setter
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();
  const currentUserId = Number.parseInt(session?.user?.id, 10);
  
  const { id: commentId, content, created_at, user } = comment;
  const userImage = user.profile_picture || null;
  const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true });

  const { loading, error, success, fetchDeleteComment } = useDeleteComment();

  const handleDeleteComment = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDeleting(true);
    await fetchDeleteComment(commentId);
  };

  useEffect(() => {
    if (success && isDeleting) {
      onDeleteComment(commentId);
      toast.success("Comment deleted successfully");
      setIsDeleting(false);
    } else if (error && isDeleting) {
      toast.error(error || "Comment was not deleted.");
      setIsDeleting(false);
    }
  }, [success, error, commentId, onDeleteComment, isDeleting]);

  const isCommentAuthor = currentUserId === user.id;
  const isPostAuthor = currentUserId === author_id;
  const canDelete = isCommentAuthor || isPostAuthor;

  return (
    <div className={`flex gap-3 py-3 ${!isLast ? "border-b border-border/60" : ""}`}>
      <Avatar className="relative h-8 w-8 flex-shrink-0 rounded-full overflow-hidden">
        <AvatarImage src={userImage} alt={user.first_name} />
        <AvatarFallback>{user?.first_name?.charAt(0) ?? "?"}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href={`/Profile/${user.id}`}
              prefetch={false}
              className="text-sm font-medium truncate hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-medium text-sm">
                {isCommentAuthor ? "You" : `${user.first_name} ${user.last_name}`}
              </span>
            </Link>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>

          {canDelete && (
            <DropdownMenu onOpenChange={setIsDropdownOpen}> {/* ✅ this is the key */}
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full dropdown-inside-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="z-[1005] "
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenuItem
                  onClick={handleDeleteComment}
                  disabled={loading || isDeleting}
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  {loading || isDeleting ? "Deleting..." : "Delete comment"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <p className="text-sm mt-1">{content}</p>
      </div>
    </div>
  );
}
