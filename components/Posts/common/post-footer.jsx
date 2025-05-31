"use client"

import { useState, useEffect } from "react"
import { ThumbsUp, ThumbsDown, MessageCircle, Loader2, CornerDownRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import useHandleReaction from "@/hooks/Posts/handleReaction"
import InstagramStyleCommentSection from "./comments-section/comment-section"
import useGetComments from "@/hooks/Posts/Comments/getComments"
import { toast } from "sonner"
import EmbeddedCommentSection from "./comments-section/embedded"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Footer({ bottomInfo, singlePost = false }) {
   const { data: session } = useSession();
   const currentUserId = session?.user?.id;

   const { post_id, user_id, likesCount, dislikesCount, commentsCount, userReaction } = bottomInfo

   const { loadingReaction, errorReaction, successReaction, fetchAddReaction, fetchDeleteReaction } = useHandleReaction()

   const [liked, setLiked] = useState(false)
   const [disliked, setDisliked] = useState(false)
   const [likes, setLikes] = useState(likesCount)
   const [dislikes, setDislikes] = useState(dislikesCount)
   const [commentsNum, setCommentsNum] = useState(commentsCount);
   const [lastReactionType, setLastReactionType] = useState(null)

   const { loadingComments, comments, fetchComments, errorComments, onDeleteComment } = useGetComments(post_id)
   const [isCommentsOpen, setIsCommentsOpen] = useState(false)

   const isAuthor = parseInt(currentUserId) === user_id
   const router = useRouter();
   const handleMessageClick = () => {
      router.push(`/Messages?userA=${currentUserId}&userB=${user_id}`);
   };

   useEffect(() => {
      if (userReaction === 1) {
         setLiked(true)
         setDisliked(false)
      } else if (userReaction === 0) {
         setDisliked(true)
         setLiked(false)
      }
   }, [userReaction])

   useEffect(() => {
      if (singlePost) {
         // Fetch comments only if it's a single post view
         fetchComments(post_id).catch(error => {
            console.error("Error fetching comments:", error);
            toast.error("Failed to load comments. Please try again.");
         });
      } else {
         // Reset comments when not in single post view
         setCommentsNum(commentsCount);
      }
   }, [singlePost])

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
                  <span>{commentsNum}</span>
               </Button>
            )}

            {!isAuthor &&
               <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 px-2 ml-auto min-w-0"
                  onClick={handleMessageClick}
               >
                  <CornerDownRight className="h-4 w-4 flex-shrink-0" />
                  {/* Full label on normal screens */}
                  <span className="text-sm text-gray-500 hidden min-[400px]:inline">Reply privately</span>

                  {/* Short label on narrow screens */}
                  <span className="text-sm text-gray-500 inline min-[400px]:hidden">Reply</span>
               </Button>

            }

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
               onManageComment={setCommentsNum}
               isLoading={loadingComments}
            />
         )}

      </div>
   )
}