"use client";

import { useEffect, useState } from "react";
import Post from "../Posts/Post";

const Posts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
        try {
          const res = await fetch(`/api/posts/getUserPost/${userId}`);
          if (!res.ok) throw new Error("Request failed");
          const data = await res.json();
          setPosts(data);
            setLoading(false);
        } catch (err) {
          console.error("Error fetching posts:", err);
        }
      };
      

    if (userId) {
      fetchPosts();
    }
  }, [userId]);

  if (loading) return <p>Loading posts...</p>;
  if (!posts || posts.length === 0) return <p className="text-muted-foreground">No posts found.</p>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
