"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ThumbsUp, ThumbsDown, MoreVertical, Flag, MessageCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MediaGallery } from "../structure/media-gallery"
import { CommentsSection } from "../structure/comments-section"
import { useUser } from "../context/user-context"

export function PostBase({ post, children, typeColor, typeIcon }) {
  const { currentUser } = useUser()
  const [liked, setLiked] = useState(post.likedBy?.includes(currentUser.id) || false)
  const [disliked, setDisliked] = useState(post.dislikedBy?.includes(currentUser.id) || false)
  const [likeCount, setLikeCount] = useState(post.likes || 0)
  const [dislikeCount, setDislikeCount] = useState(post.dislikes || 0)
  const [showComments, setShowComments] = useState(false)
  const [deleted, setDeleted] = useState(false)

  if (deleted) return null

  const handleLike = () => {
    if (liked) {
      setLiked(false)
      setLikeCount(likeCount - 1)
    } else {
      setLiked(true)
      setLikeCount(likeCount + 1)
      if (disliked) {
        setDisliked(false)
        setDislikeCount(dislikeCount - 1)
      }
    }
  }

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false)
      setDislikeCount(dislikeCount - 1)
    } else {
      setDisliked(true)
      setDislikeCount(dislikeCount + 1)
      if (liked) {
        setLiked(false)
        setLikeCount(likeCount - 1)
      }
    }
  }

  const handleReport = () => {
    alert(`Post "${post.title}" has been reported.`)
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      setDeleted(true)
      // In a real app, you would call an API to delete the post
      console.log(`Post ${post.id} deleted`)
    }
  }

  const toggleComments = () => {
    setShowComments(!showComments)
  }

  const isOwnPost = post.author.id === currentUser.id

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md mb-6 w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">{post.createdAt}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={typeColor}>
              {typeIcon} {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isOwnPost && (
                  <>
                    <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:text-red-500">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete Post
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleReport} className="text-red-500 focus:text-red-500">
                  <Flag className="h-4 w-4 mr-2" /> Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardTitle className="mt-2 text-xl">{post.title}</CardTitle>
        {children}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">{post.content}</p>
        {post.media && post.media.length > 0 && <MediaGallery media={post.media} />}
      </CardContent>
      <CardFooter className="flex flex-col border-t pt-3">
        <div className="flex justify-between w-full">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`flex gap-1 ${liked ? "text-blue-600" : "text-muted-foreground"}`}
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
              <span>{likeCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`flex gap-1 ${disliked ? "text-red-600" : "text-muted-foreground"}`}
              onClick={handleDislike}
            >
              <ThumbsDown className="h-4 w-4" fill={disliked ? "currentColor" : "none"} />
              <span>{dislikeCount}</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="flex gap-1 text-muted-foreground" onClick={toggleComments}>
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments?.length || 0}</span>
          </Button>
        </div>

        {showComments && <CommentsSection postId={post.id} comments={post.comments} postAuthorId={post.author.id} />}
      </CardFooter>
    </Card>
  )
}
