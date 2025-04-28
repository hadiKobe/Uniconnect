"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
        setLoading(false);
      }
    };

    if (userId) {
      fetchPosts();
    }
  }, [userId]);

  if (loading) return <p>Loading posts...</p>;
  if (!posts || posts.length === 0) return <p className="text-muted-foreground">No posts found.</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Posts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </CardContent>
    </Card>
  )
}

export default Posts;
