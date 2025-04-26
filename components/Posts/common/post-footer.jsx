"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CommentSection from "./comments-section/comment-section";

export default function Footer({ bottomInfo }) {
   const { post_id, user_id, likesCount, dislikesCount, commentsCount, userReaction } = bottomInfo;
   const [liked, setLiked] = useState(false);
   const [disliked, setDisliked] = useState(false);
   const [showComments, setShowComments] = useState(false);
   const [comments, setComments] = useState([]);
   const [loadingComments, setLoadingComments] = useState(false);


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
      const path = `/api/posts/reaction`;
      const delPath = `${path}/delete/${post_id}`;
      const addPath = `${path}/add`;

      const add = async () => fetch(addPath, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ post_id, reaction: type === 'like' ? 1 : 0 })
      });

      const del = async () => fetch(delPath, {
         method: "DELETE",
         headers: { "Content-Type": "application/json" }
      });

      const reactions = { like: liked, dislike: disliked };
      const res = reactions[type] ? await del() : await add();

      if (res.ok) {
         if (type === 'like') {
            setLiked(!liked);
            setDisliked(false);
         } else if (type === 'dislike') {
            setDisliked(!disliked);
            setLiked(false);
         }
      }
   };

   const handleCommentsClick = async () => {
      if (!showComments) {
         setLoadingComments(true);
         try {
            const path = `/api/posts/getPost/${post_id}/comments`;
            await fetch(path)
               .then((res) => res.json())
               .then((data) => setComments(data))
               .catch((err) => console.error(err));

         } catch (error) {
            console.error("Failed to fetch comments", error);
         }
         setLoadingComments(false);
      }
      setShowComments(prev => !prev);

   };

   useEffect(() => {
      console.log(comments);
   }, [comments]);

   return (
      <div className="flex flex-col w-full">
         <div className="w-full h-px bg-border mb-3"></div>

         <div className="flex items-center gap-4 pt-2">
            <Button
               variant="ghost"
               size="sm"
               className={cn("flex items-center gap-1 px-2", liked && "text-blue-600")}
               onClick={(e) => handleInteraction(e, 'like')}
            >
               <ThumbsUp className={cn("h-4 w-4", liked && "fill-blue-600")} />
               <span>{likesCount}</span>
            </Button>

            <Button
               variant="ghost"
               size="sm"
               className={cn("flex items-center gap-1 px-2", disliked && "text-red-600")}
               onClick={(e) => handleInteraction(e, 'dislike')}
            >
               <ThumbsDown className={cn("h-4 w-4", disliked && "fill-red-600")} />
               <span>{dislikesCount}</span>
            </Button>

            <Button
               variant="ghost"
               size="sm"
               className={cn("flex items-center gap-1 px-2", showComments && "text-blue-600")}
               onClick={handleCommentsClick}
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
                  <CommentSection commentsInfo={{ post_id, user_id, comments }} />
               )}
            </div>
         )}
      </div>
   );
}
