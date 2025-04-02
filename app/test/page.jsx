"use client";
import { useEffect, useState } from "react";
import Post from "@/components/posts/Post";
import AddPost from "@/components/posts/AddPost";

export default function Home() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async()=>{
    fetch('/api/posts/getPost')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error(err));
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="space-y-5 p-4 bg-black">
      <AddPost onPostAdded={fetchPosts}/>

      {posts.map((post) => (
        <Post
          key={post.id}
          name={`${post.first_name} ${post.last_name}`}
          major={post.major}
          content={post.content}
          createdAt={post.created_at}
        />
      ))}
    </div>
  );
}