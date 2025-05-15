"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Post from "../Posts/Post";

const Posts = ({ posts }) => {
  if (!posts) return <p>Loading posts...</p>;
  if (posts.length === 0) return <p className="text-muted-foreground">No posts found.</p>;

  return (
    posts.map((post) => (
      <Post key={post.id} post={post} />
    ))
  );
};

export default Posts;
