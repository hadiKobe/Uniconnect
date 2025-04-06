import { useState } from "react";


const Bottom = ({ postId, likeCount, commentCount}) => {
   const [liked, setLiked] = useState(false);

   const handleLike = async (e) => {
      e.preventDefault();
      
      const res = await fetch("/api/posts/like/add", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ postId }),
      });

      if (res.ok) {
         console.log("Like added successfully");
         setLiked(true);
      }
   }

   return (
      <div className="flex justify-start space-x-8 border-t pt-3 border-gray-200">
         <button className="cursor-pointer flex items-center space-x-2 hover:text-blue-500" onClick={handleLike}>
            <span id='likeSpan'>{liked ? 'Liked':'Like'}</span>
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