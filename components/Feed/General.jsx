"use client";
import { useEffect, useState } from "react";
import Post from "@/components/Posts/Post"
import AddPost from "@/components/Posts/AddPost"

const GeneralClient = () => {
   const [posts, setPosts] = useState([]);
   const [filter, setFilter] = useState('all');
   const path = '/api/posts/getPost';

   const fetchPosts = async (filter) => {
      let filteredPath = (filter === 'all') ? path : `${path}?filter=${filter}`;
      
      fetch(filteredPath)
         .then(res => res.json())
         .then(data => setPosts(data))
         .catch(err => console.error(err));
   }
   useEffect(() => {
      fetchPosts(filter);
   }, [filter]);

   return (

      <div className="space-y-5 p-4">
         <div className="flex flex-wrap gap-2 mb-4 justify-center items-center">
            <button onClick={() => setFilter('all')} className="btn cursor-pointer">All |</button>
            <button onClick={() => setFilter('friends')} className="btn cursor-pointer">MyFeed |</button>
            <button onClick={() => setFilter('major')} className="btn cursor-pointer">MyMajor |</button>
            <button onClick={() => setFilter('job')} className="btn cursor-pointer">MyJobs |</button>
            <button onClick={() => setFilter('market')} className="btn cursor-pointer">MyMarket |</button>
            <button onClick={() => setFilter('tutor')} className="btn cursor-pointer">TutorMe</button>
         </div>

         {/* Posts List */}
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


   )
}

export default GeneralClient