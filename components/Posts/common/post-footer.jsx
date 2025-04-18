"use client"
import { useState, useEffect, use } from "react"
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Footer({ bottomInfo }) {
   const { postId, likeCount, dislikeCount, commentCount, userReaction } = bottomInfo;
   const [liked, setLiked] = useState(false)
   const [disliked, setDisliked] = useState(false)
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
      console.log(userReaction);
      e.preventDefault();
      const path = `/api/posts/reaction`;
      const delPath = `${path}/delete/${postId}`;
      const addPath = `${path}/add`;

      const add = async () => fetch(addPath, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ postId, reaction: type === 'like' ? 1 : 0 })
      });

      const del = async () => fetch(delPath, {
         method: "DELETE",
         headers: { "Content-Type": "application/json" }
      });

      const reactions = { like: liked, dislike: disliked };
      const res = reactions[type] ? await del() : await add();

      if (res.ok) {
         console.log(`${type} added successfully`);

         if (type === 'like') {
            setLiked(!liked);
            setDisliked(false);
         } else if (type === 'dislike') {
            setDisliked(!disliked);
            setLiked(false);
         }
      }
   }
   const handleComment = (e) => {
      e.preventDefault();
      alert("Comment clicked")
   }

   return (
      <div className="flex flex-col w-full">

         <div className="w-full h-px bg-border mb-3"></div>
         <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center">
               <Button
                  variant="ghost"
                  size="sm"
                  className={cn("flex items-center gap-1 px-2", liked && "text-blue-600")}
                  onClick={(e) => handleInteraction(e, 'like')}
               >
                  <ThumbsUp className={cn("h-4 w-4", liked && "fill-blue-600")} />
                  <span>{likeCount}</span>
               </Button>
            </div>

            <div className="flex items-center">
               <Button
                  variant="ghost"
                  size="sm"
                  className={cn("flex items-center gap-1 px-2", disliked && "text-red-600")}
                  onClick={(e) => handleInteraction(e, 'dislike')}
               >
                  <ThumbsDown className={cn("h-4 w-4", disliked && "fill-red-600")} />
                  <span>{dislikeCount}</span>
               </Button>
            </div>

            <div className="flex items-center">
               <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2" onClick={handleComment} disabled={commentCount === 0}>
                  <MessageCircle className="h-4 w-4" />
               </Button>
            </div>
         </div>
      </div>
   )
}