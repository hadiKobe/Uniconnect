"use client";
import { useEffect, useRef, useState } from "react";
import Post from "@/components/Posts/Post";

import { Button } from "../ui/button";
import { List, GraduationCap, User, Plus } from "lucide-react";
import { AddPost } from "../Posts/AddPost";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const GeneralClient = () => {
  const [posts, setPosts] = useState([]);
  const [showAddPost, setShowAddPost] = useState(false); 
  const addPostRef = useRef(null);
  const path = "/api/posts/getPost";

  const fetchPosts = async () => {
    fetch(path)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleNewPostClick = () => {
    setShowAddPost(true); // 👈 Show the AddPost component
    setTimeout(() => {
      addPostRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); // Slight delay ensures rendering before scroll
  };

  return (
    <div className="w-full p-4">
      {/* Filters + New Post */}
      <div className="flex flex-wrap justify-center items-center gap-1 md:gap-2 mb-4">
        <Button variant="ghost" size="sm" className="rounded-full text-sm font-medium" disabled>
          <List className="w-4 h-4 mr-1" />
          All
        </Button>

        <Button variant="ghost" size="sm" className="rounded-full text-sm font-medium" disabled>
          <GraduationCap className="w-4 h-4 mr-1" />
          MyMajor
        </Button>

        <Button variant="ghost" size="sm" className="rounded-full text-sm font-medium" disabled>
          <User className="w-4 h-4 mr-1" />
          MyFeed
        </Button>

        <Dialog>
  <DialogTrigger asChild>
    <Button
      variant="default"
      size="sm"
      className="rounded-full text-sm font-medium flex items-center gap-2"
    >
      <Plus className="w-4 h-4" />
      New Post
    </Button>
  </DialogTrigger>

  <DialogContent className="max-w-2xl w-full">
    <DialogHeader>
      <DialogTitle>Create a New Post</DialogTitle>
    </DialogHeader>
    <AddPost />
  </DialogContent>
</Dialog>

      </div>

      
     

     
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
  );
};

export default GeneralClient;
