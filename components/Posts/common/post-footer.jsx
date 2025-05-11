"use client"

import { useState, useEffect } from "react"
import { ThumbsUp, ThumbsDown, MessageCircle, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import useHandleReaction from "@/hooks/Posts/handleReaction"
import InstagramStyleCommentSection from "./comments-section/comment-section"
import useGetComments from "@/hooks/Posts/Comments/getComments"
import { toast } from "sonner"
import EmbeddedCommentSection from "./comments-section/embedded"

export default function Footer({ bottomInfo ,singlePost = false}) {
   const { post_id, user_id, likesCount, dislikesCount, commentsCount, userReaction } = bottomInfo

   const { loadingReaction, errorReaction, successReaction, fetchAddReaction, fetchDeleteReaction } = useHandleReaction()

   const [liked, setLiked] = useState(false)
   const [disliked, setDisliked] = useState(false)
   const [likes, setLikes] = useState(likesCount)
   const [dislikes, setDislikes] = useState(dislikesCount)
   const [lastReactionType, setLastReactionType] = useState(null)

   const { loadingComments, comments, fetchComments, errorComments, onDeleteComment } = useGetComments(post_id)
   const [isCommentsOpen, setIsCommentsOpen] = useState(false)

   useEffect(() => {
      if (userReaction === 1) {
         setLiked(true)
         setDisliked(false)
      } else if (userReaction === 0) {
         setDisliked(true)
         setLiked(false)
      }
   }, [userReaction])

   const handleInteraction = async (e, type) => {
      e.preventDefault()
      const reactions = { like: liked, dislike: disliked }
      reactions[type] ? await fetchDeleteReaction(post_id) : await fetchAddReaction(post_id, type)
      setLastReactionType(type)
   }

   useEffect(() => {
      if (errorReaction) toast.error("Something went wrong while reacting on post", errorReaction)

      if (successReaction) {
         if (lastReactionType === "like") {
            setLiked(!liked)
            setLikes((prev) => (liked ? prev - 1 : prev + 1))
            disliked && setDislikes((prev) => prev - 1)
            setDisliked(false)
         } else if (lastReactionType === "dislike") {
            setDisliked(!disliked)
            setDislikes((prev) => (disliked ? prev - 1 : prev + 1))
            liked && setLikes((prev) => prev - 1)
            setLiked(false)
         }
      }
   }, [errorReaction, successReaction])

   const handleCommentsClick = () => {
      // First open the modal for smooth animation
      setIsCommentsOpen(true);

      // Then fetch comments if they haven't been fetched yet
         fetchComments(post_id).catch(error => {
            console.error("Error fetching comments:", error);
            toast.error("Failed to load comments. Please try again.");
         });
   }

   useEffect(() => {
      if (errorComments) {
         toast.error("Something went wrong while loading comments", errorComments);
      }
   }, [errorComments])

   return (
      <div className="flex flex-col w-full">
         {!singlePost && (
         <div className="w-full h-px bg-border mb-3"></div>
         )}

         <div className="flex items-center gap-4 pt-2">
            <Button
               variant="ghost"
               size="sm"
               className={cn("flex items-center gap-1 px-2", liked && "text-blue-600")}
               onClick={(e) => handleInteraction(e, "like")}
               disabled={loadingReaction}
            >
               <ThumbsUp className={cn("h-4 w-4", liked && "fill-blue-600")} />
               <span>{likes}</span>
            </Button>

            <Button
               variant="ghost"
               size="sm"
               className={cn("flex items-center gap-1 px-2", disliked && "text-red-600")}
               onClick={(e) => handleInteraction(e, "dislike")}
               disabled={loadingReaction}
            >
               <ThumbsDown className={cn("h-4 w-4", disliked && "fill-red-600")} />
               <span>{dislikes}</span>
            </Button>
            {!singlePost && (
            <Button
               variant="ghost"
               size="sm"
               className="flex items-center gap-1 px-2"
               onClick={handleCommentsClick}
               disabled={loadingComments && isCommentsOpen} // Disable only when loading and comments are open
            >
               {loadingComments && isCommentsOpen ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
               ) : (
                  <MessageCircle className="h-4 w-4" />
               )}
               <span>{comments?.length ?? commentsCount}</span>
            </Button>
            )}

         </div>

         {/* Always render the comment section component */}
         {singlePost ? (
            <EmbeddedCommentSection
               commentsInfo={{
                  post_id,
                  user_id,
                  comments: comments || [],
               }}
               isLoading={loadingComments}
            />
         ) : (
            <InstagramStyleCommentSection
               commentsInfo={{
                  post_id,
                  user_id,
                  comments: comments || [],
               }}
               isOpen={isCommentsOpen}
               onClose={() => setIsCommentsOpen(false)}
               isLoading={loadingComments}
            />
         )}

      </div>
   )
}