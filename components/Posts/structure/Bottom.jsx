import { useState } from "react";


const Bottom = ({ postId, likeCount, commentCount }) => {
   const [liked, setLiked] = useState(false);
   const [disliked, setDisliked] = useState(false);

   const handleInteraction = async (e, type) => {
      e.preventDefault();
      const path = `/api/posts/${type}/add`;
      // const path = `/api/posts/${type}/add`;

      const res = await fetch(path, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ postId }),
      });

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
         <button className="cursor-pointer flex items-center space-x-2 hover:text-blue-500" onClick={(e) => handleInteraction(e, 'dislike')} disabled>
            <span id='likeSpan'>{disliked ? 'Disliked' : 'Disike'}</span>
            <span >{likeCount}</span>
         </button>
         <button className="cursor-pointer flex items-center space-x-2 hover:text-blue-500">
            <span>Comment</span>
            <span>{commentCount}</span>
         </button>
      </div>
   )
}

export default Bottom