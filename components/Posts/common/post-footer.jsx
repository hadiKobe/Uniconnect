"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CommentSection from "./comments-section/comment-section";
import useHandleReaction from "@/hooks/Posts/handleReaction";
import useGetComments from "@/hooks/Posts/Comments/getComments";
import { toast } from "sonner";

export default function Footer({ bottomInfo }) {
   const { post_id, user_id, likesCount, dislikesCount, commentsCount, userReaction } = bottomInfo;

   const { loadingReaction, errorReaction, successReaction, fetchAddReaction, fetchDeleteReaction } = useHandleReaction();

   const [liked, setLiked] = useState(false);
   const [disliked, setDisliked] = useState(false);
   const [likes, setLikes] = useState(likesCount);
   const [dislikes, setDislikes] = useState(dislikesCount);
   const [lastReactionType, setLastReactionType] = useState(null);

   const { loadingComments, comments, fetchComments, errorComments, onDeleteComment } = useGetComments(post_id);
   const [showComments, setShowComments] = useState(false);


   useEffect(() => {
      if (userReaction === 1) {
         setLiked(true);
         setDisliked(false);

      } else if (userReaction === 0) {
         setDisliked(true);
         setLiked(false);
      }

   }, [userReaction]);

   const handleInteraction = async (e, type) => {
      e.preventDefault();
      const reactions = { like: liked, dislike: disliked };
      reactions[type] ? await fetchDeleteReaction(post_id) : await fetchAddReaction(post_id, type);
      setLastReactionType(type); // ✅ store the current type
   };
   useEffect(() => {
      if (errorReaction)
         toast.error("Something went wrong while reacting on post", errorReaction);

      if (successReaction) {
         if (lastReactionType === 'like') {
            setLiked(!liked);
            setLikes(prev => liked ? prev - 1 : prev + 1);
            disliked && setDislikes(prev => prev - 1);
            setDisliked(false);

         } else if (lastReactionType === 'dislike') {
            setDisliked(!disliked);
            setDislikes(prev => disliked ? prev - 1 : prev + 1);
            liked && setLikes(prev => prev - 1);
            setLiked(false);
         }
      }
   }, [errorReaction, successReaction]);

   const handleCommentsClick = async () => {
      if (!showComments)
         fetchComments(post_id);
      setShowComments(prev => !prev);
   };
   useEffect(() => {
      if (errorComments)
         toast.error("Something went wrong while reacting on post", errorComments);
   }, [errorComments]);


   return (
      <div className="flex flex-col w-full">
         <div className="w-full h-px bg-border mb-3"></div>

         <div className="flex items-center gap-4 pt-2">
            <Button
               variant="ghost"
               size="sm"
               className={cn("flex items-center gap-1 px-2", liked && "text-blue-600")}
               onClick={(e) => handleInteraction(e, 'like')}
               disabled={loadingReaction || loadingComments}
            >
               <ThumbsUp className={cn("h-4 w-4", liked && "fill-blue-600")} />
               <span>{likes}</span>
            </Button>

            <Button
               variant="ghost"
               size="sm"
               className={cn("flex items-center gap-1 px-2", disliked && "text-red-600")}
               onClick={(e) => handleInteraction(e, 'dislike')}
               disabled={loadingReaction || loadingComments}
            >
               <ThumbsDown className={cn("h-4 w-4", disliked && "fill-red-600")} />
               <span>{dislikes}</span>
            </Button>

            <Button
               variant="ghost"
               size="sm"
               className={cn("flex items-center gap-1 px-2", showComments && "text-blue-600")}
               onClick={handleCommentsClick}
               disabled={loadingComments || loadingReaction}
            >
               <MessageCircle className={cn("h-4 w-4", showComments && "fill-blue-600")} />
               <span>{showComments ? "Hide" : commentsCount}</span>
            </Button>
         </div>

         {/* Show Comments Section */}
         {showComments && (
            <div className="mt-4">
               {loadingComments ? (
                  <p className="text-sm text-gray-500">Loading comments...</p>
               ) : (
                  <CommentSection commentsInfo={{ post_id, user_id, comments }} onDeleteComment={onDeleteComment}/>
               )}
            </div>
         )}
      </div>
   );
}
