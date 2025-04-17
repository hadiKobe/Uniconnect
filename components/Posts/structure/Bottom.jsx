import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as HandThumbUpOutline, HandThumbDownIcon as HandThumbDownOutline } from "@heroicons/react/24/outline";

const Bottom = ({ postId, likeCount, dislikeCount, commentCount, userReaction }) => {
   const [liked, setLiked] = useState(false);
   const [disliked, setDisliked] = useState(false);

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

   return (
      <div className="flex justify-start space-x-8 border-t pt-3 border-gray-200">

         <button className="cursor-pointer flex items-center space-x-2 " onClick={(e) => handleInteraction(e, 'like')}>
            {liked ? (<HandThumbUpSolid className="w-5 h-5 text-blue-600" />) : (<HandThumbUpOutline className="w-5 h-5 hover:text-blue-500" />)}
            <span className="text-xs">{likeCount}</span>
         </button>

         <button className="cursor-pointer flex items-center space-x-2 " onClick={(e) => handleInteraction(e, 'dislike')} >
            {disliked ? (<HandThumbDownSolid className="w-5 h-5 text-red-600" />) : (<HandThumbDownOutline className="w-5 h-5  hover:text-red-500" />)}
            <span className="text-xs">{dislikeCount}</span>
         </button>

         <button className="cursor-pointer flex items-center space-x-2 hover:text-blue-500">
            <MessageCircle size={18} />
            {/* <span>Comment</span> */}
            <span className="text-xs">{commentCount}</span>
         </button>
      </div>
   )
}

export default Bottom