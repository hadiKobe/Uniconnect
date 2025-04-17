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
  const [filter, setFilter] = useState(''); // State to manage filter
  const [showAddPost, setShowAddPost] = useState(false);
  const addPostRef = useRef(null);
  const path = "/api/posts/getPost";

  const fetchPosts = async (filter = '') => {
    let filteredPath = `${path}?filter=${filter}`;
    fetch(filteredPath)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPosts(filter);
  }, [filter]);

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
        <Button variant="ghost" size="sm" className="cursor-pointer rounded-full text-sm font-medium" onClick={() => setFilter('')}  >
          <List className="cursor-pointer w-4 h-4 mr-1" />
          All
        </Button>

        <Button variant="ghost" size="sm" className="cursor-pointer rounded-full text-sm font-medium" onClick={() => setFilter('major')}  >
          <GraduationCap className="cursor-pointer w-4 h-4 mr-1" />
          MyMajor
        </Button>

        <Button variant="ghost" size="sm" className="cursor-pointer rounded-full text-sm font-medium" onClick={() => setFilter('friends')} >
          <User className="cursor-pointer w-4 h-4 mr-1" />
          MyFeed
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="rounded-full text-sm font-medium flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl w-full">
            <DialogHeader>
              <DialogTitle>Create a New Post</DialogTitle>
            </DialogHeader>
            <AddPost onPostAdded={fetchPosts} />
          </DialogContent>
        </Dialog>

      </div>
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
        />
      ))}
    </div>
  );
};

export default GeneralClient;
