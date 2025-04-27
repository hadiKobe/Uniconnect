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
  DialogTitle
} from "@/components/ui/dialog";

const FeedClient = ({ section }) => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState(''); // State to manage filter
  const [showAddPost, setShowAddPost] = useState(false);
  const addPostRef = useRef(null);
  const path = `/api/posts/getPost?section=${section}`; // Adjusted path to include section

  const fetchPosts = async (filter = '') => {
    let filteredPath = filter ? `${path}&filter=${filter}` : path;
    await fetch(filteredPath)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPosts(filter);
  }, [filter]);

  const handlePostAdded = () => {
    fetchPosts();      // ✅ refresh posts
    setShowAddPost(false);    // ✅ close dialog
  };

  return (
    <div className="w-full max-w-4xl p-4">

      {/* Filters + New Post */}
      <div className="flex flex-wrap justify-center items-center gap-1 md:gap-2 mb-4 sticky top-0 z-49">
        <Button variant="ghost" size="sm" className="cursor-pointer rounded-full text-sm font-medium" onClick={() => setFilter('')}  >
          <List className="cursor-pointer w-4 h-4 mr-1" />
          All
        </Button>

        <Button variant="ghost" size="sm" className="cursor-pointer rounded-full text-sm font-medium" onClick={() => setFilter('major')}  >
          <GraduationCap className="cursor-pointer w-4 h-4 mr-1" />
          MyMajor
        </Button>

        <Button variant="ghost" size="sm" className="cursor-pointer rounded-full text-sm font-medium" onClick={() => { setFilter('friends') }} >
          <User className="cursor-pointer w-4 h-4 mr-1" />
          MyFeed
        </Button>

        <Dialog open={showAddPost} onOpenChange={setShowAddPost}>
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
            <AddPost onPostAdded={handlePostAdded} />
          </DialogContent>
        </Dialog>

      </div>

      {posts.map((post, index) => (
        <Post
          key={index}
          post={post}
        />
      ))}
      
    </div>
  );
};

export default FeedClient;
