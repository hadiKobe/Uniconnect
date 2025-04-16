import { useState } from "react";


const Bottom = ({ postId, likeCount, dislikeCount, commentCount }) => {
   const [liked, setLiked] = useState(false);
   const [disliked, setDisliked] = useState(false);

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

      const res = liked || disliked ? await del() : await add();

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
         <button className="cursor-pointer flex items-center space-x-2 hover:text-blue-500" onClick={(e) => handleInteraction(e, 'like')}>
            <span id='likeSpan'>{liked ? 'Liked' : 'Like'}</span>
            <span >{likeCount}</span>
         </button>
         <button className="cursor-pointer flex items-center space-x-2 hover:text-blue-500" onClick={(e) => handleInteraction(e, 'dislike')} >
            <span id='likeSpan'>{disliked ? 'Disliked' : 'Dislike'}</span>
            <span >{dislikeCount}</span>
         </button>
         <button className="cursor-pointer flex items-center space-x-2 hover:text-blue-500">
            <span>Comment</span>
            <span>{commentCount}</span>
         </button>
      </div>
   )
}

export default Bottom