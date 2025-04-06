"use client";
import { useEffect, useState } from "react";
import Post from "@/components/Posts/Post"
import AddPost from "@/components/Posts/AddPost"

const GeneralClient = () => {
   const [posts, setPosts] = useState([]);
   const fetchPosts = async () => {
      fetch('/api/posts/getPost')
         .then(res => res.json())
         .then(data => setPosts(data))
         .catch(err => console.error(err));
   }
   useEffect(() => {
      fetchPosts();
   }, []);

   return (
      <>
         <div className="space-y-5 p-4">
            <AddPost onPostAdded={fetchPosts} />

            {posts.map((post) => (
               <Post
                  key={post.id}
                  postId={post.id}
                  name={`${post.first_name} ${post.last_name}`}
                  major={post.major}
                  content={post.content}
                  likeCount={post.likesCount}
                  commentCount={post.commentsCount}
                  createdAt={post.created_at}
               />
            ))}
         </div>
      </>
   )
}

export default GeneralClient